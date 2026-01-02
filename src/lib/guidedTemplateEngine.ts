/**
 * Guided Template Engine
 *
 * @description Rule engine for guided template flow with conditional logic
 * This module is independent and doesn't affect existing template system
 */

export interface FieldValidator {
  type: 'required' | 'email' | 'minLength' | 'maxLength' | 'pattern' | 'custom';
  value?: any;
  message?: string;
}

export interface ConditionalRule {
  field: string;
  operator: 'equals' | 'notEquals' | 'contains' | 'notContains' | 'in' | 'notIn' | 'gt' | 'gte' | 'lt' | 'lte';
  value: any;
}

export interface GuidedField {
  id: string;
  key: string;
  label: string;
  type: 'text' | 'textarea' | 'select' | 'radio' | 'checkbox' | 'date' | 'email' | 'file';
  placeholder?: string;
  description?: string;
  required?: boolean;
  required_if?: ConditionalRule[];
  visible_if?: ConditionalRule[];
  validators?: FieldValidator[];
  options?: Array<{ value: string; label: string }>;
  defaultValue?: any;
}

export interface GuidedStep {
  id: string;
  title: string;
  description?: string;
  fields: GuidedField[];
  visible_if?: ConditionalRule[];
}

export interface TemplateVariant {
  id: string;
  name: string;
  description: string;
  conditions: ConditionalRule[];
  template_content: string;
  sections: TemplateSection[];
}

export interface TemplateSection {
  id: string;
  title: string;
  content: string;
  include_if?: ConditionalRule[];
  exclude_if?: ConditionalRule[];
  required?: boolean;
}

export interface GuidedTemplateConfig {
  id: string;
  name: string;
  description: string;
  category: string;
  steps: GuidedStep[];
  variants: TemplateVariant[];
  default_variant: string;
  pricing: {
    free_tier: string[];
    premium_tier: string[];
  };
}

export class GuidedTemplateEngine {
  private config: GuidedTemplateConfig;
  private formData: Record<string, any>;

  constructor(config: GuidedTemplateConfig) {
    this.config = config;
    this.formData = {};
  }

  /**
   * Update form data
   */
  setFormData(data: Record<string, any>): void {
    this.formData = { ...this.formData, ...data };
  }

  /**
   * Get current form data
   */
  getFormData(): Record<string, any> {
    return { ...this.formData };
  }

  /**
   * Evaluate a conditional rule
   */
  private evaluateCondition(rule: ConditionalRule): boolean {
    const fieldValue = this.formData[rule.field];

    switch (rule.operator) {
      case 'equals':
        return fieldValue === rule.value;
      case 'notEquals':
        return fieldValue !== rule.value;
      case 'contains':
        return String(fieldValue || '').includes(String(rule.value));
      case 'notContains':
        return !String(fieldValue || '').includes(String(rule.value));
      case 'in':
        return Array.isArray(rule.value) && rule.value.includes(fieldValue);
      case 'notIn':
        return Array.isArray(rule.value) && !rule.value.includes(fieldValue);
      case 'gt':
        return Number(fieldValue) > Number(rule.value);
      case 'gte':
        return Number(fieldValue) >= Number(rule.value);
      case 'lt':
        return Number(fieldValue) < Number(rule.value);
      case 'lte':
        return Number(fieldValue) <= Number(rule.value);
      default:
        return false;
    }
  }

  /**
   * Evaluate multiple conditions (AND logic)
   */
  private evaluateConditions(conditions?: ConditionalRule[]): boolean {
    if (!conditions || conditions.length === 0) return true;
    return conditions.every((condition) => this.evaluateCondition(condition));
  }

  /**
   * Check if a field is visible
   */
  isFieldVisible(field: GuidedField): boolean {
    return this.evaluateConditions(field.visible_if);
  }

  /**
   * Check if a field is required
   */
  isFieldRequired(field: GuidedField): boolean {
    if (!field.required && !field.required_if) return false;
    if (field.required) return true;
    return this.evaluateConditions(field.required_if);
  }

  /**
   * Check if a step is visible
   */
  isStepVisible(step: GuidedStep): boolean {
    return this.evaluateConditions(step.visible_if);
  }

  /**
   * Get visible steps
   */
  getVisibleSteps(): GuidedStep[] {
    return this.config.steps.filter((step) => this.isStepVisible(step));
  }

