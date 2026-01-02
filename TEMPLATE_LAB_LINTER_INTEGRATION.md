# Template Lab & Linter - Intégration Complète

## Vue d'Ensemble

Le **Lab des Modèles** et le **Linter iDoc** sont maintenant intégrés dans une interface unifiée. Vous pouvez tester, valider et certifier tous vos templates depuis un seul endroit.

---

## Architecture

### Systèmes de Templates

1. **document_templates** (107 templates)
   - Ancienne table pour les templates document_type
   - Utilisée par le Lab des Modèles
   - Structure: content_template (texte), schema_json (champs)

2. **idoc_guided_templates** (0 templates actuellement)
   - Nouvelle table pour les templates guidés iDoc
   - Structure: sections (JSON array), fixtures (test data)
   - Supporte le système de lint avancé

### Composants Créés

1. **UnifiedTemplateLab** - Interface unifiée
   - Navigation entre Lab et Linter
   - Design cohérent avec onglets

2. **TemplateLinter** - Linter intégré au Lab
   - Validation en temps réel
   - Compatible avec document_templates
   - Détection variables inconnues
   - Détection placeholders (TODO/FIXME)

3. **TemplateLabDetail** - Nouveau système d'onglets
   - **Test & Preview**: Tester le template avec données
   - **Lint & Validate**: Valider la structure
   - **History**: Historique tests et certificats

---

## Utilisation

### Accès

1. Aller dans **Admin Dashboard**
2. Menu latéral: **Lab & Linter** (icône Beaker)
3. Deux boutons en haut:
   - **Template Lab**: Tester les templates document_templates
   - **iDoc Linter**: Auditer les templates idoc_guided_templates

### Workflow Complet

#### 1. Test d'un Template (Lab)

```
1. Cliquer sur "Template Lab"
2. Sélectionner un template dans la liste (107 disponibles)
3. Onglet "Test & Preview":
   - Remplir les champs du schéma
   - Cliquer "Générer Prévisualisation"
   - Vérifier le rendu
   - Marquer "Test Réussi" ou "Test Échoué"

4. Onglet "Lint & Validate":
   - Entrer des valeurs de test
   - Cliquer "Run Lint Check"
   - Voir les erreurs (variables inconnues, placeholders)
   - Corriger si nécessaire

5. Onglet "History":
   - Voir tous les tests précédents
   - Voir les certificats de conformité

6. Approuver ou Rejeter:
   - Boutons en haut
   - Si approuvé → Certificat généré
   - Si rejeté → Notes internes ajoutées
```

#### 2. Audit iDoc (Linter)

```
1. Cliquer sur "iDoc Linter"
2. Choisir un mode d'audit:
   - Single: Un template précis
   - All: Tous les templates
   - Random: N templates aléatoires
   - Category: Par catégorie
   - Unverified: Non vérifiés depuis X jours

3. Lancer l'audit
4. Analyser les résultats
5. Exporter CSV/JSON si nécessaire
```

---

## Fonctionnalités du Linter Intégré

### Détection Automatique

**Variables Inconnues**
- Détecte `{{variable}}` non définie dans schema
- Liste toutes les variables non reconnues
- Affiche en rouge avec alerte

**Placeholders**
- Détecte [TODO], [FIXME], [XXX]
- Détecte TODO:, FIXME:
- Alerte orange si trouvé

**Helpers Handlebars**
- Reconnaît les helpers standards: if, unless, each, with, eq, ne, lt, gt, and, or, not
- Support du helper custom: boolFR
- Ignore les helpers connus pour éviter faux positifs

**Contexte Handlebars**
- Ignore `{{this}}`
- Ignore `{{#each}}`, `{{/each}}`
- Ignore `{{#if}}`, `{{/if}}`

### Résultats Visuels

**Status Pass**
- Badge vert avec checkmark
- "All variables are properly defined"
- Aucune action requise

**Status Fail**
- Badge rouge avec warning
- Liste des problèmes détectés
- Actions recommandées

**Statistiques**
- Variables Used: Compteur bleu
- Unknown Variables: Compteur rouge (si > 0)
- Placeholders: Orange si détecté, vert sinon

**Schema Info**
- Required Fields: Avec astérisque *
- Optional Fields: Sans astérisque
- Facilite la validation

---

## Différences Clés

