# MODULE COMPLET: Paiement + Facturation + Comptabilité

## ✅ STATUT: IMPLÉMENTÉ ET OPÉRATIONNEL

Ce document décrit le module complet de paiement, facturation, taxes, comptabilité et administration implémenté pour iDoc.

---

## 📊 ARCHITECTURE GÉNÉRALE

### 1. BASE DE DONNÉES (Supabase)

**3 Tables Principales:**

#### A) `purchases` - Achats One-Shot
```sql
- id (uuid, PK)
- user_id (uuid, FK auth.users)
- template_id (uuid, FK document_templates)
- stripe_session_id (text)
- stripe_payment_intent_id (text)
- stripe_invoice_id (text)
- invoice_pdf_url (text) - URL du PDF Stripe
- invoice_hosted_url (text) - Facture hébergée
- amount (numeric) - Montant total
- currency (text) - CAD, USD, EUR
- country (text)
- province_or_state (text)
- tax_amount (numeric) - Taxes
- status (text) - pending, paid, refunded, cancelled
- metadata (jsonb)
- created_at, updated_at
```

#### B) `subscriptions` - Abonnements SaaS
```sql
- id (uuid, PK)
- user_id (uuid, FK auth.users)
- stripe_customer_id (text)
- stripe_subscription_id (text, UNIQUE)
- plan_id (text) - pro, enterprise
- status (text) - active, cancelled, past_due
- current_period_start, current_period_end (timestamptz)
- last_invoice_pdf_url (text)
- last_invoice_hosted_url (text)
- cancel_at_period_end (boolean)
- metadata (jsonb)
- created_at, updated_at
```

#### C) `accounting_log` - Journal Comptable
```sql
- id (uuid, PK)
- type (text) - sale, refund, correction, cancellation
- reference_type (text) - purchase, subscription
- reference_id (uuid)
- amount (numeric)
- tax_amount (numeric)
- country, province_or_state (text)
- currency (text)
- notes (text)
- created_by (uuid, FK auth.users) - Admin
- created_at
```

**Sécurité RLS:**
- Users voient uniquement LEURS purchases/subscriptions
- Admins voient TOUT
- Accounting_log accessible UNIQUEMENT aux admins
- Toutes les tables protégées par RLS

---

## 🔧 EDGE FUNCTIONS (Backend API)

### 1. checkout-model
**Endpoint:** `POST /functions/v1/checkout-model`

**Usage:** Créer une session Checkout pour achat de modèle

**Input:**
```json
{
  "templateId": "uuid",
  "customerEmail": "user@example.com",
  "successUrl": "https://...",
  "cancelUrl": "https://..."
}
```

**Output:**
```json
{
  "sessionId": "cs_xxx",
  "url": "https://checkout.stripe.com/..."
}
```

**Fonctionnalités:**
- ✅ Crée session Stripe Checkout
- ✅ Active automatic_tax pour calcul automatique taxes
- ✅ Demande l'adresse de facturation (billing_address_collection: required)
- ✅ Crée invoice automatiquement
- ✅ Stocke metadata (userId, templateId, type)
- ✅ Crée purchase en statut "pending"

---

### 2. checkout-subscription
**Endpoint:** `POST /functions/v1/checkout-subscription`

**Usage:** Créer une session Checkout pour abonnement

**Input:**
```json
{
  "customerEmail": "user@example.com",
  "planId": "pro", // ou "enterprise"
  "successUrl": "https://...",
  "cancelUrl": "https://..."
}
```

**Output:**
```json
{
  "sessionId": "cs_xxx",
  "url": "https://checkout.stripe.com/..."
}
```

**Fonctionnalités:**
- ✅ Crée ou réutilise customer Stripe
- ✅ Crée prix récurrent dynamiquement
- ✅ Active automatic_tax
- ✅ Demande adresse de facturation
- ✅ Mode subscription
- ✅ Prix: Pro 19.99$/mois, Enterprise 49.99$/mois

---

### 3. stripe-webhook
**Endpoint:** `POST /functions/v1/stripe-webhook`

**TRÈS IMPORTANT:** Endpoint PUBLIC (verify_jwt: false) car appelé par Stripe

**Fonctionnalités:**
- ✅ Reçoit le body RAW
- ✅ Vérifie la signature Stripe (webhookSecret)
- ✅ Gère les événements:

#### checkout.session.completed
- Achat de modèle: 
  - Met à jour purchase (payment_intent, invoice, montants, taxes, lieu, statut = "paid")
  - Crée entrée accounting_log (type: "sale")
