# Configuration Stripe pour Stratégie Volume

## Configuration Initiale Stripe

### 1. Créer/Configurer Compte Stripe

```bash
# Aller sur https://dashboard.stripe.com/register
# Ou se connecter https://dashboard.stripe.com/login

# Activer mode Production après avoir testé
```

### 2. Récupérer les Clés API

**Mode Test (développement):**
```
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

**Mode Production:**
```
STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

### 3. Configuration Supabase Edge Functions

Les clés Stripe sont déjà configurées automatiquement dans Supabase. Si besoin de vérifier:

```bash
# Via Supabase Dashboard:
# Settings → Edge Functions → Environment Variables
# STRIPE_SECRET_KEY doit être configuré
```

## Configuration des Produits Stripe

### Produits à Créer dans Stripe Dashboard

```
Produit 1: 1 Crédit iDoc
Prix: 0.49 EUR
SKU: credit_1

Produit 2: 5 Crédits iDoc
Prix: 1.99 EUR (-20%)
SKU: credit_5

Produit 3: 10 Crédits iDoc + 1 Bonus
Prix: 2.99 EUR (-40%)
SKU: credit_10
⭐ POPULAIRE

Produit 4: 25 Crédits + 3 Bonus
Prix: 5.99 EUR (-50%)
SKU: credit_25

Produit 5: 50 Crédits + 10 Bonus
Prix: 8.99 EUR (-60%)
SKU: credit_50

Produit 6: 100 Crédits + 20 Bonus
Prix: 14.99 EUR (-70%)
SKU: credit_100
```

## Configuration Webhook Stripe

### URL du Webhook

```
Production: https://[VOTRE-PROJET].supabase.co/functions/v1/stripe-webhook
Test: https://[VOTRE-PROJET].supabase.co/functions/v1/stripe-webhook
```

### Événements à Écouter

Dans Stripe Dashboard → Developers → Webhooks:

```
✅ checkout.session.completed
✅ payment_intent.succeeded
✅ payment_intent.payment_failed
✅ charge.refunded
✅ customer.subscription.created
✅ customer.subscription.updated
✅ customer.subscription.deleted
```

## Intégration Frontend

### 1. Installation (déjà faite)

Le code est prêt dans ExpressPaymentModal.tsx

### 2. Exemple d'Utilisation

```typescript
import { ExpressPaymentModal } from './components/ExpressPaymentModal';

function MyComponent() {
  const [showPayment, setShowPayment] = useState(false);

  const handlePaymentSuccess = async (credits: number) => {
    console.log(`Reçu ${credits} crédits!`);
    // Refresh user credits
    await refreshUserData();
  };

  return (
    <>
      <button onClick={() => setShowPayment(true)}>
        Acheter des crédits
      </button>

      {showPayment && (
        <ExpressPaymentModal
          documentName="Pack de crédits"
          price={2.99}
          onClose={() => setShowPayment(false)}
          onSuccess={handlePaymentSuccess}
        />
      )}
    </>
  );
}
```

### 3. Appel API Checkout

```typescript
const createCheckoutSession = async (packageId: string) => {
  const response = await fetch(
    `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/checkout-credits`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session?.access_token}`,
      },
      body: JSON.stringify({
        packageId,
        customerEmail: user.email,
        successUrl: `${window.location.origin}/success`,
        cancelUrl: `${window.location.origin}/cancel`,
      }),
    }
  );

  const { url } = await response.json();
  window.location.href = url; // Redirect to Stripe
};
```

## Configuration Variables Environnement

### Frontend (.env)

```bash
VITE_SUPABASE_URL=https://[PROJET].supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

### Backend (Supabase Edge Functions)

Déjà configuré automatiquement:
- SUPABASE_URL
- SUPABASE_SERVICE_ROLE_KEY
- STRIPE_SECRET_KEY (à ajouter manuellement)

## Tests Stripe

### Cartes de Test

```
Succès:
4242 4242 4242 4242

3D Secure requis:
4000 0027 6000 3184

Échec:
4000 0000 0000 0002

CVV: n'importe quel 3 chiffres
Expiration: n'importe quelle date future
```

### Tester le Flux Complet

1. Générer un document
2. Cliquer "Acheter crédits"
3. Sélectionner pack
4. Payer avec carte test 4242...
5. Vérifier webhook reçu
6. Confirmer crédits ajoutés

## Monitoring & Analytics

### Dashboard Stripe

Aller sur: https://dashboard.stripe.com

**Métriques à surveiller:**
- Volume de transactions/jour
- Taux de conversion checkout
- Panier moyen
- Taux d'abandon panier
- Taux de refus paiement

### Rapports Automatiques

