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
    let user = null;
    let isGuest = true;

    if (authHeader) {
      const token = authHeader.replace('Bearer ', '');
      const { data: { user: authUser }, error: userError } = await supabase.auth.getUser(token);
      if (!userError && authUser) {
        user = authUser;
        isGuest = false;
      }
    }

    const { packageId, customerEmail, successUrl, cancelUrl, referralCode } = await req.json();

    if (!packageId || !customerEmail) {
      throw new Error('packageId and customerEmail are required');
    }

    const { data: creditPackage, error: packageError } = await supabase
      .from('credit_packages')
      .select('*')
      .eq('id', packageId)
      .eq('is_active', true)
      .single();

    if (packageError || !creditPackage) {
      throw new Error('Credit package not found');
    }

    const totalCredits = creditPackage.credits + creditPackage.bonus_credits;
    const priceInCents = Math.round(creditPackage.price * 100);

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      customer_email: customerEmail,
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: `${totalCredits} crédits iDoc`,
              description: `Pack de ${creditPackage.credits} crédits + ${creditPackage.bonus_credits} bonus`,
              images: ['https://idoc.com/logo.png'],
            },
            unit_amount: priceInCents,
          },
          quantity: 1,
        },
      ],
      payment_method_types: ['card', 'paypal'],
      billing_address_collection: 'auto',
      invoice_creation: {
        enabled: true,
      },
      metadata: {
        userId: user?.id || 'guest',
        packageId: packageId,
        credits: creditPackage.credits.toString(),
        bonusCredits: creditPackage.bonus_credits.toString(),
        referralCode: referralCode || '',
        type: 'credits_purchase',
      },
      success_url: successUrl || `${req.headers.get('origin')}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl || `${req.headers.get('origin')}/`,
    });

    await supabase.from('credit_purchases').insert({
      user_id: user?.id,
      package_id: packageId,
      credits_purchased: creditPackage.credits,
      bonus_credits: creditPackage.bonus_credits,
      amount_paid: creditPackage.price,
      payment_method: 'stripe',
      stripe_session_id: session.id,
      referral_code: referralCode,
      is_guest: isGuest,
      guest_email: isGuest ? customerEmail : null,
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
    console.error('Error creating credits checkout:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});