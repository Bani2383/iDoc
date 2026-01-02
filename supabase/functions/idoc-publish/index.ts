import { createClient } from 'npm:@supabase/supabase-js@2.57.4';
import { getCorsHeaders, handleCorsPreflightRequest } from '../_shared/cors.ts';

interface PublishRequest {
  template_id: string;
  force?: boolean;
}

interface PublishResult {
  ok: boolean;
  published: boolean;
  blocked?: boolean;
  blockers?: string[];
  warnings?: string[];
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

  return Array.from(new Set(variables));
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

    const body: PublishRequest = await req.json();
    const { template_id, force = false } = body;

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
      .select('id, template_code, template_content, published, required_variables')
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

    let mainContent = '';
    if (typeof template.template_content === 'string') {
      mainContent = template.template_content;
    } else if (template.template_content && typeof template.template_content === 'object') {
      mainContent = JSON.stringify(template.template_content);
    }

    const varsUsed = extractVariables(mainContent);
    const hasPlaceholders = hasPlaceholderText(mainContent);

    const unknownVars = varsUsed.filter(varName =>
      varName.includes('TODO') ||
      varName.includes('FIXME') ||
      varName.includes('XXX') ||
      varName.includes('undefined')
    );

    const blockers: string[] = [];
    const warnings: string[] = [];

    if (unknownVars.length > 0) {
      blockers.push(`Template contains ${unknownVars.length} suspicious variable(s): ${unknownVars.join(', ')}`);
    }

    if (hasPlaceholders) {
      blockers.push('Template contains placeholder text (TODO, FIXME, etc.)');
    }

    if (!template.required_variables || template.required_variables.length === 0) {
      warnings.push('No required variables defined');
    }

    if (blockers.length > 0 && !force) {
      return new Response(
        JSON.stringify({
          ok: true,
          published: false,
          blocked: true,
          blockers,
          warnings,
        }),
        {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const { error: updateError } = await supabase
      .from('idoc_guided_templates')
      .update({ published: true })
      .eq('id', template_id);

    if (updateError) {
      throw updateError;
    }

    const result: PublishResult = {
      ok: true,
      published: true,
      blocked: false,
      warnings: warnings.length > 0 ? warnings : undefined,
    };

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error('Publish Error:', error);

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