# Guided Template Configuration Examples

## Quick Reference

This document provides copy-paste examples for creating new guided templates.

---

## Basic Template Structure

```json
{
  "id": "unique-template-id",
  "name": "Template Display Name",
  "description": "Brief description of what this template does",
  "category": "immigration|legal|business|personal",
  "steps": [...],
  "variants": [...],
  "default_variant": "variant-id",
  "pricing": {
    "free_tier": ["pdf_download"],
    "premium_tier": ["pdf_download", "docx_download", "document_edit"]
  }
}
```

---

## Field Types

### Text Input
```json
{
  "id": "field-full-name",
  "key": "full_name",
  "label": "Full Name",
  "type": "text",
  "required": true,
  "placeholder": "Enter your full name"
}
```

### Email Input
```json
{
  "id": "field-email",
  "key": "email",
  "label": "Email Address",
  "type": "email",
  "required": true,
  "validators": [
    {
      "type": "email",
      "message": "Please enter a valid email"
    }
  ]
}
```

### Textarea
```json
{
  "id": "field-description",
  "key": "description",
  "label": "Detailed Description",
  "type": "textarea",
  "required": true,
  "placeholder": "Provide detailed information...",
  "description": "Please be as specific as possible"
}
```

### Select Dropdown
```json
{
  "id": "field-country",
  "key": "country",
  "label": "Country of Residence",
  "type": "select",
  "required": true,
  "options": [
    { "value": "ca", "label": "Canada" },
    { "value": "us", "label": "United States" },
    { "value": "uk", "label": "United Kingdom" }
  ]
}
```

### Radio Buttons
```json
{
  "id": "field-marital-status",
  "key": "marital_status",
  "label": "Marital Status",
  "type": "radio",
  "required": true,
  "options": [
    { "value": "single", "label": "Single" },
    { "value": "married", "label": "Married" },
    { "value": "divorced", "label": "Divorced" }
  ]
}
```

### Checkbox
```json
{
  "id": "field-terms",
  "key": "accept_terms",
  "label": "Accept Terms",
  "type": "checkbox",
  "required": true,
  "placeholder": "I agree to the terms and conditions"
}
```

### Date Input
```json
{
  "id": "field-birth-date",
  "key": "birth_date",
  "label": "Date of Birth",
  "type": "date",
  "required": true
}
```

---

## Conditional Logic

### Show Field If Condition Met
```json
{
  "id": "field-spouse-name",
  "key": "spouse_name",
  "label": "Spouse Name",
  "type": "text",
  "required": false,
  "visible_if": [
    {
      "field": "marital_status",
      "operator": "equals",
      "value": "married"
    }
  ]
}
```

### Required If Condition Met
```json
{
  "id": "field-company",
  "key": "company_name",
  "label": "Company Name",
  "type": "text",
  "required": false,
  "required_if": [
    {
      "field": "employment_status",
      "operator": "equals",
      "value": "employed"
    }
  ]
}
```

### Multiple Conditions (AND logic)
```json
{
  "visible_if": [
    {
      "field": "employment_status",
      "operator": "equals",
      "value": "employed"
    },
    {
      "field": "country",
      "operator": "equals",
      "value": "ca"
    }
  ]
}
```

### Operators Available
- `equals` - Exact match
- `notEquals` - Not equal to
- `contains` - String contains substring
- `notContains` - String doesn't contain substring
- `in` - Value in array
- `notIn` - Value not in array

---

## Validation Rules

### Email Validation
```json
{
  "validators": [
    {
      "type": "email",
      "message": "Please enter a valid email address"
    }
  ]
}
```

### Min Length
```json
{
  "validators": [
    {
      "type": "minLength",
      "value": 10,
      "message": "Must be at least 10 characters"
    }
  ]
}
```

### Max Length
```json
{
  "validators": [
    {
      "type": "maxLength",
      "value": 500,
      "message": "Must not exceed 500 characters"
    }
  ]
}
```

