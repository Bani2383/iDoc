# iDoc Template Linter - Guide Complet

## Vue d'ensemble

Le **iDoc Linter** est un outil de validation des templates guidés qui permet de détecter automatiquement les erreurs de variables, les typos et les incohérences dans les templates.

## Architecture

### Composants

1. **Edge Function** : `supabase/functions/idoc-lint/index.ts`
   - Endpoint sécurisé admin-only
   - Lit les templates depuis la base de données
   - Analyse les variables utilisées
   - Compare avec les données fournies

2. **UI Admin** : `src/components/AdminIdocLinter.tsx`
   - Interface graphique pour tester les templates
   - Affichage des résultats de validation
   - Support de l'entrée JSON pour les données de test

3. **Intégration** : Section "Développement" du dashboard admin
   - Accessible via Admin > iDoc Linter
   - Réservé aux administrateurs

## Fonctionnalités

### Détection des variables

Le linter extrait automatiquement toutes les variables utilisées dans un template :

```handlebars
{{inputs.firstName}}
{{inputs.lastName}}
{{result.selectedTemplate}}
```

### Types de variables supportées

- Variables simples : `{{variableName}}`
- Variables avec chemins : `{{inputs.fieldName}}`
- Variables de résultat : `{{result.property}}`

### Éléments ignorés

Le linter ignore intelligemment :
- Les blocks Handlebars : `{{#if}}`, `{{/if}}`, `{{#each}}`, `{{/each}}`
- Les helpers : `{{boolFR}}`, `{{dateFormat}}`, etc.

## Utilisation

### Via l'interface Admin

1. Connectez-vous en tant qu'administrateur
2. Accédez à **Admin Dashboard > Développement > iDoc Linter**
3. Sélectionnez un template dans la liste déroulante
4. Entrez les données de test au format JSON :

```json
{
  "firstName": "Jean",
  "lastName": "Dupont",
  "email": "jean.dupont@example.com",
  "country": "Canada"
}
```

5. Cliquez sur "Run Lint Check"
6. Consultez les résultats

### Via l'API Edge Function

#### Endpoint

```
POST /functions/v1/idoc-lint
```

#### Headers

```
Authorization: Bearer {JWT_TOKEN}
Content-Type: application/json
```

#### Body

```json
{
  "template_id": "uuid-du-template",
  "inputs": {
    "field1": "value1",
    "field2": "value2"
  }
}
```

#### Réponse Success

```json
{
  "ok": true,
  "templateId": "TEMPLATE_CODE",
  "varsUsed": [
    "inputs.firstName",
    "inputs.lastName",
    "inputs.email"
  ],
  "unknownVars": [
    "inputs.phoneNumber"
  ],
  "sections": [
    {
      "sectionCode": "HEADER",
      "varsUsed": ["inputs.firstName"],
      "unknownVars": []
    }
  ],
  "metadata": {
    "requiredVariables": ["firstName", "lastName"],
    "optionalVariables": ["phoneNumber"]
  }
}
```

#### Réponse Error

```json
{
  "ok": false,
  "error": "Template not found"
}
```

## Résultats de validation

### Variables utilisées (varsUsed)

Liste complète de toutes les variables détectées dans le template principal et les sections.

### Variables inconnues (unknownVars)

Variables présentes dans le template mais **absentes** des données fournies. Cela peut indiquer :
- Une typo dans le nom de la variable
- Une variable oubliée dans les données de test
- Une variable qui devrait être optionnelle

### Analyse par section

Pour chaque section liée au template, le linter fournit :
- `sectionCode` : Identifiant de la section
- `varsUsed` : Variables utilisées dans cette section
- `unknownVars` : Variables manquantes dans cette section

### Métadonnées

- `requiredVariables` : Variables déclarées comme obligatoires
- `optionalVariables` : Variables déclarées comme optionnelles

## Cas d'usage

### 1. Validation avant publication

Avant de publier un nouveau template :
1. Créez le template dans le Lab
2. Exécutez le linter avec des données de test complètes
3. Vérifiez que `unknownVars` est vide
4. Publiez en toute confiance

### 2. Débogage de templates existants

Pour déboguer un template qui ne génère pas correctement :
1. Chargez le template dans le linter
2. Utilisez les vraies données utilisateur
3. Identifiez les variables manquantes ou mal orthographiées
4. Corrigez le template

