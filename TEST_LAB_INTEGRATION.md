# Test de l'Intégration Lab & Linter

## Test Rapide (2 minutes)

### 1. Accéder au Lab Unifié

```
1. Se connecter en tant qu'admin
2. Aller dans Admin Dashboard
3. Menu latéral → "Lab & Linter"
4. Vous devez voir 2 boutons en haut: "Template Lab" et "iDoc Linter"
```

**Attendu**: Interface avec navigation entre 2 systèmes

---

### 2. Tester le Template Lab

```
1. Cliquer sur "Template Lab" (actif par défaut)
2. Voir la liste des 107 templates
3. Statistiques affichées:
   - Total: 107
   - Brouillon: X
   - En révision: Y
   - Approuvé: Z
   - etc.
4. Cliquer sur "Tester →" pour un template
```

**Attendu**:
- Liste des templates document_templates
- Statistiques correctes
- Bouton "Tester" fonctionne

---

### 3. Tester les Onglets du Lab

```
1. Dans le détail d'un template
2. Voir 3 onglets: "Test & Preview", "Lint & Validate", "History"
3. Onglet "Test & Preview":
   - Remplir les champs
   - Cliquer "Générer Prévisualisation"
   - Voir le résultat

4. Onglet "Lint & Validate":
   - Voir le composant de linter
   - Champs pré-remplis avec placeholder
   - Cliquer "Run Lint Check"
   - Voir les résultats (variables, placeholders, etc.)

5. Onglet "History":
   - Voir l'historique des tests
   - Voir les certificats
```

**Attendu**:
- 3 onglets fonctionnels
- Linter intégré fonctionne
- Résultats clairs et visuels

---

### 4. Tester le Linter iDoc

```
1. Cliquer sur "iDoc Linter" (bouton en haut)
2. Voir 5 boutons de mode:
   - Single
   - All
   - Random
   - Category
   - Unverified

3. Mode "All":
   - Cliquer "Run Batch Lint on All Templates"
   - Voir: "No templates found" ou résultats si templates existent

4. Mode "Random":
   - Définir nombre: 5
   - Cliquer "Run Random Audit"
   - Voir résultats (si templates existent)
```

**Attendu**:
- 5 modes disponibles
- Interface réactive
- Message clair si pas de templates idoc

---

## Tests Fonctionnels Détaillés

### Test A: Linter Détecte Variables Inconnues

**Setup**:
1. Template Lab → Sélectionner un template
2. Onglet "Lint & Validate"

**Action**:
```
1. Ne remplir AUCUN champ
2. Cliquer "Run Lint Check"
```

**Attendu**:
- Status: Fail (rouge)
- Unknown Variables: > 0
- Liste des variables manquantes affichée
- Action Required visible

---

### Test B: Linter Passe Sans Erreur

**Setup**:
1. Template Lab → Sélectionner un template simple
2. Onglet "Lint & Validate"

**Action**:
```
1. Remplir TOUS les champs avec des valeurs
2. Cliquer "Run Lint Check"
```

**Attendu**:
- Status: Pass (vert)
- Unknown Variables: 0
- Message: "All variables are properly defined"
- Placeholders: None

---

### Test C: Navigation Lab ↔ Linter

**Action**:
```
1. Lab actif → Cliquer "iDoc Linter"
2. Vérifier que l'interface change
3. Linter actif → Cliquer "Template Lab"
4. Vérifier retour au Lab
```

**Attendu**:
- Transition instantanée
- Pas de rechargement page
- Boutons bien surlignés (actif vs inactif)

---

### Test D: Retour Liste depuis Détail

**Action**:
```
1. Template Lab → Sélectionner un template
2. Onglet détail affiché
3. Cliquer "← Retour à la liste"
```

**Attendu**:
- Retour à la liste des templates
- Liste toujours filtrée correctement
- Stats à jour

---

### Test E: Schema Information

