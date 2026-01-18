# Configuration Webhook Stripe - Complétée

## URL du Webhook

```
https://jgadstuimnblhykfaxsv.supabase.co/functions/v1/stripe-webhook
```

---

## 3 Façons de Configurer

### 1. Interface HTML Interactive (Recommandé)

Ouvrez le fichier dans votre navigateur:

```bash
open webhook-config.html
```

Interface visuelle avec:
- Copie automatique de l'URL
- Liste des événements à cocher
- Liens directs vers Stripe Dashboard
- Instructions pas à pas

### 2. Guide Markdown Détaillé

Consultez le fichier:

```bash
cat WEBHOOK_STRIPE_GUIDE_RAPIDE.md
```

Guide complet avec:
- Instructions détaillées
- Troubleshooting
- Sécurité
- Logs et monitoring

### 3. Script de Test

Vérifiez votre configuration:

```bash
npm run test:webhook
```

Le script vérifie:
- Les webhooks existants
- L'URL correcte
- Les événements configurés
- La connexion Stripe

---

## Configuration Manuelle (2 minutes)

### Étape 1: Ouvrir Stripe Dashboard

https://dashboard.stripe.com/test/webhooks

### Étape 2: Ajouter un Endpoint

Cliquez sur: **+ Add endpoint**

### Étape 3: Remplir le Formulaire

**Endpoint URL:**
```
https://jgadstuimnblhykfaxsv.supabase.co/functions/v1/stripe-webhook
```

**Description:**
```
iDoc - Webhook Paiements
```

### Étape 4: Sélectionner les Événements

Cliquez sur **"Select events"** et cochez:

**Checkout (2):**
- ✅ checkout.session.completed
- ✅ checkout.session.expired

**Payment Intent (3):**
- ✅ payment_intent.succeeded
- ✅ payment_intent.payment_failed
- ✅ payment_intent.canceled

**Subscription (5):**
- ✅ customer.subscription.created
- ✅ customer.subscription.updated
- ✅ customer.subscription.deleted
- ✅ customer.subscription.paused
- ✅ customer.subscription.resumed

**Invoice (3):**
- ✅ invoice.payment_succeeded
- ✅ invoice.payment_failed
- ✅ invoice.finalized

**Total:** 13 événements

### Étape 5: Créer le Webhook

Cliquez sur: **"Add endpoint"**

### Étape 6: Copier le Signing Secret

Dans la section **"Signing secret"**:
1. Cliquez sur **"Reveal"**
2. Copiez la valeur (commence par `whsec_...`)

### Étape 7: Mettre à Jour .env

Ouvrez `.env` et modifiez:

```env
STRIPE_WEBHOOK_SECRET=whsec_VOTRE_SECRET_ICI
```

---

## Vérification

### Test 1: Configuration Locale

```bash
npm run test:webhook
```

Doit afficher:
```
✅ Webhook configuré et prêt!
```

### Test 2: Test dans Stripe Dashboard

1. Allez sur: https://dashboard.stripe.com/test/webhooks
2. Cliquez sur votre webhook
3. Onglet **"Events"**
4. Cliquez sur **"Send test webhook"**
5. Sélectionnez: `checkout.session.completed`
6. Cliquez sur **"Send test webhook"**
7. Vérifiez le statut: **200 OK**

### Test 3: Paiement Réel

```bash
npm run dev
```

1. Allez sur votre site
2. Testez un achat de crédits
3. Carte test: `4242 4242 4242 4242`
4. Vérifiez que les crédits sont ajoutés

---

## Configuration Vercel (Production)

### Ajouter la Variable

1. https://vercel.com → Votre projet
2. Settings → Environment Variables
3. Cliquez: **Add New**

```
Name: STRIPE_WEBHOOK_SECRET
Value: whsec_VOTRE_SECRET_ICI
Environment: Production, Preview
```

4. Cliquez: **Save**

### Redéployer

Deployments → ... → Redeploy

---

## Ce que Fait le Webhook

Votre fonction `stripe-webhook` gère automatiquement:

### Paiements Uniques (credits_pack)
```
checkout.session.completed
  → Valide le paiement
  → Ajoute les crédits dans user_credits
  → Crée un enregistrement dans payments
  → Génère la facture PDF
  → Enregistrement comptable
```

### Abonnements (subscription)
```
customer.subscription.created
  → Crée l'entrée dans subscriptions
  → Ajoute les crédits mensuels
  → Active les fonctionnalités premium

customer.subscription.updated
  → Met à jour le plan
  → Ajuste les crédits
  → Synchronise le statut

customer.subscription.deleted
  → Désactive à la fin de période
  → Conserve les crédits restants
```

