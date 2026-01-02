import { createClient } from 'npm:@supabase/supabase-js@2.57.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

interface AutoFixRequest {
  template_ids: string[];
  fix_types: ('placeholders' | 'unknown_vars' | 'metadata' | 'all')[];
  dry_run?: boolean;
}

interface FixResult {
  template_id: string;
  template_code: string;
  success: boolean;
  fixes_applied: string[];
  errors: string[];
  before: {
    hasPlaceholders: boolean;
    unknownVars: string[];
    status: string;
  };
  after?: {
    hasPlaceholders: boolean;
    unknownVars: string[];
    status: string;
  };
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

  return Array.from(new Set(variables));
}

function removePlaceholders(content: any): any {
  if (typeof content === 'string') {
    return content
      .replace(/\[TODO\]/gi, '')
      .replace(/\[FIXME\]/gi, '')
      .replace(/\[XXX\]/gi, '')
      .replace(/\[TO BE COMPLETED\]/gi, '')
      .replace(/\[PLACEHOLDER\]/gi, '')
      .replace(/TODO:/gi, '')
      .replace(/FIXME:/gi, '')
      .replace(/\{\{TODO[^}]*\}\}/gi, '')
      .replace(/\{\{FIXME[^}]*\}\}/gi, '')
      .replace(/\s+/g, ' ')
      .trim();
  }

  if (typeof content === 'object' && content !== null) {
    if (Array.isArray(content)) {
      return content.map(item => removePlaceholders(item));
    }

    const cleaned: any = {};
    for (const [key, value] of Object.entries(content)) {
      cleaned[key] = removePlaceholders(value);
    }
    return cleaned;
  }

  return content;
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

function getContentString(content: any): string {
  if (typeof content === 'string') return content;
  if (typeof content === 'object') return JSON.stringify(content);
  return '';
}

async function autoFixTemplate(
  supabase: any,
  templateId: string,
  fixTypes: string[],
  dryRun: boolean
): Promise<FixResult> {
  const { data: template, error: templateError } = await supabase
    .from('idoc_guided_templates')
    .select('*')
    .eq('id', templateId)
    .maybeSingle();

  if (templateError || !template) {
    return {
      template_id: templateId,
      template_code: 'unknown',
      success: false,
      fixes_applied: [],
      errors: ['Template not found'],
      before: {
        hasPlaceholders: false,
        unknownVars: [],
        status: 'unknown',
      },
    };
  }

  const fixesApplied: string[] = [];
  const errors: string[] = [];

  const contentStr = getContentString(template.template_content);
  const before = {
    hasPlaceholders: hasPlaceholderText(contentStr),
    unknownVars: [] as string[],
    status: template.status || 'draft',
  };

  let updatedContent = template.template_content;
  let updatedRequired = template.required_variables || { fields: [] };
  let updatedOptional = template.optional_variables || { fields: [] };
  let updatedStatus = template.status;

  const shouldFix = (type: string) =>
    fixTypes.includes('all') || fixTypes.includes(type as any);

  if (shouldFix('placeholders') && before.hasPlaceholders) {
    try {
      updatedContent = removePlaceholders(template.template_content);
      fixesApplied.push('Removed placeholders');
    } catch (err: any) {
      errors.push(`Placeholder removal failed: ${err.message}`);
    }
  }

  if (shouldFix('metadata') || shouldFix('unknown_vars')) {
    try {
      const varsUsed = extractVariables(getContentString(updatedContent));

      const requiredFields = Array.isArray(updatedRequired?.fields)
        ? updatedRequired.fields.map((f: any) => f.name || f)
        : [];
      const optionalFields = Array.isArray(updatedOptional?.fields)
        ? updatedOptional.fields.map((f: any) => f.name || f)
        : [];

      const allDeclaredVars = [...requiredFields, ...optionalFields];
      const missingVars = varsUsed.filter(v => !allDeclaredVars.includes(v));

      before.unknownVars = missingVars;

      if (missingVars.length > 0) {
        for (const varName of missingVars) {
          const fieldDef = {
            name: varName,
            type: 'text',
            label: { en: varName, fr: varName },
            required: false,
            placeholder: { en: `Enter ${varName}`, fr: `Saisissez ${varName}` },
          };

          if (!updatedOptional.fields) {
            updatedOptional.fields = [];
          }

          updatedOptional.fields.push(fieldDef);
        }

        fixesApplied.push(`Added ${missingVars.length} missing variables to metadata`);
      }
    } catch (err: any) {
      errors.push(`Metadata fix failed: ${err.message}`);
    }
  }

  if (fixesApplied.length > 0 && !errors.some(e => e.includes('critical'))) {
    updatedStatus = 'verified';
    fixesApplied.push('Updated status to verified');
  }

  const after = {
    hasPlaceholders: hasPlaceholderText(getContentString(updatedContent)),
    unknownVars: [] as string[],
    status: updatedStatus,
  };

  if (!dryRun && fixesApplied.length > 0) {
    const updateData: any = {
      template_content: updatedContent,
      required_variables: updatedRequired,
      optional_variables: updatedOptional,
      status: updatedStatus,
      last_verified_at: new Date().toISOString(),
      verification_required: false,
    };

    const { error: updateError } = await supabase
      .from('idoc_guided_templates')
      .update(updateData)
      .eq('id', templateId);

    if (updateError) {
      errors.push(`Update failed: ${updateError.message}`);
      return {
        template_id: templateId,
        template_code: template.template_code,
        success: false,
        fixes_applied: fixesApplied,
        errors,
        before,
      };
    }
  }

  return {
    template_id: templateId,
    template_code: template.template_code,
    success: errors.length === 0,
    fixes_applied: fixesApplied,
    errors,
    before,
    after: dryRun ? undefined : after,
  };
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
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

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

    const body: AutoFixRequest = await req.json();
    const { template_ids, fix_types = ['all'], dry_run = false } = body;

    if (!template_ids || !Array.isArray(template_ids) || template_ids.length === 0) {
      return new Response(
        JSON.stringify({ ok: false, error: 'template_ids array is required' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const results: FixResult[] = [];

    for (const templateId of template_ids) {
      const result = await autoFixTemplate(supabase, templateId, fix_types, dry_run);
      results.push(result);
    }

    const summary = {
      total: results.length,
      successful: results.filter(r => r.success).length,
      failed: results.filter(r => !r.success).length,
      total_fixes: results.reduce((sum, r) => sum + r.fixes_applied.length, 0),
      dry_run,
    };

    return new Response(
      JSON.stringify({
        ok: true,
        summary,
        results,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error: any) {
    console.error('Auto-fix Error:', error);

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
