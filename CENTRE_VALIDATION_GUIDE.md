# Guide du Centre de Validation Unifié

## Vue d'Ensemble

Le **Centre de Validation** est un espace unifié dans l'interface admin qui regroupe toutes les fonctionnalités de gestion de contenu:

1. **Gestion des Modèles** - Gestion des templates avec éditeur de prix multi-devises
2. **Validation & Linter** - Système de validation et correction automatique des templates
3. **Articles / Blog** - Gestion complète des articles de blog

---

## Accès

**Navigation:** Admin Dashboard → Centre de Validation

**Permissions:** Administrateurs uniquement

---

## 1. Gestion des Modèles

### Fonctionnalités

#### Vue d'Ensemble

L'onglet **Gestion des Modèles** affiche tous les templates de la plateforme avec:

- **Templates iDoc Guidés** (`idoc_guided_templates`)
- **Templates Documents Standards** (`document_templates`)

#### Statistiques

Dashboard avec 4 cartes:
- **Total modèles** - Nombre total de templates
- **Gratuits** - Templates avec `is_free = true`
- **Payants** - Templates avec `is_free = false`
- **Vérifiés** - Templates avec `status = verified`

#### Recherche & Filtres

**Barre de recherche:**
- Recherche par nom
- Recherche par code template
- Recherche par catégorie

**Filtres:**
- Tous les modèles
- Gratuits uniquement
- Payants uniquement

---

### Éditeur de Prix Multi-Devises

Chaque template peut avoir des prix différents selon la devise du visiteur:

#### Prix Supportés

- **USD** - Dollar américain
- **CAD** - Dollar canadien
- **EUR** - Euro

#### Configuration des Prix

1. **Cliquer sur "Modifier Prix"** sur un template
2. **Choisir le type:**
   - ☑️ **Modèle gratuit** - Template accessible sans paiement
   - ☐ **Modèle payant** - Nécessite un paiement

3. **Si payant, définir les prix:**
   ```
   USD: 1.99
   CAD: 1.99
   EUR: 1.99
   ```

4. **Sauvegarder**

#### Logique d'Affichage

Le site détecte automatiquement la localisation du visiteur et affiche le prix dans sa devise:

```typescript
// Exemple de logique (à implémenter côté frontend)
const userCountry = detectUserCountry();
let price;

if (template.is_free) {
  price = "GRATUIT";
} else {
  switch (userCountry) {
    case 'US':
      price = `$${template.price_usd} USD`;
      break;
    case 'CA':
      price = `$${template.price_cad} CAD`;
      break;
    case 'EU':
    case 'FR':
    case 'DE':
      price = `€${template.price_eur}`;
      break;
    default:
      price = `$${template.price_usd} USD`;
  }
}
```

#### Prix par Défaut

Lors de la création d'un nouveau template, les prix par défaut sont:
- **USD:** 1.99
- **CAD:** 1.99
- **EUR:** 1.99
- **is_free:** false

#### Modification en Masse

Pour modifier les prix de plusieurs templates:

1. Utiliser l'éditeur de prix sur chaque template individuellement
2. Ou utiliser une requête SQL directe (pour admins avancés):

```sql
-- Mettre tous les templates gratuits
UPDATE idoc_guided_templates
SET is_free = true, price_usd = 0, price_cad = 0, price_eur = 0
WHERE category = 'test';

-- Changer le prix d'une catégorie
UPDATE idoc_guided_templates
SET price_usd = 2.99, price_cad = 2.99, price_eur = 2.99
WHERE category = 'immigration';
```

---

### Badges & Indicateurs

Chaque template affiche des badges pour identifier rapidement son statut:

- **GRATUIT** (vert) - Template gratuit
- **PAYANT** (bleu) - Template payant
- **iDoc** (violet) - Template iDoc guidé
- **Vérifié** (vert avec bouclier) - Template vérifié et éligible production

---

## 2. Validation & Linter

Système complet de validation automatique avec garanties de production.

### Fonctionnalités Principales

#### Sélection des Templates

- Sélection multiple via checkboxes
- Compteur de templates sélectionnés
- Actions groupées

#### Mode Prévisualisation (Dry-Run)