- Abonnement:
  - Crée/met à jour subscription
  - Stocke invoice PDF
  - Crée entrée accounting_log

#### invoice.payment_succeeded
- Met à jour subscription avec nouvelle invoice
- Crée entrée accounting_log

#### charge.refunded
- Met à jour purchase (statut = "refunded")
- Crée entrée accounting_log (type: "refund", montant négatif)

#### invoice.voided
- Met à jour purchase (statut = "cancelled")
- Crée entrée accounting_log (type: "cancellation")

#### customer.subscription.updated/deleted
- Met à jour statut subscription

---

### 4. admin-billing
**Endpoint:** `POST /functions/v1/admin-billing`

**Authentification:** JWT requis + rôle Admin vérifié

**Actions Disponibles:**

#### A) Remboursement
```json
{
  "action": "refund",
  "purchaseId": "uuid",
  "amount": 10.50, // optionnel, défaut = remboursement complet
  "reason": "requested_by_customer"
}
```

**Process:**
1. Vérifie que purchase existe et n'est pas déjà remboursée
2. Appelle Stripe refunds.create
3. Met à jour purchase (statut = "refunded")
4. Crée entrée accounting_log (type: "refund")

#### B) Annulation de Facture
```json
{
  "action": "void-invoice",
  "purchaseId": "uuid"
}
```

**Process:**
1. Vérifie que purchase existe
2. Appelle Stripe invoices.voidInvoice
3. Met à jour purchase (statut = "cancelled")
4. Crée entrée accounting_log (type: "cancellation")

#### C) Correction de Transaction
```json
{
  "action": "correct-transaction",
  "purchaseId": "uuid",
  "newAmount": 12.99,
  "newTaxAmount": 1.65,
  "notes": "Correction pour erreur de taxation"
}
```

**Process:**
1. Stocke valeurs originales dans metadata
2. Met à jour purchase avec nouvelles valeurs
3. Crée entrée accounting_log (type: "correction") avec delta

#### D) Annulation d'Abonnement
```json
{
  "action": "cancel-subscription",
  "subscriptionId": "uuid",
  "immediately": false // true = annulation immédiate
}
```

**Process:**
1. Annule dans Stripe (immédiat ou à la fin de période)
2. Met à jour subscription

---

## 💳 COMPOSANTS FRONTEND

### 1. CheckoutButton
**Fichier:** `src/components/CheckoutButton.tsx`

**Props:**
```typescript
interface CheckoutButtonProps {
  mode: 'model' | 'subscription';
  templateId?: string;        // Requis si mode='model'
  planId?: string;            // 'pro' ou 'enterprise'
  customerEmail: string;
  label?: string;             // Texte du bouton
  className?: string;
  successUrl?: string;
  cancelUrl?: string;
  disabled?: boolean;
}
```

**Usage Exemples:**

```tsx
// Achat de modèle
<CheckoutButton
  mode="model"
  templateId="abc-123"
  customerEmail={user.email}
  label="Acheter ce document - 1,99$"
/>

// Abonnement
<CheckoutButton
  mode="subscription"
  planId="pro"
  customerEmail={user.email}
  label="S'abonner à iDoc Pro"
/>
```

**Fonctionnalités:**
- ✅ Appelle automatiquement la bonne Edge Function
- ✅ Gère loading state
- ✅ Affiche erreurs
- ✅ Redirige vers Stripe Checkout
- ✅ Icône CreditCard + animation de chargement

---

### 2. AdminBillingDashboard
**Fichier:** `src/components/AdminBillingDashboard.tsx`

**Accès:** Réservé aux admins uniquement

**4 Onglets:**

#### A) Statistiques
- **KPIs:**
  - Revenus Totaux
  - Taxes Collectées
  - Nombre de Ventes
  - Abonnements Actifs
- **Détails:**
  - Revenus par Province/État

#### B) Ventes (Purchases)
- **Tableau complet des achats:**
  - Date, Montant, Taxes, Lieu, Statut
  - Actions:
    - 📥 Télécharger facture PDF
    - 🔄 Rembourser
    - ✏️ Corriger

#### C) Abonnements
- **Tableau des abonnements:**
  - Date début, Plan, Statut, Période
  - Téléchargement dernière facture

#### D) Journal Comptable
- **Historique complet:**
  - Toutes les transactions
  - Sales, Refunds, Corrections, Cancellations
  - Montants, taxes, notes

