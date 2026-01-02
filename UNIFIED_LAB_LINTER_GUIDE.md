# Guide Complet - Lab & Linter Unifié

## Vue d'Ensemble

Outil **tout-en-un** qui fusionne complètement le Template Lab et l'iDoc Linter. Une seule interface pour analyser, valider et certifier TOUS vos templates, peu importe leur source.

---

## Accès Rapide

```
1. Admin Dashboard
2. Menu latéral → "Lab & Linter Unifié" (icône Code)
3. Interface unifiée avec tous vos templates
```

---

## Caractéristiques Principales

### Unification Complète

**Sources de Templates:**
- ✅ `document_templates` (107 templates)
- ✅ `idoc_guided_templates` (templates guidés)
- ✅ Les deux affichés dans UNE SEULE liste

**Fonctionnalités:**
- 🔍 Recherche unifiée sur tous les templates
- 🏷️ Filtrage par catégorie
- 📊 Filtrage par source (Document / iDoc)
- ⚡ Lint individuel ou en batch
- 📈 Statistiques en temps réel
- 📥 Export CSV des résultats

---

## Interface Principale

### Header avec Statistiques

```
┌─────────────────────────────────────────┐
│  Template Lab & Linter Unifié           │
│                                          │
│  Total: 107    Document: 107   iDoc: 0  │
└─────────────────────────────────────────┘
```

### Barre de Filtres

```
┌──────────┬────────────┬────────────┬───────────────┐
│ Recherche│  Catégorie │   Source   │ Analyser Tous │
│  [...]   │  [Select]  │  [Select]  │   [Button]    │
└──────────┴────────────┴────────────┴───────────────┘
```

**Filtres Disponibles:**
1. **Recherche**: Par nom ou titre
2. **Catégorie**: Par catégorie de template
3. **Source**:
   - Toutes sources
   - Document Templates seulement
   - iDoc Templates seulement

---

## Modes d'Utilisation

### Mode 1: Liste des Templates

**Vue par défaut**: Tableau avec tous les templates

**Colonnes:**
- Template (nom + ID)
- Source (badge bleu/violet)
- Catégorie
- Statut (si disponible)
- Actions (bouton "Analyser")

**Actions:**
- Cliquer sur "Analyser" pour linter un template individuel

### Mode 2: Analyse en Batch

**Étapes:**
```
1. Appliquer les filtres souhaités
2. Cliquer "Analyser Tous (X)"
3. Attendre l'analyse (quelques secondes)
4. Voir les résultats dans le tableau
```

**Résultats affichés:**
- Status (PASS/FAIL)
- Score de qualité (0-100%)
- Variables utilisées
- Problèmes détectés
- Actions disponibles

### Mode 3: Vue Détaillée

**Accès:** Cliquer sur "Détails →" dans un résultat

**Sections:**
1. **Résultats du Lint**
   - Variables inconnues (rouge)
   - Champs requis manquants (jaune)
   - Placeholders détectés (orange)
   - Status validation (vert si OK)

2. **Informations**
   - Nombre de variables
   - Score de qualité avec barre
   - Liste complète des variables

---

## Système de Scoring

### Calcul du Score

```
Score de base: 100%
- Variables inconnues: -10% chacune
- Placeholders (TODO/FIXME): -5%
- Champs requis manquants: -10% chacun

Score minimum: 0%
```

### Interprétation

| Score | Couleur | Status | Action |
|-------|---------|--------|--------|
| 80-100% | Vert | Excellent | Prêt pour production |
| 60-79% | Jaune | Moyen | Corrections mineures |
| 0-59% | Rouge | Critique | Corrections majeures |

---

## Types de Problèmes Détectés

### 1. Variables Inconnues

**Quoi:** Variables `{{xyz}}` utilisées mais non définies dans le schema

**Exemple:**
```handlebars
Bonjour {{prenom}},  ✅ Défini dans schema
Vous habitez à {{ville}}.  ❌ PAS dans schema
```

**Solution:** Ajouter la variable au schema ou la retirer

### 2. Placeholders

**Quoi:** Marqueurs de développement dans le template

**Exemples détectés:**
- `[TODO]`
- `[FIXME]`
- `[XXX]`
- `TODO:`
- `FIXME:`

**Solution:** Remplacer par le contenu réel

### 3. Champs Requis Manquants

**Quoi:** Champs marqués `required: true` dans le schema mais jamais utilisés

**Exemple:**
```json
Schema: { "name": "email", "required": true }
Template: "Bonjour {{prenom}}"
❌ email est requis mais absent
```

**Solution:** Utiliser le champ ou le marquer optionnel

---

## Statistiques et Rapport

