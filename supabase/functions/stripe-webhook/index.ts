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
    const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET');
    
    if (!stripeSecretKey) {
      throw new Error('STRIPE_SECRET_KEY not configured');
    }

    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2023-10-16',
    });

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Lire le body RAW pour la signature
    const body = await req.text();
    const signature = req.headers.get('stripe-signature');

    if (!signature) {
      throw new Error('Missing stripe-signature header');
    }

    // Vérifier la signature Stripe
    let event: Stripe.Event;
    if (webhookSecret) {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } else {
      // En développement, parser directement
      event = JSON.parse(body);
    }

    console.log('Webhook event:', event.type);

    // Gérer les différents événements
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.userId;
        const type = session.metadata?.type;

        if (type === 'model_purchase') {
          // Achat de modèle
          const templateId = session.metadata?.templateId;
          
          // Récupérer l'invoice
          const invoice = session.invoice ? await stripe.invoices.retrieve(session.invoice as string) : null;
          
          // Mettre à jour la purchase
          const { error: updateError } = await supabase
            .from('purchases')
            .update({
              stripe_payment_intent_id: session.payment_intent as string,
              stripe_invoice_id: invoice?.id,
              invoice_pdf_url: invoice?.invoice_pdf,
              invoice_hosted_url: invoice?.hosted_invoice_url,
              amount: (session.amount_total || 0) / 100,
              tax_amount: (session.total_details?.amount_tax || 0) / 100,
              country: session.customer_details?.address?.country,
              province_or_state: session.customer_details?.address?.state,
              status: 'paid',
            })
            .eq('stripe_session_id', session.id);

          if (updateError) {
            console.error('Error updating purchase:', updateError);
          }

          // Créer une entrée dans le journal comptable
          await supabase.from('accounting_log').insert({
            type: 'sale',
            reference_type: 'purchase',
            reference_id: session.id,
            amount: (session.amount_total || 0) / 100,
            tax_amount: (session.total_details?.amount_tax || 0) / 100,
            country: session.customer_details?.address?.country,
            province_or_state: session.customer_details?.address?.state,
            currency: session.currency?.toUpperCase(),
          });

        } else if (type === 'subscription') {
          // Abonnement
          const planId = session.metadata?.planId;
          const subscription = await stripe.subscriptions.retrieve(session.subscription as string);
          
          const invoice = session.invoice ? await stripe.invoices.retrieve(session.invoice as string) : null;

          // Créer ou mettre à jour l'abonnement
          const { error: subError } = await supabase
            .from('subscriptions')
            .upsert({
              user_id: userId,
              stripe_customer_id: session.customer as string,
              stripe_subscription_id: subscription.id,
              plan_id: planId,
              status: subscription.status,
              current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
              current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
              last_invoice_pdf_url: invoice?.invoice_pdf,
              last_invoice_hosted_url: invoice?.hosted_invoice_url,
              cancel_at_period_end: subscription.cancel_at_period_end,
            }, {
              onConflict: 'stripe_subscription_id',
            });

          if (subError) {
            console.error('Error upserting subscription:', subError);
          }

          // Journal comptable
          await supabase.from('accounting_log').insert({
            type: 'sale',
            reference_type: 'subscription',
            reference_id: subscription.id,
            amount: (session.amount_total || 0) / 100,
            tax_amount: (session.total_details?.amount_tax || 0) / 100,
            country: session.customer_details?.address?.country,
            province_or_state: session.customer_details?.address?.state,
            currency: session.currency?.toUpperCase(),
          });
        }
        break;
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice;
        
        if (invoice.subscription) {
          // Mise à jour de la facture pour l'abonnement
          await supabase
            .from('subscriptions')
            .update({
              last_invoice_pdf_url: invoice.invoice_pdf,
              last_invoice_hosted_url: invoice.hosted_invoice_url,
            })
            .eq('stripe_subscription_id', invoice.subscription);

          // Journal comptable
          await supabase.from('accounting_log').insert({
            type: 'sale',
            reference_type: 'subscription',
            reference_id: invoice.subscription as string,
            amount: (invoice.amount_paid || 0) / 100,
            tax_amount: (invoice.tax || 0) / 100,
            country: invoice.customer_address?.country,
            province_or_state: invoice.customer_address?.state,
            currency: invoice.currency?.toUpperCase(),
          });
        }
        break;
      }

      case 'charge.refunded': {
        const charge = event.data.object as Stripe.Charge;
        
        // Trouver le purchase associé
        const { data: purchase } = await supabase
          .from('purchases')
          .select('id')
          .eq('stripe_payment_intent_id', charge.payment_intent)
          .single();

        if (purchase) {
          // Mettre à jour le statut
          await supabase
            .from('purchases')
            .update({ status: 'refunded' })
            .eq('id', purchase.id);

          // Journal comptable
          await supabase.from('accounting_log').insert({
            type: 'refund',
            reference_type: 'purchase',
            reference_id: purchase.id,
            amount: -(charge.amount_refunded || 0) / 100,
            currency: charge.currency?.toUpperCase(),
          });
        }
        break;
      }

      case 'invoice.voided': {
        const invoice = event.data.object as Stripe.Invoice;
        
        // Trouver le purchase associé
        const { data: purchase } = await supabase
          .from('purchases')
          .select('id')
          .eq('stripe_invoice_id', invoice.id)
          .single();

        if (purchase) {
          // Mettre à jour le statut
          await supabase
            .from('purchases')
            .update({ status: 'cancelled' })
            .eq('id', purchase.id);

          // Journal comptable
          await supabase.from('accounting_log').insert({
            type: 'cancellation',
            reference_type: 'purchase',
            reference_id: purchase.id,
            amount: 0,
            notes: 'Invoice voided',
          });
        }
        break;
      }

      case 'customer.subscription.updated':
      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        
        await supabase
          .from('subscriptions')
          .update({
            status: subscription.status,
            current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
            current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
            cancel_at_period_end: subscription.cancel_at_period_end,
          })
          .eq('stripe_subscription_id', subscription.id);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return new Response(
      JSON.stringify({ received: true }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Webhook error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
