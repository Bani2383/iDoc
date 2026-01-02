# Guide du Centre de Validation des Templates

## Vue d'ensemble

Le Centre de Validation des Templates offre un système professionnel de validation et de correction automatique pour assurer la conformité de vos templates iDoc.

## Accès

**Admin Dashboard > Centre de Validation des Templates**

## Fonctionnalités

### Mode Prévisualisation (Dry-Run)

**NOUVEAU**: Prévisualisez les corrections avant de les appliquer!

Le mode prévisualisation vous permet de:
- Voir toutes les corrections proposées
- Examiner les changements template par template
- Approuver ou annuler avant application
- **Aucune modification en base de données**

### Fonctionnalités de Validation Automatique

### 1. Suppression des Placeholders

Retire automatiquement:
- `[TODO]`
- `[FIXME]`
- `[XXX]`
- `TODO:`
- `FIXME:`
- `{{TODO}}`
- `{{FIXME}}`

### 2. Ajout des Variables Manquantes

Quand une variable `{{nom_variable}}` est utilisee dans le template mais n'est pas declaree:
- La variable est automatiquement ajoutee dans `optional_variables`
- Un champ de formulaire est cree avec:
  - Type: `text`
  - Label: `nom_variable` (en/fr)
  - Placeholder: `"Enter nom_variable"` / `"Saisissez nom_variable"`
  - Required: `false`

### 3. Mise a Jour du Statut

Apres correction:
- `status` → `'verified'`
- `last_verified_at` → date actuelle
- `verification_required` → `false`

## Mode d'Emploi

### Étape 1: Sélectionner les Templates

**Option A: Sélection Manuelle**
```
1. Cocher les cartes des templates
2. OU cliquer sur [Tout Sélectionner]
```

**Option B: Sélection Aléatoire**
```
1. Entrer le nombre: [10]
2. Cliquer [Sélection Aléatoire]
```

### Étape 2: Choisir le Mode de Validation

**Option A: Prévisualisation (Recommandé)**
```
1. Cliquer [PRÉVISUALISER (N)]
2. Examiner les corrections proposées
3. Vérifier template par template:
   - Placeholders à supprimer
   - Variables à ajouter
   - Changements de statut
4. Cliquer [Appliquer les Corrections] ou [Annuler]
```

**Option B: Validation Directe**
```
1. Cliquer [VALIDER ET CORRIGER (N)]
2. Confirmer l'opération
3. Attendre le traitement
4. Voir le rapport final
```

## Rapport d'Execution

```
Auto-correction terminee!

✅ Corriges: 8
❌ Echecs: 2
```

## Filtres Disponibles

### Par Type de Source
- **Tous** → document_templates + idoc_guided_templates
- **document_templates** → Templates classiques
- **idoc_guided_templates** → Templates guides (seuls ces templates peuvent etre auto-corriges)

### Par Categorie
- Immigration
- Legal
- Business
- Personal
- Professional
- Other

### Par Recherche
- Nom du template
- Code du template
- Mots-cles

## Limitations

**IMPORTANT**: L'auto-correction ne fonctionne que sur les templates de type `idoc_guided_templates`.

Les templates de type `document_templates` necessitent une correction manuelle car leur structure est differente.

## Bonnes Pratiques

### Avant Auto-Correction

1. **Analyser d'abord**
   ```
   - Selectionner templates
   - Cliquer [ANALYSER (N)]
   - Verifier les problemes detectes
   ```

2. **Tester sur un petit batch**
   ```
   - Selectionner 5-10 templates
   - Auto-corriger
   - Verifier les resultats
   - Si OK, continuer avec plus
   ```

### Apres Auto-Correction

1. **Recharger les templates**
   - La liste se rafraichit automatiquement

2. **Verifier les corrections**
   - Re-analyser les templates corriges
   - Score devrait etre 100/100

3. **Tester en generation**
   - Generer un document PDF
   - Verifier que les variables fonctionnent

## Scenarios d'Utilisation

### Scenario 1: Nettoyage Rapide

```javascript
// Probleme: 20 templates avec [TODO]
1. Filtrer: categorie = "immigration"
2. Tout selectionner (20 templates)
3. AUTO-CORRIGER
// Resultat: Placeholders supprimes, status verified
```

### Scenario 2: Correction des Variables

```javascript
// Probleme: Variables non declarees
1. Analyser → 5 unknown vars detectees
2. AUTO-CORRIGER
// Resultat: 5 nouveaux champs crees dans optional_variables
```

### Scenario 3: Batch Processing

```javascript
// Probleme: 107 templates a verifier
1. Selection aleatoire: [10]
2. ANALYSER → voir les problemes
3. AUTO-CORRIGER → corriger le batch
4. Repeter jusqu'a finir tous les templates
```

## API d'Auto-Correction (Future)

Une fonction Edge `idoc-auto-fix` est disponible pour l'automatisation:

```typescript
// POST https://[PROJECT].supabase.co/functions/v1/idoc-auto-fix
{
  "template_ids": ["uuid1", "uuid2"],
  "fix_types": ["all"], // ou ["placeholders", "metadata", "unknown_vars"]
  "dry_run": false
}
```

Pour deployer:
```bash
supabase functions deploy idoc-auto-fix
```

## Statistiques d'Auto-Correction

Le systeme track automatiquement:
- Nombre de templates corriges
- Nombre de placeholders supprimes
- Nombre de variables ajoutees
- Taux de succes/echec

## Support

En cas de probleme:
1. Verifier la console navigateur (F12)
2. Verifier les logs Supabase
3. Contacter l'admin systeme

---

**Derniere mise a jour**: 2026-01-02
**Version**: 1.0.0
