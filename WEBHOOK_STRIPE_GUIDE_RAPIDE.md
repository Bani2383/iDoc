# Configuration Webhook Stripe - 2 Minutes

## URL du Webhook

```
https://jgadstuimnblhykfaxsv.supabase.co/functions/v1/stripe-webhook
```

---

## Étapes (2 minutes)

### 1. Ouvrir le Dashboard Stripe

Allez sur: **https://dashboard.stripe.com/test/webhooks**

### 2. Ajouter un Endpoint

Cliquez sur le bouton: **+ Add endpoint**

### 3. Remplir le Formulaire

**Endpoint URL:**
```
https://jgadstuimnblhykfaxsv.supabase.co/functions/v1/stripe-webhook
```

**Description (optionnel):**
```
iDoc - Webhook Paiements Production
```

### 4. Sélectionner les Événements

Cliquez sur: **Select events**

Cochez ces événements (dans l'ordre alphabétique):

#### Événements Checkout
- ✅ `checkout.session.completed`
- ✅ `checkout.session.expired`

#### Événements Payment Intent
- ✅ `payment_intent.succeeded`
- ✅ `payment_intent.payment_failed`
- ✅ `payment_intent.canceled`

#### Événements Subscription
- ✅ `customer.subscription.created`
- ✅ `customer.subscription.updated`
- ✅ `customer.subscription.deleted`
- ✅ `customer.subscription.paused`
- ✅ `customer.subscription.resumed`

#### Événements Invoice
- ✅ `invoice.payment_succeeded`
- ✅ `invoice.payment_failed`
- ✅ `invoice.finalized`

**Total:** 13 événements sélectionnés

Cliquez sur: **Add events**

### 5. Finaliser

Cliquez sur: **Add endpoint**

### 6. Récupérer le Signing Secret

Après création, vous verrez votre webhook dans la liste.

**Cliquez sur le webhook** que vous venez de créer.

Dans la section **Signing secret**, cliquez sur: **Reveal**

**Copiez la valeur** (commence par `whsec_...`)

---

## Mise à Jour du Fichier .env

Ouvrez le fichier `.env` dans votre projet et remplacez:

```env
STRIPE_WEBHOOK_SECRET=whsec_AJOUTER_APRES_CONFIG_WEBHOOK
```

Par:

```env
STRIPE_WEBHOOK_SECRET=whsec_VOTRE_SECRET_ICI
```

**Exemple:**
```env
STRIPE_WEBHOOK_SECRET=whsec_1234567890abcdefghijklmnopqrstuvwxyz
```

---

## Vérification

### Test 1: Webhook actif

1. Retournez sur: https://dashboard.stripe.com/test/webhooks
2. Cliquez sur votre webhook
3. Onglet **Events**
4. Vérifiez qu'il n'y a pas d'erreurs

### Test 2: Tester l'endpoint

Dans le dashboard du webhook, cliquez sur: **Send test webhook**

Sélectionnez: `checkout.session.completed`

Cliquez sur: **Send test webhook**

Vérifiez que le statut est: **200 OK**

---

## Configuration Vercel (Production)

### Ajouter la Variable

1. Allez sur: https://vercel.com
2. Sélectionnez votre projet
3. Settings → Environment Variables
4. Cliquez: **Add New**

**Configuration:**
```
Name: STRIPE_WEBHOOK_SECRET
Value: whsec_VOTRE_SECRET_ICI
Environment: Production, Preview
```

Cliquez: **Save**

### Redéployer

1. Allez dans l'onglet **Deployments**
2. Cliquez sur le dernier déploiement
3. Menu **...** → **Redeploy**

---

## Que Fait le Webhook ?

Votre webhook gère automatiquement:

### Paiements Uniques
- ✅ Valide le paiement
- ✅ Ajoute les crédits au compte
- ✅ Enregistre dans `payments`
- ✅ Crée une facture comptable

### Abonnements
- ✅ Crée l'abonnement dans `subscriptions`
- ✅ Ajoute les crédits mensuels
- ✅ Gère les renouvellements automatiques
- ✅ Gère les annulations

### Factures
- ✅ Enregistre les PDFs
- ✅ Crée les entrées comptables
- ✅ Met à jour les statuts

---

## Événements Gérés

| Événement | Action |
|-----------|--------|
| `checkout.session.completed` | Paiement validé → Crédits ajoutés |
| `payment_intent.succeeded` | Confirmation du paiement |
| `payment_intent.payment_failed` | Échec → Email de notification |
| `customer.subscription.created` | Nouvel abonnement → Activation |
| `customer.subscription.updated` | Mise à jour du plan |
| `customer.subscription.deleted` | Annulation → Fin de période |
| `invoice.payment_succeeded` | Facture payée → Crédits renouvelés |
| `invoice.payment_failed` | Échec de paiement → Alerte |

---

## Troubleshooting

### Le webhook retourne 500

**Problème:** Variable `STRIPE_WEBHOOK_SECRET` incorrecte

**Solution:**
1. Vérifiez que le secret est bien dans `.env`
2. Redémarrez l'application locale
3. En production, vérifiez Vercel Environment Variables

### Le webhook retourne 401

**Problème:** Signature invalide

**Solution:**
1. Vérifiez que l'URL du webhook est exacte
2. Vérifiez que le secret correspond
3. Testez avec "Send test webhook"

### Les crédits ne sont pas ajoutés

**Problème:** Métadonnées manquantes dans le produit

**Solution:**
1. Vérifiez que vos produits ont les métadonnées:
   - `type` = 'credits_pack' ou 'subscription'
   - `credits` = nombre de crédits
2. Recréez le produit si nécessaire

---

## Logs du Webhook

### Voir les Logs Supabase

1. Dashboard Supabase: https://supabase.com/dashboard
2. Votre projet → Functions
3. `stripe-webhook` → Logs

### Voir les Logs Stripe

1. Dashboard Stripe: https://dashboard.stripe.com/test/webhooks
2. Votre webhook → Events
3. Cliquez sur un événement pour voir les détails

---

## Sécurité

Le webhook vérifie automatiquement:

1. **Signature Stripe** → Empêche les fausses requêtes
2. **Secret partagé** → Validation cryptographique
3. **Timestamp** → Protection contre les replay attacks

---

## Passer en Production

Quand vous serez prêt pour la production:

1. Créez un webhook sur: https://dashboard.stripe.com/webhooks (sans /test/)
2. Même URL: `https://jgadstuimnblhykfaxsv.supabase.co/functions/v1/stripe-webhook`
3. Mêmes événements
4. Nouveau signing secret
5. Mettez à jour Vercel avec le nouveau secret

---

## Commandes Utiles

```bash
# Vérifier la configuration
npm run verify:stripe

# Tester en local
npm run dev

# Voir les logs
supabase functions logs stripe-webhook
```

---

## Support

**Stripe Webhook Tester:**
https://stripe.com/docs/webhooks/test

**Documentation:**
https://stripe.com/docs/webhooks

**Support Stripe:**
https://support.stripe.com

---

**Temps estimé:** 2 minutes

**Dernière mise à jour:** 18 janvier 2026
