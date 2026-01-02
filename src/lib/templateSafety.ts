/**
 * Template Safety & Fallback System
 *
 * Guarantees that templates NEVER break the production site.
 * Provides secure rendering with automatic fallback.
 */

import { supabase } from './supabase';

// Environment detection
export const isProduction = (): boolean => {
  return import.meta.env.PROD || import.meta.env.VITE_ENV === 'production';
};

// Safe fallback template (always renders)
export const SAFE_FALLBACK_TEMPLATE = {
  id: 'fallback-safe',
  template_code: 'fallback_safe',
  title: { fr: 'Modèle de secours', en: 'Fallback Template' },
  category: 'system',
  template_content: {
    fr: `Le modèle sélectionné n'est pas encore validé ou a rencontré une erreur.

Un modèle par défaut a été appliqué afin d'assurer la stabilité du service.

Veuillez contacter le support si cette situation persiste.`,
    en: `The selected template is not yet validated or has encountered an error.

A default template has been applied to ensure service stability.

Please contact support if this situation persists.`
  },
  required_variables: { fields: [] },
  optional_variables: { fields: [] },
  status: 'verified',
  verification_required: false
};

// Check if template is eligible for production
export const isEligibleForProduction = (template: any): boolean => {
  return (
    template.status === 'verified' &&
    template.verification_required === false
  );
};

// Structured error logging
export interface TemplateError {
  template_id: string;
  template_code?: string;
  template_source?: 'idoc_guided_templates' | 'document_templates';
  environment: 'production' | 'staging' | 'development';
  action: string;
  error_message: string;
  error_stack?: string;
  context?: Record<string, any>;
  timestamp: string;
}

let errorLogQueue: TemplateError[] = [];

export const logTemplateError = async (error: TemplateError): Promise<void> => {
  // Add to queue
  errorLogQueue.push(error);

  // Console log for immediate visibility
  console.error('[Template Safety]', {
    ...error,
    severity: error.environment === 'production' ? 'CRITICAL' : 'WARNING'
  });

  // Persist to database
  try {
    const eventType = error.action as any;

    await supabase
      .from('template_health_log')
      .insert({
        template_id: error.template_id,
        template_source: error.template_source || 'idoc_guided_templates',
        event_type: eventType,
        environment: error.environment,
        details: {
          context: error.context || {},
          timestamp: error.timestamp
        },
        error_message: error.error_message
      });

    // Also log to fallbacks table if it's a render failure
    if (error.action === 'render_failed_exception' || error.action === 'fallback_used') {
      await supabase
        .from('template_render_fallbacks')
        .insert({
          template_id: error.template_id,
          template_source: error.template_source || 'idoc_guided_templates',
          template_code: error.template_code,
          error_message: error.error_message,
          error_stack: error.error_stack,
          environment: error.environment
        });

      // Increment fallback count
      const tableName = error.template_source || 'idoc_guided_templates';
      await supabase.rpc('increment_fallback_count', {
        p_template_id: error.template_id,
        p_table_name: tableName
      }).catch(() => {
        // If RPC doesn't exist, manually increment
        supabase
          .from(tableName as any)
          .update({ fallback_count: supabase.rpc('coalesce', { fallback_count: 0 }) })
          .eq('id', error.template_id)
          .catch(console.error);
      });
    }
  } catch (e) {
    console.error('Failed to persist template error log:', e);
  }
};

export const getErrorLogs = (): TemplateError[] => {
  return [...errorLogQueue];
};

export const clearErrorLogs = (): void => {
  errorLogQueue = [];
};

// Render smoke test
export interface SmokeTestResult {
  success: boolean;
  error?: string;
  warnings: string[];
}

