# Démarrage Rapide - Lab & Linter Unifié

## En 30 Secondes

```
1. Admin Dashboard
2. Menu → "Lab & Linter Unifié"
3. Cliquer "Analyser Tous (107)"
4. Attendre 8 secondes
5. ✅ Voir tous vos résultats
```

---

## Interface Rapide

### Header
```
╔════════════════════════════════════════╗
║  Lab & Linter Unifié                   ║
║                                        ║
║  Total: 107  │  Doc: 107  │  iDoc: 0  ║
╚════════════════════════════════════════╝
```

### Barre d'Actions
```
┌──────────┬──────────┬──────────┬─────────────┐
│ Recherche│ Catégorie│  Source  │ Analyser    │
│  [...]   │ [Select] │ [Select] │ Tous (107)  │
└──────────┴──────────┴──────────┴─────────────┘
```

### Résultats
```
┌─────────────────────────────────────────────────┐
│ Analysés: 107 │ Réussis: 95 │ Échecs: 12      │
│ Score Moyen: 87%            │ [Export CSV]    │
└─────────────────────────────────────────────────┘
```

---

## 3 Actions Principales

### 1. Analyser UN Template
```
Tableau → Trouver template → Cliquer "Analyser"
Résultat en < 1 seconde
```

### 2. Analyser TOUS les Templates
```
En haut à droite → "Analyser Tous (107)"
Résultats en 5-8 secondes
```

### 3. Voir Détails
```
Résultat → Cliquer "Détails →"
Vue complète des problèmes
```

---

## Score de Qualité

| Score | Signification | Action |
|-------|---------------|--------|
| 100% | ✅ Parfait | Publier |
| 80-99% | ⚠️ Bon | Corrections mineures |
| 60-79% | ⚠️ Moyen | Corrections nécessaires |
| 0-59% | ❌ Critique | Corrections urgentes |

---

## Problèmes Détectés

### 🔴 Variables Inconnues
```
{{variable}} utilisée mais pas dans le schema
→ Ajouter au schema ou retirer
```

### 🟠 Placeholders
```
[TODO], [FIXME], TODO:, FIXME: dans le template
→ Remplacer par contenu réel
```

### 🟡 Champs Manquants
```
Champ requis dans schema mais jamais utilisé
→ Utiliser ou marquer optionnel
```

---

## Filtres Rapides

### Par Texte
```
Rechercher: "immigration" → Templates filtrés
```

### Par Catégorie
```
Catégorie: "employment" → Templates de cette catégorie
```

### Par Source
```
Source: "Document Templates" → 107 templates
Source: "iDoc Templates" → 0 templates (normal)
```

---

## Export

### Générer CSV
```
1. Analyser des templates
2. Cliquer "Exporter CSV"
3. Fichier: lint-results-2026-01-XX.csv
```

### Contenu CSV
```csv
Template,Source,Status,Score,Unknown Vars,Placeholders,Missing Fields
Template1,document_templates,PASS,100,,NO,
Template2,document_templates,FAIL,60,var1;var2,YES,email
```

---

## Workflow Recommandé

### Audit Hebdomadaire
```
Lundi matin:
1. Analyser Tous
2. Noter score moyen
3. Exporter CSV
4. Corriger si score < 85%
```

### Avant Publication
```
Pour chaque nouveau template:
1. Créer
2. Analyser
3. Score doit être 100%
4. Corriger si nécessaire
5. Publier
```

---

## Raccourcis Clavier

| Action | Raccourci |
|--------|-----------|
| Ouvrir Console | F12 |
| Rechercher | Ctrl+F (dans browser) |
| Rafraîchir | F5 |

---

## Troubleshooting Rapide

### "Pas de templates"
```
→ Vérifier filtres
→ Réinitialiser filtres
```

### "Analyse lente"
```
→ Filtrer par catégorie
→ Analyser par batches
```

### "Erreur console"
```
→ F12 → Console
→ Copier erreur
→ Contacter support
```

---

## Liens Utiles

- Guide complet: `UNIFIED_LAB_LINTER_GUIDE.md`
- Tests: `TEST_UNIFIED_LINTER.md`
- Résumé technique: `FUSION_COMPLETE_SUMMARY.md`

---

## Support Rapide

**Problème?** Fournir:
1. Screenshot
2. Console logs (F12)
3. Template ID
4. Actions effectuées

---

**C'est tout! Vous êtes prêt à analyser vos 107 templates.**

Version: 2.0 | Date: 2 Janvier 2026 | Status: ✅ Ready