| Aspect | Template Lab (document_templates) | iDoc Linter (idoc_guided_templates) |
|--------|-----------------------------------|-------------------------------------|
| Structure | content_template (texte) + schema_json | sections (array) + metadata |
| Validation | Linter local (frontend) | Edge functions (backend) |
| Fixtures | Non | Oui (test data) |
| Lint Cache | Non | Oui |
| Sections | Non | Oui |
| Publish | Via approval | Via lint + verify |

---

## Migration Future

Pour migrer les templates de `document_templates` vers `idoc_guided_templates`:

```sql
-- Script de migration (à adapter selon besoin)
INSERT INTO idoc_guided_templates (
  template_code,
  title,
  category,
  sections,
  is_active,
  created_at
)
SELECT
  name as template_code,
  title,
  category,
  jsonb_build_array(
    jsonb_build_object(
      'section_code', 'main',
      'section_title', jsonb_build_object('en', 'Main Content'),
      'content_template', content_template
    )
  ) as sections,
  true as is_active,
  created_at
FROM document_templates
WHERE review_status = 'published';
```

---

## Dépannage

### "No templates found" dans iDoc Linter

**Cause**: Table `idoc_guided_templates` est vide

**Solution**:
1. Créer des templates via l'API iDoc
2. Ou migrer depuis document_templates
3. Vérifier avec: `SELECT COUNT(*) FROM idoc_guided_templates;`

### Linter ne détecte pas mes erreurs

**Vérifications**:
1. Le schema_json contient-il les champs?
2. Les noms de champs correspondent-ils exactement?
3. Y a-t-il des espaces autour du nom dans {{variable}}?

### Template Lab: Edge function error

**Cause**: API template-lab-api non accessible

**Solution**:
```bash
# Vérifier que la fonction existe
supabase functions list

# Vérifier les logs
supabase functions logs template-lab-api

# Re-déployer si nécessaire
cd supabase/functions
supabase functions deploy template-lab-api
```

### Variables Handlebars mal détectées

**Helpers connus actuellement**:
- if, unless, each, with
- eq, ne, lt, gt, and, or, not
- boolFR (custom)

**Pour ajouter un helper**:
Modifier `TemplateLinter.tsx` ligne ~60:
```typescript
const knownHelpers = ['if', 'unless', 'each', 'with', 'eq', 'ne', 'lt', 'gt', 'and', 'or', 'not', 'boolFR', 'NOUVEAU_HELPER'];
```

---

## Prochaines Évolutions

### Court Terme
- [ ] Migration wizard document_templates → idoc_guided_templates
- [ ] Lint automatique à chaque modification
- [ ] Alertes si template non vérifié depuis 30 jours

### Moyen Terme
- [ ] Fixtures auto-générées depuis schema
- [ ] Preview PDF direct dans le Lab
- [ ] Comparaison versions (diff)
- [ ] Tests A/B intégrés

### Long Terme
- [ ] IA: Suggestion corrections
- [ ] IA: Génération fixtures réalistes
- [ ] Marketplace templates certifiés
- [ ] Import/Export entre environnements

---

## API Reference

### TemplateLinter Component

```typescript
interface TemplateLinterProps {
  templateId: string;         // ID du template
  templateContent: string;    // Contenu Handlebars
  schemaFields: any[];        // Champs du schema
}
```

**Usage**:
```tsx
<TemplateLinter
  templateId={template.id}
  templateContent={template.content_template}
  schemaFields={template.schema_json?.fields || []}
/>
```

### UnifiedTemplateLab Component

```typescript
// Pas de props, composant autonome
<UnifiedTemplateLab />
```

**Features**:
- Gestion état navigation (lab/linter)
- Design cohérent
- Switch instantané

---

## Support

### Problème avec le Lab?
1. Console browser: Rechercher erreurs
2. Network tab: Vérifier appels API `/template-lab-api/`
3. Vérifier auth: Session doit être valide

### Problème avec le Linter?
1. Console browser: Rechercher erreurs
2. Vérifier templates existent: `SELECT COUNT(*) FROM idoc_guided_templates;`
3. Tester edge function: `/idoc-lint` avec curl

### Demande d'aide
Fournir:
- Screenshot de l'erreur
- Console logs (F12 → Console)
- Network tab (F12 → Network)
- Template ID concerné

---

**Version**: 1.0 (Janvier 2026)
**Status**: Production Ready ✅
**Composants**: 3 nouveaux (UnifiedTemplateLab, TemplateLinter, TemplateLabDetail amélioré)
