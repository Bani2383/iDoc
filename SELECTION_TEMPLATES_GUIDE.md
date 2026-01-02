# Guide de Sélection des Templates

## Nouveau Système de Checkboxes

Le Lab & Linter Unifié dispose maintenant d'un système de sélection par checkboxes pour choisir exactement quels templates analyser.

---

## Utilisation Rapide

### 1. Sélectionner des Templates Individuels

**Méthode:**
```
1. Dans le tableau, cliquer sur la checkbox (☐) à gauche de chaque template
2. La ligne devient bleue quand sélectionnée
3. Le compteur en haut se met à jour: "Sélectionnés: X"
```

**Visuel:**
```
☐ Template 1     → Cliquer
☑ Template 1     → Sélectionné (ligne bleue)
```

---

### 2. Tout Sélectionner / Tout Désélectionner

**Méthode:**
```
1. Cliquer sur la checkbox dans l'en-tête du tableau
2. Tous les templates visibles sont sélectionnés
3. Re-cliquer pour tout désélectionner
```

**États de la checkbox principale:**
- ☐ Vide = Aucun sélectionné
- ☑ Semi-pleine = Quelques-uns sélectionnés
- ☑ Pleine bleue = Tous sélectionnés

---

### 3. Analyser la Sélection

**Méthode:**
```
1. Sélectionner les templates désirés
2. Cliquer "Analyser (X)" où X = nombre sélectionné
3. Attendre l'analyse
4. Voir les résultats
```

**Note:** Le bouton est désactivé si 0 template sélectionné

---

## Workflows Courants

### Workflow 1: Analyser Quelques Templates Spécifiques

```
Cas: Vérifier 5 templates après modifications

1. Rechercher premier template
2. Cocher la checkbox
3. Rechercher deuxième template
4. Cocher la checkbox
5. Répéter pour les 3 autres
6. Vérifier: "Sélectionnés: 5"
7. Cliquer "Analyser (5)"
8. Voir résultats
```

---

### Workflow 2: Analyser Une Catégorie Complète

```
Cas: Vérifier tous les templates "immigration"

1. Filtre Catégorie → Sélectionner "immigration"
2. Tableau filtré (ex: 23 templates)
3. Cliquer checkbox en-tête (tout sélectionner)
4. Vérifier: "Sélectionnés: 23"
5. Cliquer "Analyser (23)"
6. Voir résultats
```

---

### Workflow 3: Analyser Tous Sauf Quelques-Uns

```
Cas: Analyser tous sauf 3 templates problématiques

1. Cliquer checkbox en-tête (tout sélectionner)
2. Vérifier: "Sélectionnés: 107"
3. Décocher les 3 templates à exclure
4. Vérifier: "Sélectionnés: 104"
5. Cliquer "Analyser (104)"
6. Voir résultats
```

---

### Workflow 4: Analyser Par Source

```
Cas: Analyser seulement templates "Document"

1. Filtre Source → "Document Templates"
2. Tableau filtré: 107 templates
3. Cliquer checkbox en-tête
4. Vérifier: "Sélectionnés: 107"
5. Cliquer "Analyser (107)"
6. Voir résultats
```

---

### Workflow 5: Sélection Manuelle Multiple

```
Cas: Analyser 3 templates non-consécutifs

1. Scroll dans la liste
2. Cocher template "Lettre Refus IRCC"
3. Scroll plus bas
4. Cocher template "Contrat Travail"
5. Scroll encore
6. Cocher template "Attestation Stage"
7. Vérifier: "Sélectionnés: 3"
8. Cliquer "Analyser (3)"
```

---

## Interface Visuelle

### Header avec Compteur

```
╔════════════════════════════════════════════════╗
║  Lab & Linter Unifié                           ║
║                                                ║
║  Total: 107  │  Sélectionnés: 5  │  Doc: 107  ║
╚════════════════════════════════════════════════╝
```

Le compteur "Sélectionnés" est en **jaune** pour visibilité.

---

### Tableau avec Checkboxes