  /**
   * Get visible fields for a step
   */
  getVisibleFields(step: GuidedStep): GuidedField[] {
    return step.fields.filter((field) => this.isFieldVisible(field));
  }

  /**
   * Validate a field
   */
  validateField(field: GuidedField, value: any): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (this.isFieldRequired(field) && !value) {
      errors.push(`${field.label} is required`);
      return { valid: false, errors };
    }

    if (!value && !this.isFieldRequired(field)) {
      return { valid: true, errors: [] };
    }

    if (field.validators) {
      for (const validator of field.validators) {
        switch (validator.type) {
          case 'email':
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
              errors.push(validator.message || 'Invalid email format');
            }
            break;
          case 'minLength':
            if (String(value).length < validator.value) {
              errors.push(validator.message || `Minimum length is ${validator.value}`);
            }
            break;
          case 'maxLength':
            if (String(value).length > validator.value) {
              errors.push(validator.message || `Maximum length is ${validator.value}`);
            }
            break;
          case 'pattern':
            if (!new RegExp(validator.value).test(value)) {
              errors.push(validator.message || 'Invalid format');
            }
            break;
        }
      }
    }

    return { valid: errors.length === 0, errors };
  }

  /**
   * Validate all fields in a step
   */
  validateStep(step: GuidedStep): { valid: boolean; errors: Record<string, string[]> } {
    const errors: Record<string, string[]> = {};
    const visibleFields = this.getVisibleFields(step);

    for (const field of visibleFields) {
      const fieldValue = this.formData[field.key];
      const validation = this.validateField(field, fieldValue);
      if (!validation.valid) {
        errors[field.key] = validation.errors;
      }
    }

    return { valid: Object.keys(errors).length === 0, errors };
  }

  /**
   * Select appropriate template variant based on form data
   */
  selectTemplateVariant(): TemplateVariant {
    for (const variant of this.config.variants) {
      if (this.evaluateConditions(variant.conditions)) {
        return variant;
      }
    }

    const defaultVariant = this.config.variants.find(
      (v) => v.id === this.config.default_variant
    );
    return defaultVariant || this.config.variants[0];
  }

  /**
   * Get sections that should be included in the final document
   */
  getIncludedSections(variant: TemplateVariant): TemplateSection[] {
    return variant.sections.filter((section) => {
      if (section.exclude_if && this.evaluateConditions(section.exclude_if)) {
        return false;
      }

      if (section.include_if) {
        return this.evaluateConditions(section.include_if);
      }

      return true;
    });
  }

  /**
   * Generate final document content
   */
  generateDocument(): {
    variant: TemplateVariant;
    sections: TemplateSection[];
    content: string;
  } {
    const variant = this.selectTemplateVariant();
    const sections = this.getIncludedSections(variant);

    let content = variant.template_content;

    Object.entries(this.formData).forEach(([key, value]) => {
      const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
      content = content.replace(regex, String(value || ''));
    });

    sections.forEach((section) => {
      let sectionContent = section.content;
      Object.entries(this.formData).forEach(([key, value]) => {
        const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
        sectionContent = sectionContent.replace(regex, String(value || ''));
      });
      section.content = sectionContent;
    });

    return { variant, sections, content };
  }

  /**
   * Check user entitlements for features
   */
  checkEntitlement(
    userTier: 'free' | 'premium',
    feature: string
  ): boolean {
    const tierFeatures = this.config.pricing[`${userTier}_tier`];
    return tierFeatures.includes(feature);
  }

  /**
   * Get progress percentage
   */
  getProgress(): number {
    const visibleSteps = this.getVisibleSteps();
    if (visibleSteps.length === 0) return 0;

    let completedFields = 0;
    let totalFields = 0;

    visibleSteps.forEach((step) => {
      const visibleFields = this.getVisibleFields(step);
      totalFields += visibleFields.length;
      visibleFields.forEach((field) => {
        if (this.formData[field.key]) {
          completedFields++;
        }
      });
    });

    return totalFields > 0 ? (completedFields / totalFields) * 100 : 0;
  }
}

/**
 * Helper to load guided template config from database or JSON
 */
export async function loadGuidedTemplateConfig(
  configId: string
): Promise<GuidedTemplateConfig | null> {
  try {
    // This would load from database in production
    // For now, return null to be implemented with actual data
    return null;
  } catch (error) {
    console.error('Error loading guided template config:', error);
    return null;
  }
}
