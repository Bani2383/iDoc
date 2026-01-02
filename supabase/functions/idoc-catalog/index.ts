import { createClient } from 'npm:@supabase/supabase-js@2.57.4';
import { getCorsHeaders, handleCorsPreflightRequest } from '../_shared/cors.ts';

interface CatalogTemplate {
  id: string;
  template_code: string;
  slug: string;
  title: any;
  description: any;
  category: string;
  sub_category: string | null;
  meta_title: any;
  meta_description: any;
  free_tier_enabled: boolean;
  premium_tier_enabled: boolean;
  usage_count: number;
  status: string;
  last_verified_at: string;
}

async function checkTemplateProductionReady(
  supabase: any,
  templateId: string
): Promise<{ ready: boolean; reason?: string }> {
  const { data, error } = await supabase
    .from('idoc_guided_templates')
    .select('id, status, last_verified_at, updated_at, version_hash, template_content, is_active')
    .eq('id', templateId)
    .maybeSingle();

  if (error || !data) {
    return { ready: false, reason: 'Template not found' };
  }

  if (!data.is_active) {
    return { ready: false, reason: 'Template is not active' };
  }

  if (data.status !== 'VERIFIED') {
    return { ready: false, reason: `Template status is ${data.status}, not VERIFIED` };
  }

  if (!data.last_verified_at) {
    return { ready: false, reason: 'Template has never been verified' };
  }

  const verifiedAt = new Date(data.last_verified_at);
  const updatedAt = new Date(data.updated_at);

  if (verifiedAt < updatedAt) {
    return { ready: false, reason: 'Template was modified after last verification' };
  }

  if (!data.version_hash) {
    return { ready: false, reason: 'Template has no version hash' };
  }

  return { ready: true };
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
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    if (path.endsWith('/catalog') && req.method === 'GET') {
      const category = url.searchParams.get('category');
      const lang = url.searchParams.get('lang') || 'en';

      let query = supabase
        .from('idoc_guided_templates')
        .select('id, template_code, slug, title, description, category, sub_category, meta_title, meta_description, free_tier_enabled, premium_tier_enabled, usage_count, status, last_verified_at, updated_at, version_hash')
        .eq('is_active', true)
        .eq('status', 'VERIFIED')
        .not('last_verified_at', 'is', null);

      if (category) {
        query = query.eq('category', category);
      }

      const { data: templates, error } = await query.order('usage_count', { ascending: false });

      if (error) {
        throw error;
      }

      const validTemplates: CatalogTemplate[] = [];

      for (const template of templates || []) {
        const verifiedAt = new Date(template.last_verified_at);
        const updatedAt = new Date(template.updated_at);

        if (verifiedAt >= updatedAt && template.version_hash) {
          validTemplates.push({
            id: template.id,
            template_code: template.template_code,
            slug: template.slug,
            title: template.title,
            description: template.description,
            category: template.category,
            sub_category: template.sub_category,
            meta_title: template.meta_title,
            meta_description: template.meta_description,
            free_tier_enabled: template.free_tier_enabled,
            premium_tier_enabled: template.premium_tier_enabled,
            usage_count: template.usage_count,
            status: template.status,
            last_verified_at: template.last_verified_at,
          });
        }
      }

      return new Response(
        JSON.stringify({
          ok: true,
          count: validTemplates.length,
          templates: validTemplates,
        }),
        {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    if (path.includes('/template/') && req.method === 'GET') {
      const templateId = path.split('/template/')[1];

      if (!templateId) {
        return new Response(
          JSON.stringify({ ok: false, error: 'Template ID required' }),
          {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }

      const productionCheck = await checkTemplateProductionReady(supabase, templateId);

      if (!productionCheck.ready) {
        return new Response(
          JSON.stringify({
            ok: false,
            error: 'Template not available',
            reason: productionCheck.reason,
            code: 'TEMPLATE_NOT_PRODUCTION_READY',
          }),
          {
            status: 403,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }

      const { data: template, error } = await supabase
        .from('idoc_guided_templates')
        .select('*')
        .eq('id', templateId)
        .eq('status', 'VERIFIED')
        .maybeSingle();

      if (error || !template) {
        return new Response(
          JSON.stringify({ ok: false, error: 'Template not found' }),
          {
            status: 404,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }

      return new Response(
        JSON.stringify({
          ok: true,
          template: {
            ...template,
            production_ready: true,
          },
        }),
        {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    if (path.endsWith('/check-production-ready') && req.method === 'POST') {
      const body = await req.json();
      const { template_id } = body;

      if (!template_id) {
        return new Response(
          JSON.stringify({ ok: false, error: 'template_id required' }),
          {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }

      const check = await checkTemplateProductionReady(supabase, template_id);

      return new Response(
        JSON.stringify({
          ok: true,
          production_ready: check.ready,
          reason: check.reason,
        }),
        {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    return new Response(
      JSON.stringify({ ok: false, error: 'Endpoint not found' }),
      {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error: any) {
    console.error('Catalog API Error:', error);

    return new Response(
      JSON.stringify({ ok: false, error: error.message || 'Internal server error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});