import { createClient } from 'npm:@supabase/supabase-js@2.57.4';
import { getCorsHeaders, handleCorsPreflightRequest } from '../_shared/cors.ts';

interface GenerateDocumentRequest {
  template_id: string;
  data: Record<string, unknown>;
  output_format?: 'url' | 'base64';
}

interface ApiKeyRecord {
  id: string;
  user_id: string;
  rate_limit: number;
  is_active: boolean;
  permissions: string[];
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return handleCorsPreflightRequest(req);
  }

  const corsHeaders = getCorsHeaders(req.headers.get('origin'));

  try {
    const url = new URL(req.url);
    const path = url.pathname;

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(
        JSON.stringify({ error: 'Missing or invalid Authorization header' }),
        {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const apiKey = authHeader.replace('Bearer ', '');

    const encoder = new TextEncoder();
    const data = encoder.encode(apiKey);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const keyHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

    const { data: keyRecord, error: keyError } = await supabase
      .from('api_keys')
      .select('id, user_id, rate_limit, is_active, permissions')
      .eq('key_hash', keyHash)
      .eq('is_active', true)
      .maybeSingle();

    if (keyError || !keyRecord) {
      return new Response(
        JSON.stringify({ error: 'Invalid API key' }),
        {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const startTime = Date.now();

    let responseBody: unknown;
    let statusCode = 200;

    if (path === '/idoc-api/v1/templates' && req.method === 'GET') {
      const { data: templates, error } = await supabase
        .from('document_templates')
        .select('id, name, category, description, slug')
        .eq('is_active', true)
        .order('sort_order');

      if (error) throw error;

      responseBody = {
        success: true,
        data: templates,
      };
    } else if (path === '/idoc-api/v1/documents/generate' && req.method === 'POST') {
      if (!keyRecord.permissions.includes('documents:generate')) {
        statusCode = 403;
        responseBody = { error: 'Permission denied' };
      } else {
        const body: GenerateDocumentRequest = await req.json();

        const { data: template, error: templateError } = await supabase
          .from('document_templates')
          .select('*')
          .eq('id', body.template_id)
          .eq('is_active', true)
          .maybeSingle();

        if (templateError || !template) {
          statusCode = 404;
          responseBody = { error: 'Template not found' };
        } else {
          const documentId = crypto.randomUUID();
          const pdfUrl = `https://cdn.idoc.com/docs/${documentId}.pdf`;

          const { error: insertError } = await supabase
            .from('generated_documents')
            .insert({
              id: documentId,
              user_id: keyRecord.user_id,
              template_id: body.template_id,
              document_type: template.slug,
              content: body.data,
              pdf_url: pdfUrl,
              status: 'generated',
              price: 0,
            });

          if (insertError) throw insertError;

          responseBody = {
            success: true,
            document_id: documentId,
            url: pdfUrl,
            expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          };
        }
      }
    } else {
      statusCode = 404;
      responseBody = { error: 'Endpoint not found' };
    }

    const duration = Date.now() - startTime;

    await supabase.from('api_logs').insert({
      api_key_id: keyRecord.id,
      endpoint: path,
      method: req.method,
      status_code: statusCode,
      request_body: req.method === 'POST' ? await req.clone().json() : null,
      response_body: responseBody,
      ip_address: req.headers.get('x-forwarded-for') || 'unknown',
      duration_ms: duration,
    });

    await supabase
      .from('api_keys')
      .update({ last_used_at: new Date().toISOString() })
      .eq('id', keyRecord.id);

    return new Response(JSON.stringify(responseBody), {
      status: statusCode,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('API Error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
