import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import { createClient } from 'npm:@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const authHeader = req.headers.get('Authorization');
    if (!authHeader) throw new Error('Missing authorization');

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    if (userError || !user) throw new Error('Unauthorized');

    // Vérifier admin
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (!profile || profile.role !== 'admin') {
      throw new Error('Admin access required');
    }

    const url = new URL(req.url);
    const path = url.pathname.split('/template-lab-api')[1] || '';

    // Router
    if (req.method === 'POST' && path === '/test') {
      return await handleRunTest(supabase, user, req);
    } else if (req.method === 'POST' && path === '/approve') {
      return await handleApprove(supabase, user, req);
    } else if (req.method === 'POST' && path === '/reject') {
      return await handleReject(supabase, user, req);
    } else if (req.method === 'POST' && path === '/publish') {
      return await handlePublish(supabase, user, req);
    } else if (req.method === 'GET' && path.startsWith('/template/')) {
      const templateId = path.substring('/template/'.length);
      return await handleGetTemplateDetail(supabase, templateId);
    }

    throw new Error('Route not found');
  } catch (error) {
    console.error('API error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

async function handleRunTest(supabase: any, user: any, req: Request) {
  const { template_id, test_values, result, issues_found } = await req.json();

  const { data, error } = await supabase.rpc('run_template_test', {
    p_template_id: template_id,
    p_admin_id: user.id,
    p_test_values: test_values,
    p_result: result,
    p_issues_found: issues_found,
  });

  if (error) throw error;

  return new Response(
    JSON.stringify({ success: true, test_run_id: data }),
    { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

async function handleApprove(supabase: any, user: any, req: Request) {
  const { template_id, summary, checklist, test_runs } = await req.json();

  const { data, error } = await supabase.rpc('approve_template', {
    p_template_id: template_id,
    p_admin_id: user.id,
    p_summary: summary,
    p_checklist: checklist || {},
    p_test_runs_included: test_runs || [],
  });

  if (error) throw error;

  return new Response(
    JSON.stringify({ success: true, certificate_id: data }),
    { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

async function handleReject(supabase: any, user: any, req: Request) {
  const { template_id, internal_notes, issues_found } = await req.json();

  const { data, error } = await supabase.rpc('reject_template', {
    p_template_id: template_id,
    p_admin_id: user.id,
    p_internal_notes: internal_notes,
    p_issues_found: issues_found,
  });

  if (error) throw error;

  return new Response(
    JSON.stringify({ success: true }),
    { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

async function handlePublish(supabase: any, user: any, req: Request) {
  const { template_id } = await req.json();

  const { data, error } = await supabase.rpc('publish_template', {
    p_template_id: template_id,
    p_admin_id: user.id,
  });

  if (error) throw error;

  return new Response(
    JSON.stringify({ success: true }),
    { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

async function handleGetTemplateDetail(supabase: any, templateId: string) {
  // Template info
  const { data: template, error: tempError } = await supabase
    .from('document_templates')
    .select('*')
    .eq('id', templateId)
    .single();

  if (tempError) throw tempError;

  // Test runs
  const { data: testRuns } = await supabase
    .from('template_test_runs')
    .select(`
      *,
      user_profiles!template_test_runs_admin_id_fkey(email, full_name)
    `)
    .eq('template_id', templateId)
    .order('created_at', { ascending: false })
    .limit(20);

  // Certificates
  const { data: certificates } = await supabase
    .from('template_certificates')
    .select(`
      *,
      user_profiles!template_certificates_approved_by_user_id_fkey(email, full_name)
    `)
    .eq('template_id', templateId)
    .order('approved_at', { ascending: false });

  return new Response(
    JSON.stringify({ template, testRuns, certificates }),
    { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}
