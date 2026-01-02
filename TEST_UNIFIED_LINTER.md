# Test Rapide - Lab & Linter Unifié

## Test en 3 Minutes

### Étape 1: Accès (30 secondes)

```
1. Ouvrir Admin Dashboard
2. Menu latéral → Cliquer "Lab & Linter Unifié"
3. Vérifier que l'interface charge
```

**Attendu:**
- ✅ Header bleu/violet avec titre
- ✅ 3 statistiques affichées (Total: 107, Document: 107, iDoc: 0)
- ✅ Barre de filtres visible
- ✅ Tableau avec liste de templates

---

### Étape 2: Analyse Individuelle (1 minute)

```
1. Dans le tableau, trouver un template
2. Cliquer sur "Analyser" (dernière colonne)
3. Attendre 1 seconde
```

**Attendu:**
- ✅ Tableau se transforme en résultats
- ✅ Une ligne avec le template analysé
- ✅ Status: PASS ou FAIL
- ✅ Score affiché avec barre de progression
- ✅ Problèmes listés (ou "Aucun")

---

### Étape 3: Vue Détaillée (1 minute)

```
1. Cliquer sur "Détails →" dans le résultat
2. Voir la vue détaillée
```

**Attendu:**
- ✅ 2 colonnes: "Résultats du Lint" et "Informations"
- ✅ Liste des variables utilisées
- ✅ Score avec barre
- ✅ Badge vert (PASS) ou rouge (FAIL)
- ✅ Bouton "← Retour à la liste"

---

### Étape 4: Analyse Batch (30 secondes)

```
1. Cliquer "← Retour à la liste"
2. En haut, cliquer "Analyser Tous (107)"
3. Attendre 5-8 secondes
```

**Attendu:**
- ✅ Loader "Analyse en cours..."
- ✅ Après quelques secondes, tableau rempli avec résultats
- ✅ Toutes les lignes ont un status
- ✅ Statistiques affichées en haut:
  - Analysés: 107
  - Réussis: X
  - Échecs: Y
  - Score Moyen: Z%

---

## Tests Fonctionnels Détaillés

### Test A: Filtrage par Recherche

```
Action:
1. Dans "Rechercher un template", taper "immigration"
2. Observer le tableau

Attendu:
- Tableau filtré
- Seuls les templates avec "immigration" dans le nom/titre
- Compteur "Analyser Tous (X)" mis à jour
```

---

### Test B: Filtrage par Catégorie

```
Action:
1. Sélectionner une catégorie dans le dropdown
2. Observer le tableau

Attendu:
- Tableau filtré par catégorie
- Compteur mis à jour
- Templates affichés correspondent à la catégorie
```

---

### Test C: Filtrage par Source

```
Action:
1. Sélectionner "Document Templates"
2. Vérifier le tableau

Attendu:
- Tous les badges "Source" sont bleus (Doc)
- Compteur = 107
- Stats en haut: "Document: 107"

Action:
2. Sélectionner "iDoc Templates"

Attendu:
- Tableau vide (normal, 0 templates iDoc)
- Message ou tableau vide
```

---

### Test D: Export CSV

```
Action:
1. Analyser quelques templates (ou tous)
2. Cliquer "Exporter CSV"
3. Vérifier le fichier téléchargé

Attendu:
- Fichier CSV téléchargé
- Nom: lint-results-2026-01-XX.csv
- Colonnes: Template, Source, Status, Score, Unknown Vars, Placeholders, Missing Fields
- Données correspondant aux résultats
```

---

### Test E: Badges Source

```
Action:
1. Observer la colonne "Source" dans le tableau

Attendu:
- Badges bleus avec "Doc" pour document_templates
- Badges violets avec "iDoc" pour idoc_guided_templates
- Visuellement distincts
```

---

### Test F: Score de Qualité

```
Action:
1. Analyser plusieurs templates
2. Observer les scores dans la colonne "Score"

Attendu:
- Barre de progression horizontale
- Couleur verte si score >= 80%
- Couleur jaune si score 60-79%
- Couleur rouge si score < 60%
- Pourcentage affiché à droite
```

---

### Test G: Types de Problèmes

```
Action:
1. Analyser un template avec erreurs
2. Colonne "Problèmes", observer les badges

Attendu:
- Badge rouge "X var inconnues" si variables inconnues
- Badge orange "Placeholders" si TODO/FIXME détectés
- Badge jaune "X champs manquants" si champs requis absents
- Texte vert "Aucun" si template parfait
```

---

### Test H: Réinitialisation Filtres

```
Action:
1. Appliquer plusieurs filtres
2. Cliquer "Analyser Tous"
3. Retour à la liste
4. Réinitialiser les filtres

Attendu:
- Filtres se réinitialisent facilement
- Compteur revient à total (107)
- Liste complète réapparaît
```

---

## Tests de Performance

### Test Perf 1: Temps de Chargement Initial

```
Action:
1. Ouvrir Lab & Linter Unifié
2. Chronométrer jusqu'à affichage tableau

Attendu:
- < 2 secondes pour charger
- Pas d'erreurs console
- Pas de freeze
```

---

### Test Perf 2: Temps d'Analyse Batch

```
Action:
1. Cliquer "Analyser Tous (107)"
2. Chronométrer

Attendu:
- < 10 secondes pour 107 templates
- UI responsive pendant l'analyse
- Loader visible
```

---

### Test Perf 3: Temps d'Analyse Individuelle

