# iDoc Linter Pro - Quick Start Guide

## Accessing the Linter

1. Log in as **admin** user
2. Go to **Admin Dashboard**
3. Click **"iDoc Linter Pro"** in the sidebar

## Using Single Lint

```
1. Select template from dropdown
2. Choose a fixture OR enter custom JSON
3. Click "Run Lint"
4. Review results
```

### What You'll See:
- Variables used in template
- Unknown variables (red)
- Placeholder text warnings
- Section-level analysis
- Cache status

## Using Batch Lint

```
1. Click "Batch Lint" tab
2. Click "Run Batch Lint"
3. View summary table
```

### What You'll See:
- All templates status (pass/fail)
- Unknown variable counts
- Placeholder detection
- Publish buttons

## Publishing Templates

```
1. Run lint first (single or batch)
2. If template passes, click "Publish"
3. Confirm action
4. Template is now live
```

### Blockers:
- Templates with TODO/FIXME variables
- Templates with placeholder text
- Templates with suspicious variables

### Override:
- Use "Force Publish" option (use with caution)

## Troubleshooting

### "Failed to fetch"
- **Check**: You're logged in as admin
- **Check**: Browser console for errors
- **Fix**: Refresh page and try again

### 403 Forbidden
- **Check**: Your user role is 'admin'
- **Fix**: Update role in database

### Invalid JSON
- **Fix**: Use fixture dropdown instead
- **Fix**: Validate JSON syntax

## Performance Tips

1. **First lint is slower** - builds cache
2. **Subsequent lints are fast** - uses cache
3. **Batch lint updates cache** - for all templates
4. **Cache auto-invalidates** - on template updates

## Quick Reference

| Action | Time | Caching |
|--------|------|---------|
| First Lint | ~500ms | Builds cache |
| Cached Lint | ~150ms | Uses cache |
| Batch Lint | ~3s | Updates all caches |
| Publish | ~200ms | N/A |

## Need Help?

See detailed guides:
- `IDOC_LINTER_TROUBLESHOOTING.md` - Fix issues
- `IDOC_LINTER_DEPLOYMENT_COMPLETE.md` - Full docs
