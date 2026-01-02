import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import Stripe from 'npm:stripe@14.10.0';
import { createClient } from 'npm:@supabase/supabase-js@2.57.4';
import { getCorsHeaders, handleCorsPreflightRequest } from '../_shared/cors.ts';

async function verifyTemplateProductionReady(
  supabase: any,
  templateId: string
): Promise<{ ok: boolean; error?: string }> {
  const { data: template, error } = await supabase
    .from('idoc_guided_templates')
    .select('id, status, last_verified_at, updated_at, version_hash, is_active, template_code')
    .eq('id', templateId)
    .maybeSingle();

  if (error || !template) {
    return { ok: false, error: 'Template not found' };
  }

  if (!template.is_active) {
    return { ok: false, error: 'Template is not active' };
  }

  if (template.status !== 'VERIFIED') {
    return { ok: false, error: `Template is not verified (status: ${template.status})` };
  }

  if (!template.last_verified_at) {
    return { ok: false, error: 'Template has never been verified' };
  }

  const verifiedAt = new Date(template.last_verified_at);
  const updatedAt = new Date(template.updated_at);

  if (verifiedAt < updatedAt) {
    return {
      ok: false,
      error: 'Template was modified after verification. Re-verification required.',
    };
  }

  if (!template.version_hash) {
    return { ok: false, error: 'Template has no version hash' };
  }

  return { ok: true };
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return handleCorsPreflightRequest(req);
  }

  const corsHeaders = getCorsHeaders(req.headers.get('origin'));

  try {
    const stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY');
    if (!stripeSecretKey) {
      throw new Error('STRIPE_SECRET_KEY not configured');
    }

    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2023-10-16',
    });

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const authHeader = req.headers.get('Authorization');
    let user = null;
    let isGuest = true;

    if (authHeader) {
      const token = authHeader.replace('Bearer ', '');
      const { data: userData, error: userError } = await supabase.auth.getUser(token);
      if (!userError && userData?.user) {
        user = userData.user;
        isGuest = false;
      }
    }

    const { template_id, customer_email, success_url, cancel_url, metadata } = await req.json();

    if (!template_id) {
      return new Response(
        JSON.stringify({ ok: false, error: 'template_id is required' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    if (!customer_email) {
      return new Response(
        JSON.stringify({ ok: false, error: 'customer_email is required' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const productionCheck = await verifyTemplateProductionReady(supabase, template_id);

    if (!productionCheck.ok) {
      console.error('CHECKOUT BLOCKED:', productionCheck.error);

      await supabase.from('idoc_verification_audit').insert({
        template_id,
        verification_type: 'CHECKOUT_BLOCKED',
        new_status: 'BLOCKED',
        verification_report: {
          error: productionCheck.error,
          blocked_at: new Date().toISOString(),
        },
        blockers: [productionCheck.error],
        performed_by: user?.id || null,
        success: false,
        error_message: productionCheck.error,
      });

      return new Response(
        JSON.stringify({
          ok: false,
          error: 'This template is not available for purchase',
          reason: productionCheck.error,
          code: 'TEMPLATE_NOT_PRODUCTION_READY',
        }),
        {
          status: 403,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const { data: template, error: templateError } = await supabase
      .from('idoc_guided_templates')
      .select('id, template_code, title, category')
      .eq('id', template_id)
      .eq('status', 'VERIFIED')
      .maybeSingle();

    if (templateError || !template) {
      return new Response(
        JSON.stringify({ ok: false, error: 'Template not found or not available' }),
        {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const price = 4.99;
    const priceInCents = Math.round(price * 100);

    const templateTitle = typeof template.title === 'object' && template.title.en
      ? template.title.en
      : template.template_code;

    const checkoutMetadata = {
      template_id: template_id,
      template_code: template.template_code,
      type: 'idoc_guided_template',
      user_id: user?.id || 'guest',
      is_guest: isGuest ? 'true' : 'false',
      ...metadata,
    };

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      customer_email: customer_email,
      line_items: [
        {
          price_data: {
            currency: 'cad',
            product_data: {
              name: templateTitle,
              description: `iDoc Guided Template: ${templateTitle}`,
            },
            unit_amount: priceInCents,
          },
          quantity: 1,
        },
      ],
      automatic_tax: {
        enabled: true,
      },
      billing_address_collection: 'required',
      invoice_creation: {
        enabled: true,
      },
      metadata: checkoutMetadata,
      success_url: success_url || `${req.headers.get('origin')}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancel_url || `${req.headers.get('origin')}/templates/${template.template_code}`,
    });

    const purchaseRecord = {
      user_id: user?.id || null,
      stripe_session_id: session.id,
      amount: price,
      currency: 'CAD',
      status: 'pending',
      metadata: checkoutMetadata,
    };

    await supabase.from('purchases').insert(purchaseRecord);

    await supabase.from('idoc_generated_documents').insert({
      user_id: user?.id || null,
      session_id: session.id,
      template_id: template_id,
      document_type: template.template_code,
      status: 'payment_pending',
      price: price,
    });

    return new Response(
      JSON.stringify({
        ok: true,
        session_id: session.id,
        url: session.url,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error: any) {
    console.error('Checkout Error:', error);

    return new Response(
      JSON.stringify({ ok: false, error: error.message || 'Checkout failed' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});