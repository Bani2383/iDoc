# 📋 Document de Spécifications Techniques et Fonctionnelles (PRD)

**Projet :** iDoc - Générateur de Documents Intelligents
**Version :** 2.0
**Date :** 2025-11-16

> **Note Importante :** Ces nouvelles fonctionnalités seront **ajoutées aux fonctionnalités déjà existantes de iDoc**, enrichissant son efficacité, sa sécurité, sa monétisation B2B et B2C.

---

## 📊 Table des Matières

1. [Phase 0 : Fondation et Typographie](#phase-0)
2. [Phase 1 : Efficacité et Conversion](#phase-1)
3. [Phase 2 : Sécurité, Légalité et Workflow](#phase-2)
4. [Phase 3 : Automatisation et Outils Pro](#phase-3)
5. [Phase 4 : Monétisation et Croissance](#phase-4)
6. [Architecture Technique](#architecture)
7. [Roadmap d'Implémentation](#roadmap)

---

<a name="phase-0"></a>
## 🎨 Phase 0 : Fondation et Typographie

**Objectif :** Créer une identité visuelle professionnelle et performante (UX de base).

### 0.1. Typographie Professionnelle (Frontend)

#### 📝 User Story
> En tant qu'utilisateur, je veux une interface élégante et lisible qui inspire confiance et professionnalisme.

#### ✅ Critères d'Acceptation

| Élément | Police | Poids | Format | Optimisation |
|---------|--------|-------|--------|--------------|
| **Titres** (H1-H6, Boutons) | Montserrat | 300, 400, 600, 700 | WOFF2 | `font-display: swap` |
| **Corps** (Paragraphes, Formulaires) | Roboto | 400, 500, 700 | WOFF2 | `font-display: swap` |

**Spécifications Techniques :**
- ✓ Auto-hébergement des polices (pas de CDN externe)
- ✓ Préchargement des fichiers critiques
- ✓ Subsetting des caractères (Latin uniquement)
- ✓ Fallback system fonts optimisés

**Fichiers à créer :**
- `/public/fonts/montserrat/` - Fichiers WOFF2
- `/public/fonts/roboto/` - Fichiers WOFF2
- `/src/styles/fonts.css` - Déclarations @font-face

#### 📈 KPI
- Lighthouse Performance Score ≥ 90
- Temps de chargement polices < 100ms
- CLS (Cumulative Layout Shift) < 0.1

---

### 0.2. Profil Utilisateur Enrichi (Backend)

#### 📝 User Story
> En tant qu'utilisateur inscrit, je veux compléter mon profil une seule fois pour bénéficier du pré-remplissage automatique sur tous mes documents.

#### ✅ Critères d'Acceptation

**Nouveaux champs de profil :**

| Champ | Type | Obligatoire | Objectif |
|-------|------|-------------|----------|
| `professional_status` | SELECT | Non | Employé, Indépendant, Étudiant, Retraité, Autre |
| `profession` | TEXT | Non | Titre du poste / profession |
| `housing_status` | SELECT | Non | Propriétaire, Locataire, Hébergé, Autre |
| `company_name` | TEXT | Non | Nom de l'employeur/entreprise |
| `address_line1` | TEXT | Non | Adresse ligne 1 |
| `address_line2` | TEXT | Non | Adresse ligne 2 |
| `city` | TEXT | Non | Ville |
| `postal_code` | TEXT | Non | Code postal |
| `country` | TEXT | Non | Pays (défaut: Canada) |
| `phone` | TEXT | Non | Téléphone |
| `birth_date` | DATE | Non | Date de naissance |

**Fonctionnalités :**
- ✓ Page "Mon Profil" dans le dashboard client
- ✓ Formulaire en plusieurs onglets (Info Perso, Info Pro, Adresse)
- ✓ Sauvegarde automatique (debounce 2s)
- ✓ Validation côté client et serveur
- ✓ Message de confirmation visuel

#### 🗄️ Migration Base de Données
```sql
ALTER TABLE user_profiles ADD COLUMN professional_status TEXT;
ALTER TABLE user_profiles ADD COLUMN profession TEXT;
ALTER TABLE user_profiles ADD COLUMN housing_status TEXT;
ALTER TABLE user_profiles ADD COLUMN company_name TEXT;
ALTER TABLE user_profiles ADD COLUMN address_line1 TEXT;
ALTER TABLE user_profiles ADD COLUMN address_line2 TEXT;
ALTER TABLE user_profiles ADD COLUMN city TEXT;
ALTER TABLE user_profiles ADD COLUMN postal_code TEXT;
ALTER TABLE user_profiles ADD COLUMN country TEXT DEFAULT 'Canada';
ALTER TABLE user_profiles ADD COLUMN phone TEXT;
ALTER TABLE user_profiles ADD COLUMN birth_date DATE;
```

#### 📈 KPI
- Taux de complétion du profil (objectif: 70% des utilisateurs inscrits)
- Temps moyen de complétion du profil (objectif: < 3 minutes)

---

<a name="phase-1"></a>
## ⚡ Phase 1 : Efficacité et Conversion

**Objectif :** Améliorer l'expérience utilisateur et augmenter les taux de conversion.

---

### 1.1. DocPilot V2 🧭 - Moteur de Recommandation Intelligent

#### 📝 User Story
> En tant que visiteur non-inscrit, je veux recevoir des suggestions de documents pertinents basées sur ma navigation pour découvrir des documents que je n'aurais pas trouvés seul.

#### ✅ Critères d'Acceptation

**Tracking Comportemental :**
- ✓ Suivre les templates consultés (localStorage pour invités)
- ✓ Suivre le temps passé sur chaque template
- ✓ Suivre les recherches effectuées
- ✓ Suivre les catégories explorées

**Algorithme de Recommandation :**
- ✓ **Similarité de catégorie :** Si l'utilisateur consulte "Contrat de Bail", suggérer "État des Lieux"
- ✓ **Documents complémentaires :** Si "Lettre de Motivation", suggérer "CV Professionnel"
- ✓ **Popularité contextuelle :** "Souvent consultés ensemble"

**Affichage des Recommandations :**
- ✓ Widget latéral "Documents qui pourraient vous intéresser" (max 3 suggestions)
- ✓ Section en bas de page après génération
- ✓ CTA clair vers inscription si invité

**Exemple d'Interface :**
```
┌─────────────────────────────────────┐
│ 🧭 Documents recommandés pour vous  │
├─────────────────────────────────────┤
│ ✓ Contrat de Colocation             │
│   Souvent consulté avec ce document │
│                                      │
│ ✓ État des Lieux d'Entrée           │
│   Complète votre bail résidentiel   │
│                                      │
│ ✓ Quittance de Loyer                │
│   Populaire dans cette catégorie    │
└─────────────────────────────────────┘
```

#### 🗄️ Tables Nécessaires
```sql
-- Table de tracking des consultations
CREATE TABLE document_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  session_id TEXT NOT NULL, -- pour invités
  template_id UUID REFERENCES document_templates(id),
  viewed_at TIMESTAMPTZ DEFAULT now(),
  duration_seconds INTEGER,
  source TEXT -- search, category, recommendation
);

-- Table de règles de recommandation
CREATE TABLE recommendation_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_template_id UUID REFERENCES document_templates(id),
  recommended_template_id UUID REFERENCES document_templates(id),
  rule_type TEXT, -- similar, complementary, popular
  weight INTEGER DEFAULT 1,
  is_active BOOLEAN DEFAULT true
);
```

#### 📈 KPI
- Taux de clic sur recommandations (objectif: > 15%)
- Taux de conversion post-recommandation (objectif: +25% vs sans recommandation)
- Nombre moyen de documents consultés par session (objectif: +30%)

---

### 1.2. SmartFill ⚡ - Pré-remplissage Automatique

#### 📝 User Story
> En tant qu'utilisateur inscrit, je veux que mes documents soient pré-remplis automatiquement avec mes informations personnelles pour gagner du temps.

#### ✅ Critères d'Acceptation

**Mapping Automatique :**

| Variable Template | Source Profil | Transformation |
|-------------------|---------------|----------------|
| `{{nom_complet}}` | `full_name` | Direct |
| `{{prenom}}` | `full_name.split(' ')[0]` | Extraction |
| `{{nom}}` | `full_name.split(' ').slice(1).join(' ')` | Extraction |
| `{{email}}` | `email` | Direct |
| `{{telephone}}` | `phone` | Direct |
| `{{date_naissance}}` | `birth_date` | Format DD/MM/YYYY |
| `{{adresse_complete}}` | `address_line1 + city + postal_code` | Concaténation |
| `{{adresse}}` | `address_line1` | Direct |
| `{{ville}}` | `city` | Direct |
| `{{code_postal}}` | `postal_code` | Direct |
| `{{profession}}` | `profession` | Direct |
| `{{employeur}}` | `company_name` | Direct |

**Comportement :**
- ✓ Pré-remplissage au chargement du formulaire
- ✓ Champs éditables (utilisateur peut modifier)
- ✓ Indicateur visuel "Pré-rempli depuis votre profil" (icône ⚡)
- ✓ Bouton "Rafraîchir depuis mon profil" si modifications

**Exemple d'Interface :**
```
┌─────────────────────────────────────┐
│ Nom complet *                    ⚡ │
│ [Jean Dupont                    ]   │
│ Pré-rempli depuis votre profil      │
└─────────────────────────────────────┘
```

**Logique Frontend :**
```typescript
interface ProfileMapping {
  templateVariable: string;
  profileField: keyof UserProfile;
  transform?: (value: any) => string;
}

const SMART_FILL_MAPPINGS: ProfileMapping[] = [
  { templateVariable: 'nom_complet', profileField: 'full_name' },
  { templateVariable: 'email', profileField: 'email' },
  { templateVariable: 'telephone', profileField: 'phone' },
  // ...
];
```

#### 📈 KPI
- Temps de remplissage réduit de 60% (objectif: 2 min → 48 sec)
- Taux de complétion des formulaires (objectif: +35%)
- Score de satisfaction utilisateur (objectif: > 4.5/5)

---

### 1.3. CompliancE-Check 🛡️ - Vérification d'Erreurs Intelligente

#### 📝 User Story
> En tant qu'utilisateur, je veux être alerté des erreurs ou incohérences dans mon document avant de le finaliser pour éviter les problèmes légaux.

#### ✅ Critères d'Acceptance

**Types de Vérifications :**

1. **Champs Obligatoires Manquants**
   - ✓ Détection des variables `required: true` non remplies
   - ✓ Highlight visuel des champs manquants (bordure rouge)
   - ✓ Liste récapitulative en modal

2. **Incohérences de Dates**
   - ✓ Date de début > Date de fin
   - ✓ Date dans le futur pour événements passés
   - ✓ Date de naissance > 120 ans ou < 18 ans (selon contexte)

3. **Format de Données**
   - ✓ Email invalide
   - ✓ Téléphone invalide (format international)
   - ✓ Code postal invalide (selon pays)

4. **Cohérence Logique**
   - ✓ Montant négatif où illogique
   - ✓ Durée incohérente (ex: bail de 0 mois)

**Interface de Vérification :**
```
┌─────────────────────────────────────────┐
│ 🛡️ Vérification du document           │
├─────────────────────────────────────────┤
│ ⚠️ 3 problèmes détectés :              │
│                                         │
│ ❌ Champs obligatoires manquants (2)   │
│    • Date de signature                 │
│    • Adresse complète                  │
│                                         │
│ ⚠️ Incohérences détectées (1)          │
│    • Date de fin avant date de début   │
│                                         │
│ [Corriger les erreurs] [Ignorer et continuer] │
└─────────────────────────────────────────┘
```

**Implémentation :**
```typescript
interface ValidationRule {
  field: string;
  type: 'required' | 'format' | 'logic';
  validator: (value: any, formData: Record<string, any>) => boolean;
  message: string;
  severity: 'error' | 'warning';
}

const VALIDATION_RULES: ValidationRule[] = [
  {
    field: 'email',
    type: 'format',
    validator: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
    message: 'Format d\'email invalide',
    severity: 'error'
  },
  // ...
];
```

#### 📈 KPI
- Taux de documents sans erreur au premier essai (objectif: +50%)
- Réduction des retours clients pour erreurs (objectif: -70%)
- Temps de correction des erreurs (objectif: < 1 minute)

---

### 1.4. DocVault 🗄️ - Organisation des Documents

#### 📝 User Story
> En tant qu'utilisateur inscrit, je veux organiser mes documents dans des dossiers personnalisés pour retrouver facilement mes fichiers importants.

#### ✅ Critères d'Acceptation

**Fonctionnalités :**
- ✓ Créer des dossiers personnalisés
- ✓ Renommer les dossiers
- ✓ Supprimer les dossiers (avec confirmation)
- ✓ Déplacer documents entre dossiers (drag & drop)
- ✓ Dossiers par défaut : "Non classés", "Favoris", "Partagés"
- ✓ Vue en grille ou liste
- ✓ Recherche dans DocVault
- ✓ Filtres : Par date, par type, par dossier

**Interface :**
```
┌─ DocVault ────────────────────────────┐
│ 📁 Mes Dossiers                       │
├───────────────────────────────────────┤
│ 📂 Tous les documents (45)           │
│ ⭐ Favoris (7)                        │
│ 📤 Partagés avec moi (3)             │
│ ├─ 📁 Contrats (12)                  │
│ ├─ 📁 Immigration (8)                │
│ └─ 📁 Personnel (15)                 │
│                                       │
│ [+ Nouveau dossier]                   │
└───────────────────────────────────────┘
```

#### 🗄️ Tables Nécessaires
```sql
-- Table des dossiers
CREATE TABLE document_folders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  parent_folder_id UUID REFERENCES document_folders(id),
  color TEXT,
  icon TEXT,
  is_system BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Lien documents ↔ dossiers
ALTER TABLE user_documents ADD COLUMN folder_id UUID REFERENCES document_folders(id);
ALTER TABLE user_documents ADD COLUMN is_favorite BOOLEAN DEFAULT false;

-- Index pour performance
CREATE INDEX idx_folders_user ON document_folders(user_id);
CREATE INDEX idx_documents_folder ON user_documents(folder_id);
```

#### 📈 KPI
- Taux d'adoption de DocVault (objectif: 60% des utilisateurs)
- Nombre moyen de dossiers par utilisateur (objectif: 3-5)
- Temps de recherche de document (objectif: < 10 secondes)

---

<a name="phase-2"></a>
## 🔒 Phase 2 : Sécurité, Légalité et Workflow

**Objectif :** Ajouter des fonctionnalités avancées de gestion de signatures et de conformité légale.

---

### 2.1. SignFlow ✍️ - Workflow de Signature Multi-Parties

#### 📝 User Story
> En tant qu'utilisateur Pro, je veux envoyer un document à plusieurs signataires avec un ordre de signature spécifique et suivre l'état de chaque signature.

#### ✅ Critères d'Acceptation

**Configuration du Workflow :**
- ✓ Définir l'ordre de signature (séquentiel ou parallèle)
- ✓ Ajouter jusqu'à 10 signataires
- ✓ Définir le rôle de chaque signataire (Signataire, Approbateur, Témoin, CC)
- ✓ Champs personnalisés par signataire

**Statuts de Signature :**

| Statut | Icône | Description |
|--------|-------|-------------|
| `draft` | 📝 | Brouillon en préparation |
| `sent` | 📤 | Envoyé, en attente |
| `opened` | 👁️ | Ouvert par le destinataire |
| `signed` | ✅ | Signé |
| `declined` | ❌ | Refusé |
| `expired` | ⏰ | Expiré (après 30 jours) |
| `completed` | 🎉 | Toutes signatures complètes |

**Tableau de Bord SignFlow :**
```
┌─ Contrat_CDI_Jean_Martin.pdf ─────────┐
│ Envoyé le 15/11/2025 • Expire le 15/12 │
├───────────────────────────────────────┤
│ 1. Jean Martin (Employé)          ✅  │
│    Signé le 16/11/2025 à 14:32       │
│                                       │
│ 2. Sophie Dubois (RH)             👁️  │
│    Ouvert le 16/11/2025 à 15:10       │
│    En attente de signature             │
│                                       │
│ 3. Pierre Durand (Directeur)      📤  │
│    En attente                          │
│                                       │
│ [Relancer Sophie] [Annuler]           │
└───────────────────────────────────────┘
```

#### 🗄️ Tables Nécessaires
```sql
-- Workflows de signature
CREATE TABLE signature_workflows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id UUID REFERENCES user_documents(id) ON DELETE CASCADE,
  created_by UUID REFERENCES auth.users(id),
  workflow_type TEXT DEFAULT 'sequential', -- sequential, parallel
  status TEXT DEFAULT 'draft',
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  completed_at TIMESTAMPTZ
);

-- Signataires
CREATE TABLE workflow_signers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workflow_id UUID REFERENCES signature_workflows(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT DEFAULT 'signer', -- signer, approver, witness, cc
  order_index INTEGER NOT NULL,
  status TEXT DEFAULT 'pending',
  signed_at TIMESTAMPTZ,
  ip_address TEXT,
  user_agent TEXT,
  signature_data TEXT, -- Base64 de la signature
  access_token TEXT UNIQUE, -- Token pour accès sécurisé
  opened_at TIMESTAMPTZ,
  declined_reason TEXT
);
```

#### 📈 KPI
- Taux de complétion des signatures (objectif: > 85%)
- Temps moyen jusqu'à signature complète (objectif: < 48h)
- Taux d'ouverture des emails de signature (objectif: > 90%)

---

### 2.2. ProofStamp 🕰️ - Preuve Légale d'Horodatage

#### 📝 User Story
> En tant qu'utilisateur, je veux une preuve légale et infalsifiable de la date et heure de signature de mon document.

#### ✅ Critères d'Acceptation

**Horodatage Qualifié :**
- ✓ Timestamp RFC 3161 conforme
- ✓ Hash SHA-256 du document
- ✓ Certificat numérique
- ✓ Intégration dans métadonnées PDF

**Informations Horodatées :**
- Date et heure UTC
- Hash du document
- IP du signataire
- User Agent (navigateur)
- Géolocalisation (consentement)

**Certificat de Signature :**
```
╔══════════════════════════════════════╗
║   🕰️ CERTIFICAT D'HORODATAGE       ║
╠══════════════════════════════════════╣
║ Document : Contrat_CDI.pdf          ║
║ Signataire : Jean Martin             ║
║ Date : 16/11/2025 14:32:15 UTC      ║
║ Hash : a3f5c9d8e2b1...              ║
║ IP : 192.168.1.42                    ║
║ Certificat : #TS-2025-11-16-8472    ║
╚══════════════════════════════════════╝
```

#### Implémentation Technique

**Option 1 : Service Externe (Recommandé)**
- Utiliser un TSA (Time Stamp Authority) certifié
- Exemples : DigiCert, GlobalSign, Certum

**Option 2 : Implémentation Interne**
```typescript
import crypto from 'crypto';

interface TimestampData {
  documentHash: string;
  timestamp: Date;
  signerEmail: string;
  ipAddress: string;
  userAgent: string;
}

function generateProofStamp(doc: Buffer, metadata: TimestampData): string {
  const hash = crypto.createHash('sha256').update(doc).digest('hex');
  const proof = {
    ...metadata,
    documentHash: hash,
    certificateId: `TS-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  };
  return JSON.stringify(proof);
}
```

#### 📈 KPI
- Valeur juridique reconnue : 100%
- Temps de génération du certificat : < 2 secondes
- Taux de conservation des certificats : 100% sur 10 ans

---

### 2.3. DocHistory 🔄 - Historique et Restauration de Versions

#### 📝 User Story
> En tant qu'utilisateur, je veux consulter l'historique de modifications de mes documents et restaurer une version antérieure si nécessaire.

#### ✅ Critères d'Acceptation

**Fonctionnalités :**
- ✓ Sauvegarde automatique de chaque version (brouillons uniquement)
- ✓ Comparaison visuelle entre versions (diff)
- ✓ Restauration d'une version antérieure comme nouveau brouillon
- ✓ Limite : 10 versions par document
- ✓ Métadonnées : Date, auteur, taille, changements

**Interface Timeline :**
```
┌─ Historique : Contrat_Location.pdf ───┐
│                                        │
│ ●─ Version 3 (Actuelle)           📄  │
│ │  16/11/2025 14:32 • Jean Martin      │
│ │  Ajout clause résiliation            │
│ │  [Voir] [Comparer]                   │
│ │                                      │
│ ●─ Version 2                       📄  │
│ │  15/11/2025 10:15 • Jean Martin      │
│ │  Modification montant loyer          │
│ │  [Voir] [Comparer] [Restaurer]       │
│ │                                      │
│ ●─ Version 1 (Original)            📄  │
│    14/11/2025 09:00 • Jean Martin      │
│    Création initiale                   │
│    [Voir]                               │
└────────────────────────────────────────┘
```

#### 🗄️ Tables Nécessaires
```sql
-- Versions de documents
CREATE TABLE document_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id UUID REFERENCES user_documents(id) ON DELETE CASCADE,
  version_number INTEGER NOT NULL,
  content TEXT NOT NULL, -- JSON des données du formulaire
  pdf_url TEXT,
  file_size INTEGER,
  changes_summary TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Limiter à 10 versions par document
CREATE OR REPLACE FUNCTION limit_document_versions()
RETURNS TRIGGER AS $$
BEGIN
  DELETE FROM document_versions
  WHERE document_id = NEW.document_id
  AND id NOT IN (
    SELECT id FROM document_versions
    WHERE document_id = NEW.document_id
    ORDER BY version_number DESC
    LIMIT 10
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

#### 📈 KPI
- Taux d'utilisation de la restauration (objectif: 5-10% des documents)
- Satisfaction utilisateur (objectif: > 4.5/5)

---

<a name="phase-3"></a>
## 🤖 Phase 3 : Automatisation et Outils Pro (Monétisation B2B)

**Objectif :** Fournir des outils d'entreprise pour l'automatisation et l'intégration avec des systèmes existants.

---

### 3.1. iDoc Connect 🤖 - API d'Automatisation

#### 📝 User Story
> En tant que développeur d'entreprise, je veux générer des documents PDF depuis notre CRM/ERP via une API RESTful sécurisée pour automatiser nos processus documentaires.

#### ✅ Critères d'Acceptation

**API RESTful :**
- ✓ Authentication : Bearer Token + API Key
- ✓ Rate Limiting : 1000 requêtes/heure (Pro), 10,000/heure (Enterprise)
- ✓ Format : JSON Input → PDF Output
- ✓ Documentation OpenAPI/Swagger complète

**Endpoints Principaux :**

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| `POST` | `/api/v1/documents/generate` | Génère un PDF depuis template + données |
| `GET` | `/api/v1/templates` | Liste templates disponibles |
| `GET` | `/api/v1/documents/{id}` | Récupère un document généré |
| `POST` | `/api/v1/signatures/send` | Envoie document pour signature |
| `GET` | `/api/v1/signatures/{id}/status` | Statut d'un workflow de signature |

**Exemple d'Utilisation :**

```bash
# Génération de PDF
curl -X POST https://api.idoc.com/v1/documents/generate \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "template_id": "lettre-invitation-visa-canada",
    "data": {
      "nom_hote": "Jean Dupont",
      "adresse_rue": "123 Rue Principale",
      "ville": "Montréal",
      "code_postal": "H1A 1A1"
    },
    "output_format": "url"
  }'

# Réponse
{
  "success": true,
  "document_id": "doc_abc123xyz",
  "url": "https://cdn.idoc.com/docs/doc_abc123xyz.pdf",
  "expires_at": "2025-11-23T14:32:15Z"
}
```

**Portail Développeur :**
- URL : `idoc.com/developers`
- Sandbox : Clés de test gratuites (100 appels/jour)
- Documentation interactive
- Code samples (JS, Python, PHP, Ruby, Go)
- Webhooks pour événements (document.generated, signature.completed)

#### 🗄️ Tables Nécessaires
```sql
-- Clés API
CREATE TABLE api_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  key_hash TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  permissions JSONB DEFAULT '["documents:generate"]',
  rate_limit INTEGER DEFAULT 1000,
  is_active BOOLEAN DEFAULT true,
  last_used_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  expires_at TIMESTAMPTZ
);

-- Logs API
CREATE TABLE api_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  api_key_id UUID REFERENCES api_keys(id),
  endpoint TEXT NOT NULL,
  method TEXT NOT NULL,
  status_code INTEGER,
  request_body JSONB,
  response_body JSONB,
  ip_address TEXT,
  duration_ms INTEGER,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

#### 📈 KPI
- Nombre de comptes API actifs (objectif: 50 en 6 mois)
- Volume d'appels API/mois (objectif: 100,000)
- Taux d'erreur API (objectif: < 1%)
- Revenus API (objectif: 10,000$/mois)

---

### 3.2. RegulaSmart 🌍 - Adaptabilité Légale par Juridiction

#### 📝 User Story
> En tant qu'utilisateur international, je veux que mes documents soient automatiquement conformes aux lois de ma juridiction (Canada, France, Belgique, etc.).

#### ✅ Critères d'Acceptation

**Fonctionnalités :**
- ✓ Sélection obligatoire de la juridiction au début
- ✓ Substitution automatique des clauses légales
- ✓ Adaptation des formats (dates, adresses, monnaie)
- ✓ Signalement visuel des clauses adaptées
- ✓ Disclaimer légal automatique

**Juridictions Supportées (V1) :**
- 🇨🇦 Canada (Québec, Ontario, Colombie-Britannique)
- 🇫🇷 France
- 🇧🇪 Belgique
- 🇨🇭 Suisse
- 🇱🇺 Luxembourg

**Exemple d'Adaptation :**

**Contrat de Bail - Clause de Préavis**

| Juridiction | Clause |
|-------------|--------|
| 🇨🇦 Québec | Le locataire doit donner un avis de 3 mois avant la fin du bail (Art. 1898 CCQ) |
| 🇫🇷 France | Le locataire doit donner un préavis de 3 mois, réduit à 1 mois dans certaines zones (Loi ALUR) |
| 🇧🇪 Belgique | Le locataire doit donner un préavis de 3 mois minimum |

**Interface de Sélection :**
```
┌─────────────────────────────────────┐
│ 🌍 Sélectionnez votre juridiction  │
├─────────────────────────────────────┤
│ Ce document sera adapté aux lois    │
│ de la juridiction sélectionnée.     │
│                                     │
│ [🇨🇦 Canada (Québec)          ▼]   │
│                                     │
│ ℹ️ Clauses adaptées :               │
│ • Préavis de résiliation            │
│ • Dépôt de garantie                 │
│ • Augmentation de loyer             │
│                                     │
│ [Continuer]                         │
└─────────────────────────────────────┘
```

#### 🗄️ Tables Nécessaires
```sql
-- Juridictions
CREATE TABLE jurisdictions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL, -- CA_QC, FR, BE
  name TEXT NOT NULL,
  country TEXT NOT NULL,
  region TEXT,
  is_active BOOLEAN DEFAULT true
);

-- Règles de substitution
CREATE TABLE legal_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id UUID REFERENCES document_templates(id),
  jurisdiction_id UUID REFERENCES jurisdictions(id),
  clause_key TEXT NOT NULL, -- ex: "notice_period"
  clause_text TEXT NOT NULL,
  legal_reference TEXT,
  priority INTEGER DEFAULT 0
);
```

#### 📈 KPI
- Taux d'adoption (objectif: 40% des utilisateurs sélectionnent une juridiction)
- Conformité légale : 100%
- Satisfaction utilisateurs internationaux (objectif: > 4.7/5)

---

### 3.3. BulkSend 👥 - Envoi de Groupe

#### 📝 User Story
> En tant que responsable RH, je veux envoyer des contrats personnalisés à 50 nouveaux employés en une seule opération via import CSV.

#### ✅ Critères d'Acceptation

**Fonctionnalités :**
- ✓ Import fichier CSV ou Excel
- ✓ Mapping colonnes ↔ variables template
- ✓ Prévisualisation avant envoi
- ✓ Envoi en masse avec personnalisation
- ✓ Tableau de suivi en temps réel
- ✓ Gestion des erreurs (email invalide, données manquantes)

**Workflow :**

1. **Upload CSV**
```csv
nom,prenom,email,poste,salaire,date_embauche
Dupont,Jean,jean@example.com,Développeur,60000,2025-12-01
Martin,Sophie,sophie@example.com,Designer,55000,2025-12-01
```

2. **Mapping**
```
┌─────────────────────────────────────┐
│ 📊 Mapping des colonnes            │
├─────────────────────────────────────┤
│ Colonne CSV    →  Variable Template │
│                                     │
│ nom            →  {{nom}}           │
│ prenom         →  {{prenom}}        │
│ email          →  {{email}}         │
│ poste          →  {{poste}}         │
│ salaire        →  {{salaire}}       │
│ date_embauche  →  {{date_debut}}    │
│                                     │
│ [Prévisualiser] [Lancer l'envoi]   │
└─────────────────────────────────────┘
```

3. **Suivi**
```
┌─────────────────────────────────────┐
│ 📤 Envoi en cours...               │
├─────────────────────────────────────┤
│ ✅ Jean Dupont - Envoyé             │
│ ✅ Sophie Martin - Envoyé           │
│ ⏳ Pierre Durand - En cours...      │
│ ❌ Marie Dubois - Erreur email      │
│                                     │
│ Progression : 48/50 (96%)           │
└─────────────────────────────────────┘
```

#### 🗄️ Tables Nécessaires
```sql
-- Campagnes d'envoi
CREATE TABLE bulk_campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  name TEXT NOT NULL,
  template_id UUID REFERENCES document_templates(id),
  total_count INTEGER,
  success_count INTEGER DEFAULT 0,
  error_count INTEGER DEFAULT 0,
  status TEXT DEFAULT 'pending',
  csv_mapping JSONB,
  created_at TIMESTAMPTZ DEFAULT now(),
  completed_at TIMESTAMPTZ
);

-- Envois individuels
CREATE TABLE bulk_sends (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID REFERENCES bulk_campaigns(id) ON DELETE CASCADE,
  recipient_email TEXT NOT NULL,
  recipient_data JSONB,
  document_id UUID REFERENCES user_documents(id),
  status TEXT DEFAULT 'pending',
  error_message TEXT,
  sent_at TIMESTAMPTZ
);
```

#### 📈 KPI
- Volume d'envois groupés/mois (objectif: 5000 documents)
- Taux de succès des envois (objectif: > 98%)
- Temps de traitement (objectif: < 2 secondes par document)

---

<a name="phase-4"></a>
## 💰 Phase 4 : Monétisation et Croissance

**Objectif :** Maximiser la conversion instantanée, la rétention et la valeur à long terme des utilisateurs.

---

### 4.1. Vente Directe - iDoc Standard (1,99 $/document)

#### 📝 User Story
> En tant que visiteur, je veux générer et acheter un document instantanément sans créer de compte d'abord.

#### ✅ Critères d'Acceptation

**Flux Invité Optimisé :**

```
1. Sélection Template → 2. Remplissage → 3. Aperçu
         ↓
4. Paywall : "1,99 $ pour télécharger"
         ↓
5. Paiement Express (Apple Pay / Google Pay / CB)
         ↓
6. Téléchargement PDF + Email
         ↓
7. Proposition d'inscription : "Sauvegardez dans DocVault"
```

**Paiement Express :**
- ✓ Stripe Payment Element
- ✓ Apple Pay (Safari/iOS)
- ✓ Google Pay (Chrome/Android)
- ✓ CB minimaliste (Nom + Numéro + CVC)
- ✓ Aucun champ supplémentaire requis
- ✓ Conversion en < 30 secondes

**Écran de Paiement :**
```
┌─────────────────────────────────────┐
│ 📄 Contrat de Bail Résidentiel     │
│                                     │
│ Document prêt !                     │
│ Téléchargez-le pour seulement :    │
│                                     │
│        1,99 $ CAD                   │
│                                     │
│ [🍎 Apple Pay]                      │
│ [G Pay]                             │
│ [💳 Carte bancaire]                 │
│                                     │
│ ✓ Téléchargement immédiat           │
│ ✓ Format PDF professionnel          │
│ ✓ Paiement sécurisé                 │
└─────────────────────────────────────┘
```

**Inscription Post-Achat :**
```
┌─────────────────────────────────────┐
│ ✅ Paiement réussi !               │
│                                     │
│ Votre document est prêt.            │
│ [📥 Télécharger le PDF]            │
│                                     │
│ 💡 Créez un compte gratuitement     │
│    pour sauvegarder ce document     │
│    dans votre DocVault              │
│                                     │
│ [Créer mon compte] [Plus tard]     │
└─────────────────────────────────────┘
```

#### 📈 KPI Critiques
- **Taux de conversion invité → achat** : Objectif > 8%
- **Temps de paiement** : Objectif < 30 secondes
- **Taux d'inscription post-achat** : Objectif > 40%
- **Revenus quotidiens Standard** : Objectif 200-500 $/jour

---

### 4.2. Vente Abonnement - iDoc Pro (9,99 $/mois)

#### 📝 User Story
> En tant qu'utilisateur fréquent, je veux un abonnement mensuel pour accéder à toutes les fonctionnalités Pro et générer des documents illimités.

#### ✅ Critères d'Acceptation

**Fonctionnalités iDoc Pro :**

| Fonctionnalité | Standard (1,99 $/doc) | Pro (9,99 $/mois) |
|----------------|----------------------|-------------------|
| Documents illimités | ❌ | ✅ |
| DocVault | ❌ | ✅ (Illimité) |
| SmartFill | ❌ | ✅ |
| CompliancE-Check | ❌ | ✅ |
| SignFlow (multi-signatures) | ❌ | ✅ (10 workflows/mois) |
| ProofStamp | ❌ | ✅ |
| DocHistory | ❌ | ✅ |
| RegulaSmart | ❌ | ✅ |
| Support prioritaire | ❌ | ✅ |

**Déclencheurs d'Upsell :**

1. **Déclencheur de Volume**
   ```
   Vous avez généré 3 documents ce mois-ci (5,97 $)

   💡 Avec iDoc Pro (9,99 $/mois) :
   • Documents illimités
   • Économisez dès le 5e document

   [Essayer 7 jours gratuits]
   ```

2. **Déclencheur Fonctionnel**
   ```
   🔒 Cette fonctionnalité est réservée à iDoc Pro

   DocVault vous permet d'organiser et retrouver
   facilement tous vos documents.

   [Passer à Pro - 9,99 $/mois]
   [Voir toutes les fonctionnalités Pro]
   ```

3. **Déclencheur de Profil**
   ```
   Nous avons détecté que vous êtes :
   👔 Professionnel indépendant

   iDoc Pro est fait pour vous :
   • Signature électronique multi-parties
   • Conformité juridique automatique
   • Support prioritaire

   [Essayer gratuitement 7 jours]
   ```

**Essai Gratuit avec Opt-Out :**
- ✓ 7 jours gratuits
- ✓ CB requise (prélèvement après 7 jours)
- ✓ Email de rappel à J-2
- ✓ Annulation en 1 clic

**Page d'Abonnement :**
```
┌─────────────────────────────────────┐
│ 🚀 iDoc Pro                         │
│                                     │
│ Tout ce dont vous avez besoin pour  │
│ vos documents professionnels        │
│                                     │
│      9,99 $ /mois                   │
│                                     │
│ ✅ Documents illimités              │
│ ✅ Signatures électroniques         │
│ ✅ DocVault illimité                │
│ ✅ Pré-remplissage automatique      │
│ ✅ Vérification d'erreurs           │
│ ✅ Support prioritaire              │
│                                     │
│ [Essayer 7 jours gratuits]         │
│                                     │
│ Sans engagement • Annulez quand vous voulez │
└─────────────────────────────────────┘
```

#### 📈 KPI Critiques
- **Taux de conversion Standard → Pro** : Objectif > 12%
- **Taux de rétention mensuelle** : Objectif > 85%
- **LTV (Lifetime Value)** : Objectif > 120 $ (12 mois)
- **Revenus mensuels récurrents (MRR)** : Objectif 5000 $ en 6 mois

---

### 4.3. Vente B2B - API iDoc Connect

#### 📝 User Story
> En tant que décideur IT, je veux tester l'API iDoc dans notre environnement de développement avant de m'engager commercialement.

#### ✅ Critères d'Acceptation

**Portail Développeur : idoc.com/developers**

**Page d'Accueil Développeur :**
```
┌─────────────────────────────────────────┐
│ 🤖 iDoc Connect API                     │
│ Automatisez la génération de documents │
├─────────────────────────────────────────┤
│                                         │
│ 📚 Documentation                        │
│ 🧪 Sandbox (Gratuit)                   │
│ 💼 Tarifs Entreprise                    │
│                                         │
│ [Créer un compte développeur]          │
└─────────────────────────────────────────┘
```

**Sandbox Gratuit :**
- ✓ Clés API de test gratuites
- ✓ Limite : 100 appels/jour
- ✓ Tous les templates disponibles
- ✓ Filigrane "TEST" sur les PDFs
- ✓ Durée : Illimitée

**Documentation OpenAPI/Swagger :**
- Endpoints documentés avec exemples
- Cas d'usage concrets (CRM, ERP, RH)
- Code samples dans 6 langages
- Playground interactif

**High-Touch Sales :**

Après 7 jours d'utilisation active du Sandbox :
```
Email automatique :

Bonjour [Prénom],

Nous avons remarqué que vous utilisez activement
l'API iDoc Connect depuis 7 jours.

Souhaitez-vous discuter de vos besoins spécifiques
avec notre équipe ? Nous pouvons vous proposer :

• Volume d'appels adapté à votre usage
• Support technique dédié
• SLA garantis
• Tarifs dégressifs

[Planifier un appel de 15 minutes]

Cordialement,
L'équipe iDoc
```

**Grille Tarifaire B2B :**

| Plan | Appels/mois | Prix | Support |
|------|-------------|------|---------|
| **Sandbox** | 3,000 (100/jour) | Gratuit | Documentation |
| **Startup** | 10,000 | 99 $/mois | Email |
| **Business** | 50,000 | 399 $/mois | Email + Chat |
| **Enterprise** | 200,000+ | Sur devis | Dédié + SLA |

#### 📈 KPI Critiques
- **Comptes sandbox actifs** : Objectif 200 en 6 mois
- **Taux de conversion Sandbox → Payant** : Objectif > 15%
- **Revenus API mensuels** : Objectif 5000 $ en 12 mois
- **NPS (Net Promoter Score)** : Objectif > 50

---

### 4.4. Croissance et Échelle

#### 4.4.1. Programme d'Affiliation

**Structure :**
- 🎯 **Commission** : 30% sur 1er mois d'abonnement Pro
- 🎯 **Cookie** : 30 jours
- 🎯 **Suivi** : Liens traçables uniques
- 🎯 **Paiement** : Mensuel via PayPal/Stripe

**Portail Affilié :**
```
┌─────────────────────────────────────┐
│ 🤝 Tableau de Bord Affilié         │
├─────────────────────────────────────┤
│ Ce mois-ci :                        │
│ • Visites : 1,234                   │
│ • Conversions : 12                  │
│ • Commission : 35,88 $              │
│                                     │
│ Votre lien :                        │
│ idoc.com/?ref=VOTRECODE            │
│                                     │
│ [Matériel marketing] [Statistiques] │
└─────────────────────────────────────┘
```

#### 4.4.2. Widget Embarqué

**Cas d'Usage :**
- Cabinets d'avocats
- Sites de services RH
- Plateformes immobilières

**Exemple d'Intégration :**
```html
<!-- Widget iDoc -->
<script src="https://cdn.idoc.com/widget.js"></script>
<div id="idoc-widget"
     data-template="contrat-bail"
     data-theme="minimal">
</div>
```

**Commission :**
- 10% de commission sur chaque vente via widget
- White-label disponible (Plan Enterprise)

#### 4.4.3. Infrastructure SEO/SEM

**SEO Ultra-Ciblé :**

Créer une page dédiée pour CHAQUE document :

- `idoc.com/contrat-de-bail-residentiel`
- `idoc.com/lettre-de-motivation-emploi`
- `idoc.com/contrat-de-location-vehicule`

**Structure de Page SEO :**
```
┌─────────────────────────────────────┐
│ H1: Contrat de Bail Résidentiel    │
│                                     │
│ [Formulaire de génération]          │
│                                     │
│ H2: Pourquoi utiliser ce modèle ?  │
│ • Conforme aux lois du Québec       │
│ • Format professionnel              │
│ • Prêt en 5 minutes                 │
│                                     │
│ H2: FAQ                             │
│ • Qu'est-ce qu'un bail résidentiel ?│
│ • Durée typique d'un bail ?         │
│ ...                                 │
│                                     │
│ H2: Modèles similaires              │
│ • État des lieux                    │
│ • Quittance de loyer                │
└─────────────────────────────────────┘
```

**Mots-clés Ciblés :**
- Longue traîne : "contrat de bail Québec pdf gratuit"
- Intention d'achat : "générer contrat de bail"
- Local : "bail résidentiel Montréal"

**SEM (Google Ads) :**
- Budget initial : 500 $/mois
- Ciblage : Mots-clés haute intention
- Landing pages dédiées
- A/B testing agressif

#### 4.4.4. Preuve Sociale en Temps Réel

**Widget de Notifications :**
```
┌──────────────────────────────┐
│ 🔔 Jean de Montréal vient de│
│    générer un Contrat CDI    │
│    il y a 3 minutes          │
└──────────────────────────────┘

Apparaît en bas à gauche, disparaît après 5 secondes
Rotation toutes les 20 secondes
```

**Compteur de Documents Générés :**
```
🎉 15,234 documents générés ce mois-ci
```

---

### 4.5. KPI Globaux à Suivre

#### Conversion Instantanée
- **Taux de conversion invité → achat (1,99 $)** : > 8%
- **Revenu moyen par visiteur (RPV)** : > 0,15 $
- **Taux d'abandon panier** : < 30%

#### Passage Standard → Pro
- **Taux de conversion Standard → Pro** : > 12%
- **Déclencheurs les plus efficaces** : Identifier top 3
- **Taux d'essai → abonnement** : > 60%

#### B2B via API
- **Leads qualifiés/mois** : > 20
- **Taux de conversion Sandbox → Payant** : > 15%
- **Revenus API mensuels** : > 5000 $ en 12 mois

#### Rétention & Réachat
- **Taux de rétention mensuelle (Pro)** : > 85%
- **Taux de churn** : < 5% par mois
- **LTV moyenne** : > 120 $
- **Taux de réachat (Standard)** : > 25%

#### Croissance
- **MRR (Monthly Recurring Revenue)** : +15% par mois
- **CAC (Customer Acquisition Cost)** : < 15 $
- **Ratio LTV/CAC** : > 3:1
- **NPS (Net Promoter Score)** : > 50

---

<a name="architecture"></a>
## 🏗️ Architecture Technique

### Stack Technologique

**Frontend :**
- React 18 + TypeScript
- Vite (build tool)
- Tailwind CSS
- React Query (data fetching)
- Zustand (state management)

**Backend :**
- Supabase (PostgreSQL + Auth + Storage)
- Edge Functions (Deno)

**Paiements :**
- Stripe (Standard + Pro)
- Webhooks pour gestion abonnements

**PDF Generation :**
- jsPDF (client-side pour prévisualisation)
- Puppeteer (server-side via Edge Function pour PDF haute qualité)

**Email :**
- Resend ou SendGrid

**CDN & Hosting :**
- Vercel ou Netlify (frontend)
- Supabase Storage (PDFs)

### Schéma de Base de Données (Nouvelles Tables)

```sql
-- Phase 0: Profils enrichis (déjà couvert dans migrations)

-- Phase 1: DocPilot
CREATE TABLE document_views (...);
CREATE TABLE recommendation_rules (...);

-- Phase 1: DocVault
CREATE TABLE document_folders (...);

-- Phase 2: SignFlow
CREATE TABLE signature_workflows (...);
CREATE TABLE workflow_signers (...);

-- Phase 2: DocHistory
CREATE TABLE document_versions (...);

-- Phase 3: API
CREATE TABLE api_keys (...);
CREATE TABLE api_logs (...);

-- Phase 3: RegulaSmart
CREATE TABLE jurisdictions (...);
CREATE TABLE legal_rules (...);

-- Phase 3: BulkSend
CREATE TABLE bulk_campaigns (...);
CREATE TABLE bulk_sends (...);

-- Phase 4: Abonnements
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_customer_id TEXT UNIQUE,
  stripe_subscription_id TEXT UNIQUE,
  plan TEXT NOT NULL, -- 'pro', 'enterprise'
  status TEXT NOT NULL, -- 'active', 'canceled', 'past_due'
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  cancel_at_period_end BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Phase 4: Transactions
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  stripe_payment_intent_id TEXT,
  amount_cents INTEGER NOT NULL,
  currency TEXT DEFAULT 'CAD',
  type TEXT NOT NULL, -- 'document', 'subscription'
  document_id UUID REFERENCES user_documents(id),
  status TEXT NOT NULL, -- 'pending', 'succeeded', 'failed'
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Phase 4: Affiliation
CREATE TABLE affiliates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  referral_code TEXT UNIQUE NOT NULL,
  commission_rate DECIMAL DEFAULT 0.30,
  total_earnings_cents INTEGER DEFAULT 0,
  total_referrals INTEGER DEFAULT 0,
  payout_email TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE referrals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  affiliate_id UUID REFERENCES affiliates(id),
  referred_user_id UUID REFERENCES auth.users(id),
  transaction_id UUID REFERENCES transactions(id),
  commission_cents INTEGER,
  status TEXT DEFAULT 'pending', -- pending, paid
  created_at TIMESTAMPTZ DEFAULT now()
);
```

---

<a name="roadmap"></a>
## 📅 Roadmap d'Implémentation

### Sprint 1-2 (Semaines 1-4) : Phase 0 - Fondation
- [ ] Intégrer Montserrat + Roboto (auto-hébergé)
- [ ] Migration DB : Profils enrichis
- [ ] Page "Mon Profil" dans dashboard
- [ ] Tests et validation

### Sprint 3-5 (Semaines 5-10) : Phase 1 - Efficacité
- [ ] DocPilot V2 : Tracking + Recommandations
- [ ] SmartFill : Mapping profil → templates
- [ ] CompliancE-Check : Validation formulaires
- [ ] DocVault : Dossiers et organisation
- [ ] Tests utilisateurs + ajustements

### Sprint 6-8 (Semaines 11-16) : Phase 2 - Sécurité
- [ ] SignFlow : Workflow multi-signatures
- [ ] ProofStamp : Horodatage qualifié
- [ ] DocHistory : Versions et restauration
- [ ] Tests de charge

### Sprint 9-11 (Semaines 17-22) : Phase 3 - B2B
- [ ] iDoc Connect API : Endpoints + Auth
- [ ] Portail Développeur + Documentation Swagger
- [ ] RegulaSmart : Juridictions + Clauses
- [ ] BulkSend : Import CSV + Envoi masse
- [ ] Sandbox + Tests bêta clients

### Sprint 12-14 (Semaines 23-28) : Phase 4 - Monétisation
- [ ] Intégration Stripe : Paiement unique + Abonnements
- [ ] Flux invité optimisé (1,99 $)
- [ ] Page d'abonnement Pro (9,99 $/mois)
- [ ] Déclencheurs d'upsell
- [ ] Programme d'affiliation
- [ ] Pages SEO dédiées (top 20 templates)
- [ ] Widget preuve sociale
- [ ] Campagne Google Ads initiale
- [ ] Tests A/B conversion

### Sprint 15+ (Post-lancement) : Croissance
- [ ] Optimisation continue (A/B tests)
- [ ] Expansion SEO (100+ pages)
- [ ] Partenariats B2B
- [ ] Internationalisation (US, Europe)
- [ ] Nouvelles fonctionnalités basées sur feedback

---

## 📊 Résumé Exécutif

Ce PRD décrit l'évolution d'iDoc vers une **plateforme complète de génération documentaire** avec :

- ✅ **Phase 0** : UX premium et profils enrichis
- ✅ **Phase 1** : Efficacité utilisateur (+60% temps gagné)
- ✅ **Phase 2** : Sécurité et conformité légale
- ✅ **Phase 3** : Outils B2B et automatisation
- ✅ **Phase 4** : Monétisation multi-canal (B2C + B2B)

**Objectifs à 12 mois :**
- 🎯 50,000 utilisateurs inscrits
- 🎯 10,000 $/mois en MRR (Pro + API)
- 🎯 100,000 documents générés/mois
- 🎯 ROI marketing > 3:1

**Prochaines Étapes :**
1. Validation du PRD par l'équipe
2. Priorisation des phases (recommandation : 0 → 1 → 4 → 2 → 3)
3. Constitution de l'équipe (1 PM, 2 devs, 1 designer)
4. Kick-off Sprint 1

---

**Document préparé par :** Assistant IA iDoc
**Date de dernière mise à jour :** 2025-11-16
**Version :** 2.0