**Action**:
```
1. Template avec plusieurs champs required et optional
2. Onglet "Lint & Validate"
3. Cliquer "Run Lint Check"
4. Scroller jusqu'à "Schema Information"
```

**Attendu**:
- Required Fields listés avec *
- Optional Fields listés sans *
- Séparation claire entre les deux

---

## Tests de Régression

### Vérifier que rien n'est cassé

**Autres onglets Admin Dashboard**:
```
1. Dashboard → Fonctionne
2. Modèles → Fonctionne
3. Utilisateurs → Fonctionne
4. Facturation → Fonctionne
5. Articles → Fonctionne
```

**Attendu**: Tous les onglets existants fonctionnent normalement

---

## Tests d'Erreur

### Test 1: Template sans schema_json

**Setup**: Template où schema_json est null

**Attendu**:
- Linter n'affiche aucun champ
- Message: "No fields defined in schema"
- Ou affiche uniquement les variables détectées

---

### Test 2: Template avec content_template null

**Setup**: Template où content_template est null ou ""

**Attendu**:
- Linter affiche: 0 variables used
- Status: Pass (techniquement valide, pas de variables)

---

### Test 3: Navigation sans être admin

**Setup**: Se connecter avec compte non-admin

**Action**: Essayer d'accéder au Lab

**Attendu**:
- Message: "Accès Restreint"
- Pas d'erreur console

---

## Checklist Complète

- [ ] Interface Lab & Linter accessible depuis Admin Dashboard
- [ ] Boutons de navigation Lab ↔ Linter fonctionnent
- [ ] Liste des templates s'affiche (107 templates)
- [ ] Statistiques affichées correctement
- [ ] Clic sur "Tester →" ouvre le détail
- [ ] 3 onglets présents: Test, Lint, History
- [ ] Onglet Test: Preview fonctionne
- [ ] Onglet Lint: Linter s'affiche
- [ ] Linter détecte variables inconnues
- [ ] Linter détecte placeholders TODO/FIXME
- [ ] Schema Information affichée correctement
- [ ] Status Pass/Fail visuel clair
- [ ] Onglet History: Tests et Certificats affichés
- [ ] Boutons Approuver/Rejeter fonctionnent
- [ ] iDoc Linter: 5 modes disponibles
- [ ] iDoc Linter: Message si pas de templates
- [ ] Retour à la liste fonctionne
- [ ] Filtres recherche/status fonctionnent
- [ ] Build passe sans erreur
- [ ] Pas d'erreurs console
- [ ] Autres onglets Admin toujours fonctionnels

---

## Problèmes Connus

### iDoc Linter: "No templates found"

**Normal si**: Table `idoc_guided_templates` est vide

**Pas un bug**: C'est attendu, cette table n'a pas encore été populée

**Pour tester le linter iDoc**:
1. Créer des templates via migration
2. Ou utiliser uniquement le linter intégré dans le Lab

---

## Commandes Utiles

### Vérifier les templates

```sql
-- Compter templates Lab
SELECT COUNT(*) FROM document_templates;
-- Résultat: 107

-- Compter templates iDoc
SELECT COUNT(*) FROM idoc_guided_templates;
-- Résultat: 0 (normal pour l'instant)

-- Voir un template
SELECT id, name, title, category, review_status
FROM document_templates
LIMIT 1;
```

### Logs Browser

```javascript
// Console
console.log('Active tab:', activeTab);

// Check auth
console.log('Profile:', profile);
console.log('Role:', profile?.role);
```

---

## Report de Bug

Si vous trouvez un problème, noter:

1. **Quoi**: Description du problème
2. **Où**: Quel onglet, quel composant
3. **Quand**: Quelle action a déclenché
4. **Console**: Erreurs dans F12 → Console
5. **Network**: Requêtes échouées dans F12 → Network
6. **Screenshot**: Image du problème

---

**Date**: 2 Janvier 2026
**Version testée**: Lab & Linter Unifié v1.0
**Build**: ✅ Successful