### Factures
```
invoice.payment_succeeded
  → Enregistre le PDF de facture
  → Met à jour last_invoice_pdf_url
  → Renouvelle les crédits mensuels

invoice.payment_failed
  → Alerte l'utilisateur
  → Marque l'abonnement comme unpaid
```

---

## Événements Gérés

| Événement | Code dans webhook | Effet |
|-----------|-------------------|-------|
| checkout.session.completed | ✅ Implémenté | Crédits ajoutés |
| payment_intent.succeeded | ✅ Implémenté | Confirmation |
| payment_intent.payment_failed | ✅ Implémenté | Notification échec |
| customer.subscription.created | ✅ Implémenté | Activation |
| customer.subscription.updated | ✅ Implémenté | Mise à jour plan |
| customer.subscription.deleted | ✅ Implémenté | Annulation |
| invoice.payment_succeeded | ✅ Implémenté | Renouvellement |
| invoice.payment_failed | ✅ Implémenté | Alerte paiement |

---

## Logs et Debugging

### Voir les Logs Supabase

```bash
# Ouvrir le dashboard
open https://supabase.com/dashboard

# Ou via CLI (si installé)
supabase functions logs stripe-webhook
```

Navigation:
1. Votre projet
2. Functions (menu gauche)
3. `stripe-webhook`
4. Logs

### Voir les Logs Stripe

1. https://dashboard.stripe.com/test/webhooks
2. Cliquez sur votre webhook
3. Onglet **"Events"**
4. Cliquez sur un événement pour voir:
   - Request body
   - Response status
   - Headers
   - Timestamp

---

## Sécurité

Le webhook vérifie automatiquement:

1. **Signature Stripe**
   - Header `stripe-signature`
   - Vérifié avec `STRIPE_WEBHOOK_SECRET`
   - Empêche les fausses requêtes

2. **Timestamp**
   - Protection contre replay attacks
   - Vérifie que l'événement est récent

3. **Event ID**
   - Idempotence garantie
   - Pas de traitement en double

---

## Troubleshooting

### Erreur 401 Unauthorized

**Cause:** Signing secret incorrect

**Solution:**
1. Vérifiez `STRIPE_WEBHOOK_SECRET` dans `.env`
2. Copiez à nouveau depuis Stripe Dashboard
3. Redémarrez l'application

### Erreur 500 Internal Server Error

**Cause:** Erreur dans le code du webhook

**Solution:**
1. Vérifiez les logs Supabase Functions
2. Vérifiez que les tables existent
3. Vérifiez les permissions RLS

### Webhook reçu mais crédits non ajoutés

**Cause:** Métadonnées manquantes

**Solution:**
1. Vérifiez que le produit a les métadonnées:
   - `type` = 'credits_pack' ou 'subscription'
   - `credits` = nombre de crédits
2. Recréez le produit avec `npm run setup:stripe`

### Événements non reçus

**Cause:** URL incorrecte ou événements non sélectionnés

**Solution:**
1. Vérifiez l'URL exacte du webhook
2. Vérifiez la liste des événements écoutés
3. Testez avec "Send test webhook"

---

## Passer en Production

Quand prêt pour la production (clés live):

1. **Créer un nouveau webhook**
   - https://dashboard.stripe.com/webhooks (sans /test/)
   - Même URL
   - Mêmes événements

2. **Nouveau Signing Secret**
   - Copier le nouveau `whsec_...`
   - Mettre à jour Vercel (production uniquement)

3. **Tester en production**
   - Petit montant réel
   - Vérifier les logs
   - Confirmer les crédits

---

## Commandes Utiles

```bash
# Vérifier la configuration Stripe
npm run verify:stripe

# Tester le webhook
npm run test:webhook

# Créer/recréer les produits
npm run setup:stripe

# Lancer en local
npm run dev

# Build de production
npm run build
```

---

## Fichiers Créés

```
✅ WEBHOOK_STRIPE_GUIDE_RAPIDE.md    - Guide détaillé
✅ CONFIGURATION_WEBHOOK_STRIPE.md   - Ce fichier
✅ webhook-config.html               - Interface visuelle
✅ scripts/test-stripe-webhook.ts    - Script de test
✅ supabase/functions/stripe-webhook - Fonction déjà déployée
```

---

## Support

**Stripe Documentation:**
- Webhooks: https://stripe.com/docs/webhooks
- Testing: https://stripe.com/docs/webhooks/test
- Signatures: https://stripe.com/docs/webhooks/signatures

**Supabase Documentation:**
- Functions: https://supabase.com/docs/guides/functions
- Logs: https://supabase.com/docs/guides/functions/debugging

**Dashboard:**
- Stripe Test: https://dashboard.stripe.com/test/webhooks
- Supabase: https://supabase.com/dashboard

---

**Configuration:** En attente de votre action
**Temps estimé:** 2 minutes
**Dernière mise à jour:** 18 janvier 2026
