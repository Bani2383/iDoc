# Guide de Sélection Visuelle - Interface Cartes

## Nouvelle Interface Complète

L'interface a été entièrement refaite pour une sélection visuelle et intuitive.

---

## Vue d'Ensemble

### 1. En Haut - Compteurs Clairs

```
╔══════════════════════════════════════════════════════╗
║  Total: 107  │  Affichés: 107  │  Sélectionnés: 0   ║
║              │                 │   [EN JAUNE]        ║
║  Document: 107  │  iDoc: 10                          ║
╚══════════════════════════════════════════════════════╝
```

**Le compteur "Sélectionnés" est EN JAUNE avec une bordure pour être bien visible!**

---

### 2. Zone de Filtres et Boutons

```
┌─────────────────────────────────────────────┐
│ [Recherche] [Catégorie] [Source]            │
│                                             │
│ [Tout Sélectionner]  [10] [Aléatoire]      │
│ [Effacer]            [ANALYSER (0)] ←─ GROS │
└─────────────────────────────────────────────┘
```

---

### 3. Affichage en GRILLE DE CARTES

```
┌─────────────┐  ┌─────────────┐  ┌─────────────┐
│ ☐           │  │ ☑           │  │ ☐           │
│ Lettre      │  │ Contrat     │  │ Attestation │
│ Refus IRCC  │  │ Travail     │  │ Stage       │
│             │  │  [BLEUE]    │  │             │
│ [Document]  │  │ [Document]  │  │ [Document]  │
│ immigration │  │ employment  │  │ education   │
└─────────────┘  └─────────────┘  └─────────────┘
   Blanc            FOND BLEU        Blanc
   Non sélectionné  SÉLECTIONNÉ      Non sélectionné
```

---

## Comment Utiliser

### Méthode 1: Sélection Manuelle

**Étape par étape:**

1. **Voir tous les documents en cartes**
   - Grille de 3 colonnes
   - Chaque carte = 1 document
   - Fond blanc = Non sélectionné
   - Fond bleu = Sélectionné

2. **Cliquer sur une carte**
   - Clic → La carte devient BLEUE
   - Checkbox change: ☐ → ☑
   - Compteur augmente: "Sélectionnés: 1"

3. **Cliquer sur d'autres cartes**
   - Chaque clic ajoute à la sélection
   - "Sélectionnés: 2", "Sélectionnés: 3", etc.

4. **Désélectionner**
   - Re-cliquer une carte bleue
   - Elle redevient blanche
   - Compteur diminue

5. **Analyser**
   - Bouton VERT "ANALYSER (X)"
   - X = nombre de documents sélectionnés
   - Cliquer → Analyse démarre

---

### Méthode 2: Tout Sélectionner

**C'est INSTANTANÉ:**

1. Cliquer bouton "Tout Sélectionner (107)"
2. TOUTES les cartes deviennent bleues
3. Compteur: "Sélectionnés: 107"
4. Cliquer "ANALYSER (107)"

**Pour désélectionner tout:**
- Re-cliquer "Tout Désélectionner"
- Toutes les cartes redeviennent blanches
- Compteur: "Sélectionnés: 0"

---

### Méthode 3: Sélection Aléatoire (NOUVEAU!)

**Pour tester sur un échantillon:**

1. **Choisir combien de documents**
   ```
   [10] ← Changer le nombre (ex: 5, 10, 20, 50)
   ```

2. **Cliquer "Sélection Aléatoire"**
   ```
   [🔀 Sélection Aléatoire]
   ```

3. **Résultat instantané:**
   - 10 cartes au hasard deviennent bleues
   - Compteur: "Sélectionnés: 10"

4. **Analyser**
   - Cliquer "ANALYSER (10)"

**Exemple:**
```
Input: [25]  →  Clic [Aléatoire]  →  25 documents choisis au hasard
```

---

### Méthode 4: Filtrer PUIS Sélectionner

**Le plus puissant:**

1. **Filtrer d'abord**
   ```
   Catégorie: [immigration] ← Sélectionner
   → Affichés: 23
   ```

2. **Voir les 23 cartes filtrées**
   - Seulement les templates "immigration"

3. **Choisir mode de sélection:**

   **Option A: Tout sélectionner**
   ```
   [Tout Sélectionner (23)]
   → Les 23 templates immigration sont sélectionnés
   ```

   **Option B: Aléatoire dans filtre**
   ```
   [10] [Sélection Aléatoire]
   → 10 templates immigration au hasard
   ```

   **Option C: Manuel**
   ```
   Cliquer sur 5 cartes spécifiques
   → Exactement ces 5 templates
   ```

4. **Analyser**
   ```
   [ANALYSER (X)]
   ```

---

## Visualisation des États

### Carte NON Sélectionnée

