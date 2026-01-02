# iDoc Template Linter - Implémentation Complète

## Résumé

Le système de **linting de templates iDoc** a été entièrement adapté et intégré à votre architecture Supabase. Cette fonctionnalité permet de valider automatiquement les templates guidés en détectant les variables manquantes, les typos et les incohérences.

## Fichiers créés

### 1. Edge Function Supabase
**Fichier** : `supabase/functions/idoc-lint/index.ts`

Fonctionnalités :
- Endpoint sécurisé admin-only avec vérification JWT
- Lecture des templates depuis la base de données `idoc_guided_templates`
- Extraction intelligente des variables `{{...}}`
- Ignore les blocks Handlebars et les helpers
- Analyse des sections associées au template
- Retourne les variables utilisées et inconnues

### 2. Interface Admin
**Fichier** : `src/components/AdminIdocLinter.tsx`

Fonctionnalités :
- Sélection de template via dropdown
- Éditeur JSON pour les données de test
- Affichage détaillé des résultats :
  - Variables utilisées
  - Variables inconnues (typos)
  - Analyse par section
  - Métadonnées (variables requises/optionnelles)
- Interface responsive et intuitive

### 3. Intégration Dashboard
**Fichier** : `src/components/AdminDashboard.tsx` (modifié)

Ajouts :
- Nouvelle section "Développement" dans le menu
- Entrée "iDoc Linter" avec icône Code
- Route `idoc-linter` dans l'état actif
- Import du composant AdminIdocLinter

### 4. Documentation complète
**Fichier** : `docs/idoc/IDOC_LINTER_GUIDE.md`

Contenu :
- Architecture détaillée
- Guide d'utilisation (UI et API)
- Exemples de requêtes et réponses
- Cas d'usage pratiques
- Troubleshooting
- Roadmap des améliorations

## Utilisation

### Via l'interface Admin

1. Accédez au dashboard admin
2. Cliquez sur **Développement > iDoc Linter**
3. Sélectionnez un template
4. Entrez les données de test JSON :

```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com"
}
```

5. Cliquez sur "Run Lint Check"
6. Analysez les résultats

### Via l'API Edge Function

```bash
curl -X POST \
  https://your-project.supabase.co/functions/v1/idoc-lint \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "template_id": "uuid-du-template",
    "inputs": {
      "firstName": "John",
      "lastName": "Doe"
    }
  }'
```

## Sécurité

- Authentification JWT obligatoire
- Vérification du rôle `admin` dans `user_profiles`
- CORS configuré pour id0c.com et localhost
- Service Role Key utilisée pour accès complet à la DB

## Avantages

### 1. Détection précoce des erreurs
Identifiez les typos et variables manquantes avant la mise en production.

### 2. Qualité des templates
Maintenez un haut niveau de qualité pour tous vos templates.

### 3. Gain de temps
Évitez les allers-retours de débogage en production.

### 4. Documentation automatique
Obtenez la liste complète des variables utilisées par template.

## Exemples de résultats

### Template valide

```json
{
  "ok": true,
  "templateId": "IRCC_REFUSAL_LETTER",
  "varsUsed": [
    "inputs.firstName",
    "inputs.lastName",
    "inputs.applicationNumber"
  ],
  "unknownVars": [],
  "sections": [],
  "metadata": {
    "requiredVariables": ["firstName", "lastName", "applicationNumber"],
    "optionalVariables": ["phoneNumber"]
  }
}
```

### Template avec erreurs

```json
{
  "ok": true,
  "templateId": "STUDY_PERMIT_LETTER",
  "varsUsed": [
    "inputs.firstName",
    "inputs.lstName",
    "inputs.dateOfBirth"
  ],
  "unknownVars": [
    "inputs.lstName"
  ],
  "sections": [],
  "metadata": {
    "requiredVariables": ["firstName", "lastName", "dateOfBirth"],
    "optionalVariables": []
  }
}
```

**Problème détecté** : Typo `lstName` au lieu de `lastName`

## Déploiement

### Edge Function

L'Edge Function sera automatiquement déployée lors du prochain push vers Supabase :

```bash
# Option 1 : Via Git (automatique avec votre config)
git push origin main

# Option 2 : Via Supabase CLI (manuel)
supabase functions deploy idoc-lint
```

### Frontend

Le composant est déjà intégré et sera disponible après déploiement :

```bash
npm run build
# Déployez vers votre hébergeur (Vercel, Netlify, etc.)
```

## Tests

### Build réussi
✅ Le projet compile sans erreurs
✅ Toutes les dépendances sont résolues
✅ Les types TypeScript sont valides

### Tests recommandés après déploiement

1. **Test d'authentification**
   - Vérifiez que seuls les admins peuvent accéder
   - Testez avec un utilisateur non-admin (devrait échouer)

2. **Test de validation**
   - Créez un template de test avec des typos volontaires
   - Lancez le linter
   - Vérifiez que les typos sont détectés

3. **Test de sections**
   - Utilisez un template avec plusieurs sections
   - Vérifiez que toutes les sections sont analysées

## Prochaines étapes recommandées

### Phase 1 : Validation manuelle
1. Déployez les modifications
2. Testez avec vos templates existants
3. Corrigez les typos détectés

### Phase 2 : Intégration workflow
1. Ajoutez le linting à votre processus de création de templates
2. Créez des données de test standard pour chaque catégorie
3. Documentez les bonnes pratiques

### Phase 3 : Automatisation
1. Implémentez le batch linting (plusieurs templates)
2. Ajoutez un système de cache pour l'extraction
3. Créez des tests automatisés

## Améliorations futures proposées

### Court terme (Q1 2026)
- [ ] **Lint Batch** : Valider plusieurs templates en une seule requête
- [ ] **Cache** : Accélérer les validations répétées
- [ ] **UI améliorée** : Coloration syntaxique des variables

### Moyen terme (Q2 2026)
- [ ] **Fail Fast** : Bloquer la publication si erreurs critiques
- [ ] **Suggestions** : Proposer des corrections pour les typos
- [ ] **Historique** : Sauvegarder les résultats de lint

### Long terme (Q3 2026)
- [ ] **Export Report** : Générer des rapports PDF
- [ ] **CI/CD Integration** : Validation automatique sur commit
- [ ] **Notifications** : Alertes pour les templates problématiques

## Support technique

### Documentation
- Guide complet : `docs/idoc/IDOC_LINTER_GUIDE.md`
- Architecture : Ce fichier

### Ressources
- Edge Function : `supabase/functions/idoc-lint/index.ts`
- Component : `src/components/AdminIdocLinter.tsx`
- Dashboard : `src/components/AdminDashboard.tsx`

### Troubleshooting

**Problème** : "Admin access required"
**Solution** : Mettre à jour le rôle dans la DB
```sql
UPDATE user_profiles SET role = 'admin' WHERE id = 'your-user-id';
```

**Problème** : Variables non détectées
**Solution** : Vérifier le format des variables dans le template (doit être `{{variable}}`)

**Problème** : Trop de faux positifs
**Solution** : Améliorer les données de test pour inclure toutes les variables optionnelles

## Conclusion

Le système de linting iDoc est maintenant opérationnel et prêt à être utilisé. Cette implémentation :

- ✅ Est entièrement adaptée à votre architecture Supabase
- ✅ Utilise l'authentification et les permissions existantes
- ✅ S'intègre parfaitement au dashboard admin
- ✅ Est documentée de manière exhaustive
- ✅ Compile sans erreurs
- ✅ Prête pour le déploiement

Vous pouvez maintenant valider vos templates de manière professionnelle et éviter les erreurs de production.