export const runRenderSmokeTest = (template: any): SmokeTestResult => {
  const warnings: string[] = [];

  try {
    // Check 1: Template has content
    if (!template.template_content) {
      return {
        success: false,
        error: 'Template has no content',
        warnings
      };
    }

    // Check 2: Extract content string
    let contentStr = '';
    const content = template.template_content;

    if (typeof content === 'string') {
      contentStr = content;
    } else if (typeof content === 'object') {
      if (content.fr || content.en) {
        contentStr = content.fr || content.en || '';
      } else if (Array.isArray(content)) {
        contentStr = content.map((section: any) => {
          if (typeof section === 'string') return section;
          if (section.content) return section.content;
          if (section.template) return section.template;
          return '';
        }).join('\n');
      } else {
        contentStr = JSON.stringify(content);
      }
    }

    if (!contentStr || contentStr.trim().length === 0) {
      return {
        success: false,
        error: 'Template content is empty',
        warnings
      };
    }

    // Check 3: Look for placeholders (should be removed)
    const placeholderPatterns = [
      /\[TODO\]/gi,
      /\[FIXME\]/gi,
      /\[XXX\]/gi,
      /TODO:/gi,
      /FIXME:/gi,
      /\{\{TODO\}\}/gi,
      /\{\{FIXME\}\}/gi
    ];

    for (const pattern of placeholderPatterns) {
      if (pattern.test(contentStr)) {
        warnings.push(`Contains placeholders: ${pattern.source}`);
      }
    }

    // Check 4: Extract all variables used
    const varRegex = /\{\{([^}]+)\}\}/g;
    const varsUsed: string[] = [];
    let match;

    while ((match = varRegex.exec(contentStr)) !== null) {
      const varName = match[1].trim();

      // Skip handlebars helpers
      if (varName.startsWith('#') || varName.startsWith('/')) continue;
      if (varName === 'this') continue;

      const helperMatch = varName.match(/^(\w+)\s+(.+)/);
      if (helperMatch) {
        const helper = helperMatch[1];
        const knownHelpers = ['if', 'unless', 'each', 'with', 'eq', 'ne', 'lt', 'gt', 'and', 'or', 'not', 'boolFR'];
        if (knownHelpers.includes(helper)) continue;
      }

      if (!varsUsed.includes(varName)) {
        varsUsed.push(varName);
      }
    }

    // Check 5: Verify all variables are declared
    const declaredVars: string[] = [];

    if (template.required_variables?.fields) {
      template.required_variables.fields.forEach((field: any) => {
        declaredVars.push(field.name || field);
      });
    }

    if (template.optional_variables?.fields) {
      template.optional_variables.fields.forEach((field: any) => {
        declaredVars.push(field.name || field);
      });
    }

    const undeclaredVars = varsUsed.filter(v => !declaredVars.includes(v));

    if (undeclaredVars.length > 0) {
      warnings.push(`Undeclared variables: ${undeclaredVars.join(', ')}`);
    }

    // Check 6: Template has reasonable length
    if (contentStr.length > 100000) {
      warnings.push('Template is very large (>100KB)');
    }

    // Check 7: No obvious syntax errors
    const openBraces = (contentStr.match(/\{\{/g) || []).length;
    const closeBraces = (contentStr.match(/\}\}/g) || []).length;

    if (openBraces !== closeBraces) {
      return {
        success: false,
        error: `Unmatched braces: ${openBraces} opening, ${closeBraces} closing`,
        warnings
      };
    }

    // All checks passed
    return {
      success: true,
      warnings
    };

  } catch (error: any) {
    return {
      success: false,
      error: `Smoke test exception: ${error.message}`,
      warnings
    };
  }
};

// Safe template rendering wrapper
export interface RenderResult {
  success: boolean;
  output?: string;
  error?: string;
  usedFallback: boolean;
}

export const renderTemplateSafely = async (
  template: any,
  data: Record<string, any> = {}
): Promise<RenderResult> => {
  const env = isProduction() ? 'production' : 'development';

  try {
    // Production gating
    if (isProduction() && !isEligibleForProduction(template)) {
      await logTemplateError({
        template_id: template.id,
        template_code: template.template_code,
        environment: env,
        action: 'blocked_unverified_template',
        error_message: 'Template blocked in production: not verified',
        timestamp: new Date().toISOString()
      });

      // Use fallback
      return renderFallback('blocked_unverified_template');
    }

    // Smoke test
    const smokeTest = runRenderSmokeTest(template);

    if (!smokeTest.success) {
      await logTemplateError({
        template_id: template.id,
        template_code: template.template_code,
        environment: env,
        action: 'render_failed_smoke_test',
        error_message: smokeTest.error || 'Smoke test failed',
        timestamp: new Date().toISOString()
      });

      // Flag template for re-verification if in production
      if (isProduction()) {
        await flagTemplateForReverification(template.id);
      }

      return renderFallback('smoke_test_failed');
    }

    // Try to render
    // Note: Actual rendering would depend on your template engine
    // For now, we'll extract the content
    let content = template.template_content;

    if (typeof content === 'object') {
      if (content.fr || content.en) {
        content = content.fr || content.en;
      } else if (Array.isArray(content)) {
        content = content.map((section: any) => {
          if (typeof section === 'string') return section;
          if (section.content) return section.content;
          return '';
        }).join('\n\n');
      } else {
        content = JSON.stringify(content);
      }
    }

    return {
      success: true,
      output: content,
      usedFallback: false
    };

  } catch (error: any) {
    // Log the render failure
    await logTemplateError({
      template_id: template.id,
      template_code: template.template_code,
      environment: env,
      action: 'render_failed_exception',
      error_message: error.message,
      error_stack: error.stack,
      context: { data },
      timestamp: new Date().toISOString()
    });

    // Flag for re-verification in production
    if (isProduction()) {
      await flagTemplateForReverification(template.id);
    }

    return renderFallback('render_exception');
  }
};

const renderFallback = (reason: string): RenderResult => {
  const content = SAFE_FALLBACK_TEMPLATE.template_content;
  const output = typeof content === 'object' ? content.fr : content;

  return {
    success: true,
    output,
    usedFallback: true
  };
};

const flagTemplateForReverification = async (templateId: string): Promise<void> => {
  try {
    await supabase
      .from('idoc_guided_templates')
      .update({
        verification_required: true,
        updated_at: new Date().toISOString()
      })
      .eq('id', templateId);
  } catch (error) {
    console.error('Failed to flag template for reverification:', error);
  }
};

// Get templates eligible for production
export const getProductionEligibleTemplates = async (): Promise<any[]> => {
  try {
    const { data, error } = await supabase
      .from('idoc_guided_templates')
      .select('*')
      .eq('status', 'verified')
      .eq('verification_required', false)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching production-eligible templates:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Exception fetching production-eligible templates:', error);
    return [];
  }
};

// Count fallback usage (for observability)
let fallbackUsageCount = 0;

export const incrementFallbackUsage = (): void => {
  fallbackUsageCount++;
  console.warn(`[Template Safety] Fallback used ${fallbackUsageCount} times`);
};

export const getFallbackUsageCount = (): number => {
  return fallbackUsageCount;
};

export const resetFallbackUsageCount = (): void => {
  fallbackUsageCount = 0;
};
