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

    // Vérifier que l'utilisateur est admin
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (!profile || profile.role !== 'admin') {
      throw new Error('Admin access required');
    }

    const { action, ...params } = await req.json();

    switch (action) {
      case 'refund': {
        const { purchaseId, amount, reason } = params;
        
        if (!purchaseId) {
          throw new Error('purchaseId is required');
        }

        // Récupérer la purchase
        const { data: purchase, error: fetchError } = await supabase
          .from('purchases')
          .select('*')
          .eq('id', purchaseId)
          .single();

        if (fetchError || !purchase) {
          throw new Error('Purchase not found');
        }

        if (purchase.status === 'refunded') {
          throw new Error('Purchase already refunded');
        }

        // Effectuer le remboursement dans Stripe
        const refund = await stripe.refunds.create({
          payment_intent: purchase.stripe_payment_intent_id,
          amount: amount ? Math.round(amount * 100) : undefined, // Remboursement partiel optionnel
          reason: reason || 'requested_by_customer',
        });

        // Mettre à jour la purchase
        await supabase
          .from('purchases')
          .update({ 
            status: 'refunded',
            metadata: { 
              ...purchase.metadata,
              refund_id: refund.id,
              refund_reason: reason,
              refunded_at: new Date().toISOString(),
            }
          })
          .eq('id', purchaseId);

        // Journal comptable
        await supabase.from('accounting_log').insert({
          type: 'refund',
          reference_type: 'purchase',
          reference_id: purchaseId,
          amount: -(refund.amount / 100),
          currency: refund.currency.toUpperCase(),
          notes: reason,
          created_by: user.id,
        });

        return new Response(
          JSON.stringify({ success: true, refund }),
          {
            status: 200,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }

      case 'void-invoice': {
        const { purchaseId } = params;
        
        if (!purchaseId) {
          throw new Error('purchaseId is required');
        }

        // Récupérer la purchase
        const { data: purchase, error: fetchError } = await supabase
          .from('purchases')
          .select('*')
          .eq('id', purchaseId)
          .single();

        if (fetchError || !purchase) {
          throw new Error('Purchase not found');
        }

        if (!purchase.stripe_invoice_id) {
          throw new Error('No invoice associated with this purchase');
        }

        // Annuler la facture dans Stripe
        const invoice = await stripe.invoices.voidInvoice(purchase.stripe_invoice_id);

        // Mettre à jour la purchase
        await supabase
          .from('purchases')
          .update({ status: 'cancelled' })
          .eq('id', purchaseId);

        // Journal comptable
        await supabase.from('accounting_log').insert({
          type: 'cancellation',
          reference_type: 'purchase',
          reference_id: purchaseId,
          amount: 0,
          notes: 'Invoice voided by admin',
          created_by: user.id,
        });

        return new Response(
          JSON.stringify({ success: true, invoice }),
          {
            status: 200,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }

      case 'correct-transaction': {
        const { purchaseId, newAmount, newTaxAmount, notes } = params;
        
        if (!purchaseId) {
          throw new Error('purchaseId is required');
        }

        // Récupérer la purchase
        const { data: purchase, error: fetchError } = await supabase
          .from('purchases')
          .select('*')
          .eq('id', purchaseId)
          .single();

        if (fetchError || !purchase) {
          throw new Error('Purchase not found');
        }

        const oldAmount = parseFloat(purchase.amount);
        const oldTaxAmount = parseFloat(purchase.tax_amount || 0);

        // Mettre à jour avec les valeurs corrigées
        await supabase
          .from('purchases')
          .update({ 
            amount: newAmount,
            tax_amount: newTaxAmount,
            metadata: {
              ...purchase.metadata,
              corrected: true,
              original_amount: oldAmount,
              original_tax_amount: oldTaxAmount,
              correction_notes: notes,
              corrected_at: new Date().toISOString(),
            }
          })
          .eq('id', purchaseId);

        // Journal comptable
        await supabase.from('accounting_log').insert({
          type: 'correction',
          reference_type: 'purchase',
          reference_id: purchaseId,
          amount: newAmount - oldAmount,
          tax_amount: (newTaxAmount || 0) - oldTaxAmount,
          notes: `Correction: ${notes}. Original: ${oldAmount}, New: ${newAmount}`,
          created_by: user.id,
        });

        return new Response(
          JSON.stringify({ success: true }),
          {
            status: 200,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }

      case 'cancel-subscription': {
        const { subscriptionId, immediately } = params;
        
        if (!subscriptionId) {
          throw new Error('subscriptionId is required');
        }

        // Récupérer l'abonnement
        const { data: subscription, error: fetchError } = await supabase
          .from('subscriptions')
          .select('*')
          .eq('id', subscriptionId)
          .single();

        if (fetchError || !subscription) {
          throw new Error('Subscription not found');
        }

        // Annuler dans Stripe
        if (immediately) {
          await stripe.subscriptions.cancel(subscription.stripe_subscription_id);
        } else {
          await stripe.subscriptions.update(subscription.stripe_subscription_id, {
            cancel_at_period_end: true,
          });
        }

        // Mettre à jour la base
        await supabase
          .from('subscriptions')
          .update({ 
            status: immediately ? 'canceled' : subscription.status,
            cancel_at_period_end: !immediately,
          })
          .eq('id', subscriptionId);

        return new Response(
          JSON.stringify({ success: true }),
          {
            status: 200,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }

      default:
        throw new Error(`Unknown action: ${action}`);
    }
  } catch (error) {
    console.error('Admin billing error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
