import { createClient, SupabaseClient } from '@supabase/supabase-js';

export interface SupabaseConfig {
  url: string;
  anonKey: string;
  isValid: boolean;
  errors: string[];
}

export interface SupabaseDiagnostics {
  config: SupabaseConfig;
  origin: string;
  timestamp: string;
  userAgent: string;
}

class SupabaseClientManager {
  private client: SupabaseClient | null = null;
  private config: SupabaseConfig;
  private diagnostics: SupabaseDiagnostics;

  constructor() {
    const url = import.meta.env.VITE_SUPABASE_URL || '';
    const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

    this.config = this.validateConfig(url, anonKey);
    this.diagnostics = {
      config: this.config,
      origin: typeof window !== 'undefined' ? window.location.origin : 'SSR',
      timestamp: new Date().toISOString(),
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'Unknown',
    };

    if (this.config.isValid) {
      try {
        this.client = createClient(url, anonKey, {
          auth: {
            autoRefreshToken: true,
            persistSession: true,
            detectSessionInUrl: true,
          },
        });
        console.info('✅ Supabase client initialized', {
          url: this.maskUrl(url),
          origin: this.diagnostics.origin,
          timestamp: this.diagnostics.timestamp,
        });
      } catch (error) {
        console.error('❌ Failed to create Supabase client:', error);
        this.config.isValid = false;
        this.config.errors.push(`Client creation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    } else {
      console.error('❌ Invalid Supabase configuration:', this.config.errors);
      this.logActionableGuidance();
    }
  }

  private validateConfig(url: string, anonKey: string): SupabaseConfig {
    const errors: string[] = [];
    let isValid = true;

    if (!url) {
      errors.push('VITE_SUPABASE_URL is missing');
      isValid = false;
    } else {
      if (url.includes(' ')) {
        errors.push('VITE_SUPABASE_URL contains spaces');
        isValid = false;
      }
      if (!url.startsWith('https://')) {
        errors.push('VITE_SUPABASE_URL must start with https://');
        isValid = false;
      }
      try {
        const urlObj = new URL(url);
        if (!urlObj.hostname.endsWith('.supabase.co')) {
          errors.push('VITE_SUPABASE_URL must end with .supabase.co');
          isValid = false;
        }
      } catch (e) {
        errors.push('VITE_SUPABASE_URL is not a valid URL');
        isValid = false;
      }
    }

    if (!anonKey) {
      errors.push('VITE_SUPABASE_ANON_KEY is missing');
      isValid = false;
    } else if (anonKey.length < 20) {
      errors.push('VITE_SUPABASE_ANON_KEY appears invalid (too short)');
      isValid = false;
    }

    return { url, anonKey, isValid, errors };
  }

  private maskUrl(url: string): string {
    try {
      const urlObj = new URL(url);
      const hostname = urlObj.hostname;
      const parts = hostname.split('.');
      if (parts.length > 0) {
        const projectRef = parts[0];
        const masked = projectRef.substring(0, 4) + '****' + projectRef.substring(projectRef.length - 4);
        return url.replace(projectRef, masked);
      }
      return url;
    } catch {
      return '***masked***';
    }
  }

  private logActionableGuidance(): void {
    console.group('🔧 Supabase Configuration Help');
    console.log('Expected format:');
    console.log('  VITE_SUPABASE_URL=https://<project-ref>.supabase.co');
    console.log('  VITE_SUPABASE_ANON_KEY=eyJhbGci...');
    console.log('\nSteps to fix:');
    console.log('  1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables');
    console.log('  2. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY');
    console.log('  3. Check Production, Preview, and Development');
    console.log('  4. Go to Deployments → Redeploy');
    console.log('  5. Wait 1-2 minutes and refresh');
    console.groupEnd();
  }

  public getClient(): SupabaseClient {
    if (!this.client) {
      throw new Error('Supabase client not initialized. Check configuration.');
    }
    return this.client;
  }

  public getDiagnostics(): SupabaseDiagnostics {
    return this.diagnostics;
  }

  public getMaskedConfig(): { url: string; anonKey: string } {
    return {
      url: this.config.url,
      anonKey: this.maskAnonKey(this.config.anonKey),
    };
  }

  public maskAnonKey(key: string): string {
    if (!key || key.length < 10) return '***';
    return `${key.substring(0, 6)}...${key.substring(key.length - 4)}`;
  }

  public isConfigValid(): boolean {
    return this.config.isValid;
  }

  public getConfigErrors(): string[] {
    return this.config.errors;
  }

  public async testConnection(): Promise<{
    success: boolean;
    status?: number;
    responseTime: number;
    error?: string;
    suggestion?: string;
  }> {
    const startTime = performance.now();

    if (!this.config.isValid) {
      return {
        success: false,
        responseTime: 0,
        error: 'Invalid configuration',
        suggestion: 'Fix configuration errors first: ' + this.config.errors.join(', '),
      };
    }

    try {
      const response = await fetch(`${this.config.url}/rest/v1/`, {
        method: 'HEAD',
        headers: {
          'apikey': this.config.anonKey,
          'Authorization': `Bearer ${this.config.anonKey}`,
        },
      });

      const responseTime = performance.now() - startTime;

      if (response.ok || response.status === 401 || response.status === 200) {
        return {
          success: true,
          status: response.status,
          responseTime,
        };
      }

      return {
        success: false,
        status: response.status,
        responseTime,
        error: `HTTP ${response.status}`,
        suggestion: this.getSuggestionForStatus(response.status),
      };
    } catch (error) {
      const responseTime = performance.now() - startTime;
      const errorMessage = error instanceof Error ? error.message : String(error);

      return {
        success: false,
        responseTime,
        error: errorMessage,
        suggestion: this.getSuggestionForError(errorMessage),
      };
    }
  }

  private getSuggestionForStatus(status: number): string {
    switch (status) {
      case 401:
      case 403:
        return 'Check VITE_SUPABASE_ANON_KEY is correct';
      case 404:
        return 'Check VITE_SUPABASE_URL project reference is correct';
      case 500:
      case 502:
      case 503:
        return 'Supabase service may be down. Check status.supabase.com';
      default:
        return 'Check Vercel environment variables and redeploy';
    }
  }

  private getSuggestionForError(error: string): string {
    const errorLower = error.toLowerCase();

    if (errorLower.includes('network') || errorLower.includes('fetch')) {
      return 'Network error: Check internet connection, VPN, or firewall';
    }
    if (errorLower.includes('cors')) {
      return 'CORS error: Check Supabase project settings → API → CORS allowed origins';
    }
    if (errorLower.includes('dns') || errorLower.includes('name_not_resolved')) {
      return 'DNS error: VITE_SUPABASE_URL may be incorrect or missing from Vercel env vars';
    }
    if (errorLower.includes('blocked') || errorLower.includes('content blocker')) {
      return 'Request blocked: Disable browser extensions (AdBlock, Privacy Badger, etc.)';
    }
    if (errorLower.includes('timeout')) {
      return 'Request timeout: Check Supabase project is not paused';
    }

    return 'Test the Supabase URL directly in a browser tab. Check Vercel env vars.';
  }
}

const supabaseManager = new SupabaseClientManager();

export const supabase = supabaseManager.isConfigValid()
  ? supabaseManager.getClient()
  : null;

export const getSupabaseDiagnostics = () => supabaseManager.getDiagnostics();
export const getMaskedConfig = () => supabaseManager.getMaskedConfig();
export const testSupabaseConnection = () => supabaseManager.testConnection();
export const isSupabaseConfigured = () => supabaseManager.isConfigValid();
export const getSupabaseConfigErrors = () => supabaseManager.getConfigErrors();
