# iDoc Linter - Guide de Diagnostic

## Status: Fonctions Redéployées ✅

Les fonctions `idoc-lint` et `idoc-batch-lint` ont été redéployées avec les headers CORS corrects.

---

## Si "Failed to fetch" persiste

### 1. Vérifier l'URL Supabase

Ouvrir la console du navigateur et vérifier que l'URL utilisée est correcte:

```javascript
console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL);
```

L'URL devrait ressembler à: `https://[project-id].supabase.co`

### 2. Vérifier l'Authentification

Le linter nécessite:
- Utilisateur connecté
- Rôle admin dans `user_profiles`

```sql
-- Vérifier le rôle
SELECT role FROM user_profiles WHERE id = auth.uid();
```

### 3. Tester avec cURL

```bash
# Obtenir le token
# Dans la console du navigateur:
supabase.auth.getSession().then(d => console.log(d.data.session.access_token))

# Tester idoc-batch-lint
curl -X POST https://[project-id].supabase.co/functions/v1/idoc-batch-lint \
  -H "Authorization: Bearer [TOKEN]" \
  -H "Content-Type: application/json" \
  -d '{}'
```

### 4. Vérifier les Headers CORS

Les fonctions utilisent maintenant ces CORS headers:
```javascript
'Access-Control-Allow-Origin': origin // ou 'https://id0c.com' par défaut
'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey'
```

### 5. Alternative: Utiliser la nouvelle fonction Verify & Publish

Si le linter ne fonctionne toujours pas, utilisez la nouvelle fonction `idoc-verify-publish` qui combine lint + publication:

```javascript
const { data: { session } } = await supabase.auth.getSession();

const response = await fetch(`${supabaseUrl}/functions/v1/idoc-verify-publish`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${session.access_token}`,
  },
  body: JSON.stringify({
    template_id: 'YOUR_TEMPLATE_ID',
    dry_run: true  // Pour tester sans publier
  })
});

const result = await response.json();
console.log(result);
```

---

## Endpoints Disponibles

| Fonction | Endpoint | Méthode | Auth |
|----------|----------|---------|------|
| idoc-lint | `/functions/v1/idoc-lint` | POST | Admin |
| idoc-batch-lint | `/functions/v1/idoc-batch-lint` | POST | Admin |
| idoc-verify-publish | `/functions/v1/idoc-verify-publish` | POST | Admin |
| idoc-catalog | `/functions/v1/idoc-catalog/catalog` | GET | Public |
| idoc-checkout | `/functions/v1/idoc-checkout` | POST | Optionnel |

---

## Codes d'Erreur Communs

| Code | Signification | Solution |
|------|---------------|----------|
| 403 | Pas admin | Vérifier `user_profiles.role = 'admin'` |
| 404 | Template non trouvé | Vérifier l'ID du template |
| 405 | Mauvaise méthode | Utiliser POST |
| 500 | Erreur serveur | Vérifier les logs Supabase |
| CORS Error | Origine non autorisée | Fonction redéployée avec CORS fixes |

---

## Test Rapide dans la Console

Copier-coller ce code dans la console du navigateur (sur la page admin):

```javascript
(async () => {
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    console.error('❌ Pas connecté');
    return;
  }

  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  console.log('🔗 URL:', supabaseUrl);

  try {
    const response = await fetch(`${supabaseUrl}/functions/v1/idoc-batch-lint`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.access_token}`,
      },
      body: JSON.stringify({})
    });

    console.log('📡 Status:', response.status);
    const result = await response.json();
    console.log('✅ Résultat:', result);
  } catch (err) {
    console.error('❌ Erreur:', err);
  }
})();
```

---

## Solution Temporaire

Si le linter reste problématique, utilisez directement les vérifications SQL:

```sql
-- Vérifier tous les templates
SELECT
  id,
  template_code,
  status,
  last_verified_at,
  updated_at,
  CASE
    WHEN status = 'VERIFIED' AND last_verified_at >= updated_at THEN 'READY'
    ELSE 'NEEDS_VERIFICATION'
  END as production_status
FROM idoc_guided_templates
WHERE is_active = true;

-- Templates avec status DRAFT
SELECT template_code, status, updated_at
FROM idoc_guided_templates
WHERE status = 'DRAFT' AND is_active = true;

-- Templates production-ready
SELECT * FROM idoc_production_templates;
```

---

## Contact Support Supabase

Si le problème persiste après ces vérifications, les logs des Edge Functions sont disponibles dans le dashboard Supabase:

1. Aller sur https://supabase.com/dashboard
2. Sélectionner le projet
3. Edge Functions → Logs
4. Filtrer par `idoc-lint` ou `idoc-batch-lint`
5. Vérifier les erreurs

---

## Changelog

**2026-01-02**: Fonctions redéployées avec:
- Headers CORS fixes
- Support de `boolFR` et `this` dans le linter
- Amélioration des messages d'erreur