**Modales Incluses:**
- **Modal Remboursement:**
  - Choix montant (complet ou partiel)
  - Raison du remboursement
- **Modal Correction:**
  - Nouveau montant
  - Nouveau montant taxes
  - Notes de correction

---

## 🌍 STRIPE TAX - CALCUL AUTOMATIQUE

**Configuration dans Checkout Sessions:**
```typescript
automatic_tax: {
  enabled: true,
}
billing_address_collection: 'required'
```

**Taxes gérées automatiquement:**
- 🇨🇦 **Canada:**
  - QC: TPS (5%) + TVQ (9.975%) = ~15%
  - ON, NB, NS, NL, PE: TVH (13-15%)
  - Autres: TPS (5%)
- 🇺🇸 **USA:** Selon l'état (0-10%)
- 🇪🇺 **Europe:** TVA selon pays (19-27%)
- 🌍 **Autres:** Exemption automatique si hors juridiction

**Avantages:**
- ✅ Pas de code manuel de taxation
- ✅ Mise à jour automatique des taux
- ✅ Conformité légale garantie
- ✅ Support multi-pays

---

## 📄 FACTURES PDF

**Process:**
1. Stripe génère automatiquement la facture PDF
2. Webhook `checkout.session.completed` ou `invoice.payment_succeeded`
3. Stockage des URLs:
   - `invoice_pdf_url` - Lien de téléchargement direct
   - `invoice_hosted_url` - Page web de la facture

**URLs Stockées:**
- Dans `purchases` pour achats one-shot
- Dans `subscriptions` pour abonnements (last_invoice_*)

**Accès Client:**
- Téléchargement direct via interface
- Pas de régénération manuelle nécessaire

---

## 🔐 SÉCURITÉ

### Authentification & Autorisation
- ✅ Edge Functions protégées par JWT (sauf webhook)
- ✅ Vérification rôle Admin côté serveur
- ✅ RLS sur toutes les tables
- ✅ Clés Stripe jamais exposées au frontend

### Webhooks
- ✅ Signature Stripe vérifiée
- ✅ Body RAW requis
- ✅ Endpoint public mais sécurisé

### Données Sensibles
- ✅ Aucune donnée carte stockée (géré par Stripe)
- ✅ Metadata sécurisée dans Stripe
- ✅ Journalisation de toutes les actions admin

---

## 📊 JOURNAL COMPTABLE (Accounting Log)

**Toutes les transactions sont loggées:**

### Types d'Entrées:

1. **sale** - Vente
   - Créé lors du paiement réussi
   - Montant positif
   - Inclut taxes

2. **refund** - Remboursement
   - Créé lors d'un refund
   - Montant négatif
   - Référence le purchase original

3. **correction** - Correction
   - Créé lors d'une correction admin
   - Montant = delta (nouveau - ancien)
   - Notes détaillées dans le champ notes

4. **cancellation** - Annulation
   - Créé lors d'une annulation de facture
   - Montant = 0
   - Notes d'explication

**Chaque entrée contient:**
- Type d'opération
- Référence (purchase ou subscription)
- Montants (total + taxes)
- Lieu (pays, province)
- Devise
- Notes
- Admin qui a effectué l'action
- Timestamp

---

## 🚀 INTÉGRATION DANS L'APPLICATION

### Dans SmartFillStudio (génération de documents):

```tsx
import { CheckoutButton } from './components/CheckoutButton';

// Après génération du document
<CheckoutButton
  mode="model"
  templateId={selectedTemplate.id}
  customerEmail={user.email}
  label="Acheter et télécharger - 1,99$"
/>
```

### Dans ProSubscriptionPage:

```tsx
<CheckoutButton
  mode="subscription"
  planId="pro"
  customerEmail={user.email}
  label="S'abonner maintenant - 19,99$/mois"
/>
```

### Dans AdminDashboard:

```tsx
import { AdminBillingDashboard } from './components/AdminBillingDashboard';

// Nouvel onglet dans le menu admin
<AdminBillingDashboard />
```

---

## 📋 CONFIGURATION REQUISE

### Variables d'Environnement Supabase:

**Automatiquement configurées:**
- ✅ `STRIPE_SECRET_KEY` - Clé secrète Stripe
- ✅ `STRIPE_WEBHOOK_SECRET` - Secret webhook
- ✅ `SUPABASE_URL` - URL Supabase
- ✅ `SUPABASE_SERVICE_ROLE_KEY` - Clé service