### 3. Tests automatisés

Intégration dans un pipeline de test :

```typescript
const response = await fetch(`${supabaseUrl}/functions/v1/idoc-lint`, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${adminToken}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    template_id: templateId,
    inputs: testData
  })
});

const result = await response.json();

if (result.unknownVars.length > 0) {
  console.error('Template validation failed:', result.unknownVars);
  process.exit(1);
}
```

## Sécurité

### Authentification

- Endpoint protégé par authentification JWT Supabase
- Vérification du rôle admin dans `user_profiles`
- Accès refusé pour les utilisateurs non-admin

### Permissions requises

- Rôle : `admin` dans la table `user_profiles`
- Token JWT valide dans l'en-tête Authorization

## Limitations actuelles

1. **Helpers personnalisés** : Les helpers complexes peuvent parfois être mal interprétés
2. **Variables dynamiques** : Les variables construites dynamiquement ne sont pas détectées
3. **Conditionnelles complexes** : Les conditions imbriquées peuvent nécessiter une analyse manuelle

## Améliorations futures

### Proposées

1. **Lint Batch** : Valider plusieurs templates en une seule requête
2. **Cache** : Mise en cache de l'extraction de variables pour accélérer
3. **Fail Fast** : Option pour bloquer la publication si des erreurs sont détectées
4. **Suggestions** : Proposer des corrections pour les typos détectées
5. **Export Report** : Générer un rapport PDF des résultats de validation
6. **CI/CD Integration** : Webhook pour validation automatique lors de modifications

### Roadmap

- **Q1 2026** : Lint Batch + Cache
- **Q2 2026** : Fail Fast + Suggestions
- **Q3 2026** : Export Report + CI/CD

## Support

Pour toute question ou problème :
1. Consultez cette documentation
2. Vérifiez les logs de l'Edge Function
3. Contactez l'équipe de développement

## Exemples avancés

### Test avec données complexes

```json
{
  "applicant": {
    "firstName": "Marie",
    "lastName": "Martin",
    "contact": {
      "email": "marie.martin@example.com",
      "phone": "+1-514-555-0100"
    }
  },
  "application": {
    "type": "STUDY_PERMIT",
    "country": "Canada",
    "province": "Quebec"
  }
}
```

### Template avec variables imbriquées

```handlebars
Bonjour {{applicant.firstName}} {{applicant.lastName}},

Votre demande de {{application.type}} pour le {{application.country}}
a été reçue.

Contact : {{applicant.contact.email}}
```

### Résultat d'analyse

```json
{
  "ok": true,
  "varsUsed": [
    "applicant.firstName",
    "applicant.lastName",
    "application.type",
    "application.country",
    "applicant.contact.email"
  ],
  "unknownVars": []
}
```

## Maintenance

### Mise à jour du linter

Si vous modifiez la logique d'extraction des variables :

1. Modifiez `supabase/functions/idoc-lint/index.ts`
2. Testez avec plusieurs templates
3. Déployez via Supabase CLI ou l'interface Supabase

### Ajout de nouveaux patterns

Pour supporter de nouveaux patterns de variables, modifiez la fonction `extractVariables()` :

```typescript
function extractVariables(content: string): string[] {
  // Votre logique personnalisée
  const matches = content.match(/custom-pattern/g) || [];
  return uniq(matches);
}
```

## Troubleshooting

### Problème : "Admin access required"

**Solution** : Vérifiez que votre compte a le rôle `admin` dans la table `user_profiles`

```sql
UPDATE user_profiles SET role = 'admin' WHERE id = 'votre-user-id';
```

### Problème : "Template not found"

**Solution** : Vérifiez que le template existe et est actif

```sql
SELECT id, template_code, is_active
FROM idoc_guided_templates
WHERE id = 'template-id';
```

### Problème : Trop de variables inconnues

**Solution** :
1. Vérifiez la structure de vos données de test
2. Utilisez des chemins complets (ex: `inputs.field` au lieu de `field`)
3. Consultez les `requiredVariables` et `optionalVariables`

## Conclusion

Le iDoc Linter est un outil essentiel pour maintenir la qualité et la fiabilité des templates. Utilisez-le régulièrement pendant le développement pour détecter les problèmes tôt et assurer une expérience utilisateur optimale.