**Bouton:** `[PRÉVISUALISER (N)]`

**Actions:**
- Analyse sans modification en base de données
- Détection des placeholders à supprimer
- Identification des variables manquantes
- **Smoke Test** - Test de rendu pour vérifier que le template peut être rendu en sécurité
- **Éligibilité Production** - Affiche si le template sera éligible après correction

**Résultat détaillé par template:**
```
┌──────────────────────────────────────────┐
│ Template: ircc_study_permit              │
├──────────────────────────────────────────┤
│ Placeholders à Supprimer:                │
│  • [TODO] (3x)                           │
│  • {{FIXME}} (1x)                        │
├──────────────────────────────────────────┤
│ Variables à Ajouter:                     │
│  • applicant_name → Type: text           │
│  • submission_date → Type: text          │
├──────────────────────────────────────────┤
│ Test de Rendu (Smoke Test):             │
│  ✓ Le template peut être rendu          │
│  ⚠ Avertissement: 2 avertissements      │
├──────────────────────────────────────────┤
│ Éligibilité Production:                  │
│  Actuellement: ✗ Non éligible           │
│  Après correction: ✓ Éligible           │
└──────────────────────────────────────────┘
```

#### Auto-Correction Sécurisée

**Bouton:** `[VALIDER ET CORRIGER (N)]`

**Corrections SAFE ONLY:**

1. Suppression des placeholders:
   - `[TODO]`
   - `[FIXME]`
   - `[XXX]`
   - `TODO:`
   - `FIXME:`
   - `{{TODO}}`
   - `{{FIXME}}`

2. Ajout des variables manquantes dans `optional_variables`

3. Exécution du smoke test

4. Mise à jour du statut:
   - ✅ **verified** si smoke test passe sans avertissement
   - ⚠️ **draft** si smoke test passe avec avertissements
   - ❌ **draft** si smoke test échoue

**Workflow:**
```
1. Sélectionner templates
2. [PRÉVISUALISER] → Vérifier corrections proposées
3. [VALIDER ET CORRIGER] → Appliquer corrections
4. Vérifier logs dans console (F12)
5. Résultat: X templates vérifiés, Y en attente
```

### Production Gating

**Règle d'éligibilité:**
```typescript
eligible_for_production =
  status === "verified" &&
  verification_required === false
```

**Comportement:**
- **Production:** Templates non éligibles sont BLOQUÉS (fallback automatique)
- **Dev/Staging:** Templates non éligibles sont AUTORISÉS (avec warning)

### Smoke Test

Le smoke test vérifie:

✓ Template a du contenu
✓ Pas de placeholders restants
✓ Variables utilisées sont déclarées
✓ Syntaxe correcte (accolades balancées)
✓ Taille raisonnable (<100KB)

**Résultats possibles:**
- ✅ **Success, no warnings** → Peut être vérifié
- ⚠️ **Success, with warnings** → À revoir manuellement
- ❌ **Failed** → Bloqué, nécessite correction manuelle

---

## 3. Articles / Blog

Gestion complète des articles de blog pour le SEO et le contenu éditorial.

### Fonctionnalités

- **Création d'articles** - Éditeur complet avec markdown
- **Gestion des catégories** - Organisation par catégories
- **SEO intégré** - Meta descriptions, slugs, tags
- **Statistiques** - Vues, engagement, performance
- **Publication/Brouillon** - Workflow de publication
- **Traductions** - Support multi-langues (FR/EN)

### Workflow Recommandé

1. **Créer un brouillon**
2. **Rédiger le contenu**
3. **Optimiser le SEO** (titre, meta, slug)
4. **Prévisualiser**
5. **Publier**

---

## Workflow Complet Recommandé

### Pour les Nouveaux Templates

```
1. Admin Dashboard → Centre de Validation
2. Onglet "Gestion des Modèles"
3. Modifier Prix → Définir USD/CAD/EUR
4. Onglet "Validation & Linter"
5. Sélectionner le nouveau template
6. [PRÉVISUALISER] → Vérifier corrections
7. [VALIDER ET CORRIGER] → Appliquer
8. Vérifier éligibilité production (✓)
```