**Frontend (.env):**
```bash
VITE_SUPABASE_URL=votre_url
VITE_SUPABASE_ANON_KEY=votre_clé
```

### Stripe Dashboard:

1. **Activer Stripe Tax:**
   - Dashboard > Settings > Tax
   - Enable Stripe Tax

2. **Configurer Webhook:**
   - Endpoint: `https://votre-projet.supabase.co/functions/v1/stripe-webhook`
   - Événements à écouter:
     - checkout.session.completed
     - invoice.payment_succeeded
     - charge.refunded
     - invoice.voided
     - customer.subscription.updated
     - customer.subscription.deleted

3. **Copier le Webhook Secret** → Variable STRIPE_WEBHOOK_SECRET

---

## 🧪 TESTING

### Test Achat de Modèle:
```typescript
// 1. Cliquer sur CheckoutButton mode="model"
// 2. Utiliser carte test: 4242 4242 4242 4242
// 3. Date: futur, CVC: 123
// 4. Adresse Canada pour tester taxes
// 5. Vérifier:
//    - Purchase créé en DB
//    - Statut = "paid"
//    - Taxes calculées correctement
//    - Invoice PDF disponible
//    - Entrée accounting_log créée
```

### Test Remboursement:
```typescript
// 1. Dans AdminBillingDashboard
// 2. Onglet "Ventes"
// 3. Cliquer icône remboursement
// 4. Entrer montant (ou laisser vide pour complet)
// 5. Entrer raison
// 6. Vérifier:
//    - Purchase.status = "refunded"
//    - Entrée accounting_log type="refund"
//    - Refund visible dans Stripe Dashboard
```

### Test Correction:
```typescript
// 1. Dans AdminBillingDashboard
// 2. Cliquer icône édition
// 3. Modifier montants
// 4. Ajouter notes
// 5. Vérifier:
//    - Purchase mis à jour
//    - Valeurs originales dans metadata
//    - Entrée accounting_log type="correction"
```

---

## 📈 STATISTIQUES DISPONIBLES

L'AdminBillingDashboard calcule automatiquement:

1. **Revenus Totaux** (CAD)
   - Somme de toutes purchases status="paid"

2. **Taxes Collectées** (CAD)
   - Somme de tous tax_amount

3. **Nombre de Ventes**
   - Count purchases paid

4. **Abonnements Actifs**
   - Count subscriptions status="active"

5. **Revenus par Province/État**
   - Agrégation par province_or_state
   - Trié par montant décroissant

---

## 🔧 MAINTENANCE

### Remboursements Réguliers:
1. Admin Dashboard > Facturation > Ventes
2. Trouver la transaction
3. Cliquer remboursement
4. Tout est automatique (Stripe + DB + Comptabilité)

### Corrections Comptables:
1. Admin Dashboard > Facturation > Ventes
2. Cliquer correction
3. Modifier montants
4. L'ancien montant est préservé dans metadata

### Analyse Financière:
1. Admin Dashboard > Facturation > Journal Comptable
2. Exporter les données si nécessaire
3. Tous les événements sont tracés

---

## 🎯 AVANTAGES DU SYSTÈME

✅ **Automatisation Complète:**
- Taxes calculées automatiquement
- Factures générées par Stripe
- Webhooks synchronisent tout

✅ **Conformité:**
- Stripe Tax = conformité légale garantie
- Journal comptable complet
- Traçabilité totale

✅ **Sécurité:**
- RLS sur toutes les tables
- Pas de données sensibles stockées
- Vérification signatures webhook

✅ **Facilité d'Utilisation:**
- CheckoutButton réutilisable
- Interface admin intuitive
- Tout est intégré

✅ **Scalabilité:**
- Supporte multi-devises
- Multi-pays automatique
- Prêt pour croissance

---

## 📝 RÉSUMÉ

**Le module complet de paiement/facturation/comptabilité iDoc comprend:**

✔️ 3 tables de base de données avec RLS
✔️ 4 Edge Functions (checkout-model, checkout-subscription, stripe-webhook, admin-billing)
✔️ 2 composants frontend (CheckoutButton, AdminBillingDashboard)
✔️ Calcul automatique des taxes via Stripe Tax
✔️ Factures PDF générées automatiquement
✔️ Remboursements admin
✔️ Annulations de factures
✔️ Corrections comptables
✔️ Journal comptable complet
✔️ Statistiques en temps réel
✔️ Support multi-devises et multi-pays

**STATUS: PRODUCTION-READY ✅**

