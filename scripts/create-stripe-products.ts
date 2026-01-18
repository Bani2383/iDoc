/**
 * Script pour créer automatiquement tous les produits Stripe
 *
 * Usage: npm run setup:stripe
 */

import Stripe from 'stripe';
import { config } from 'dotenv';

config();

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

if (!stripeSecretKey) {
  console.error('❌ STRIPE_SECRET_KEY non trouvée dans .env');
  process.exit(1);
}

const stripe = new Stripe(stripeSecretKey, {
  apiVersion: '2024-11-20.acacia',
});

interface ProductConfig {
  name: string;
  description: string;
  amount: number;
  currency: string;
  type: 'one_time' | 'recurring';
  interval?: 'month' | 'year';
  metadata: Record<string, string>;
}

const products: ProductConfig[] = [
  // Documents à l'unité - Prix attractifs
  {
    name: 'Document Simple',
    description: 'Génération d\'un document professionnel',
    amount: 1.99,
    currency: 'eur',
    type: 'one_time',
    metadata: {
      type: 'single_document',
      tier: 'basic',
      credits: '1',
    }
  },
  {
    name: 'Document Premium',
    description: 'Document avec signature électronique incluse',
    amount: 4.99,
    currency: 'eur',
    type: 'one_time',
    metadata: {
      type: 'single_document',
      tier: 'premium',
      credits: '1',
      includes_signature: 'true',
    }
  },

  // Packs de crédits - Offres progressives
  {
    name: 'Pack Découverte - 5 crédits',
    description: '5 crédits pour tester iDoc',
    amount: 4.99,
    currency: 'eur',
    type: 'one_time',
    metadata: {
      type: 'credits_pack',
      pack_id: 'pack5',
      credits: '5',
      bonus_credits: '0',
    }
  },
  {
    name: 'Pack Starter - 10 crédits',
    description: '10 crédits pour vos documents essentiels',
    amount: 9.99,
    currency: 'eur',
    type: 'one_time',
    metadata: {
      type: 'credits_pack',
      pack_id: 'pack10',
      credits: '10',
      bonus_credits: '1',
    }
  },
  {
    name: 'Pack Populaire - 25 crédits',
    description: '25 crédits + 5 bonus - Économisez 20%',
    amount: 19.99,
    currency: 'eur',
    type: 'one_time',
    metadata: {
      type: 'credits_pack',
      pack_id: 'pack25',
      credits: '25',
      bonus_credits: '5',
      popular: 'true',
    }
  },
  {
    name: 'Pack Pro - 50 crédits',
    description: '50 crédits + 10 bonus - Économisez 30%',
    amount: 39.99,
    currency: 'eur',
    type: 'one_time',
    metadata: {
      type: 'credits_pack',
      pack_id: 'pack50',
      credits: '50',
      bonus_credits: '10',
    }
  },
  {
    name: 'Pack Business - 100 crédits',
    description: '100 crédits + 25 bonus - Économisez 40%',
    amount: 69.99,
    currency: 'eur',
    type: 'one_time',
    metadata: {
      type: 'credits_pack',
      pack_id: 'pack100',
      credits: '100',
      bonus_credits: '25',
    }
  },
  {
    name: 'Pack Entreprise - 500 crédits',
    description: '500 crédits + 150 bonus - Économisez 50%',
    amount: 299.99,
    currency: 'eur',
    type: 'one_time',
    metadata: {
      type: 'credits_pack',
      pack_id: 'pack500',
      credits: '500',
      bonus_credits: '150',
    }
  },

  // Abonnements mensuels
  {
    name: 'Abonnement Starter',
    description: '20 crédits par mois + support prioritaire',
    amount: 19.99,
    currency: 'eur',
    type: 'recurring',
    interval: 'month',
    metadata: {
      type: 'subscription',
      plan_id: 'starter',
      credits_per_month: '20',
    }
  },
  {
    name: 'Abonnement Pro',
    description: '60 crédits par mois + signature + API',
    amount: 49.99,
    currency: 'eur',
    type: 'recurring',
    interval: 'month',
    metadata: {
      type: 'subscription',
      plan_id: 'pro',
      credits_per_month: '60',
      popular: 'true',
    }
  },
  {
    name: 'Abonnement Business',
    description: '200 crédits par mois + gestion équipe',
    amount: 149.99,
    currency: 'eur',
    type: 'recurring',
    interval: 'month',
    metadata: {
      type: 'subscription',
      plan_id: 'business',
      credits_per_month: '200',
    }
  },

  // Abonnements annuels (économie de 2 mois)
  {
    name: 'Abonnement Starter Annuel',
    description: '240 crédits par an (20/mois) - 2 mois offerts',
    amount: 199.99,
    currency: 'eur',
    type: 'recurring',
    interval: 'year',
    metadata: {
      type: 'subscription',
      plan_id: 'starter_annual',
      credits_per_month: '20',
      total_credits: '240',
    }
  },
  {
    name: 'Abonnement Pro Annuel',
    description: '720 crédits par an (60/mois) - 2 mois offerts',
    amount: 499.99,
    currency: 'eur',
    type: 'recurring',
    interval: 'year',
    metadata: {
      type: 'subscription',
      plan_id: 'pro_annual',
      credits_per_month: '60',
      total_credits: '720',
      popular: 'true',
    }
  },
  {
    name: 'Abonnement Business Annuel',
    description: '2400 crédits par an (200/mois) - 2 mois offerts',
    amount: 1499.99,
    currency: 'eur',
    type: 'recurring',
    interval: 'year',
    metadata: {
      type: 'subscription',
      plan_id: 'business_annual',
      credits_per_month: '200',
      total_credits: '2400',
    }
  },
];