```
┌─────────────────────────────┐
│ ☐  Lettre Refus IRCC        │  ← Fond BLANC
│                             │  ← Bordure grise
│    [Document] [immigration] │
│    ID: 3f2a8b9c...          │
└─────────────────────────────┘
```

**Signaux visuels:**
- Fond: Blanc
- Checkbox: ☐ Vide grise
- Bordure: Gris clair

---

### Carte SÉLECTIONNÉE

```
┌─────────────────────────────┐
│ ☑  Lettre Refus IRCC        │  ← Fond BLEU CLAIR
│                             │  ← Bordure bleue épaisse
│    [Document] [immigration] │  ← Shadow visible
│    ID: 3f2a8b9c...          │
└─────────────────────────────┘
```

**Signaux visuels:**
- Fond: Bleu clair (bg-blue-50)
- Checkbox: ☑ Pleine bleue
- Bordure: Bleu foncé (border-blue-500)
- Ombre: Shadow-md

---

### Carte au SURVOL

```
┌─────────────────────────────┐
│ ☐  Lettre Refus IRCC        │  ← Bordure bleue claire
│                             │  ← Shadow apparaît
│    [Document] [immigration] │  ← Curseur = pointer
│    ID: 3f2a8b9c...          │
└─────────────────────────────┘
```

**Signaux visuels:**
- Bordure: Devient bleu clair
- Shadow: Apparaît
- Curseur: Pointer (main)

---

## Boutons Détaillés

### Bouton "Tout Sélectionner"

**État 1: Rien sélectionné**
```
┌──────────────────────────┐
│ ☑ Tout Sélectionner (107)│  ← BLEU
└──────────────────────────┘
```

**État 2: Tout sélectionné**
```
┌──────────────────────────┐
│ ☐ Tout Désélectionner    │  ← BLEU
└──────────────────────────┘
```

Le texte change automatiquement!

---

### Bouton "Sélection Aléatoire"

```
┌─────┐  ┌─────────────────────────┐
│ [10]│  │ 🔀 Sélection Aléatoire  │  ← VIOLET
└─────┘  └─────────────────────────┘
  ↑
Input nombre
```

**États:**
- Normal: Violet, cliquable
- Disabled: Gris (si 0 documents affichés)

---

### Bouton "Effacer"

```
┌──────────────────┐
│ ❌ Effacer (5)   │  ← GRIS
└──────────────────┘
```

**États:**
- Actif: Gris foncé (si > 0 sélectionnés)
- Disabled: Gris clair (si 0 sélectionné)

---

### Bouton "ANALYSER"

```
┌──────────────────────┐
│ ▶ ANALYSER (10)      │  ← VERT, GROS
└──────────────────────┘
```

**États:**

1. **Prêt (X > 0)**
   ```
   ┌──────────────────────┐
   │ ▶ ANALYSER (10)      │  ← VERT FONCÉ
   └──────────────────────┘
   ```

2. **Disabled (X = 0)**
   ```
   ┌──────────────────────┐
   │ ▶ ANALYSER           │  ← GRIS
   └──────────────────────┘
   ```

3. **En cours**
   ```
   ┌──────────────────────────────┐
   │ ⟳ Analyse en cours...        │  ← Spinner
   └──────────────────────────────┘
   ```

---

## Workflows Complets

### Workflow 1: Test Rapide sur Échantillon

```
Objectif: Tester le linter sur 10 documents au hasard

1. Page charge → 107 documents affichés
2. Input: Changer [10] à [10] (déjà bon)
3. Clic: [Sélection Aléatoire]
4. Résultat: 10 cartes bleues au hasard
5. Compteur: "Sélectionnés: 10"
6. Clic: [ANALYSER (10)]
7. Attendre 2-3 secondes
8. Voir résultats de 10 documents

Temps total: 10 secondes
```

---

### Workflow 2: Analyse Catégorie Complète

```
Objectif: Analyser tous les templates "immigration"

1. Filtre Catégorie: [immigration]
2. Affichés: 23 documents
3. Clic: [Tout Sélectionner (23)]
4. Toutes les 23 cartes deviennent bleues
5. Clic: [ANALYSER (23)]
6. Attendre 3-4 secondes
7. Voir résultats de 23 documents

Temps total: 15 secondes
```

---

### Workflow 3: Sélection Manuelle Précise

```
Objectif: Analyser 3 templates spécifiques que j'ai modifiés

1. Chercher premier template (barre recherche)
2. Clic sur sa carte → Bleue
3. Effacer recherche
4. Chercher deuxième template
5. Clic sur sa carte → Bleue
6. Effacer recherche
7. Chercher troisième template
8. Clic sur sa carte → Bleue
9. Compteur: "Sélectionnés: 3"
10. Clic: [ANALYSER (3)]
11. Voir résultats de 3 documents

Temps total: 30 secondes
```

