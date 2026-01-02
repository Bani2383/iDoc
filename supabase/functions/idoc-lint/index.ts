import { createClient } from 'npm:@supabase/supabase-js@2.57.4';
import { getCorsHeaders, handleCorsPreflightRequest } from '../_shared/cors.ts';

interface LintRequest {
  template_id: string;
  inputs: Record<string, any>;
}

interface LintResult {
  ok: boolean;
  templateId: string;
  varsUsed: string[];
  unknownVars: string[];
  sections?: {
    sectionCode: string;
    varsUsed: string[];
    unknownVars: string[];
  }[];
  metadata?: {
    requiredVariables: string[];
    optionalVariables: string[];
  };
}

function uniq(arr: string[]): string[] {
  return Array.from(new Set(arr));
}

function getValue(obj: Record<string, any>, path: string): any {
  return path.split('.').reduce((acc, key) => (acc == null ? acc : acc[key]), obj);
}

/**
 * Extract variables from template content
 * Matches: {{variable}}, {{inputs.variable}}, {{result.variable}}
 * Ignores: {{#if}}, {{/if}}, {{#each}}, helpers like {{boolFR ...}}
 */
function extractVariables(content: string): string[] {
  const matches = content.match(/{{\s*[^}]+\s*}}/g) || [];
  const variables: string[] = [];

  for (const match of matches) {
    const inner = match.replace(/{{|}}/g, '').trim();

    // Ignore block helpers
    if (inner.startsWith('#') || inner.startsWith('/')) continue;

    // Split on whitespace to separate helpers from variables
    const tokens = inner.split(/\s+/).filter(Boolean);

    // Single token - likely a variable
    if (tokens.length === 1) {
      variables.push(tokens[0]);
      continue;
    }

    // Multiple tokens - extract any that look like variables
    for (const token of tokens) {
      // Keep tokens that are path-like (contain . or alphanumeric)
      if (token.includes('.') || /^[a-zA-Z_][a-zA-Z0-9_]*$/.test(token)) {
        // Skip common helper names
        if (!['if', 'each', 'with', 'unless', 'eq', 'ne', 'gt', 'lt', 'and', 'or', 'not'].includes(token)) {
          variables.push(token);
        }
      }
    }
  }

  return uniq(variables);
}

/**
 * Find unknown variables (not present in data)
 */
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

/**
 * Check if user is admin
 */
async function assertAdmin(req: Request, supabase: any): Promise<void> {
  const authHeader = req.headers.get('Authorization');

  if (!authHeader?.startsWith('Bearer ')) {
    throw new Error('Missing authorization header');
  }

  const token = authHeader.replace('Bearer ', '');

  // Verify JWT and get user
  const { data: { user }, error } = await supabase.auth.getUser(token);

  if (error || !user) {
    throw new Error('Invalid authentication');
  }

  // Check if user is admin
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

    // Admin verification
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
    const { template_id, inputs } = body;

    if (!template_id) {
      return new Response(
        JSON.stringify({ ok: false, error: 'template_id is required' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Fetch template from database
    const { data: template, error: templateError } = await supabase
      .from('idoc_guided_templates')
      .select('template_code, template_content, required_variables, optional_variables')
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

    // Build data object for comparison
    const data = { inputs };

    // Extract and analyze main template content
    let mainContent = '';
    if (typeof template.template_content === 'string') {
      mainContent = template.template_content;
    } else if (template.template_content && typeof template.template_content === 'object') {
      // If template_content is JSONB with locale variants
      mainContent = JSON.stringify(template.template_content);
    }

    const varsUsed = extractVariables(mainContent);
    const unknownVars = findUnknownVariables(varsUsed, data);

    // Fetch and analyze sections
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
      sections: sectionAnalysis,
      metadata: {
        requiredVariables: template.required_variables || [],
        optionalVariables: template.optional_variables || [],
      },
    };

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error('Lint Error:', error);

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
