# iDoc Wizard - Quick Start Guide
## Tester le Nouveau Générateur Guidé

---

## 🚀 Accès Rapide (Dev)

### Option 1: Via URL directe (quand route sera ajoutée)

```
http://localhost:5173/#/idoc
```

### Option 2: Modifier la vue par défaut (temporaire)

**Fichier**: `src/App.tsx`, ligne 70

```typescript
// AVANT
const [currentView, setCurrentView] = useState<...>('improved');

// APRÈS (pour tester)
const [currentView, setCurrentView] = useState<...>('idoc-wizard');
```

Puis:
```bash
npm run dev
```

Le wizard s'affichera directement au chargement.

---

## 🎯 Parcours de Test Complet

### Test 1: Visa Visiteur

1. **Page d'accueil du wizard**
   - Voir le champ "Quel est votre problème ?"
   - Entrer: `visa visiteur canada`
   - Cliquer "Continuer"

2. **Sélection du type**
   - 4 cartes doivent apparaître
   - Cliquer sur "Visa Visiteur"

3. **Formulaire de détails**
   - Remplir:
     - Nom: `Jean Dupont`
     - Ville: `Paris`
     - Pays: `France`
     - Date: (aujourd'hui par défaut)
   - Cliquer "Aperçu"

4. **Preview**
   - Voir résumé du document
   - Message "Version gratuite : PDF"
   - Cliquer "Télécharger PDF"
   - Console log: `iDoc wizard completed: {...}`

**Résultat attendu**: Redirect vers homepage avec console log des inputs

---

### Test 2: Validation des Erreurs

1. Laisser les champs vides
2. Cliquer "Aperçu"
3. **Voir affichage des erreurs**:
   - "Le nom du demandeur est requis (minimum 2 caractères)"
   - "La ville est requise"
   - "Le pays est requis"

**Résultat attendu**: Bloc rouge avec liste des erreurs, impossibilité de continuer

---

### Test 3: Navigation Retour

1. Avancer jusqu'à l'étape "Details"
2. Cliquer "Retour"
3. **Vérifier** retour à "Type de document"
4. Cliquer encore "Retour"
5. **Vérifier** retour à "Intro" avec texte libre conservé

**Résultat attendu**: Navigation fluide, données conservées

---

### Test 4: Interprétation Intelligente

**Textes à tester** (étape Intro):

| Texte Entré | Type Détecté | Sous-type |
|-------------|--------------|-----------|
| `refus visa` | LETTRE_EXPLICATIVE_GENERIQUE | REFUS |
| `fonds insuffisants` | LETTRE_EXPLICATIVE_GENERIQUE | FONDS |
| `lettre invitation` | INVITATION | - |
| `répondre à une lettre` | REPONSE_LETTRE | - |
| `immigration canada` | IMMIGRATION_LETTRE | IRCC |
| `caq québec` | IMMIGRATION_LETTRE | CAQ |

**Comment vérifier**:
1. Entrer le texte
2. Cliquer "Continuer"
3. Observer quelle carte est pré-sélectionnée (ou devrait l'être)

**Note**: L'auto-sélection n'est pas encore implémentée dans l'UI, mais le mapping fonctionne dans `RulesEngine.interpretFreeText()`

---

## 🧪 Tests du Rules Engine (Console)

### Ouvrir la console browser et tester:

```javascript
// Import (si disponible via window ou directement dans le code)
import { RulesEngine } from './src/lib/rulesEngine';

// Test 1: Interprétation texte libre
RulesEngine.interpretFreeText("refus visa");
// → { document_type: 'LETTRE_EXPLICATIVE_GENERIQUE', sous_type_lettre: 'REFUS' }

// Test 2: Validation
const inputs = {
  document_type: 'VISA_VISITEUR_UNIVERSEL',
  variables: {
    nom_demandeur: 'John',
    ville: 'Paris',
    pays: 'France',
    date: '2026-01-02'
  }
};
RulesEngine.validate(inputs);
// → [{ field: 'visa_visiteur', message: '...', rule: 'required_object' }]

// Test 3: Génération de slug
RulesEngine.generateSlug({
  document_type: 'VISA_VISITEUR_UNIVERSEL',
  visa_visiteur: { pays_destination: 'Canada' },
  variables: { nom_demandeur: '', ville: '', pays: '', date: '' }
});
// → "lettre-visa-visiteur-canada"

// Test 4: Routing
RulesEngine.routeToTemplate({
  document_type: 'VISA_VISITEUR_UNIVERSEL',
  variables: { nom_demandeur: 'John', ville: 'Paris', pays: 'France', date: '2026-01-02' }
});
// → { template_id: 'VISITEUR_universel', sections_to_include: ['Disclaimer_Idoc'], sections_to_exclude: [] }
```

---

## 📊 Vérifier la Base de Données

### Tables créées

Ouvrir Supabase Dashboard → SQL Editor:

```sql
-- Vérifier que les tables existent
SELECT table_name
FROM information_schema.tables
WHERE table_name LIKE 'idoc_%'
ORDER BY table_name;

-- Devrait retourner:
-- idoc_generated_documents
-- idoc_guided_templates
-- idoc_template_analytics
-- idoc_template_section_mapping
-- idoc_template_sections

-- Vérifier les RLS policies
SELECT schemaname, tablename, policyname
FROM pg_policies
WHERE tablename LIKE 'idoc_%'
ORDER BY tablename, policyname;

-- Devrait retourner ~10 policies
```

---

## 🎨 Vérifier le Design

### Checklist Visuelle

**Page d'accueil wizard**:
- [ ] Icône bleue ronde avec FileText
- [ ] Titre H1 centré
- [ ] Sous-titre gris
- [ ] Barre de progression (4 cercles)
- [ ] Card blanche avec ombre
- [ ] Champ textarea grand et clair
- [ ] Bouton bleu "Continuer"
- [ ] Footer avec disclaimer

**Étape Type de Document**:
- [ ] 4 cartes en grid 2x2 (desktop)
- [ ] 1 colonne (mobile)
- [ ] Hover: bordure bleue
- [ ] Icônes FileText sur chaque carte
- [ ] Bouton "Retour" visible

**Étape Détails**:
- [ ] Labels clairs avec astérisques (champs requis)
- [ ] Inputs avec border-radius
- [ ] Grid 2 colonnes pour Ville/Pays
- [ ] Date picker natif
- [ ] Bloc d'erreurs rouge si validation échoue

**Étape Preview**:
- [ ] Bloc gris avec icône Sparkles
- [ ] Résumé du document
- [ ] Encadré bleu "Version gratuite"
- [ ] Bouton vert "Télécharger PDF"

---

## 🐛 Problèmes Connus & Solutions

### 1. "Cannot find module 'IdocWizard'"

**Cause**: Import lazy incorrect

**Solution**:
```typescript
// Vérifier dans App.tsx ligne 56
const IdocWizard = lazy(() => import('./components/IdocWizard').then(m => ({ default: m.IdocWizard })));
```

### 2. "RulesEngine is not defined"

**Cause**: Import manquant dans IdocWizard

**Solution**:
```typescript
// En haut de IdocWizard.tsx
import { RulesEngine, GuidedTemplateInputs, DocumentType } from '../lib/rulesEngine';
```

### 3. Barre de progression ne s'affiche pas

**Cause**: CSS Tailwind manquant

**Solution**: Vérifier que `tailwind.config.js` inclut tous les fichiers:
```javascript
content: [
  "./index.html",
  "./src/**/*.{js,ts,jsx,tsx}",
],
```

### 4. Console errors liés aux types

**Cause**: TypeScript strict mode

**Solution**: Types déjà définis dans `rulesEngine.ts`, s'assurer de les importer

---

## 📝 Logs de Debug Utiles

### Activer les logs

Dans `IdocWizard.tsx`, ajouter:

```typescript
// Après chaque setState
console.log('Current step:', currentStep);
console.log('Current inputs:', inputs);
console.log('Validation errors:', errors);
```

### Logs attendus (parcours complet)

```
Current step: intro
Current inputs: { variables: { nom_demandeur: '', ville: '', pays: '', date: '2026-01-02' } }

[User enters text]
Current step: document_type
Current inputs: { document_type: 'VISA_VISITEUR_UNIVERSEL', variables: {...} }

[User selects type]
Current step: details
Current inputs: { document_type: 'VISA_VISITEUR_UNIVERSEL', variables: {...} }

[User fills form]
Current step: preview
Validation errors: []

[User clicks download]
iDoc wizard completed: {
  document_type: 'VISA_VISITEUR_UNIVERSEL',
  variables: {
    nom_demandeur: 'Jean Dupont',
    ville: 'Paris',
    pays: 'France',
    date: '2026-01-02'
  }
}
```

---

## ✅ Critères de Succès

### Phase 1 (Actuelle) - Foundation

- [x] Wizard affiche 4 étapes
- [x] Navigation avant/arrière fonctionne
- [x] Validation bloque si erreurs
- [x] Console log final contient tous les inputs
- [x] Aucune erreur console
- [x] Build passe (npm run build)
- [x] Design responsive (mobile + desktop)

### Phase 2 (Prochaine) - PDF Generation

- [ ] Bouton "Télécharger PDF" génère un vrai PDF
- [ ] PDF contient les variables remplacées
- [ ] PDF inclut le disclaimer
- [ ] Nom de fichier suit le pattern: `lettre-TYPE-NOM-DATE.pdf`
- [ ] Téléchargement automatique (pas juste console log)

---

## 🚦 Statut Actuel

| Fonctionnalité | Statut | Notes |
|----------------|--------|-------|
| UI Wizard | ✅ COMPLET | 4 étapes + navigation |
| Validation | ✅ COMPLET | Temps réel + affichage erreurs |
| Rules Engine | ✅ COMPLET | Tous validators implémentés |
| Routing | ✅ COMPLET | Auto-selection template |
| Database | ✅ COMPLET | 5 tables + RLS |
| PDF Generation | ❌ TODO | Phase 2 |
| Templates DB | ❌ TODO | Phase 2 (30+ templates) |
| SEO Pages | ❌ TODO | Phase 2 (/modele/[slug]) |
| Paywall | ❌ TODO | Phase 2 (premium features) |

---

## 🎯 Prochaines Actions

### Immédiat (5 minutes)

1. Lancer le projet:
   ```bash
   npm run dev
   ```

2. Modifier `src/App.tsx` ligne 70:
   ```typescript
   const [currentView, setCurrentView] = useState<...>('idoc-wizard');
   ```

3. Ouvrir http://localhost:5173

4. Tester le parcours complet "Visa Visiteur"

### Court terme (1-2 jours)

1. Implémenter génération PDF basique
2. Insérer 3-5 templates en DB
3. Tester génération complète

### Moyen terme (1 semaine)

1. Insérer tous les templates (30+)
2. Créer pages SEO
3. Implémenter paywall

---

## 📞 Besoin d'Aide ?

### Fichiers Clés

| Fichier | Description |
|---------|-------------|
| `src/lib/rulesEngine.ts` | Logique validation + routing |
| `src/components/IdocWizard.tsx` | UI du wizard |
| `src/App.tsx` | Route principale (ligne 342-351) |
| `IDOC_IMPLEMENTATION_SUMMARY.md` | Documentation complète |

### Debug Checklist

1. ✅ Build passe ? → `npm run build`
2. ✅ Tables créées ? → Vérifier Supabase Dashboard
3. ✅ Route active ? → Vérifier App.tsx ligne 342
4. ✅ Import correct ? → Vérifier App.tsx ligne 56
5. ✅ Console errors ? → Ouvrir DevTools

---

**Document créé**: 2 janvier 2026
**Pour**: Test rapide du wizard iDoc
**Durée test**: 5-10 minutes

**🎉 Bon test du nouveau générateur guidé ! 🎉**
