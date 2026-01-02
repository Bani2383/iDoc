# iDoc Linter Pro - Troubleshooting Guide

## Status: Functions Deployed ✅

The following Edge Functions have been successfully deployed:

- `idoc-lint` - Single template validation
- `idoc-batch-lint` - Batch template validation
- `idoc-publish` - Template publishing with validation

## Quick Fix: "Failed to fetch" Error

If you see "Failed to fetch", follow these steps:

### 1. Check Authentication

Make sure you're logged in as an **admin user**. The linter requires admin privileges.

```sql
-- Verify your user role in Supabase
SELECT id, email, role FROM user_profiles WHERE role = 'admin';
```

### 2. Check Environment Variables

Verify your `.env` file has the correct Supabase URL:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### 3. Test Edge Function Directly

Test the function using curl:

```bash
curl -X POST "https://your-project.supabase.co/functions/v1/idoc-lint" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "template_id": "template-uuid-here",
    "inputs": {}
  }'
```

### 4. Check Browser Console

Open the browser console (F12) and look for:
- Network errors (check the Network tab)
- CORS errors
- Authentication errors

### 5. Verify CORS Configuration

The functions should allow requests from:
- `https://id0c.com`
- `https://www.id0c.com`
- `http://localhost:5173` (dev)
- `http://localhost:3000` (dev)

If you're running on a different port, update `supabase/functions/_shared/cors.ts`:

```typescript
const ALLOWED_ORIGINS = [
  'https://id0c.com',
  'https://www.id0c.com',
  'http://localhost:5173',
  'http://localhost:YOUR_PORT', // Add your port
];
```

Then redeploy the functions.

## Common Issues

### Issue 1: 403 Forbidden

**Cause:** User is not an admin

**Solution:** Update user role in database:

```sql
UPDATE user_profiles
SET role = 'admin'
WHERE email = 'your-email@example.com';
```

### Issue 2: 404 Not Found

**Cause:** Edge Function not deployed or incorrect URL

**Solution:**
1. Verify functions are deployed in Supabase Dashboard > Edge Functions
2. Check the Supabase URL in `.env`
3. Ensure function names match: `idoc-lint`, `idoc-batch-lint`, `idoc-publish`

### Issue 3: Network Error / Failed to Fetch

**Cause:** Network issue or CORS problem

**Solution:**
1. Check internet connection
2. Verify Supabase project is active
3. Check browser console for CORS errors
4. Add your origin to CORS whitelist

### Issue 4: Invalid JSON

**Cause:** Malformed JSON in inputs field

**Solution:**
- Use the fixture dropdown to load pre-configured test data
- Validate JSON syntax before submitting
- Ensure all keys are quoted: `{"key": "value"}`

## Function Endpoints

### Single Lint
```
POST /functions/v1/idoc-lint
Body: {
  "template_id": "uuid",
  "inputs": {},
  "use_cache": true
}
```

### Batch Lint
```
POST /functions/v1/idoc-batch-lint
Body: {
  "template_ids": ["uuid1", "uuid2"],
  "published_only": false
}
```

### Publish
```
POST /functions/v1/idoc-publish
Body: {
  "template_id": "uuid",
  "force": false
}
```

## Testing Tips

1. **Start with Single Lint**: Test one template first before running batch operations
2. **Use Fixtures**: Load pre-configured test data using the fixture dropdown
3. **Check Cache**: First lint might be slower as it builds cache
4. **Monitor Logs**: Check Supabase Edge Function logs for errors

## Getting Help

If issues persist:

1. Check Supabase Dashboard > Edge Functions > Logs
2. Look for error messages in browser console (F12 > Console)
3. Verify your user has admin role in `user_profiles` table
4. Ensure functions are deployed and running

## Manual Redeployment

If you need to redeploy the functions:

```bash
# The functions are already deployed via the deploy_edge_function tool
# To redeploy, use the same tool with the updated function code
```

Or use the deployment script:

```bash
npx tsx scripts/deployIdocFunctions.ts
```

## Success Indicators

When everything works correctly, you should see:

- **Single Lint**: Template analysis with variables, unknowns, and placeholders
- **Batch Lint**: Summary table with pass/fail status for all templates
- **Publish**: Confirmation or blocker messages
- **Cache**: "Cache Used: Yes" indicator for subsequent runs

## Performance Notes

- First lint: ~500-1000ms (builds cache)
- Cached lint: ~100-200ms
- Batch lint: ~2-5s for 10 templates
- Batch operations update cache automatically
