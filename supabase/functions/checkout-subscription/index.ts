import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import Stripe from 'npm:stripe@14.10.0';
import { createClient } from 'npm:@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

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

    const { customerEmail, planId, successUrl, cancelUrl } = await req.json();

    if (!customerEmail) {
      throw new Error('customerEmail is required');
    }

    const plan = planId || 'pro';
    
    // Prix des plans (en cents)
    const planPrices: Record<string, number> = {
      'pro': 1999, // 19.99 CAD/mois
      'enterprise': 4999, // 49.99 CAD/mois
    };

    const priceInCents = planPrices[plan] || planPrices['pro'];

    // Vérifier si le client existe déjà
    const { data: existingCustomer } = await supabase
      .from('subscriptions')
      .select('stripe_customer_id')
      .eq('user_id', user.id)
      .limit(1)
      .single();

    let customerId = existingCustomer?.stripe_customer_id;

    // Créer le client Stripe si nécessaire
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: customerEmail,
        metadata: {
          userId: user.id,
        },
      });
      customerId = customer.id;
    }

    // Créer un prix récurrent dans Stripe
    const price = await stripe.prices.create({
      currency: 'cad',
      unit_amount: priceInCents,
      recurring: {
        interval: 'month',
      },
      product_data: {
        name: `iDoc ${plan.charAt(0).toUpperCase() + plan.slice(1)}`,
        description: `Abonnement mensuel iDoc ${plan}`,
      },
    });

    // Créer la session Checkout avec abonnement et Stripe Tax
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      customer: customerId,
      line_items: [
        {
          price: price.id,
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
        planId: plan,
        type: 'subscription',
      },
      success_url: successUrl || `${req.headers.get('origin')}/dashboard?subscription=success`,
      cancel_url: cancelUrl || `${req.headers.get('origin')}/pricing`,
    });

    return new Response(
      JSON.stringify({ sessionId: session.id, url: session.url }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error creating subscription checkout:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
