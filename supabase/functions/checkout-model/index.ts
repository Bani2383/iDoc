import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import Stripe from 'npm:stripe@14.10.0';
import { createClient } from 'npm:@supabase/supabase-js@2.39.3';
import { getCorsHeaders, handleCorsPreflightRequest } from '../_shared/cors.ts';

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
    if (!authHeader) {
      throw new Error('Missing authorization header');
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    
    if (userError || !user) {
      throw new Error('Unauthorized');
    }

    const { templateId, customerEmail, successUrl, cancelUrl } = await req.json();

    if (!templateId || !customerEmail) {
      throw new Error('templateId and customerEmail are required');
    }

    // Récupérer le template
    const { data: template, error: templateError } = await supabase
      .from('document_templates')
      .select('id, name, price')
      .eq('id', templateId)
      .single();

    if (templateError || !template) {
      throw new Error('Template not found');
    }

    const price = template.price || 1.99;
    const priceInCents = Math.round(price * 100);

    // Créer la session Checkout avec Stripe Tax
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      customer_email: customerEmail,
      line_items: [
        {
          price_data: {
            currency: 'cad',
            product_data: {
              name: template.name,
              description: `Modèle de document: ${template.name}`,
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
      metadata: {
        userId: user.id,
        templateId: templateId,
        type: 'model_purchase',
      },
      success_url: successUrl || `${req.headers.get('origin')}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl || `${req.headers.get('origin')}/`,
    });

    // Créer l'entrée purchase en statut pending
    await supabase.from('purchases').insert({
      user_id: user.id,
      template_id: templateId,
      stripe_session_id: session.id,
      amount: price,
      currency: 'CAD',
      status: 'pending',
    });

    return new Response(
      JSON.stringify({ sessionId: session.id, url: session.url }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