async function createProducts() {
  console.log('🚀 Création des produits Stripe...\n');

  const createdProducts: Array<{
    name: string;
    priceId: string;
    amount: number;
    type: string;
  }> = [];

  for (const productConfig of products) {
    try {
      console.log(`📦 Création: ${productConfig.name}...`);

      // Créer le produit
      const product = await stripe.products.create({
        name: productConfig.name,
        description: productConfig.description,
        metadata: productConfig.metadata,
      });

      // Créer le prix
      const priceData: Stripe.PriceCreateParams = {
        product: product.id,
        unit_amount: Math.round(productConfig.amount * 100),
        currency: productConfig.currency,
        metadata: productConfig.metadata,
      };

      if (productConfig.type === 'recurring') {
        priceData.recurring = {
          interval: productConfig.interval!,
        };
      }

      const price = await stripe.prices.create(priceData);

      createdProducts.push({
        name: productConfig.name,
        priceId: price.id,
        amount: productConfig.amount,
        type: productConfig.type,
      });

      console.log(`   ✅ Créé: ${price.id} (${productConfig.amount} ${productConfig.currency.toUpperCase()})`);

    } catch (error) {
      if (error instanceof Error) {
        console.error(`   ❌ Erreur: ${error.message}`);
      }
    }
  }

  console.log('\n' + '='.repeat(80));
  console.log('✅ PRODUITS CRÉÉS AVEC SUCCÈS\n');

  console.log('📋 Price IDs à copier dans src/config/stripe.ts:\n');

  const byCategory = {
    'Documents': createdProducts.filter(p => p.name.includes('Document')),
    'Packs de crédits': createdProducts.filter(p => p.name.includes('Pack')),
    'Abonnements mensuels': createdProducts.filter(p => p.type === 'recurring' && !p.name.includes('Annuel')),
    'Abonnements annuels': createdProducts.filter(p => p.type === 'recurring' && p.name.includes('Annuel')),
  };

  for (const [category, items] of Object.entries(byCategory)) {
    if (items.length > 0) {
      console.log(`\n${category}:`);
      items.forEach(item => {
        console.log(`  ${item.name}`);
        console.log(`    priceId: '${item.priceId}',`);
      });
    }
  }

  console.log('\n' + '='.repeat(80));
  console.log(`\n✨ ${createdProducts.length} produits créés sur ${products.length} tentés\n`);
  console.log('📖 Dashboard Stripe: https://dashboard.stripe.com/test/products\n');
}

createProducts()
  .then(() => {
    console.log('✅ Terminé!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Erreur fatale:', error);
    process.exit(1);
  });