### Pattern (Regex)
```json
{
  "validators": [
    {
      "type": "pattern",
      "value": "^[A-Z]{2}\\d{6}$",
      "message": "Must be in format: AB123456"
    }
  ]
}
```

### Combined Validators
```json
{
  "validators": [
    {
      "type": "minLength",
      "value": 5,
      "message": "Too short"
    },
    {
      "type": "maxLength",
      "value": 50,
      "message": "Too long"
    },
    {
      "type": "pattern",
      "value": "^[a-zA-Z ]+$",
      "message": "Letters and spaces only"
    }
  ]
}
```

---

## Complete Step Example

```json
{
  "id": "step-1-personal",
  "title": "Personal Information",
  "description": "Please provide your basic information",
  "fields": [
    {
      "id": "field-first-name",
      "key": "first_name",
      "label": "First Name",
      "type": "text",
      "required": true,
      "placeholder": "Enter your first name",
      "validators": [
        {
          "type": "minLength",
          "value": 2,
          "message": "Name must be at least 2 characters"
        }
      ]
    },
    {
      "id": "field-last-name",
      "key": "last_name",
      "label": "Last Name",
      "type": "text",
      "required": true,
      "placeholder": "Enter your last name"
    },
    {
      "id": "field-email",
      "key": "email",
      "label": "Email",
      "type": "email",
      "required": true,
      "validators": [
        {
          "type": "email",
          "message": "Invalid email format"
        }
      ]
    }
  ]
}
```

---

## Conditional Step

```json
{
  "id": "step-employment",
  "title": "Employment Details",
  "description": "Tell us about your current employment",
  "visible_if": [
    {
      "field": "employment_status",
      "operator": "equals",
      "value": "employed"
    }
  ],
  "fields": [...]
}
```

---

## Template Variants

### Simple Variant
```json
{
  "id": "variant-standard",
  "name": "Standard Letter",
  "description": "Standard version of the document",
  "conditions": [],
  "template_content": "Full document template here",
  "sections": [...]
}
```

### Conditional Variant
```json
{
  "id": "variant-employed",
  "name": "For Employed Applicants",
  "description": "Version for employed individuals",
  "conditions": [
    {
      "field": "employment_status",
      "operator": "equals",
      "value": "employed"
    }
  ],
  "template_content": "Template for employed applicants",
  "sections": [...]
}
```

---

## Document Sections

### Always Included Section
```json
{
  "id": "section-intro",
  "title": "Introduction",
  "content": "Dear Sir/Madam,\n\nMy name is {{full_name}}...",
  "required": true
}
```

### Conditionally Included Section
```json
{
  "id": "section-employment",
  "title": "Employment Information",
  "content": "I am currently employed at {{company_name}}...",
  "include_if": [
    {
      "field": "employment_status",
      "operator": "equals",
      "value": "employed"
    }
  ]
}
```

### Conditionally Excluded Section
```json
{
  "id": "section-financial",
  "title": "Financial Information",
  "content": "My financial details are...",
  "exclude_if": [
    {
      "field": "include_financial",
      "operator": "equals",
      "value": "no"
    }
  ]
}
```

---

## Variable Replacement

Use `{{variable_key}}` in your content:

```
Dear Immigration Officer,

My name is {{full_name}} and I was born on {{date_of_birth}}.
I am writing to address the refusal of my {{application_type}} application.

My current email is {{email}} and phone is {{phone}}.

Sincerely,
{{full_name}}
```

---

## Complete Mini Template