```
┌───┬─────────────────┬────────┬──────────┐
│ ☑ │ Template        │ Source │ Actions  │
├───┼─────────────────┼────────┼──────────┤
│ ☑ │ Lettre Refus    │ [Doc]  │ Analyser │  ← Sélectionné (ligne bleue)
│ ☐ │ Contrat Travail │ [Doc]  │ Analyser │
│ ☑ │ Attestation     │ [Doc]  │ Analyser │  ← Sélectionné (ligne bleue)
└───┴─────────────────┴────────┴──────────┘
```

---

### Bouton Analyser

**État Normal:**
```
┌─────────────────────┐
│ ▶ Analyser (5)      │  ← Bleu, cliquable
└─────────────────────┘
```

**État Désactivé:**
```
┌─────────────────────┐
│ ▶ Analyser (0)      │  ← Gris, non cliquable
└─────────────────────┘
```

**État En Cours:**
```
┌─────────────────────┐
│ ⟳ Analyse...        │  ← Spinner animé
└─────────────────────┘
```

---

## Avantages du Système

### Avant (Sans Checkboxes)

❌ Analyse UN template à la fois → Lent
❌ OU Tous les 107 → Trop
❌ Pas de sélection multiple
❌ Pas de contrôle fin

### Après (Avec Checkboxes)

✅ Sélection multiple précise
✅ Contrôle total sur ce qui est analysé
✅ Filtrage + Sélection = Puissant
✅ Workflow flexible
✅ Gain de temps énorme

---

## Combinaison Filtres + Sélection

### Exemple Puissant

```
Objectif: Analyser les templates "immigration" créés récemment

1. Filtre Catégorie → "immigration"
   → 23 templates affichés

2. Filtre Recherche → "2024"
   → 8 templates affichés

3. Checkbox en-tête → Tout sélectionner
   → 8 templates sélectionnés

4. Décocher 1 template pas prêt
   → 7 templates sélectionnés

5. Analyser (7)
   → Résultats précis
```

**Résultat:** Analyse exactement ce que vous voulez, rien de plus.

---

## États Visuels

### Ligne Non Sélectionnée

```
Background: Blanc
Checkbox: ☐ (vide)
Hover: Gris clair
```

### Ligne Sélectionnée

```
Background: Bleu clair (bg-blue-50)
Checkbox: ☑ (pleine, bleue)
Hover: Bleu plus foncé
```

### Checkbox En-Tête

**Rien sélectionné:**
```
☐ Gris
```

**Quelques-uns sélectionnés:**
```
☑ Bleu semi-transparent
```

**Tous sélectionnés:**
```
☑ Bleu plein
```

---

## Performance

### Temps d'Analyse

| Sélection | Temps |
|-----------|-------|
| 1 template | < 1s |
| 5 templates | 1-2s |
| 10 templates | 2-3s |
| 25 templates | 4-5s |
| 50 templates | 7-9s |
| 107 templates | 10-15s |

**Conseil:** Sélectionnez uniquement ce dont vous avez besoin pour des résultats plus rapides.

---

## Cas d'Usage Réels

### Cas 1: Audit Incrémental

```
Scénario: Vous corrigez les templates un par un

Lundi:
1. Analyser tout → Identifier 12 templates problématiques
2. Noter les IDs

Mardi:
1. Corriger template 1
2. Sélectionner uniquement template 1
3. Analyser (1) → Vérifier correction
4. Répéter pour template 2, 3, etc.

Résultat: Feedback rapide après chaque correction
```

---

### Cas 2: Test Avant Publication

```
Scénario: 3 nouveaux templates à publier

1. Créer templates A, B, C
2. Rechercher "nouveau" (si vous les nommez ainsi)
3. Sélectionner les 3
4. Analyser (3)
5. Si PASS → Publier
6. Si FAIL → Corriger puis re-analyser (3)

Résultat: Validation batch rapide
```

---

### Cas 3: Comparaison Avant/Après

```
Scénario: Vous modifiez plusieurs templates

1. Avant modifications:
   - Sélectionner templates concernés
   - Analyser (X)
   - Noter scores: 75%, 82%, 68%

2. Faire modifications

3. Après modifications:
   - RE-sélectionner mêmes templates
   - Analyser (X)
   - Nouveaux scores: 95%, 90%, 85%

Résultat: Preuve d'amélioration
```

