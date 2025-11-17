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
    if (!authHeader) {
      throw new Error('Missing authorization header');
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    
    if (userError || !user) {
      throw new Error('Unauthorized');
    }

    const url = new URL(req.url);
    const path = url.pathname.split('/dossiers-api')[1] || '';

    // Router
    if (req.method === 'POST' && path === '/create') {
      return await handleCreateDossier(supabase, user, req);
    } else if (req.method === 'POST' && path === '/add-document') {
      return await handleAddDocument(supabase, user, req);
    } else if (req.method === 'POST' && path === '/update-status') {
      return await handleUpdateStatus(supabase, user, req);
    } else if (req.method === 'POST' && path === '/update-document-status') {
      return await handleUpdateDocumentStatus(supabase, user, req);
    } else if (req.method === 'GET' && path === '/list') {
      return await handleListDossiers(supabase, user, url);
    } else if (req.method === 'GET' && path.startsWith('/')) {
      const dossierId = path.substring(1);
      return await handleGetDossier(supabase, user, dossierId);
    }

    throw new Error('Route not found');
  } catch (error) {
    console.error('API error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

async function handleCreateDossier(supabase: any, user: any, req: Request) {
  const { client_id, title, description, priority, due_date } = await req.json();

  if (!client_id || !title) {
    throw new Error('client_id and title are required');
  }

  // Créer le dossier
  const { data: dossier, error } = await supabase
    .from('dossiers')
    .insert({
      client_id,
      title,
      description,
      priority: priority || 'normal',
      due_date,
      created_by_user_id: user.id,
      status: 'draft',
    })
    .select()
    .single();

  if (error) throw error;

  // Logger l'activité
  await supabase.rpc('log_dossier_activity', {
    p_dossier_id: dossier.id,
    p_user_id: user.id,
    p_activity_type: 'created',
    p_details: { title, description },
  });

  return new Response(
    JSON.stringify({ success: true, dossier }),
    {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    }
  );
}

async function handleAddDocument(supabase: any, user: any, req: Request) {
  const { dossier_id, document_id, status } = await req.json();

  if (!dossier_id || !document_id) {
    throw new Error('dossier_id and document_id are required');
  }

  // Ajouter le document au dossier
  const { data, error } = await supabase
    .from('dossier_documents')
    .insert({
      dossier_id,
      document_id,
      status: status || 'draft',
    })
    .select()
    .single();

  if (error) throw error;

  // Logger
  await supabase.rpc('log_dossier_activity', {
    p_dossier_id: dossier_id,
    p_user_id: user.id,
    p_activity_type: 'document_added',
    p_details: { document_id },
  });

  return new Response(
    JSON.stringify({ success: true, data }),
    {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    }
  );
}

async function handleUpdateStatus(supabase: any, user: any, req: Request) {
  const { dossier_id, new_status, notes } = await req.json();

  if (!dossier_id || !new_status) {
    throw new Error('dossier_id and new_status are required');
  }

  // Utiliser la fonction SQL pour changer le statut
  const { data, error } = await supabase.rpc('change_dossier_status', {
    p_dossier_id: dossier_id,
    p_new_status: new_status,
    p_user_id: user.id,
    p_notes: notes,
  });

  if (error) throw error;

  return new Response(
    JSON.stringify({ success: true }),
    {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    }
  );
}

async function handleUpdateDocumentStatus(supabase: any, user: any, req: Request) {
  const { dossier_document_id, new_status, review_comments } = await req.json();

  if (!dossier_document_id || !new_status) {
    throw new Error('dossier_document_id and new_status are required');
  }

  const { data, error } = await supabase
    .from('dossier_documents')
    .update({
      status: new_status,
      review_comments,
      reviewed_by: user.id,
      reviewed_at: new Date().toISOString(),
    })
    .eq('id', dossier_document_id)
    .select()
    .single();

  if (error) throw error;

  // Logger
  await supabase.rpc('log_dossier_activity', {
    p_dossier_id: data.dossier_id,
    p_user_id: user.id,
    p_activity_type: 'document_status_changed',
    p_details: { dossier_document_id, new_status, review_comments },
  });

  return new Response(
    JSON.stringify({ success: true, data }),
    {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    }
  );
}

async function handleListDossiers(supabase: any, user: any, url: URL) {
  const clientId = url.searchParams.get('client_id');
  const status = url.searchParams.get('status');

  let query = supabase
    .from('dossiers')
    .select(`
      *,
      clients(*),
      dossier_documents(count)
    `)
    .order('created_at', { ascending: false });

  if (clientId) {
    query = query.eq('client_id', clientId);
  }

  if (status) {
    query = query.eq('status', status);
  }

  const { data, error } = await query;

  if (error) throw error;

  return new Response(
    JSON.stringify({ dossiers: data }),
    {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    }
  );
}

async function handleGetDossier(supabase: any, user: any, dossierId: string) {
  // Récupérer le dossier complet
  const { data: dossier, error: dossierError } = await supabase
    .from('dossiers')
    .select(`
      *,
      clients(*)
    `)
    .eq('id', dossierId)
    .single();

  if (dossierError) throw dossierError;

  // Récupérer les documents
  const { data: documents, error: docsError } = await supabase
    .from('dossier_documents')
    .select('*')
    .eq('dossier_id', dossierId)
    .order('created_at', { ascending: false });

  if (docsError) throw docsError;

  // Récupérer l'activité
  const { data: activity, error: activityError } = await supabase
    .from('dossier_activity')
    .select(`
      *,
      user_profiles!dossier_activity_user_id_fkey(email, full_name)
    `)
    .eq('dossier_id', dossierId)
    .order('created_at', { ascending: false })
    .limit(50);

  if (activityError) throw activityError;

  return new Response(
    JSON.stringify({
      dossier,
      documents,
      activity,
    }),
    {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    }
  );
}