---

### Workflow 4: Analyse Progressive par Batch

```
Objectif: Analyser tous les documents par groupes de 20

Batch 1:
1. [20] [Sélection Aléatoire]
2. [ANALYSER (20)]
3. Noter résultats

Batch 2:
4. [Effacer (20)]
5. [20] [Sélection Aléatoire]
6. [ANALYSER (20)]
7. Noter résultats

Batch 3:
8. Répéter...

Jusqu'à avoir tout analysé
```

---

### Workflow 5: Filtres Multiples + Aléatoire

```
Objectif: Tester 5 templates "immigration" qui contiennent "IRCC"

1. Filtre Catégorie: [immigration]
   → Affichés: 23

2. Recherche: "IRCC"
   → Affichés: 8

3. Input: [5]

4. Clic: [Sélection Aléatoire]
   → 5 templates immigration+IRCC au hasard

5. Clic: [ANALYSER (5)]

6. Résultats ultra-ciblés
```

---

## Page Résultats

### Après Analyse

```
┌─────────────────────────────────────────┐
│ Résultats de l'Analyse                  │
│ [Exporter CSV] [Retour à la sélection] │
├─────────────────────────────────────────┤
│ Analysés: 10  │ Réussis: 7              │
│ Échecs: 3     │ Score Moyen: 78%        │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ ☑ Lettre Refus IRCC          PASS  95% │
│   Variables: 12 | Inconnues: 0          │
├─────────────────────────────────────────┤
│ ❌ Contrat Travail            FAIL  45% │
│   Variables: 8 | Inconnues: 5           │
│   [x var1, var2, var3, var4, var5]      │
├─────────────────────────────────────────┤
│ ☑ Attestation Stage          PASS  88% │
│   Variables: 6 | Inconnues: 0          │
└─────────────────────────────────────────┘
```

**Chaque résultat montre:**
- Nom du template
- Status: PASS/FAIL avec icône
- Score: Barre de progression
- Détails: Variables, problèmes
- Codes des variables inconnues

---

## Retour à la Sélection

Depuis la page résultats:

```
Clic: [Retour à la sélection]
```

**Résultat:**
- Retour à la grille de cartes
- Sélection précédente est EFFACÉE
- Compteur: "Sélectionnés: 0"
- Prêt pour nouvelle sélection

---

## Avantages de la Nouvelle Interface

### ✅ AVANT vs MAINTENANT

**AVANT:**
```
❌ Tableau dense difficile à lire
❌ Checkboxes petites
❌ Pas de feedback visuel clair
❌ Pas de mode aléatoire
❌ Sélection confuse
```

**MAINTENANT:**
```
✅ Grille de cartes spacieuse
✅ Cartes ENTIÈRES cliquables
✅ Fond bleu = Sélection évidente
✅ Mode aléatoire intégré
✅ Compteur jaune bien visible
✅ 5 méthodes de sélection
✅ Interface intuitive
```

---

## Points Clés à Retenir

### 1. Tout est VISUEL
```
Carte blanche = Non sélectionné
Carte bleue = Sélectionné
C'est SIMPLE!
```

### 2. Clic sur TOUTE la carte
```
Pas besoin de viser la petite checkbox
TOUTE la carte est cliquable
```

### 3. Compteur jaune = Votre guide
```
Toujours regarder: "Sélectionnés: X"
C'est votre indicateur principal
```

### 4. Mode aléatoire = Gain de temps
```
Pour tester rapidement
Changer le nombre, cliquer
C'est fait!
```

### 5. Filtres PUIS sélection = Puissance
```
Filtrer réduit les options
Puis sélectionner exactement ce que vous voulez
```

---

## Cas d'Usage Réels

### Cas 1: "Je veux tout analyser"

```
Action: [Tout Sélectionner (107)]
Puis: [ANALYSER (107)]
Temps: 10-15 secondes d'analyse
```

---

### Cas 2: "Je veux tester sur 10 au hasard"

```
Action: [10] [Sélection Aléatoire]
Puis: [ANALYSER (10)]
Temps: 2-3 secondes d'analyse
```

---

### Cas 3: "Je veux vérifier une catégorie"

```
Action: Filtre → [immigration]
Puis: [Tout Sélectionner (23)]
Puis: [ANALYSER (23)]
Temps: 3-4 secondes d'analyse
```

---

### Cas 4: "Je veux 3 templates précis"

```
Action: Cliquer carte 1, carte 2, carte 3
Puis: [ANALYSER (3)]
Temps: < 1 seconde d'analyse
```

---

### Cas 5: "Je veux moitié de chaque catégorie"

