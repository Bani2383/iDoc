import { createClient } from 'npm:@supabase/supabase-js@2.57.4';
import { getCorsHeaders, handleCorsPreflightRequest } from '../_shared/cors.ts';

interface BatchLintRequest {
  template_ids?: string[];
  published_only?: boolean;
}

interface TemplateLintSummary {
  id: string;
  template_code: string;
  status: 'pass' | 'fail';
  unknownVarsCount: number;
  unknownVars: string[];
  hasPlaceholders: boolean;
  published: boolean;
  cacheUsed: boolean;
}

interface BatchLintResult {
  ok: boolean;
  totalTemplates: number;
  passedTemplates: number;
  failedTemplates: number;
  results: TemplateLintSummary[];
  executionTimeMs: number;
}

function uniq(arr: string[]): string[] {
  return Array.from(new Set(arr));
}

function extractVariables(content: string): string[] {
  const matches = content.match(/{\{\s*[^}]+\s*}}/g) || [];
  const variables: string[] = [];

  for (const match of matches) {
    const inner = match.replace(/{{|}}/g, '').trim();
    if (inner.startsWith('#') || inner.startsWith('/')) continue;

    const tokens = inner.split(/\s+/).filter(Boolean);

    if (tokens.length === 1) {
      variables.push(tokens[0]);
      continue;
    }

    for (const token of tokens) {
      if (token.includes('.') || /^[a-zA-Z_][a-zA-Z0-9_]*$/.test(token)) {
        if (!['if', 'each', 'with', 'unless', 'eq', 'ne', 'gt', 'lt', 'and', 'or', 'not'].includes(token)) {
          variables.push(token);
        }
      }
    }
  }

  return uniq(variables);
}

function hasPlaceholderText(content: string): boolean {
  const placeholders = [
    /\bTODO\b/i,
    /\bFIXME\b/i,
    /\bXXX\b/i,
    /\[TO BE COMPLETED\]/i,
    /\[PLACEHOLDER\]/i,
    /\{\{TODO/i,
    /\{\{FIXME/i,
  ];

  return placeholders.some(pattern => pattern.test(content));
}

async function assertAdmin(req: Request, supabase: any): Promise<void> {
  const authHeader = req.headers.get('Authorization');

  if (!authHeader?.startsWith('Bearer ')) {
    throw new Error('Missing authorization header');
  }

  const token = authHeader.replace('Bearer ', '');
  const { data: { user }, error } = await supabase.auth.getUser(token);

  if (error || !user) {
    throw new Error('Invalid authentication');
  }

  const { data: profile, error: profileError } = await supabase
    .from('user_profiles')
    .select('role')
    .eq('id', user.id)
    .maybeSingle();

  if (profileError || !profile || profile.role !== 'admin') {
    throw new Error('Admin access required');
  }
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return handleCorsPreflightRequest(req);
  }

  const corsHeaders = getCorsHeaders(req.headers.get('origin'));
  const startTime = Date.now();

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    await assertAdmin(req, supabase);

    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ ok: false, error: 'Method not allowed' }),
        {
          status: 405,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const body: BatchLintRequest = await req.json();
    const { template_ids, published_only = false } = body;

    let query = supabase
      .from('idoc_guided_templates')
      .select('id, template_code, template_content, published, vars_used_cache, vars_cache_updated_at, updated_at')
      .eq('is_active', true);

    if (published_only) {
      query = query.eq('published', true);
    }

    if (template_ids && template_ids.length > 0) {
      query = query.in('id', template_ids);
    }

    const { data: templates, error: templatesError } = await query;

    if (templatesError) {
      throw templatesError;
    }

    if (!templates || templates.length === 0) {
      return new Response(
        JSON.stringify({ ok: false, error: 'No templates found' }),
        {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const results: TemplateLintSummary[] = [];

    for (const template of templates) {
      const cacheValid =
        template.vars_used_cache &&
        template.vars_cache_updated_at &&
        template.updated_at &&
        new Date(template.vars_cache_updated_at) >= new Date(template.updated_at);

      let varsUsed: string[];
      let cacheUsed = false;

      if (cacheValid) {
        varsUsed = Array.isArray(template.vars_used_cache) ? template.vars_used_cache : [];
        cacheUsed = true;
      } else {
        let mainContent = '';
        if (typeof template.template_content === 'string') {
          mainContent = template.template_content;
        } else if (template.template_content && typeof template.template_content === 'object') {
          mainContent = JSON.stringify(template.template_content);
        }

        varsUsed = extractVariables(mainContent);

        await supabase
          .from('idoc_guided_templates')
          .update({
            vars_used_cache: varsUsed,
            vars_cache_updated_at: new Date().toISOString(),
          })
          .eq('id', template.id);
      }

      let mainContent = '';
      if (typeof template.template_content === 'string') {
        mainContent = template.template_content;
      } else if (template.template_content && typeof template.template_content === 'object') {
        mainContent = JSON.stringify(template.template_content);
      }

      const hasPlaceholders = hasPlaceholderText(mainContent);

      const unknownVars = varsUsed.filter(varName =>
        varName.includes('TODO') ||
        varName.includes('FIXME') ||
        varName.includes('XXX') ||
        varName.includes('undefined')
      );

      const unknownVarsCount = unknownVars.length;
      const status: 'pass' | 'fail' = (unknownVarsCount > 0 || hasPlaceholders) ? 'fail' : 'pass';

      results.push({
        id: template.id,
        template_code: template.template_code,
        status,
        unknownVarsCount,
        unknownVars,
        hasPlaceholders,
        published: template.published || false,
        cacheUsed,
      });
    }

    const passedTemplates = results.filter(r => r.status === 'pass').length;
    const failedTemplates = results.filter(r => r.status === 'fail').length;
    const executionTimeMs = Date.now() - startTime;

    const result: BatchLintResult = {
      ok: true,
      totalTemplates: results.length,
      passedTemplates,
      failedTemplates,
      results,
      executionTimeMs,
    };

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error('Batch Lint Error:', error);

    const status = error.message?.includes('Admin') ? 403 : 500;

    return new Response(
      JSON.stringify({
        ok: false,
        error: error.message || 'Internal server error',
        executionTimeMs: Date.now() - startTime,
      }),
      {
        status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});