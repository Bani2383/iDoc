import { createClient } from 'npm:@supabase/supabase-js@2.57.4';
import { getCorsHeaders, handleCorsPreflightRequest } from '../_shared/cors.ts';

interface LintRequest {
  template_id: string;
  inputs: Record<string, any>;
  use_cache?: boolean;
}

interface LintResult {
  ok: boolean;
  templateId: string;
  varsUsed: string[];
  unknownVars: string[];
  hasPlaceholders: boolean;
  sections?: {
    sectionCode: string;
    varsUsed: string[];
    unknownVars: string[];
  }[];
  metadata?: {
    requiredVariables: string[];
    optionalVariables: string[];
  };
  cacheUsed?: boolean;
}

function uniq(arr: string[]): string[] {
  return Array.from(new Set(arr));
}

function getValue(obj: Record<string, any>, path: string): any {
  return path.split('.').reduce((acc, key) => (acc == null ? acc : acc[key]), obj);
}

function extractVariables(content: string): string[] {
  const matches = content.match(/\{\{\s*[^}]+\s*\}\}/g) || [];
  const variables: string[] = [];

  for (const match of matches) {
    const inner = match.replace(/\{\{|\}\}/g, '').trim();

    if (inner.startsWith('#') || inner.startsWith('/')) continue;

    const tokens = inner.split(/\s+/).filter(Boolean);

    if (tokens.length === 1) {
      variables.push(tokens[0]);
      continue;
    }

    for (const token of tokens) {
      if (token.includes('.') || /^[a-zA-Z_][a-zA-Z0-9_]*$/.test(token)) {
        if (!['if', 'each', 'with', 'unless', 'eq', 'ne', 'gt', 'lt', 'and', 'or', 'not', 'boolFR', 'this'].includes(token)) {
          variables.push(token);
        }
      }
    }
  }

  return uniq(variables);
}

function findUnknownVariables(varsUsed: string[], data: Record<string, any>): string[] {
  const unknown: string[] = [];

  for (const varPath of varsUsed) {
    const value = getValue(data, varPath);
    if (value === undefined) {
      unknown.push(varPath);
    }
  }

  return uniq(unknown);
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

    const body: LintRequest = await req.json();
    const { template_id, inputs, use_cache = true } = body;

    if (!template_id) {
      return new Response(
        JSON.stringify({ ok: false, error: 'template_id is required' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const { data: template, error: templateError } = await supabase
      .from('idoc_guided_templates')
      .select('template_code, template_content, required_variables, optional_variables, vars_used_cache, vars_cache_updated_at, updated_at')
      .eq('id', template_id)
      .maybeSingle();

    if (templateError || !template) {
      return new Response(
        JSON.stringify({ ok: false, error: 'Template not found' }),
        {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const data = { inputs };

    const cacheValid = use_cache &&
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

      supabase
        .from('idoc_guided_templates')
        .update({
          vars_used_cache: varsUsed,
          vars_cache_updated_at: new Date().toISOString(),
        })
        .eq('id', template_id)
        .then(() => console.log(`Cache updated for template ${template_id}`))
        .catch(err => console.error('Cache update failed:', err));
    }

    const unknownVars = findUnknownVariables(varsUsed, data);

    let mainContent = '';
    if (typeof template.template_content === 'string') {
      mainContent = template.template_content;
    } else if (template.template_content && typeof template.template_content === 'object') {
      mainContent = JSON.stringify(template.template_content);
    }
    const hasPlaceholders = hasPlaceholderText(mainContent);

    const { data: sections, error: sectionsError } = await supabase
      .from('idoc_template_section_mapping')
      .select(`
        section_id,
        idoc_template_sections(section_code, content)
      `)
      .eq('template_id', template_id);

    const sectionAnalysis: LintResult['sections'] = [];

    if (!sectionsError && sections) {
      for (const mapping of sections) {
        const section = (mapping as any).idoc_template_sections;
        if (section && section.content) {
          const sectionContent = typeof section.content === 'string'
            ? section.content
            : JSON.stringify(section.content);

          const sectionVarsUsed = extractVariables(sectionContent);
          const sectionUnknownVars = findUnknownVariables(sectionVarsUsed, data);

          sectionAnalysis.push({
            sectionCode: section.section_code,
            varsUsed: sectionVarsUsed,
            unknownVars: sectionUnknownVars,
          });
        }
      }
    }

    const result: LintResult = {
      ok: true,
      templateId: template.template_code,
      varsUsed,
      unknownVars,
      hasPlaceholders,
      sections: sectionAnalysis,
      metadata: {
        requiredVariables: template.required_variables || [],
        optionalVariables: template.optional_variables || [],
      },
      cacheUsed,
    };

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error('Lint Error:', error);

    const corsHeaders = getCorsHeaders(req.headers.get('origin'));
    const status = error.message?.includes('Admin') ? 403 : 500;

    return new Response(
      JSON.stringify({ ok: false, error: error.message || 'Internal server error' }),
      {
        status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});