```
Action:
1. Cliquer "Analyser" sur un template
2. Chronométrer

Attendu:
- < 1 seconde
- Instantané visuellement
```

---

## Tests d'Erreur

### Test Erreur 1: Connexion Perdue

```
Setup:
1. Ouvrir DevTools
2. Onglet Network → Offline
3. Rafraîchir la page

Attendu:
- Message d'erreur ou loader infini
- Pas de crash
- Console montre erreur réseau
```

---

### Test Erreur 2: Template Sans Schema

```
Action:
1. Analyser un template où schema_json est null

Attendu:
- Analyse fonctionne quand même
- 0 variables dans schema
- Possiblement variables "inconnues" détectées
- Pas de crash
```

---

### Test Erreur 3: Template Sans Content

```
Action:
1. Analyser un template où content_template est vide

Attendu:
- Score: 100% (rien à valider)
- 0 variables utilisées
- Status: PASS
- Pas d'erreur
```

---

## Tests de Régression

### Vérifier que rien n'est cassé ailleurs

```
1. Dashboard → Fonctionne
2. Modèles → Fonctionne
3. Utilisateurs → Fonctionne
4. Articles → Fonctionne
5. Autres onglets → Fonctionnent
```

**Attendu:** Tous les autres onglets admin restent fonctionnels

---

## Checklist Complète

### Interface
- [ ] Header avec titre visible
- [ ] Statistiques affichées (Total, Document, iDoc)
- [ ] Barre de filtres présente
- [ ] Tableau avec colonnes correctes
- [ ] Bouton "Analyser Tous" visible

### Filtres
- [ ] Recherche fonctionne
- [ ] Filtre catégorie fonctionne
- [ ] Filtre source fonctionne
- [ ] Combinaison filtres fonctionne
- [ ] Compteur "Analyser Tous (X)" se met à jour

### Analyse
- [ ] Analyse individuelle < 1s
- [ ] Analyse batch (107) < 10s
- [ ] Loader visible pendant analyse
- [ ] Résultats corrects affichés
- [ ] Status PASS/FAIL correct

### Résultats
- [ ] Colonne Status (CheckCircle/XCircle)
- [ ] Colonne Score avec barre
- [ ] Colonne Variables (count)
- [ ] Colonne Problèmes avec badges
- [ ] Badges colorés correctement

### Vue Détaillée
- [ ] Bouton "Détails →" fonctionne
- [ ] 2 colonnes affichées
- [ ] Variables inconnues listées (si présentes)
- [ ] Champs manquants listés (si présents)
- [ ] Placeholders détectés (si présents)
- [ ] Score affiché avec barre
- [ ] Bouton retour fonctionne

### Export
- [ ] Bouton "Exporter CSV" visible après analyse
- [ ] CSV téléchargé
- [ ] CSV contient bonnes données
- [ ] Nom de fichier correct (lint-results-DATE.csv)

### Performance
- [ ] Chargement initial < 2s
- [ ] Analyse individuelle < 1s
- [ ] Analyse batch < 10s
- [ ] Pas de freeze UI
- [ ] Pas de memory leak

### Erreurs
- [ ] Pas d'erreurs console
- [ ] Pas de warnings TypeScript
- [ ] Build réussi
- [ ] Gestion erreurs réseau
- [ ] Templates null gérés

### Régression
- [ ] Dashboard fonctionne
- [ ] Autres onglets admin fonctionnent
- [ ] Navigation fluide
- [ ] Auth fonctionne

---

## Résultats Attendus

### Template PASS Exemple

```
┌──────────────────────────────────────────────────┐
│ Template: Lettre de Refus IRCC                   │
│ Source: [Doc]                                     │
│ Status: ✅ PASS                                   │
│ Score: ████████████████████████ 100%              │
│ Variables: 15 utilisées, 0 inconnues             │
│ Problèmes: Aucun                                  │
│ Actions: Détails →                                │
└──────────────────────────────────────────────────┘
```

### Template FAIL Exemple

```
┌──────────────────────────────────────────────────┐
│ Template: Contrat de Travail                     │
│ Source: [Doc]                                     │
│ Status: ❌ FAIL                                   │
│ Score: ████████░░░░░░░░░░░░ 60%                  │
│ Variables: 20 utilisées, 3 inconnues             │
│ Problèmes:                                        │
│   🔴 3 var inconnues                             │
│   🟠 Placeholders                                │
│ Actions: Détails →                                │
└──────────────────────────────────────────────────┘
```

---

## Debugging

### Si rien ne s'affiche

```
1. F12 → Console
2. Chercher erreurs rouges
3. Vérifier:
   - Session authentifiée?
   - Role = admin?
   - Connexion Supabase OK?
```

### Si analyse ne se lance pas

```
1. F12 → Console
2. Vérifier erreurs
3. Tester:
   - Templates existent? SELECT COUNT(*) FROM document_templates;
   - schema_json valide?
   - content_template non null?
```

### Si résultats incorrects

```
1. Vérifier template dans DB
2. Vérifier schema_json
3. Vérifier content_template
4. Comparer avec détection manuelle
```

---

## Contact Support

En cas de problème, fournir:

1. **Screenshot** du problème
2. **Console logs** (F12 → Console → Copy all)
3. **Network logs** (F12 → Network → Failed requests)
4. **Template ID** concerné
5. **Actions effectuées** avant le problème

---

**Version Tests**: 1.0
**Date**: 2 Janvier 2026
**Composant testé**: UnifiedTemplateLabLinter
**Status Build**: ✅ Success