```json
{
  "id": "simple-letter",
  "name": "Simple Letter Template",
  "description": "A basic letter template",
  "category": "personal",
  "steps": [
    {
      "id": "step-1",
      "title": "Your Information",
      "fields": [
        {
          "id": "field-name",
          "key": "name",
          "label": "Your Name",
          "type": "text",
          "required": true
        },
        {
          "id": "field-purpose",
          "key": "purpose",
          "label": "Purpose of Letter",
          "type": "select",
          "required": true,
          "options": [
            { "value": "application", "label": "Application" },
            { "value": "complaint", "label": "Complaint" },
            { "value": "inquiry", "label": "Inquiry" }
          ]
        }
      ]
    },
    {
      "id": "step-2",
      "title": "Letter Content",
      "fields": [
        {
          "id": "field-content",
          "key": "content",
          "label": "Letter Body",
          "type": "textarea",
          "required": true,
          "placeholder": "Write your letter content here..."
        }
      ]
    }
  ],
  "variants": [
    {
      "id": "variant-default",
      "name": "Standard Letter",
      "description": "Standard letter format",
      "conditions": [],
      "template_content": "",
      "sections": [
        {
          "id": "section-header",
          "title": "Header",
          "content": "{{name}}\nDate: {{current_date}}",
          "required": true
        },
        {
          "id": "section-body",
          "title": "Body",
          "content": "Purpose: {{purpose}}\n\n{{content}}",
          "required": true
        },
        {
          "id": "section-signature",
          "title": "Signature",
          "content": "Sincerely,\n{{name}}",
          "required": true
        }
      ]
    }
  ],
  "default_variant": "variant-default",
  "pricing": {
    "free_tier": ["pdf_download"],
    "premium_tier": ["pdf_download", "docx_download", "document_edit"]
  }
}
```

---

## SQL Insert Template

```sql
INSERT INTO guided_template_configs (name, description, category, is_active, config)
VALUES (
  'Your Template Name',
  'Your template description',
  'immigration',  -- or legal, business, personal
  true,
  '{
    "id": "your-template-id",
    "name": "Your Template Name",
    "description": "Your template description",
    "category": "immigration",
    "steps": [...],
    "variants": [...],
    "default_variant": "variant-id",
    "pricing": {
      "free_tier": ["pdf_download"],
      "premium_tier": ["pdf_download", "docx_download", "document_edit"]
    }
  }'::jsonb
)
ON CONFLICT DO NOTHING;
```

---

## Testing Your Template

1. Insert configuration via migration or SQL
2. Navigate to "Modèles guidés"
3. Select your template
4. Test all conditional paths
5. Verify field validation
6. Check document generation
7. Test variant selection
8. Verify section inclusion/exclusion

---

## Tips & Best Practices

### Field Keys
- Use snake_case: `first_name`, `email_address`
- Be descriptive: `refusal_reasons` not `reason`
- Keep unique per template

### Conditions
- Test edge cases
- Use multiple conditions carefully (AND logic)
- Consider default values

### Content
- Use clear, professional language
- Include all necessary variables
- Test variable replacement

### Variants
- Order matters (first match wins)
- Always have a default variant
- Test all condition combinations

### Validation
- Add helpful error messages
- Don't over-validate
- Test user experience

---

## Common Patterns

### Employment-Based Conditional
```json
{
  "visible_if": [
    {
      "field": "employment_status",
      "operator": "in",
      "value": ["employed", "self_employed"]
    }
  ]
}
```

### Country-Specific Fields
```json
{
  "visible_if": [
    {
      "field": "country",
      "operator": "equals",
      "value": "ca"
    }
  ]
}
```

### Yes/No Follow-up
```json
{
  "id": "field-has-dependents",
  "key": "has_dependents",
  "label": "Do you have dependents?",
  "type": "radio",
  "options": [
    { "value": "yes", "label": "Yes" },
    { "value": "no", "label": "No" }
  ]
},
{
  "id": "field-dependents-count",
  "key": "dependents_count",
  "label": "Number of Dependents",
  "type": "text",
  "visible_if": [
    {
      "field": "has_dependents",
      "operator": "equals",
      "value": "yes"
    }
  ]
}
```

---

**Ready to create your first template? Start with a simple one and add complexity gradually!**
