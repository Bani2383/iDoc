/**
 * Configuration Stripe pour iDoc
 *
 * IMPORTANT:
 * 1. Créez vos produits dans Stripe Dashboard: https://dashboard.stripe.com/test/products
 * 2. Copiez les Price IDs et remplacez-les ci-dessous
 * 3. Configurez le webhook pour recevoir les événements de paiement
 */

export const STRIPE_CONFIG = {
  // Clé publique (accessible côté client)
  publishableKey: import.meta.env.VITE_STRIPE_PUBLIC_KEY || '',

  // URLs de succès/annulation
  successUrl: `${import.meta.env.VITE_APP_URL || 'http://localhost:5173'}/payment/success`,
  cancelUrl: `${import.meta.env.VITE_APP_URL || 'http://localhost:5173'}/payment/cancelled`,

  // Prix des crédits (créés automatiquement)
  prices: {
    // Packs de crédits (paiements uniques)
    credits: {
      pack5: {
        priceId: 'price_1Sr0B4HY6LMBqiO4zzq1S8ks',
        amount: 4.99,
        credits: 5,
        currency: 'eur',
        name: 'Pack Découverte',
        description: '5 crédits pour tester iDoc',
      },
      pack10: {
        priceId: 'price_1Sr0B5HY6LMBqiO46zRGtgWN',
        amount: 9.99,
        credits: 10,
        bonusCredits: 1,
        currency: 'eur',
        name: 'Pack Starter',
        description: '10 crédits + 1 bonus',
      },
      pack25: {
        priceId: 'price_1Sr0B5HY6LMBqiO4shUU5VGe',
        amount: 19.99,
        credits: 25,
        bonusCredits: 5,
        currency: 'eur',
        name: 'Pack Populaire',
        description: '25 crédits + 5 bonus - Économisez 20%',
        popular: true,
      },
      pack50: {
        priceId: 'price_1Sr0B6HY6LMBqiO4EZKBdQFc',
        amount: 39.99,
        credits: 50,
        bonusCredits: 10,
        currency: 'eur',
        name: 'Pack Pro',
        description: '50 crédits + 10 bonus - Économisez 30%',
      },
      pack100: {
        priceId: 'price_1Sr0B6HY6LMBqiO4BilZBUvi',
        amount: 69.99,
        credits: 100,
        bonusCredits: 25,
        currency: 'eur',
        name: 'Pack Business',
        description: '100 crédits + 25 bonus - Économisez 40%',
      },
      pack500: {
        priceId: 'price_1Sr0B6HY6LMBqiO4GQGXdmvC',
        amount: 299.99,
        credits: 500,
        bonusCredits: 150,
        currency: 'eur',
        name: 'Pack Entreprise',
        description: '500 crédits + 150 bonus - Économisez 50%',
      },
    },

    // Abonnements mensuels (paiements récurrents)
    subscriptions: {
      starter: {
        priceId: 'price_1Sr0B7HY6LMBqiO4eUA95tZy',
        amount: 19.99,
        creditsPerMonth: 20,
        currency: 'eur',
        interval: 'month',
        name: 'Starter',
        description: '20 crédits/mois + priorité support',
        features: [
          '20 crédits par mois',
          'Tous les modèles disponibles',
          'Support prioritaire',
          'Historique illimité',
        ],
      },
      pro: {
        priceId: 'price_1Sr0B7HY6LMBqiO4nbD7IV70',
        amount: 49.99,
        creditsPerMonth: 60,
        currency: 'eur',
        interval: 'month',
        name: 'Pro',
        description: '60 crédits/mois + fonctionnalités avancées',
        popular: true,
        features: [
          '60 crédits par mois',
          'Signature électronique incluse',
          'API access',
          'Support 24/7',
          'Branding personnalisé',
        ],
      },
      business: {
        priceId: 'price_1Sr0B8HY6LMBqiO4K3PhUczk',
        amount: 149.99,
        creditsPerMonth: 200,
        currency: 'eur',
        interval: 'month',
        name: 'Business',
        description: '200 crédits/mois + gestion équipe',
        features: [
          '200 crédits par mois',
          'Gestion multi-utilisateurs',
          'Templates personnalisés',
          'SLA garanti',
          'Account manager dédié',
        ],
      },
      starterAnnual: {
        priceId: 'price_1Sr0B8HY6LMBqiO4dUwIWTwJ',
        amount: 199.99,
        creditsPerMonth: 20,
        currency: 'eur',
        interval: 'year',
        name: 'Starter Annuel',
        description: '240 crédits/an - 2 mois offerts',
        features: [
          '20 crédits par mois',
          'Tous les modèles disponibles',
          'Support prioritaire',
          'Historique illimité',
          'Économisez 2 mois',
        ],
      },
      proAnnual: {
        priceId: 'price_1Sr0B9HY6LMBqiO4N9JtBfZm',
        amount: 499.99,
        creditsPerMonth: 60,
        currency: 'eur',
        interval: 'year',
        name: 'Pro Annuel',
        description: '720 crédits/an - 2 mois offerts',
        popular: true,
        features: [
          '60 crédits par mois',
          'Signature électronique incluse',
          'API access',
          'Support 24/7',
          'Branding personnalisé',
          'Économisez 2 mois',
        ],
      },
      businessAnnual: {
        priceId: 'price_1Sr0B9HY6LMBqiO4uChWCsmz',
        amount: 1499.99,
        creditsPerMonth: 200,
        currency: 'eur',
        interval: 'year',
        name: 'Business Annuel',
        description: '2400 crédits/an - 2 mois offerts',
        features: [
          '200 crédits par mois',
          'Gestion multi-utilisateurs',
          'Templates personnalisés',
          'SLA garanti',
          'Account manager dédié',
          'Économisez 2 mois',
        ],
      },
    },

    // Documents à l'unité
    singleDocuments: {
      basic: {
        priceId: 'price_1Sr0B3HY6LMBqiO4blgrZP7L',
        amount: 1.99,
        currency: 'eur',
        name: 'Document Simple',
        description: 'Génération d\'un document professionnel',
      },
      premium: {
        priceId: 'price_1Sr0B4HY6LMBqiO4dX21LdhN',
        amount: 4.99,
        currency: 'eur',
        name: 'Document Premium',
        description: 'Avec signature électronique incluse',
      },
    },
  },

  // Devises supportées
  currencies: {
    eur: { symbol: '€', name: 'Euro' },
    usd: { symbol: '$', name: 'US Dollar' },
    cad: { symbol: 'CA$', name: 'Canadian Dollar' },
    gbp: { symbol: '£', name: 'British Pound' },
  },

  // Cartes de test Stripe
  testCards: {
    success: '4242424242424242',
    decline: '4000000000000002',
    requiresAuth: '4000002500003155',
  },
};

// Fonction helper pour obtenir un prix par ID
export function getPrice(category: 'credits' | 'subscriptions' | 'singleDocuments', key: string) {
  return STRIPE_CONFIG.prices[category][key as keyof typeof STRIPE_CONFIG.prices[typeof category]];
}

// Fonction helper pour formater un montant
export function formatAmount(amount: number, currency: keyof typeof STRIPE_CONFIG.currencies = 'eur') {
  const { symbol } = STRIPE_CONFIG.currencies[currency];
  return `${amount.toFixed(2)} ${symbol}`;
}

// Validation de la configuration
export function isStripeConfigured(): boolean {
  return !!STRIPE_CONFIG.publishableKey && STRIPE_CONFIG.publishableKey !== '';
}

// Mode de fonctionnement (test ou production)
export function isStripeTestMode(): boolean {
  return STRIPE_CONFIG.publishableKey.startsWith('pk_test_');
}