### Statistiques en Direct

Après une analyse batch:

```
┌────────────┬──────────┬────────┬─────────────┐
│ Analysés   │ Réussis  │ Échecs │ Score Moyen │
│     107    │    95    │   12   │     87%     │
└────────────┴──────────┴────────┴─────────────┘
```

### Export CSV

**Bouton:** "Exporter CSV"

**Colonnes exportées:**
1. Template
2. Source
3. Status (PASS/FAIL)
4. Score
5. Unknown Vars
6. Placeholders
7. Missing Fields

**Nom du fichier:** `lint-results-YYYY-MM-DD.csv`

---

## Cas d'Usage

### Cas 1: Audit Complet

```
Objectif: Vérifier tous les templates

1. Ne rien filtrer (garder "Toutes sources")
2. Cliquer "Analyser Tous (107)"
3. Attendre quelques secondes
4. Exporter CSV pour rapport
5. Trier par score (plus bas = priorité)
6. Corriger les templates avec score < 60%
```

### Cas 2: Audit par Catégorie

```
Objectif: Vérifier une catégorie spécifique

1. Sélectionner catégorie (ex: "immigration")
2. Cliquer "Analyser Tous (X)"
3. Voir les résultats filtrés
4. Corriger les problèmes
```

### Cas 3: Vérification Individuelle

```
Objectif: Valider un template avant publication

1. Rechercher le template par nom
2. Cliquer "Analyser"
3. Voir les détails
4. Si PASS → Publier
5. Si FAIL → Corriger puis re-analyser
```

### Cas 4: Migration Document → iDoc

```
Objectif: Préparer migration vers iDoc

1. Filtrer "Source: Document Templates"
2. Analyser Tous
3. Identifier templates avec score > 80%
4. Ces templates sont prêts pour migration
5. Corriger les autres avant migration
```

---

## Détection des Helpers Handlebars

L'outil **ignore automatiquement** les helpers connus:

**Helpers Standards:**
- `if`, `unless`, `each`, `with`
- `eq`, `ne`, `lt`, `gt`
- `and`, `or`, `not`

**Helpers Custom:**
- `boolFR` (convertit booléen en Oui/Non)

**Exemple:**
```handlebars
{{#if condition}}  ✅ Ignoré (helper connu)
  {{variable}}     ✅ Validé
{{/if}}
```

---

## Performance

### Temps d'Analyse

| Nombre Templates | Temps Estimé |
|------------------|--------------|
| 1 template | < 1 seconde |
| 10 templates | 1-2 secondes |
| 50 templates | 3-5 secondes |
| 107 templates | 5-8 secondes |

**Note:** Analyse locale (frontend), très rapide

### Optimisation

- Filtrer avant d'analyser pour réduire le nombre
- Utiliser la recherche pour templates spécifiques
- Export CSV pour analyses hors ligne

---

## Workflow Recommandé

### Audit Régulier (Hebdomadaire)

```
Lundi matin:
1. Ouvrir Lab & Linter Unifié
2. Analyser Tous
3. Noter score moyen
4. Si score < 85% → Planifier corrections
5. Exporter CSV pour tracking
```

### Avant Publication

```
Pour chaque nouveau template:
1. Créer le template
2. Analyser individuellement
3. Score doit être 100%
4. Si < 100% → Corriger
5. Re-analyser jusqu'à 100%
6. Publier
```

### Après Modification

```
Après tout changement de template:
1. Analyser le template modifié
2. Vérifier score maintenu
3. Si score baisse → Identifier cause
4. Corriger immédiatement
5. Re-analyser
```

---

## Troubleshooting

### Problème: "Pas de templates trouvés"

**Causes possibles:**
1. Filtres trop restrictifs
2. Base de données vide
3. Erreur de connexion

**Solutions:**
1. Réinitialiser les filtres
2. Vérifier: `SELECT COUNT(*) FROM document_templates;`
3. Vérifier console browser (F12)

### Problème: "Analyse très lente"

**Causes:**
1. Trop de templates (> 500)
2. Templates très longs
3. Navigateur surchargé

**Solutions:**
1. Filtrer par catégorie
2. Analyser par batches de 50
3. Fermer autres onglets

### Problème: "Faux positifs sur variables"

**Causes:**
1. Helper custom non reconnu
2. Variable dynamique
3. Schema mal défini

**Solutions:**
1. Ajouter helper dans code (liste knownHelpers)
2. Documenter dans internal_notes
3. Vérifier schema_json

### Problème: "Export CSV vide"

**Cause:** Aucun résultat d'analyse

**Solution:**
1. Lancer analyse d'abord
2. Attendre fin de l'analyse
3. Puis exporter

