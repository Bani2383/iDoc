import { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle, RefreshCw, Copy, X } from 'lucide-react';
import {
  getSupabaseDiagnostics,
  getMaskedConfig,
  testSupabaseConnection,
  isSupabaseConfigured,
  getSupabaseConfigErrors,
} from '../lib/supabaseClient';

interface PingResult {
  success: boolean;
  status?: number;
  responseTime: number;
  error?: string;
  suggestion?: string;
  timestamp: string;
}

export default function DebugSupabasePage() {
  const [pingResult, setPingResult] = useState<PingResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [autoTested, setAutoTested] = useState(false);

  const diagnostics = getSupabaseDiagnostics();
  const maskedConfig = getMaskedConfig();
  const isConfigured = isSupabaseConfigured();
  const configErrors = getSupabaseConfigErrors();

  useEffect(() => {
    if (!autoTested && isConfigured) {
      setAutoTested(true);
      handlePing();
    }
  }, [autoTested, isConfigured]);

  const handlePing = async () => {
    setIsLoading(true);
    try {
      const result = await testSupabaseConnection();
      setPingResult({
        ...result,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      setPingResult({
        success: false,
        responseTime: 0,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyReport = () => {
    const report = {
      timestamp: new Date().toISOString(),
      origin: diagnostics.origin,
      supabaseUrl: maskedConfig.url,
      anonKeyPresent: !!maskedConfig.anonKey && maskedConfig.anonKey !== '***',
      anonKeyMasked: maskedConfig.anonKey,
      configValid: isConfigured,
      configErrors: configErrors,
      pingResult: pingResult,
      userAgent: diagnostics.userAgent,
      envVarsFound: {
        VITE_SUPABASE_URL: !!import.meta.env.VITE_SUPABASE_URL,
        VITE_SUPABASE_ANON_KEY: !!import.meta.env.VITE_SUPABASE_ANON_KEY,
      },
    };

    navigator.clipboard.writeText(JSON.stringify(report, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const debugEnabled = import.meta.env.VITE_ENABLE_DEBUG === 'true' ||
                       import.meta.env.DEV ||
                       window.location.hostname === 'localhost';

  if (!debugEnabled) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <div className="bg-gray-800 rounded-lg p-8 max-w-md text-center">
          <X className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">Access Denied</h1>
          <p className="text-gray-400">
            Debug mode is not enabled. Set VITE_ENABLE_DEBUG=true in environment variables.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Supabase Diagnostics</h1>
          <p className="text-gray-400">Production debug panel for Supabase connectivity</p>
        </div>

        {!isConfigured && (
          <div className="bg-red-900/50 border border-red-500 rounded-lg p-6 mb-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-6 h-6 text-red-400 flex-shrink-0 mt-1" />
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-red-300 mb-2">Configuration Invalid</h3>
                <ul className="list-disc list-inside space-y-1 text-red-200">
                  {configErrors.map((error, idx) => (
                    <li key={idx}>{error}</li>
                  ))}
                </ul>
                <div className="mt-4 p-4 bg-gray-800 rounded border border-gray-700">
                  <p className="font-semibold mb-2">How to fix:</p>
                  <ol className="list-decimal list-inside space-y-1 text-sm text-gray-300">
                    <li>Go to Vercel Dashboard → Settings → Environment Variables</li>
                    <li>Add: VITE_SUPABASE_URL = https://your-project.supabase.co</li>
                    <li>Add: VITE_SUPABASE_ANON_KEY = eyJhbGci...</li>
                    <li>Check all environments (Production, Preview, Development)</li>
                    <li>Go to Deployments → Redeploy</li>
                  </ol>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h2 className="text-xl font-semibold mb-4">Configuration</h2>
            <div className="space-y-3">
              <div>
                <div className="text-sm text-gray-400 mb-1">Supabase URL</div>
                <div className="font-mono text-sm bg-gray-900 p-2 rounded border border-gray-700 break-all">
                  {maskedConfig.url || <span className="text-red-400">NOT SET</span>}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-400 mb-1">Anon Key (Masked)</div>
                <div className="font-mono text-sm bg-gray-900 p-2 rounded border border-gray-700 break-all">
                  {maskedConfig.anonKey || <span className="text-red-400">NOT SET</span>}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-400 mb-1">Config Status</div>
                <div className="flex items-center gap-2">
                  {isConfigured ? (
                    <>
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span className="text-green-400 font-medium">Valid</span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-4 h-4 text-red-400" />
                      <span className="text-red-400 font-medium">Invalid</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h2 className="text-xl font-semibold mb-4">Environment</h2>
            <div className="space-y-3">
              <div>
                <div className="text-sm text-gray-400 mb-1">Current Origin</div>
                <div className="font-mono text-sm bg-gray-900 p-2 rounded border border-gray-700 break-all">
                  {diagnostics.origin}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-400 mb-1">Timestamp</div>
                <div className="font-mono text-sm bg-gray-900 p-2 rounded border border-gray-700">
                  {new Date(diagnostics.timestamp).toLocaleString()}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-400 mb-1">Environment Variables</div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm">
                    {import.meta.env.VITE_SUPABASE_URL ? (
                      <CheckCircle className="w-4 h-4 text-green-400" />
                    ) : (
                      <X className="w-4 h-4 text-red-400" />
                    )}
                    <span>VITE_SUPABASE_URL</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    {import.meta.env.VITE_SUPABASE_ANON_KEY ? (
                      <CheckCircle className="w-4 h-4 text-green-400" />
                    ) : (
                      <X className="w-4 h-4 text-red-400" />
                    )}
                    <span>VITE_SUPABASE_ANON_KEY</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Connection Test</h2>
            <button
              onClick={handlePing}
              disabled={isLoading || !isConfigured}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              {isLoading ? 'Testing...' : 'Retry Ping'}
            </button>
          </div>

          {!isConfigured && (
            <div className="text-yellow-400 text-sm">
              Fix configuration errors first before testing connection.
            </div>
          )}

          {pingResult && (
            <div className={`p-4 rounded-lg border ${
              pingResult.success
                ? 'bg-green-900/30 border-green-500/50'
                : 'bg-red-900/30 border-red-500/50'
            }`}>
              <div className="flex items-start gap-3">
                {pingResult.success ? (
                  <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
                ) : (
                  <AlertCircle className="w-6 h-6 text-red-400 flex-shrink-0 mt-1" />
                )}
                <div className="flex-1">
                  <div className="font-semibold mb-2">
                    {pingResult.success ? 'Connection Successful' : 'Connection Failed'}
                  </div>
                  <div className="space-y-2 text-sm">
                    {pingResult.status && (
                      <div>HTTP Status: <span className="font-mono">{pingResult.status}</span></div>
                    )}
                    <div>Response Time: <span className="font-mono">{pingResult.responseTime.toFixed(0)}ms</span></div>
                    {pingResult.error && (
                      <div className="text-red-300">Error: {pingResult.error}</div>
                    )}
                    {pingResult.suggestion && (
                      <div className="mt-3 p-3 bg-gray-800 rounded border border-gray-700">
                        <div className="text-yellow-300 font-semibold mb-1">💡 Suggestion:</div>
                        <div className="text-gray-300">{pingResult.suggestion}</div>
                      </div>
                    )}
                    <div className="text-gray-400 text-xs">
                      Tested at: {new Date(pingResult.timestamp).toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Export Report</h2>
            <button
              onClick={copyReport}
              className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
            >
              <Copy className="w-4 h-4" />
              {copied ? 'Copied!' : 'Copy JSON'}
            </button>
          </div>
          <p className="text-sm text-gray-400">
            Copy a JSON report with all diagnostic information (keys are masked for security).
          </p>
        </div>

        <div className="mt-8 text-center text-sm text-gray-500">
          <p>This page is only accessible when VITE_ENABLE_DEBUG=true or in development mode.</p>
          <p className="mt-1">Never share full anon keys publicly.</p>
        </div>
      </div>
    </div>
  );
}
