import { createClient } from 'npm:@supabase/supabase-js@2.57.4';
import { getCorsHeaders, handleCorsPreflightRequest } from '../_shared/cors.ts';

interface VerifyPublishRequest {
  template_id: string;
  force?: boolean;
  dry_run?: boolean;
}

interface VerifyPublishResult {
  ok: boolean;
  status: 'DRAFT' | 'VERIFIED' | 'BLOCKED';
  published: boolean;
  blocked: boolean;
  blockers: string[];
  warnings: string[];
  report: {
    unknownVarsCount: number;
    unknownVars: string[];
    hasPlaceholders: boolean;
    missingRequired: string[];
    versionHash: string;
    verifiedAt?: string;
  };
}

function calculateVersionHash(content: any): string {
  const contentStr = typeof content === 'string' ? content : JSON.stringify(content);
  return Array.from(
    new TextEncoder().encode(contentStr)
  ).reduce((hash, byte) => {
    hash = ((hash << 5) - hash) + byte;
    return hash & hash;
  }, 0).toString(16);
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

    const body: VerifyPublishRequest = await req.json();
    const { template_id, force = false, dry_run = false } = body;

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
      .select('id, template_code, template_content, required_variables, optional_variables')
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

    const suspiciousVars = varsUsed.filter(varName =>
      varName.includes('TODO') ||
      varName.includes('FIXME') ||
      varName.includes('XXX') ||
      varName.includes('undefined') ||
      varName.includes('null')
    );

    const typoVars = varsUsed.filter(varName =>
      varName.includes('varibles') ||
      varName.includes('inpts') ||
      varName.includes('fistName')
    );

    const requiredVars = Array.isArray(template.required_variables)
      ? template.required_variables
      : [];

    const missingRequired = requiredVars.filter(
      (reqVar: string) => !varsUsed.includes(reqVar) && !varsUsed.includes(`inputs.${reqVar}`)
    );

    const versionHash = calculateVersionHash(template.template_content);

    const blockers: string[] = [];
    const warnings: string[] = [];

    if (suspiciousVars.length > 0) {
      blockers.push(`Template contains ${suspiciousVars.length} suspicious variable(s): ${suspiciousVars.join(', ')}`);
    }

    if (typoVars.length > 0) {
      blockers.push(`Template contains ${typoVars.length} potential typo(s): ${typoVars.join(', ')}`);
    }

    if (hasPlaceholders) {
      blockers.push('Template contains placeholder text (TODO, FIXME, etc.)');
    }

    if (missingRequired.length > 0) {
      warnings.push(`${missingRequired.length} required variable(s) not found in template: ${missingRequired.join(', ')}`);
    }

    if (!template.required_variables || requiredVars.length === 0) {
      warnings.push('No required variables defined');
    }

    const isBlocked = blockers.length > 0 && !force;
    const newStatus = isBlocked ? 'BLOCKED' : 'VERIFIED';

    const verificationReport = {
      unknownVarsCount: suspiciousVars.length + typoVars.length,
      unknownVars: [...suspiciousVars, ...typoVars],
      hasPlaceholders,
      missingRequired,
      varsUsed,
      requiredVariables: requiredVars,
      optionalVariables: template.optional_variables || [],
      blockers,
      warnings,
      versionHash,
      verifiedAt: new Date().toISOString(),
    };

    if (dry_run) {
      return new Response(
        JSON.stringify({
          ok: true,
          status: newStatus,
          published: false,
          blocked: isBlocked,
          blockers,
          warnings,
          report: verificationReport,
        }),
        {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    if (isBlocked) {
      const { error: auditError } = await supabase
        .from('idoc_verification_audit')
        .insert({
          template_id,
          verification_type: 'PUBLISH',
          old_status: 'DRAFT',
          new_status: 'BLOCKED',
          verification_report: verificationReport,
          blockers,
          warnings,
          performed_by: (await supabase.auth.getUser()).data.user?.id,
          success: false,
        });

      if (auditError) {
        console.error('Audit log error:', auditError);
      }

      return new Response(
        JSON.stringify({
          ok: true,
          status: 'BLOCKED',
          published: false,
          blocked: true,
          blockers,
          warnings,
          report: verificationReport,
        }),
        {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const now = new Date().toISOString();

    const { error: updateError } = await supabase
      .from('idoc_guided_templates')
      .update({
        status: 'VERIFIED',
        published: true,
        is_published: true,
        last_verified_at: now,
        last_verification_report: verificationReport,
        version_hash: versionHash,
        verification_required: false,
        vars_used_cache: varsUsed,
        vars_cache_updated_at: now,
      })
      .eq('id', template_id);

    if (updateError) {
      throw new Error(`Failed to publish template: ${updateError.message}`);
    }

    await supabase
      .from('idoc_verification_audit')
      .insert({
        template_id,
        verification_type: 'PUBLISH',
        old_status: 'DRAFT',
        new_status: 'VERIFIED',
        verification_report: verificationReport,
        blockers: [],
        warnings,
        performed_by: (await supabase.auth.getUser()).data.user?.id,
        success: true,
      });

    const result: VerifyPublishResult = {
      ok: true,
      status: 'VERIFIED',
      published: true,
      blocked: false,
      blockers: [],
      warnings,
      report: {
        unknownVarsCount: 0,
        unknownVars: [],
        hasPlaceholders: false,
        missingRequired,
        versionHash,
        verifiedAt: now,
      },
    };

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error('Verify & Publish Error:', error);

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