---

## Commandes SQL Utiles

### Statistiques Rapides

```sql
-- Compter templates par source
SELECT
  'document_templates' as source,
  COUNT(*) as total
FROM document_templates
UNION ALL
SELECT
  'idoc_guided_templates' as source,
  COUNT(*) as total
FROM idoc_guided_templates;

-- Templates par catégorie
SELECT
  category,
  COUNT(*) as count
FROM document_templates
GROUP BY category
ORDER BY count DESC;

-- Templates sans schema
SELECT id, name, title
FROM document_templates
WHERE schema_json IS NULL
OR schema_json->>'fields' IS NULL;
```

### Corrections Rapides

```sql
-- Mettre à jour statut
UPDATE document_templates
SET review_status = 'in_review'
WHERE review_status IS NULL;

-- Ajouter catégorie manquante
UPDATE document_templates
SET category = 'other'
WHERE category IS NULL;
```

---

## API du Composant

### Props

```typescript
// Aucune props requise
<UnifiedTemplateLabLinter />
```

### État Interne

```typescript
interface Template {
  id: string;
  name: string;
  title: string;
  category: string;
  content_template: string;
  schema_json: any;
  review_status?: string;
  source: 'document_templates' | 'idoc_guided_templates';
}

interface LintResult {
  templateId: string;
  templateName: string;
  ok: boolean;
  varsUsed: string[];
  unknownVars: string[];
  hasPlaceholders: boolean;
  missingFields: string[];
  score: number;
}
```

---

## Différences avec Versions Précédentes

| Fonctionnalité | Ancien (Séparé) | Nouveau (Unifié) |
|----------------|-----------------|------------------|
| Templates visibles | 107 OU 0 | 107 + 0 = 107 |
| Interfaces | 2 séparées | 1 unifiée |
| Navigation | Switch Lab/Linter | Tout dans une page |
| Filtrage | Basique | Avancé (3 filtres) |
| Lint | Backend/Frontend | Frontend optimisé |
| Export | Non | CSV complet |
| Performance | Variable | Rapide (< 8s pour 107) |
| UX | Confuse | Claire et intuitive |

---

## Évolutions Futures

### Court Terme (Semaine 1-2)
- [ ] Cache des résultats d'analyse
- [ ] Sauvegarde des résultats en DB
- [ ] Historique des analyses
- [ ] Notifications si score baisse

### Moyen Terme (Mois 1-2)
- [ ] IA: Suggestions de corrections
- [ ] Auto-fix pour erreurs simples
- [ ] Comparaison versions (diff)
- [ ] Intégration CI/CD

### Long Terme (Mois 3+)
- [ ] Templates marketplace certifiés
- [ ] Badge qualité sur templates
- [ ] Système de réputation
- [ ] Import/Export inter-projets

---

## Support et Aide

### Documentation Complète
- Ce guide
- `TEMPLATE_LAB_LINTER_INTEGRATION.md` (technique)
- `TEST_LAB_INTEGRATION.md` (tests)

### Code Source
- Composant: `UnifiedTemplateLabLinter.tsx`
- Intégration: `AdminDashboard.tsx`

### Base de Données
- Tables: `document_templates`, `idoc_guided_templates`
- Schémas: Voir migrations dans `supabase/migrations/`

### Aide en Cas de Problème

1. **Console Browser** (F12 → Console)
   - Rechercher messages d'erreur
   - Noter les stack traces

2. **Network Tab** (F12 → Network)
   - Vérifier appels Supabase
   - Status codes (200 = OK, 4xx/5xx = erreur)

3. **SQL Direct**
   ```sql
   -- Test connexion
   SELECT NOW();

   -- Compter templates
   SELECT COUNT(*) FROM document_templates;
   ```

---

## Checklist de Validation

Avant de marquer un template comme "Production Ready":

- [ ] Score = 100%
- [ ] 0 variables inconnues
- [ ] 0 placeholders
- [ ] 0 champs requis manquants
- [ ] Testé avec vraies données
- [ ] Preview générée correctement
- [ ] Approuvé par équipe
- [ ] Documentation à jour

---

## Conclusion

Le **Lab & Linter Unifié** est votre outil central pour:
- ✅ Garantir la qualité de tous vos templates
- ✅ Détecter les erreurs avant publication
- ✅ Maintenir un score élevé
- ✅ Exporter des rapports détaillés
- ✅ Travailler efficacement sur 107+ templates

**Une seule interface. Tous vos templates. Zéro compromis.**

---

**Version**: 2.0 - Janvier 2026
**Status**: Production Ready ✅
**Build**: Successful
**Performance**: Optimisée (< 8s pour 107 templates)