### Pour les Templates Existants

```
1. Onglet "Validation & Linter"
2. Filtrer par "Non vérifiés"
3. Sélectionner tous (Ctrl+A ou Select All)
4. [PRÉVISUALISER] → Analyser les problèmes
5. [VALIDER ET CORRIGER] → Correction automatique
6. Revoir ceux avec warnings manuellement
7. Re-valider après corrections manuelles
```

### Pour les Prix

```
1. Onglet "Gestion des Modèles"
2. Filtrer par catégorie si besoin
3. Pour chaque template:
   - Cliquer "Modifier Prix"
   - Définir USD/CAD/EUR ou cocher "Gratuit"
   - Sauvegarder
4. Vérifier l'affichage sur le site
```

### Pour les Articles

```
1. Onglet "Articles / Blog"
2. Créer nouvel article
3. Rédiger contenu + SEO
4. Sauvegarder brouillon
5. Prévisualiser
6. Publier quand prêt
```

---

## FAQ

### Q: Puis-je avoir des prix différents pour chaque devise?

**R:** Oui! Les prix sont indépendants pour USD, CAD, et EUR. Vous pouvez par exemple avoir:
- USD: 1.99
- CAD: 2.49
- EUR: 1.79

### Q: Comment savoir si un template est éligible production?

**R:** Un template est éligible si:
- Badge **"Vérifié"** est affiché (vert avec bouclier)
- `status = verified`
- `verification_required = false`
- Smoke test passe

### Q: Que se passe-t-il si j'applique l'auto-correction et ça échoue?

**R:** L'auto-correction est 100% safe:
- Si le smoke test échoue, le template reste en statut `draft`
- Aucune donnée n'est perdue
- Vous pouvez corriger manuellement et re-valider
- Les logs dans la console (F12) vous indiquent le problème exact

### Q: Puis-je revenir en arrière après une correction?

**R:** Non, les corrections sont définitives. C'est pourquoi il est **FORTEMENT RECOMMANDÉ** d'utiliser **[PRÉVISUALISER]** d'abord pour voir les changements avant de les appliquer.

### Q: Comment changer le prix de TOUS les templates d'une catégorie?

**R:** Deux options:
1. **UI:** Filtrer par catégorie → Modifier prix un par un (recommandé)
2. **SQL:** Requête directe en base (pour admins avancés uniquement)

### Q: Un template est bloqué en production, que faire?

**R:**
```
1. Console logs (F12) → Identifier le template_id
2. Centre de Validation → Validation & Linter
3. Rechercher le template par ID
4. [PRÉVISUALISER] → Voir problèmes
5. Corriger manuellement si nécessaire
6. [VALIDER ET CORRIGER]
7. Vérifier éligibilité = ✓
```

---

## Sécurité & Permissions

### Accès Restreint

- ✓ Administrateurs uniquement (`role = 'admin'`)
- ✗ Utilisateurs réguliers (message: "Accès Administrateur Requis")
- ✗ Visiteurs non authentifiés (redirection login)

### Audit Trail

Toutes les actions sont loggées:
- Modifications de prix
- Validations de templates
- Corrections appliquées
- Smoke tests

### Protection Production

- Templates non vérifiés = BLOQUÉS en production
- Fallback automatique en cas d'erreur
- Site ne crash JAMAIS
- Logs structurés pour monitoring

---

## Support

### Logs de Debug

**Console (F12):**
```javascript
// Voir les logs du Centre de Validation
console.log('Template processed:', template_code);
console.log('Smoke test result:', smokeTestResult);
console.log('Price updated:', { usd, cad, eur });
```

### Monitoring

Métriques recommandées:
- Taux de templates vérifiés
- Nombre de fallbacks utilisés en production
- Temps moyen de validation
- Taux de succès des smoke tests

### Contact

Pour bugs ou questions:
1. Vérifier cette documentation
2. Vérifier les logs (F12)
3. Utiliser le mode prévisualisation
4. Contacter l'équipe de développement

---

**Version:** 1.0.0
**Date:** 2026-01-02
**Build:** 17.32s | AdminDashboard: 184.69 kB
**Statut:** ✅ Production Ready