```sql
-- Revenue quotidien
SELECT
  DATE(created_at) as date,
  COUNT(*) as transactions,
  SUM(amount_paid) as revenue
FROM credit_purchases
WHERE status = 'completed'
GROUP BY DATE(created_at)
ORDER BY date DESC;

-- Top packages
SELECT
  cp.credits,
  COUNT(*) as purchases,
  SUM(cpr.amount_paid) as total_revenue
FROM credit_purchases cpr
JOIN credit_packages cp ON cp.id = cpr.package_id
WHERE cpr.status = 'completed'
GROUP BY cp.credits
ORDER BY purchases DESC;
```

## Optimisations Conversion

### A/B Testing Prix

**Test 1: Pack 10 Crédits**
```
Variant A: 2.99€
Variant B: 2.49€
Variant C: 3.49€

Mesurer: Taux conversion + Revenue total
```

**Test 2: Bonus Crédits**
```
Variant A: 10 crédits + 1 bonus
Variant B: 10 crédits + 2 bonus
Variant C: 11 crédits (pas de notion bonus)

Mesurer: Attractivité perçue
```

### Optimisations UX Checkout

```javascript
// Réduire friction
- Apple Pay / Google Pay en 1er
- Pas de création compte obligatoire
- Email uniquement
- Checkout en 2 clics max

// Social proof
- "234 achats aujourd'hui"
- "Sarah vient d'acheter"
- Timer urgence

// Garanties
- "Remboursement 24h"
- "Paiement sécurisé SSL"
- "Support 24/7"
```

## Conformité & Légal

### CGV à Ajouter

```
- Description claire produit (crédits virtuels)
- Politique de remboursement (24h)
- Durée validité crédits (6 mois)
- Conditions d'utilisation
- Support contact
```

### RGPD

```
✅ Consentement collecte email
✅ Politique confidentialité
✅ Droit accès/suppression données
✅ Sécurisation données paiement (Stripe PCI-DSS)
```

## Support & Troubleshooting

### Problèmes Courants

**Webhook ne fonctionne pas:**
```bash
# Vérifier logs Supabase
# Settings → Edge Functions → stripe-webhook → Logs

# Tester webhook manuellement
stripe trigger checkout.session.completed
```

**Crédits non ajoutés:**
```sql
-- Vérifier purchase status
SELECT * FROM credit_purchases
WHERE stripe_session_id = 'cs_test_...'
ORDER BY created_at DESC;

-- Vérifier balance user
SELECT credits_balance, total_credits_purchased
FROM user_profiles
WHERE id = '...';
```

**Paiement échoué:**
```
1. Vérifier carte test valide
2. Vérifier clés API correctes (test vs prod)
3. Vérifier webhook configuré
4. Checker logs Stripe Dashboard
```

## Checklist Lancement Production

### Avant de Passer en Live

- [ ] Compte Stripe vérifié et activé
- [ ] Clés production configurées
- [ ] Webhook production configuré et testé
- [ ] Tests paiements réels effectués
- [ ] CGV/Mentions légales publiées
- [ ] Politique remboursement définie
- [ ] Support client configuré
- [ ] Monitoring alertes configuré
- [ ] Backup base données activé
- [ ] Logs centralisés activés

### Configuration Google Ads

**Budget Initial:** 50€/jour

**Campagnes:**

```
Campagne 1: Recherche Transactionnelle
- "acheter document en ligne"
- "modèle cv rapide"
- "attestation en ligne"
CPC max: 0.50€
Landing: Page génération directe

Campagne 2: Recherche Informationnelle
- "comment faire un cv"
- "modèle lettre motivation"
- "créer attestation"
CPC max: 0.30€
Landing: Article SEO + CTA

Campagne 3: Display Retargeting
- Visiteurs sans achat
- Abandons panier
CPC max: 0.20€
Offre: -50% premier achat

Campagne 4: YouTube
- Tuto "CV en 30 secondes"
- Demo plateforme
CPV max: 0.10€
```

**Tracking Conversions:**

```javascript
// À ajouter après achat réussi
gtag('event', 'purchase', {
  transaction_id: purchaseId,
  value: amount,
  currency: 'EUR',
  items: [{
    item_id: packageId,
    item_name: `${credits} crédits`,
    price: price,
    quantity: 1
  }]
});
```

## Résumé Configuration Rapide

```bash
# 1. Stripe Dashboard
- Créer compte
- Récupérer clés API
- Configurer webhook

# 2. Supabase
- Ajouter STRIPE_SECRET_KEY dans Edge Functions env
- Déployer fonction checkout-credits
- Appliquer migration volume_tracking

# 3. Frontend
- Configurer VITE_STRIPE_PUBLISHABLE_KEY
- Intégrer ExpressPaymentModal
- Tester avec carte 4242...

# 4. Monitoring
- Vérifier dashboard Stripe
- Checker logs Supabase
- Suivre analytics custom

# 5. Production
- Activer compte Stripe
- Passer clés en live
- Lancer campagnes Ads
```

## Support

**Questions Stripe:** support@stripe.com
**Documentation:** https://stripe.com/docs
**Status:** https://status.stripe.com

**Support iDoc:**
- GitHub Issues
- Email: support@idoc.com
- Chat: disponible 24/7
