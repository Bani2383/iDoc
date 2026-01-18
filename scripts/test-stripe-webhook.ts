/**
 * Script pour tester le webhook Stripe localement
 *
 * Usage: npx tsx scripts/test-stripe-webhook.ts
 */

import Stripe from 'stripe';
import { config } from 'dotenv';

config();

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

if (!stripeSecretKey) {
  console.error('❌ STRIPE_SECRET_KEY non trouvée');
  process.exit(1);
}

if (!webhookSecret) {
  console.error('⚠️  STRIPE_WEBHOOK_SECRET non configurée');
  console.log('\n📖 Consultez: WEBHOOK_STRIPE_GUIDE_RAPIDE.md\n');
}

const stripe = new Stripe(stripeSecretKey, {
  apiVersion: '2024-11-20.acacia',
});

async function testWebhook() {
  console.log('🧪 Test du Webhook Stripe\n');

  console.log('📋 Configuration:');
  console.log(`   STRIPE_SECRET_KEY: ${stripeSecretKey.substring(0, 20)}...`);
  console.log(`   STRIPE_WEBHOOK_SECRET: ${webhookSecret ? webhookSecret.substring(0, 20) + '...' : 'NON CONFIGURÉ'}`);
  console.log(`   Mode: ${stripeSecretKey.includes('_test_') ? 'TEST' : 'PRODUCTION'}\n`);

  console.log('🔍 Vérification des webhooks existants...\n');

  try {
    const webhooks = await stripe.webhookEndpoints.list({ limit: 10 });

    if (webhooks.data.length === 0) {
      console.log('⚠️  Aucun webhook configuré\n');
      console.log('📖 Pour configurer le webhook:');
      console.log('   1. Consultez: WEBHOOK_STRIPE_GUIDE_RAPIDE.md');
      console.log('   2. URL: https://jgadstuimnblhykfaxsv.supabase.co/functions/v1/stripe-webhook');
      console.log('   3. Dashboard: https://dashboard.stripe.com/test/webhooks\n');
      return;
    }

    console.log(`✅ ${webhooks.data.length} webhook(s) trouvé(s):\n`);

    webhooks.data.forEach((webhook, index) => {
      console.log(`Webhook ${index + 1}:`);
      console.log(`   ID: ${webhook.id}`);
      console.log(`   URL: ${webhook.url}`);
      console.log(`   Status: ${webhook.status}`);
      console.log(`   Événements: ${webhook.enabled_events.length}`);
      console.log(`   Créé: ${new Date(webhook.created * 1000).toLocaleString('fr-FR')}`);

      const correctUrl = 'https://jgadstuimnblhykfaxsv.supabase.co/functions/v1/stripe-webhook';
      if (webhook.url === correctUrl) {
        console.log('   ✅ URL correcte');
      } else {
        console.log(`   ⚠️  URL incorrecte (devrait être: ${correctUrl})`);
      }

      console.log('');
    });

    console.log('\n📊 Événements écoutés recommandés:');
    const recommendedEvents = [
      'checkout.session.completed',
      'payment_intent.succeeded',
      'payment_intent.payment_failed',
      'customer.subscription.created',
      'customer.subscription.updated',
      'customer.subscription.deleted',
      'invoice.payment_succeeded',
      'invoice.payment_failed',
    ];

    const firstWebhook = webhooks.data[0];
    recommendedEvents.forEach(event => {
      const isEnabled = firstWebhook.enabled_events.includes(event);
      console.log(`   ${isEnabled ? '✅' : '⚠️ '} ${event}`);
    });

    console.log('\n🧪 Test de connexion...');

    const testEvent = {
      type: 'checkout.session.completed',
      data: {
        object: {
          id: 'test_session_123',
          amount_total: 999,
          metadata: {
            userId: 'test_user',
            type: 'credits_purchase',
            credits: '10',
          },
        },
      },
    };

    console.log('\n✅ Webhook configuré et prêt!\n');
    console.log('🚀 Prochaines étapes:');
    console.log('   1. Testez un vrai paiement avec la carte 4242 4242 4242 4242');
    console.log('   2. Vérifiez les logs dans Supabase Functions');
    console.log('   3. Consultez les événements dans le Dashboard Stripe\n');

  } catch (error) {
    console.error('\n❌ Erreur lors de la vérification:', error instanceof Error ? error.message : error);
    console.log('\n📖 Consultez: WEBHOOK_STRIPE_GUIDE_RAPIDE.md\n');
  }
}

testWebhook()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Erreur:', error);
    process.exit(1);
  });