```
Immigration:
1. Filtre → [immigration] → 23 affichés
2. [12] [Sélection Aléatoire]
3. [ANALYSER (12)]

Employment:
4. [Effacer] → Compteur à 0
5. Filtre → [employment] → 30 affichés
6. [15] [Sélection Aléatoire]
7. [ANALYSER (15)]

Etc.
```

---

## Troubleshooting

### Problème: "Je ne vois pas les documents"

**Solution:**
1. Vérifier que page a chargé (pas de spinner)
2. Vérifier filtres: Mettre tout à "Toutes"
3. Vérifier compteur "Affichés: X" (si 0, pas normal)
4. Rafraîchir page (F5)

---

### Problème: "La sélection ne marche pas"

**Solution:**
1. Vérifier que vous cliquez sur la CARTE (pas à côté)
2. La carte doit devenir BLEUE
3. Le compteur doit augmenter
4. Si rien ne se passe, rafraîchir (F5)

---

### Problème: "Bouton ANALYSER est gris"

**Cause:** 0 document sélectionné

**Solution:**
1. Regarder compteur: "Sélectionnés: 0"
2. Sélectionner au moins 1 document
3. Compteur augmente
4. Bouton devient vert

---

### Problème: "Sélection aléatoire ne fait rien"

**Cause probable:** Input nombre est 0 ou invalide

**Solution:**
1. Vérifier input: [10] ← Doit contenir un nombre
2. Si vide ou 0, mettre 10
3. Re-cliquer [Sélection Aléatoire]

---

### Problème: "Trop lent"

**Cause:** Trop de documents sélectionnés

**Solution:**
1. Si vous avez sélectionné 107, ça prend 10-15s
2. Pour aller plus vite, sélectionner moins (10-20)
3. Faire plusieurs petits batches au lieu d'un gros

---

## Résumé en 5 Points

### 1. Interface CARTES Cliquables
- Grille de cartes
- Clic = Sélection
- Fond bleu = Sélectionné

### 2. Compteur Jaune Bien Visible
- "Sélectionnés: X"
- Votre guide principal
- Toujours visible en haut

### 3. Mode ALÉATOIRE Intégré
- Choisir nombre
- Cliquer bouton
- Sélection instantanée

### 4. Filtres + Sélection = Puissance
- Filtrer d'abord
- Sélectionner ensuite
- Analyse ultra-précise

### 5. Gros Bouton ANALYSER Vert
- Impossible à manquer
- Affiche le nombre
- Lance l'analyse

---

## Interface Complète

```
╔════════════════════════════════════════════════╗
║ 🔥 Template Lab & Linter                       ║
║                                                ║
║ Total: 107 | Affichés: 107 | Sélectionnés: 5  ║
║                                      ↑ JAUNE   ║
╠════════════════════════════════════════════════╣
║ Filtres et Sélection                           ║
║                                                ║
║ [Recherche] [Catégorie] [Source]               ║
║                                                ║
║ [Tout Sélectionner] [10][Aléatoire] [Effacer] ║
║                              [ANALYSER (5)] ←──║
║                                    GROS VERT   ║
╠════════════════════════════════════════════════╣
║ 107 documents disponibles • 5 sélectionnés    ║
╠════════════════════════════════════════════════╣
║                                                ║
║ ┌──────┐ ┌──────┐ ┌──────┐                   ║
║ │ ☐    │ │ ☑    │ │ ☐    │  ← GRILLE         ║
║ │ Doc1 │ │ Doc2 │ │ Doc3 │     DE            ║
║ │      │ │ BLEU │ │      │     CARTES        ║
║ └──────┘ └──────┘ └──────┘                   ║
║                                                ║
║ ┌──────┐ ┌──────┐ ┌──────┐                   ║
║ │ ☑    │ │ ☐    │ │ ☑    │  ← CLIQUABLES     ║
║ │ Doc4 │ │ Doc5 │ │ Doc6 │                   ║
║ │ BLEU │ │      │ │ BLEU │                   ║
║ └──────┘ └──────┘ └──────┘                   ║
║                                                ║
║ ... et 101 autres documents ...               ║
╚════════════════════════════════════════════════╝
```

---

**Votre interface est maintenant 100% visuelle et intuitive!**

**Testez dès maintenant:**
1. Ouvrir Admin Dashboard
2. Aller "Lab & Linter Unifié"
3. Voir la grille de cartes
4. Cliquer [10] [Sélection Aléatoire]
5. Voir 10 cartes devenir bleues
6. Cliquer [ANALYSER (10)]
7. Voir les résultats en 2-3 secondes

**C'est aussi simple que ça!**

---

**Version**: 3.0 - Interface Cartes Visuelles
**Date**: 2 Janvier 2026
**Status**: ✅ Build Réussi (13.49s)
**Innovation**: Mode Aléatoire + Cartes Cliquables
