/**
 * Centralized API Service
 *
 * Provides a single point of access for all Supabase Edge Function calls.
 * This prevents duplication of API credentials in components and improves security.
 */

import { supabase } from './supabase';

interface ApiCallOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: Record<string, unknown>;
  requireAuth?: boolean;
}

/**
 * Make a call to a Supabase Edge Function
 */
export async function callEdgeFunction<T = unknown>(
  functionName: string,
  options: ApiCallOptions = {}
): Promise<{ data: T | null; error: Error | null }> {
  const { method = 'POST', body, requireAuth = true } = options;

  try {
    // Check authentication if required
    if (requireAuth) {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        return {
          data: null,
          error: new Error('Authentication required')
        };
      }
    }

    // Make the API call
    const { data, error } = await supabase.functions.invoke(functionName, {
      method,
      body: body || {}
    });

    if (error) {
      console.error(`Error calling ${functionName}:`, error);
      return { data: null, error };
    }

    return { data: data as T, error: null };
  } catch (error) {
    console.error(`Exception calling ${functionName}:`, error);
    return {
      data: null,
      error: error instanceof Error ? error : new Error('Unknown error')
    };
  }
}

/**
 * Call the idoc-api edge function
 */
export async function callIdocApi<T = unknown>(
  endpoint: string,
  body?: Record<string, unknown>
): Promise<{ data: T | null; error: Error | null }> {
  return callEdgeFunction<T>('idoc-api', {
    body: { endpoint, ...body }
  });
}

/**
 * Call the dossiers-api edge function
 */
export async function callDossiersApi<T = unknown>(
  action: string,
  data?: Record<string, unknown>
): Promise<{ data: T | null; error: Error | null }> {
  return callEdgeFunction<T>('dossiers-api', {
    body: { action, ...data }
  });
}

/**
 * Call the template-lab-api edge function
 */
export async function callTemplateLabApi<T = unknown>(
  action: string,
  data?: Record<string, unknown>
): Promise<{ data: T | null; error: Error | null }> {
  return callEdgeFunction<T>('template-lab-api', {
    body: { action, ...data }
  });
}

/**
 * Call the idoc-shadow-test edge function
 */
export async function callShadowTest<T = unknown>(
  templateId: string,
  testData?: Record<string, unknown>
): Promise<{ data: T | null; error: Error | null }> {
  return callEdgeFunction<T>('idoc-shadow-test', {
    body: { templateId, ...testData }
  });
}

/**
 * Call the idoc-lint edge function
 */
export async function callIdocLint<T = unknown>(
  templateId: string
): Promise<{ data: T | null; error: Error | null }> {
  return callEdgeFunction<T>('idoc-lint', {
    body: { templateId }
  });
}

/**
 * Call the idoc-auto-fix edge function
 */
export async function callIdocAutoFix<T = unknown>(
  templateId: string,
  issues?: unknown[]
): Promise<{ data: T | null; error: Error | null }> {
  return callEdgeFunction<T>('idoc-auto-fix', {
    body: { templateId, issues }
  });
}

/**
 * Call the admin-accounting-export edge function
 */
export async function callAccountingExport<T = unknown>(
  filters?: Record<string, unknown>
): Promise<{ data: T | null; error: Error | null }> {
  return callEdgeFunction<T>('admin-accounting-export', {
    body: filters
  });
}

/**
 * Call checkout edge functions
 */
export async function callCheckout<T = unknown>(
  type: 'subscription' | 'credits' | 'model',
  data: Record<string, unknown>
): Promise<{ data: T | null; error: Error | null }> {
  const functionName = `checkout-${type}`;
  return callEdgeFunction<T>(functionName, { body: data });
}

/**
 * Validate input data before API call
 */
export function validateApiInput(
  data: Record<string, unknown>,
  requiredFields: string[]
): { valid: boolean; error: string | null } {
  for (const field of requiredFields) {
    if (!(field in data) || data[field] === null || data[field] === undefined || data[field] === '') {
      return {
        valid: false,
        error: `Missing required field: ${field}`
      };
    }
  }
  return { valid: true, error: null };
}
