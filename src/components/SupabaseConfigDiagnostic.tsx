import React, { useState, useEffect } from 'react';
import { supabase, getSupabaseConfig } from '../lib/supabase';
import { CheckCircle, XCircle, AlertCircle, RefreshCw } from 'lucide-react';

export default function SupabaseConfigDiagnostic() {
  const [testing, setTesting] = useState(false);
  const [results, setResults] = useState<{
    configLoaded: boolean;
    urlValid: boolean;
    keyValid: boolean;
    dnsResolved: boolean;
    connectionTest: boolean;
    authTest: boolean;
    error?: string;
    requestUrl?: string;
  }>({
    configLoaded: false,
    urlValid: false,
    keyValid: false,
    dnsResolved: false,
    connectionTest: false,
    authTest: false
  });

  const runDiagnostic = async () => {
    setTesting(true);
    const newResults = {
      configLoaded: false,
      urlValid: false,
      keyValid: false,
      dnsResolved: false,
      connectionTest: false,
      authTest: false,
      error: undefined as string | undefined,
      requestUrl: undefined as string | undefined
    };

    try {
      const config = getSupabaseConfig();

      newResults.configLoaded = !!config.url && !!config.hasAnonKey;
      newResults.urlValid = config.url.includes('.supabase.co');
      newResults.keyValid = config.hasAnonKey;
      newResults.requestUrl = config.url;

      console.log('🔍 Configuration Supabase détectée:', config);

      try {
        const { error: pingError } = await supabase.from('document_templates').select('count').limit(1);

        if (pingError) {
          newResults.error = pingError.message;
          if (pingError.message.includes('Failed to fetch') ||
              pingError.message.includes('ERR_NAME_NOT_RESOLVED')) {
            newResults.dnsResolved = false;
            newResults.error = `DNS ne résout pas: ${config.url}`;
          } else {
            newResults.dnsResolved = true;
            newResults.connectionTest = false;
          }
        } else {
          newResults.dnsResolved = true;
          newResults.connectionTest = true;
        }
      } catch (err: any) {
        newResults.error = err.message;
        newResults.dnsResolved = false;
      }

      try {
        const { error: authError } = await supabase.auth.getSession();
        newResults.authTest = !authError;
      } catch (err: any) {
        console.error('Auth test failed:', err);
      }

    } catch (err: any) {
      newResults.error = err.message;
    }

    setResults(newResults);
    setTesting(false);
  };

  useEffect(() => {
    runDiagnostic();
  }, []);

  const StatusIcon = ({ status }: { status: boolean }) =>
    status ? <CheckCircle className="w-5 h-5 text-green-600" /> : <XCircle className="w-5 h-5 text-red-600" />;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Diagnostic Supabase</h2>
        <button
          onClick={runDiagnostic}
          disabled={testing}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${testing ? 'animate-spin' : ''}`} />
          Retester
        </button>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
          <StatusIcon status={results.configLoaded} />
          <div className="flex-1">
            <p className="font-semibold">Variables d'environnement chargées</p>
            <p className="text-sm text-gray-600">VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY</p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
          <StatusIcon status={results.urlValid} />
          <div className="flex-1">
            <p className="font-semibold">Format URL valide</p>
            {results.requestUrl && (
              <p className="text-sm text-gray-600 font-mono break-all">{results.requestUrl}</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
          <StatusIcon status={results.keyValid} />
          <div className="flex-1">
            <p className="font-semibold">Clé Anon présente</p>
            <p className="text-sm text-gray-600">La clé d'authentification est configurée</p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
          <StatusIcon status={results.dnsResolved} />
          <div className="flex-1">
            <p className="font-semibold">Résolution DNS</p>
            <p className="text-sm text-gray-600">Le domaine Supabase est accessible</p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
          <StatusIcon status={results.connectionTest} />
          <div className="flex-1">
            <p className="font-semibold">Connexion base de données</p>
            <p className="text-sm text-gray-600">Requête test réussie</p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
          <StatusIcon status={results.authTest} />
          <div className="flex-1">
            <p className="font-semibold">Auth Supabase</p>
            <p className="text-sm text-gray-600">Service d'authentification disponible</p>
          </div>
        </div>

        {results.error && (
          <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-semibold text-red-900">Erreur détectée</p>
              <p className="text-sm text-red-700 mt-1 font-mono">{results.error}</p>
            </div>
          </div>
        )}

        {!results.dnsResolved && (
          <div className="p-6 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h3 className="font-bold text-yellow-900 mb-3">⚠️ Solution pour ERR_NAME_NOT_RESOLVED</h3>
            <ol className="space-y-2 text-sm text-yellow-800">
              <li>1. Connectez-vous à Vercel : https://vercel.com</li>
              <li>2. Allez dans votre projet id0c</li>
              <li>3. Settings → Environment Variables</li>
              <li>4. Vérifiez que ces variables existent :</li>
              <li className="ml-4 font-mono bg-white p-2 rounded">
                VITE_SUPABASE_URL = https://ffujpjaaramwhtmzqhlx.supabase.co
              </li>
              <li className="ml-4 font-mono bg-white p-2 rounded">
                VITE_SUPABASE_ANON_KEY = eyJhbG...
              </li>
              <li>5. Redéployez depuis Vercel → Deployments → Redeploy</li>
            </ol>
          </div>
        )}
      </div>

      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="font-semibold text-blue-900 mb-2">Variables Vercel à configurer :</h3>
        <div className="space-y-2 text-sm">
          <div className="font-mono bg-white p-2 rounded">
            <strong>VITE_SUPABASE_URL</strong> = https://ffujpjaaramwhtmzqhlx.supabase.co
          </div>
          <div className="font-mono bg-white p-2 rounded">
            <strong>VITE_SUPABASE_ANON_KEY</strong> = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZmdWpwamFhcmFtd2h0bXpxaGx4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzExMTMzMDcsImV4cCI6MjA0NjY4OTMwN30.Lp-xJGVWG6yI0-Dq66eOxfqW6qyqTOJoqzw5lE_ggaE
          </div>
        </div>
      </div>
    </div>
  );
}
