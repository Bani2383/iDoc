# Guided Templates - Integration Documentation

## Overview

The Guided Templates system is a **NEW FEATURE** that has been integrated incrementally without modifying or replacing any existing functionality. This system provides advanced document generation with conditional logic, dynamic sections, and rule-based validation.

## Key Principles

1. **No Breaking Changes** - All existing features remain intact
2. **Coexistence** - New system works alongside existing templates
3. **Modularity** - Independent components that don't affect existing code
4. **Progressive Enhancement** - Users can still use traditional templates

## Architecture

### New Components

#### 1. Rule Engine (`src/lib/guidedTemplateEngine.ts`)
- Core engine for conditional logic
- Handles field validation with conditional requirements
- Selects appropriate template variants based on user responses
- Manages section inclusion/exclusion
- Calculates progress and validates form data

#### 2. UI Components
- **GuidedTemplateBrowser** - Browse available guided templates
- **GuidedTemplateWizard** - Multi-step form with conditional fields
- **GuidedTemplatePreview** - Preview with dynamic sections
- **GuidedTemplateFlow** - Main orchestrator component

#### 3. Database Tables
- **guided_template_configs** - Stores JSON configurations
- **guided_template_submissions** - Stores user submissions

### Integration Points

#### App.tsx
- Added new route: `'guided-templates'`
- Lazy loaded `GuidedTemplateFlow` component
- No modifications to existing routes

#### AppHeader.tsx
- Added "Modèles guidés" navigation button (with NEW badge)
- Appears after existing "generators" button
- Available in both desktop and mobile menus

## How It Works

### 1. Configuration-Driven
Templates are defined as JSON configurations with:
- **Steps**: Multi-step wizard configuration
- **Fields**: Form fields with validation rules
- **Conditional Logic**: Show/hide fields based on previous answers
- **Variants**: Different document versions based on conditions
- **Sections**: Dynamic document sections that can be included/excluded
- **Pricing**: Feature access control (free vs premium)

### 2. Conditional Logic
```typescript
// Example: Show financial fields only if refusal reason is "insufficient_funds"
{
  "visible_if": [
    {
      "field": "refusal_reasons",
      "operator": "equals",
      "value": "insufficient_funds"
    }
  ]
}
```

### 3. Dynamic Sections
Document sections can be conditionally included:
```typescript
{
  "include_if": [...],  // Include if conditions are met
  "exclude_if": [...],  // Exclude if conditions are met
  "required": true      // Always include
}
```

### 4. Entitlements
```json
{
  "pricing": {
    "free_tier": ["pdf_download"],
    "premium_tier": ["pdf_download", "docx_download", "document_edit"]
  }
}
```

## Adding New Templates

### Method 1: Database Migration
```sql
INSERT INTO guided_template_configs (name, description, category, config)
VALUES (
  'Template Name',
  'Template Description',
  'category',
  '{...JSON config...}'::jsonb
);
```

### Method 2: Admin Interface (Future)
An admin UI can be built to create/edit configurations without SQL.

## Sample Template

The system includes a sample IRCC Refusal Letter Response template demonstrating:
- Multi-step wizard (5 steps)
- Conditional steps (show financial info only if applicable)
- Conditional fields (property ownership follow-up)
- Multiple variants (financial vs ties to home country)
- Dynamic sections based on user responses
- Field validation with custom rules
- Progress tracking

## Testing

### Access the Feature
1. Navigate to the application
2. Click "Modèles guidés" in the header (or "Guided Templates")
3. Select the IRCC template
4. Fill out the wizard
5. Preview the generated document
6. Download (based on tier)

### Test Conditional Logic
- Select different refusal reasons to see steps appear/disappear
- Change field values to trigger different variants
- Verify sections are included/excluded correctly

## Existing Features (Unchanged)

The following remain completely intact:
- ✅ Traditional document templates (`document_templates`)
- ✅ Simple generators (`document_generators`)
- ✅ Guest document generation
- ✅ AI document generator
- ✅ PDF signature features
- ✅ All existing payment flows
- ✅ All existing user dashboards

## Benefits

### For Users
- Intelligent guidance through complex forms
- Only see relevant questions
- Multiple document variants from one template
- Better validation and error prevention

### For Admins
- No code changes needed to create templates
- JSON-based configuration
- Reusable conditional logic
- Easy to A/B test different approaches

### For Developers
- Clean separation of concerns
- Type-safe rule engine
- Modular and testable
- Easy to extend with new operators/validators

## Future Enhancements

Possible additions without breaking changes:
- Admin UI for template creation
- More template variants (CAQ, Visa, Work Permit)
- Additional field types (file upload, signature)
- Advanced operators (greater than, less than, regex)
- Template versioning
- Analytics per template
- AI-powered field suggestions
- Multi-language support for templates

## Security

- ✅ RLS policies on both tables
- ✅ Users can only access own submissions
- ✅ Admins can manage all configs
- ✅ Public can view active templates
- ✅ SECURITY DEFINER with search_path on triggers
- ✅ Input sanitization via rule engine

## Performance

- Lazy loading of components
- Efficient JSONB queries
- Proper indexing on foreign keys
- Minimal bundle size impact (~19KB for all guided template components)

## Migration Path

If needed, existing templates can be migrated:
1. Export existing template data
2. Transform to guided template JSON format
3. Import as guided template configs
4. Keep old templates for backwards compatibility

## Support

For questions or issues:
1. Check rule engine types in `guidedTemplateEngine.ts`
2. Review sample IRCC template configuration
3. Test in development environment first
4. Use browser dev tools to inspect form data flow

---

**Last Updated**: January 2, 2026
**Status**: Production Ready
**Breaking Changes**: None
