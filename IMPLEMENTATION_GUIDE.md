# 📘 Guide d'Implémentation iDoc v2.0

**Date :** 2025-11-16
**Statut :** Infrastructure DB complète ✅ | Composants de base créés ✅ | Intégrations en attente ⏳

---

## 📋 Table des Matières

1. [Vue d'ensemble](#vue-densemble)
2. [État actuel](#état-actuel)
3. [Base de données](#base-de-données)
4. [Composants créés](#composants-créés)
5. [Prochaines étapes](#prochaines-étapes)
6. [Intégrations requises](#intégrations-requises)

---

## 🎯 Vue d'ensemble

Ce guide détaille l'état d'avancement de l'implémentation d'iDoc v2.0 selon le PRD (voir `PRD_iDoc_v2.md`).

### ✅ Migrations DB créées (100%)

**5 nouvelles migrations appliquées avec succès:**

1. `add_enriched_user_profiles` - Phase 0
2. `add_phase1_docpilot_docvault` - Phase 1
3. `add_phase2_signflow_dochistory` - Phase 2
4. `add_phase3_api_regulasmart_bulksend` - Phase 3
5. `add_phase4_monetization` - Phase 4

**Total : 16 nouvelles tables créées**

---

## 📊 État actuel

### ✅ Complété

#### Base de données
- [x] Profils enrichis (11 nouveaux champs)
- [x] Tables DocPilot (document_views, recommendation_rules)
- [x] Tables DocVault (document_folders)
- [x] Tables SignFlow (signature_workflows, workflow_signers)
- [x] Tables DocHistory (document_versions)
- [x] Tables API (api_keys, api_logs)
- [x] Tables RegulaSmart (jurisdictions, legal_rules)
- [x] Tables BulkSend (bulk_campaigns, bulk_sends)
- [x] Tables Monétisation (subscriptions, transactions, affiliates, referrals)

#### Types TypeScript
- [x] Tous les types exportés dans `src/lib/supabase.ts`

#### Hooks personnalisés
- [x] `useSmartFill` - Hook pour pré-remplissage automatique

#### Composants
- [x] `UserProfilePage` - Page de gestion du profil utilisateur
- [x] `DocPilotRecommendations` - Système de recommandations
- [x] `ProSubscriptionPage` - Page d'abonnement Pro

#### Edge Functions
- [x] `idoc-api` - API RESTful pour iDoc Connect (Phase 3)

### ⏳ En attente

#### Intégrations tierces
- [ ] Stripe (paiements + abonnements)
- [ ] Service d'email (Resend ou SendGrid)
- [ ] TSA (Time Stamp Authority) pour ProofStamp

#### Composants manquants
- [ ] DocVault UI complète
- [ ] SignFlow UI complète
- [ ] DocHistory UI
- [ ] CompliancE-Check validator
- [ ] RegulaSmart selector
- [ ] BulkSend importer

#### Typographie
- [ ] Fichiers de police Montserrat et Roboto
- [ ] Configuration CSS `@font-face`

---

## 🗄️ Base de données

### Tables principales et leurs relations

```
user_profiles (étendu)
├── professional_status, profession, company_name
├── housing_status
├── address_line1, address_line2, city, postal_code, country
├── phone, birth_date
└── Relations:
    ├── document_folders (1:N)
    ├── signature_workflows (1:N)
    ├── api_keys (1:N)
    ├── bulk_campaigns (1:N)
    ├── subscriptions (1:1)
    └── affiliates (1:1)

document_templates
├── Relations:
    ├── document_views (1:N)
    ├── recommendation_rules (N:N)
    ├── legal_rules (1:N)
    └── generated_documents (1:N)

generated_documents (étendu)
├── folder_id (nouveau)
├── is_favorite (nouveau)
└── Relations:
    ├── document_folders (N:1)
    ├── document_versions (1:N)
    └── signature_workflows (1:N)

Phase 1: DocPilot & DocVault
├── document_views (tracking consultations)
├── recommendation_rules (règles de recommandation)
└── document_folders (organisation)

Phase 2: SignFlow & DocHistory
├── signature_workflows (workflows)
├── workflow_signers (signataires)
└── document_versions (historique)

Phase 3: API & RegulaSmart & BulkSend
├── api_keys (clés API)
├── api_logs (logs API)
├── jurisdictions (juridictions légales)
├── legal_rules (règles par juridiction)
├── bulk_campaigns (campagnes d'envoi)
└── bulk_sends (envois individuels)

Phase 4: Monétisation
├── subscriptions (abonnements Pro)
├── transactions (paiements)
├── affiliates (affiliés)
└── referrals (parrainages)
```

### Fonctions et Triggers SQL créés

```sql
-- Phase 1
create_default_folders() - Crée dossiers système à l'inscription
trigger: on_user_created_folders

-- Phase 2
limit_document_versions() - Limite à 10 versions par document
update_workflow_status() - Met à jour statut workflow selon signatures

-- Phase 3
cleanup_old_api_logs() - Nettoie logs > 30 jours
update_campaign_counts() - Met à jour compteurs campagne

-- Phase 4
generate_referral_code() - Génère code parrainage unique
update_affiliate_stats() - Met à jour stats affilié
has_active_subscription() - Vérifie abonnement actif
```

---

## 🧩 Composants créés

### 1. UserProfilePage

**Emplacement :** `src/components/UserProfilePage.tsx`

**Description :** Page complète de gestion du profil utilisateur avec 3 onglets

**Fonctionnalités :**
- Onglets : Personnel, Professionnel, Adresse
- Indicateur de complétion (%)
- Sauvegarde automatique
- Feedback visuel

**Utilisation :**
```tsx
import UserProfilePage from './components/UserProfilePage';

// Dans une route
<Route path="/profile" element={<UserProfilePage />} />
```

---

### 2. DocPilotRecommendations

**Emplacement :** `src/components/DocPilotRecommendations.tsx`

**Description :** Widget de recommandations basé sur le template actuel

**Fonctionnalités :**
- Recommandations basées sur règles (similar, complementary, popular)
- Fallback sur documents populaires
- Tracking des clics
- Max 3 recommandations par défaut

**Utilisation :**
```tsx
import DocPilotRecommendations from './components/DocPilotRecommendations';

<DocPilotRecommendations
  currentTemplateId={templateId}
  sessionId={sessionId}
  onTemplateClick={(template) => navigate(`/template/${template.slug}`)}
  maxRecommendations={3}
/>
```

---

### 3. ProSubscriptionPage

**Emplacement :** `src/components/ProSubscriptionPage.tsx`

**Description :** Page d'abonnement Pro avec déclencheurs contextuels

**Fonctionnalités :**
- 3 déclencheurs : volume, feature, profile
- Toggle mensuel/annuel
- Tableau comparatif
- Essai gratuit 7 jours

**Utilisation :**
```tsx
import ProSubscriptionPage from './components/ProSubscriptionPage';

// Déclencheur de volume
<ProSubscriptionPage trigger="volume" />

// Déclencheur de fonctionnalité
<ProSubscriptionPage trigger="feature" />

// Déclencheur de profil
<ProSubscriptionPage trigger="profile" />
```

---

### 4. Hook useSmartFill

**Emplacement :** `src/hooks/useSmartFill.ts`

**Description :** Hook pour pré-remplissage automatique des formulaires

**Fonctionnalités :**
- Charge le profil utilisateur
- Applique mappings de variables
- Calcule complétion profil
- Transformations de données (nom/prénom, dates, etc.)

**Utilisation :**
```tsx
import { useSmartFill } from '../hooks/useSmartFill';

function DocumentForm() {
  const { applySmartFill, getSmartFillValue, isSmartFillAvailable } = useSmartFill();

  const [formData, setFormData] = useState({});

  useEffect(() => {
    // Applique SmartFill au chargement
    setFormData(applySmartFill(formData));
  }, []);

  // Vérifier si un champ peut être pré-rempli
  const canFill = isSmartFillAvailable('nom_complet');

  // Obtenir une valeur spécifique
  const preFillValue = getSmartFillValue('email');
}
```

**Mappings supportés :**
- `nom_complet`, `nom`, `prenom` → `full_name`
- `email` → `email`
- `telephone`, `phone` → `phone`
- `date_naissance` → `birth_date`
- `adresse`, `adresse_ligne1` → `address_line1`
- `ville` → `city`
- `code_postal` → `postal_code`
- `profession` → `profession`
- `employeur`, `entreprise` → `company_name`
- etc.

---

## 🚀 Prochaines étapes

### Priorité 1 : Intégration Stripe

**Objectif :** Permettre paiements 1,99$ et abonnements Pro 9,99$/mois

**Étapes :**
1. Créer compte Stripe
2. Obtenir clés API (test + production)
3. Installer `@stripe/stripe-js`
4. Créer composants :
   - `PaymentForm` - Paiement unique
   - `SubscriptionCheckout` - Abonnement
5. Créer Edge Function `stripe-webhook` pour événements
6. Mettre à jour `ProSubscriptionPage` avec vraie intégration

**Références :**
- [Stripe Checkout](https://stripe.com/docs/payments/checkout)
- [Stripe Subscriptions](https://stripe.com/docs/billing/subscriptions/overview)

---

### Priorité 2 : Composants DocVault

**Objectif :** Permettre organisation des documents dans dossiers

**Composants à créer :**
- `DocVaultSidebar` - Liste des dossiers
- `DocVaultGrid` - Affichage des documents
- `FolderManager` - Créer/renommer/supprimer dossiers
- `DocumentMover` - Déplacer documents (drag & drop)

**Exemple de structure :**
```tsx
<DocVault>
  <DocVaultSidebar
    folders={folders}
    onFolderSelect={setActiveFolder}
    onCreateFolder={handleCreate}
  />
  <DocVaultGrid
    documents={documents}
    activeFolder={activeFolder}
    onMove={handleMove}
  />
</DocVault>
```

---

### Priorité 3 : SignFlow UI

**Objectif :** Workflow de signature multi-parties

**Composants à créer :**
- `SignFlowCreator` - Configurer workflow
- `SignersList` - Ajouter/gérer signataires
- `SignFlowDashboard` - Suivre statut signatures
- `SignaturePage` - Page de signature pour destinataires

**Flow :**
1. Créer document
2. Cliquer "Envoyer pour signature"
3. Configurer ordre (séquentiel/parallèle)
4. Ajouter signataires (email, nom, rôle)
5. Envoyer emails avec liens uniques
6. Signataires signent via token d'accès
7. Notifications de complétion

---

### Priorité 4 : CompliancE-Check

**Objectif :** Vérifier documents avant finalisation

**À créer :**
- `useValidation` hook avec règles de validation
- `ValidationModal` - Afficher erreurs/warnings
- Règles :
  - Champs obligatoires manquants
  - Formats invalides (email, téléphone)
  - Incohérences de dates
  - Montants négatifs

**Exemple :**
```tsx
const { validate, errors, warnings } = useValidation();

const handleGenerate = () => {
  const result = validate(formData, template.template_variables);

  if (result.errors.length > 0) {
    setShowValidationModal(true);
    return;
  }

  // Générer PDF
};
```

---

### Priorité 5 : RegulaSmart

**Objectif :** Adapter documents selon juridiction

**À créer :**
- `JurisdictionSelector` - Sélection juridiction obligatoire
- `LegalClauseAdapter` - Substitution clauses automatique
- Page admin pour gérer règles par juridiction

**Flow :**
1. Sélectionner juridiction au début
2. Charger legal_rules pour (template_id, jurisdiction_id)
3. Substituer clauses dans template_content
4. Afficher badge "Adapté pour Québec" par exemple

---

## 🔌 Intégrations requises

### 1. Stripe

**Variables d'environnement nécessaires :**
```env
VITE_STRIPE_PUBLIC_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

**Packages à installer :**
```bash
npm install @stripe/stripe-js stripe
```

---

### 2. Service d'email

**Recommandé : Resend**

**Variables d'environnement :**
```env
RESEND_API_KEY=re_...
```

**Utilisation :**
- Envoi liens de signature (SignFlow)
- Notifications de signature complète
- Emails de bienvenue
- Rappels abonnement

---

### 3. Service d'horodatage (ProofStamp)

**Options :**
- DigiCert Timestamp Authority
- GlobalSign TSA
- Certum TSA

**Alternative :** Implémentation interne avec crypto.subtle

---

## 📝 Routes à ajouter dans App.tsx

```tsx
// Phase 0 & 1
<Route path="/profile" element={<ProtectedRoute><UserProfilePage /></ProtectedRoute>} />

// Phase 1
<Route path="/vault" element={<ProtectedRoute><DocVaultPage /></ProtectedRoute>} />

// Phase 2
<Route path="/signatures" element={<ProtectedRoute><SignFlowDashboard /></ProtectedRoute>} />
<Route path="/sign/:token" element={<SignaturePage />} />

// Phase 3
<Route path="/developers" element={<DeveloperPortalPage />} />
<Route path="/bulk-send" element={<ProtectedRoute><BulkSendPage /></ProtectedRoute>} />

// Phase 4
<Route path="/pro" element={<ProSubscriptionPage />} />
<Route path="/billing" element={<ProtectedRoute><BillingPage /></ProtectedRoute>} />
<Route path="/affiliate" element={<ProtectedRoute><AffiliateDashboard /></ProtectedRoute>} />
```

---

## 🧪 Tests à implémenter

### Tests unitaires
- [ ] useSmartFill hook
- [ ] Fonctions de validation
- [ ] Helpers de formatage

### Tests d'intégration
- [ ] Flow de paiement complet
- [ ] Création et signature de workflow
- [ ] API iDoc Connect

### Tests E2E
- [ ] Parcours invité → achat → inscription
- [ ] Parcours abonnement Pro
- [ ] Signature multi-parties

---

## 📊 KPI à tracker

### Phase 1
- Taux d'adoption DocVault
- Temps de remplissage réduit (SmartFill)
- Taux de complétion profils

### Phase 2
- Taux de complétion signatures
- Temps moyen jusqu'à signature complète

### Phase 3
- Nombre de comptes API actifs
- Volume d'appels API/mois

### Phase 4
- Taux de conversion invité → achat
- Taux de conversion Standard → Pro
- MRR (Monthly Recurring Revenue)
- Churn rate
- LTV/CAC ratio

---

## 🐛 Problèmes connus et solutions

### Issue : Profil non chargé au premier rendu
**Solution :** Vérifier que le hook `useAuth` retourne bien `user` avant d'appeler `loadProfile()`

### Issue : Recommendations vides
**Solution :** Créer des recommendation_rules dans la DB ou utiliser le fallback sur documents populaires

### Issue : Edge Function timeout
**Solution :** Augmenter le timeout dans la config Supabase (max 150s pour Business plan)

---

## 📚 Ressources

### Documentation
- [PRD complet](./PRD_iDoc_v2.md)
- [Supabase Docs](https://supabase.com/docs)
- [Stripe Docs](https://stripe.com/docs)
- [React Query](https://tanstack.com/query/latest)

### Commandes utiles

```bash
# Lancer le dev server
npm run dev

# Build de production
npm run build

# Tests
npm run test

# Voir les logs Edge Functions
supabase functions logs idoc-api

# Lister les tables Supabase
supabase db list-tables
```

---

## 🎯 Résumé

**État global : 40% complété**

✅ **Infrastructure DB** : 100%
✅ **Types TypeScript** : 100%
✅ **Composants de base** : 30%
✅ **Edge Functions** : 50%
⏳ **Intégrations tierces** : 0%
⏳ **Tests** : 0%

**Temps estimé pour complétion :** 6-8 semaines avec 1 développeur full-time

**Prochaine étape prioritaire :** Intégration Stripe pour activer la monétisation