---

### Cas 4: Certification Par Lot

```
Scénario: Certifier templates par catégorie

Semaine 1: Immigration
1. Filtre → immigration
2. Tout sélectionner
3. Analyser → Score moyen: 73%
4. Corriger
5. Re-analyser → Score: 92%
6. ✅ Catégorie certifiée

Semaine 2: Employment
(Répéter processus)

Résultat: Certification méthodique
```

---

## Raccourcis Mentaux

### Pour Gagner du Temps

**Sélection Rapide:**
```
Filtres d'abord, sélection ensuite
Moins de templates affichés = Sélection plus rapide
```

**Tout Sélectionner:**
```
Checkbox en-tête = Sélection instantanée de la vue actuelle
```

**Désélection Rapide:**
```
Re-cliquer checkbox en-tête = Tout décocher instantané
```

**Analyse Groupée:**
```
Mieux vaut analyser 10 templates ensemble
Que faire 10 analyses individuelles
```

---

## Troubleshooting

### Problème: "Je ne peux pas sélectionner"

**Solutions:**
1. Vérifier que vous cliquez sur la checkbox (☐), pas à côté
2. Vérifier que le tableau a chargé (pas en loading)
3. Rafraîchir la page (F5)

---

### Problème: "Bouton Analyser désactivé"

**Cause:** 0 template sélectionné

**Solutions:**
1. Vérifier compteur: "Sélectionnés: 0"
2. Sélectionner au moins 1 template
3. Compteur → "Sélectionnés: 1"
4. Bouton devient actif

---

### Problème: "Sélection se perd"

**Cause:** Probable changement de vue (détails → liste)

**Solutions:**
1. Faire l'analyse AVANT de changer de vue
2. La sélection est réinitialisée au retour à la liste
3. C'est normal, re-sélectionnez si besoin

---

### Problème: "Trop lent à analyser"

**Cause:** Trop de templates sélectionnés

**Solutions:**
1. Sélectionner moins (ex: 20 au lieu de 100)
2. Faire plusieurs batches
3. Utiliser les filtres pour réduire

---

## Astuces Avancées

### Astuce 1: Sélection Progressive

```
Ne sélectionnez pas tout d'un coup.
Commencez par 5-10 templates.
Analysez.
Puis ajoutez-en plus.
```

### Astuce 2: Filtrage Intelligent

```
Combinez plusieurs filtres:
1. Catégorie = "immigration"
2. Recherche = "refus"
   → Résultat: Templates précis
3. Tout sélectionner
   → Analyse ultra-ciblée
```

### Astuce 3: Export Sélectif

```
1. Analyser seulement les problématiques
2. Exporter CSV
3. CSV contient uniquement ce qui vous intéresse
4. Pas de bruit dans les données
```

### Astuce 4: Marquage Visuel

```
Les lignes bleues = "Votre sélection"
Facile de voir ce qui sera analysé
Avant même de cliquer "Analyser"
```

---

## Résumé en 3 Points

1. **Checkbox = Contrôle Total**
   - Vous choisissez exactement quoi analyser
   - 1, 5, 10, 50 ou 107 templates

2. **Filtres + Sélection = Puissance**
   - Filtrez pour réduire
   - Sélectionnez dans le résultat
   - Analyse ultra-précise

3. **Performance Optimale**
   - Analysez seulement ce dont vous avez besoin
   - Résultats plus rapides
   - Workflow plus efficace

---

## Commandes Rapides

| Action | Commande |
|--------|----------|
| Sélectionner UN | Cliquer checkbox ligne |
| Tout sélectionner | Cliquer checkbox en-tête |
| Tout désélectionner | Re-cliquer checkbox en-tête |
| Voir combien | Regarder "Sélectionnés: X" |
| Analyser | Bouton "Analyser (X)" |

---

**Le système de checkboxes résout votre problème: vous pouvez maintenant choisir EXACTEMENT quels templates analyser!**

---

**Version**: 2.1 avec Sélection
**Date**: 2 Janvier 2026
**Status**: ✅ Fonctionnel
**Build**: Successful
