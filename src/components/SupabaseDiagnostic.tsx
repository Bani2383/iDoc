import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { AlertCircle, CheckCircle, XCircle, Globe } from 'lucide-react';

export function SupabaseDiagnostic() {
  const [status, setStatus] = useState<{
    envVarsLoaded: boolean;
    supabaseUrl: string | undefined;
    hasAnonKey: boolean;
    urlFormat: 'valid' | 'invalid' | 'unknown';
    dnsResolved: boolean;
    connectionTest: 'pending' | 'success' | 'error';
    errorMessage?: string;
  }>({
    envVarsLoaded: false,
    supabaseUrl: undefined,
    hasAnonKey: false,
    urlFormat: 'unknown',
    dnsResolved: false,
    connectionTest: 'pending'
  });

  useEffect(() => {
    const checkConnection = async () => {
      const url = import.meta.env.VITE_SUPABASE_URL;
      const hasKey = !!import.meta.env.VITE_SUPABASE_ANON_KEY;

      console.log('🔍 Diagnostic Supabase:');
      console.log('  URL:', url);
      console.log('  Has Key:', hasKey);
      console.log('  Request will go to:', url);

      const urlFormatValid = url?.includes('.supabase.co') ?? false;

      setStatus(prev => ({
        ...prev,
        envVarsLoaded: !!(url && hasKey),
        supabaseUrl: url,
        hasAnonKey: hasKey,
        urlFormat: urlFormatValid ? 'valid' : 'invalid'
      }));

      if (url && hasKey) {
        try {
          const { error } = await supabase
            .from('document_templates')
            .select('count')
            .limit(1);

          if (error) {
            const isDnsError = error.message.includes('Failed to fetch') ||
                               error.message.includes('ERR_NAME_NOT_RESOLVED') ||
                               error.message.includes('NetworkError');

            console.error('❌ Erreur Supabase:', error.message);
            console.error('   DNS Error?', isDnsError);

            setStatus(prev => ({
              ...prev,
              dnsResolved: !isDnsError,
              connectionTest: 'error',
              errorMessage: isDnsError
                ? `DNS ne résout pas: ${url}`
                : error.message
            }));
          } else {
            console.log('✅ Connexion Supabase réussie');
            setStatus(prev => ({
              ...prev,
              dnsResolved: true,
              connectionTest: 'success'
            }));
          }
        } catch (err: any) {
          console.error('❌ Exception Supabase:', err);
          setStatus(prev => ({
            ...prev,
            dnsResolved: false,
            connectionTest: 'error',
            errorMessage: err.message || String(err)
          }));
        }
      } else {
        setStatus(prev => ({
          ...prev,
          connectionTest: 'error',
          errorMessage: 'Variables d\'environnement manquantes'
        }));
      }
    };

    checkConnection();
  }, []);

  if (status.connectionTest === 'success') {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6">
        <div className="flex items-center space-x-3 mb-6">
          <AlertCircle className="w-8 h-8 text-orange-500" />
          <h2 className="text-2xl font-bold text-gray-900">
            Diagnostic de Connexion Supabase
          </h2>
        </div>

        <div className="space-y-4">
          <DiagnosticItem
            label="Variables d'environnement chargées"
            status={status.envVarsLoaded ? 'success' : 'error'}
            message={status.envVarsLoaded ? 'Configurées correctement' : 'Non trouvées'}
          />

          <DiagnosticItem
            label="VITE_SUPABASE_URL"
            status={status.supabaseUrl ? 'success' : 'error'}
            message={status.supabaseUrl || 'Non définie'}
          />

          <DiagnosticItem
            label="Format URL Supabase"
            status={status.urlFormat === 'valid' ? 'success' : status.urlFormat === 'invalid' ? 'error' : 'pending'}
            message={
              status.urlFormat === 'valid'
                ? 'Format valide (.supabase.co)'
                : status.urlFormat === 'invalid'
                ? 'Format invalide - doit contenir .supabase.co'
                : 'Vérification...'
            }
          />

          <DiagnosticItem
            label="VITE_SUPABASE_ANON_KEY"
            status={status.hasAnonKey ? 'success' : 'error'}
            message={status.hasAnonKey ? 'Définie' : 'Non définie'}
          />

          <DiagnosticItem
            label="Résolution DNS"
            status={status.dnsResolved ? 'success' : 'error'}
            message={
              status.dnsResolved
                ? 'Domaine accessible'
                : 'ERR_NAME_NOT_RESOLVED - Le navigateur ne peut pas résoudre l\'URL'
            }
          />

          <DiagnosticItem
            label="Test de connexion"
            status={status.connectionTest}
            message={
              status.connectionTest === 'pending'
                ? 'En cours...'
                : status.connectionTest === 'success'
                ? 'Connexion réussie'
                : status.errorMessage || 'Erreur inconnue'
            }
          />
        </div>

        {status.connectionTest === 'error' && (
          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <h3 className="font-semibold text-red-900 mb-3 flex items-center gap-2">
              <Globe className="w-5 h-5" />
              Solution pour ERR_NAME_NOT_RESOLVED:
            </h3>

            {!status.dnsResolved && (
              <div className="mb-4 p-3 bg-yellow-100 border border-yellow-300 rounded">
                <p className="font-semibold text-yellow-900 mb-2">⚠️ Le navigateur ne peut pas résoudre l'URL Supabase</p>
                <p className="text-sm text-yellow-800">
                  Cela signifie que les variables d'environnement Vercel ne sont pas correctement configurées.
                </p>
              </div>
            )}

            <div className="space-y-3 text-sm text-red-800">
              <div>
                <p className="font-semibold mb-1">Sur Vercel :</p>
                <ol className="list-decimal list-inside space-y-1 ml-2">
                  <li>Allez sur <a href="https://vercel.com" target="_blank" rel="noopener noreferrer" className="underline">vercel.com</a></li>
                  <li>Ouvrez votre projet → Settings → Environment Variables</li>
                  <li>Ajoutez ou modifiez ces variables :</li>
                </ol>
              </div>

              <div className="bg-white p-3 rounded border border-red-300 space-y-2 font-mono text-xs">
                <div>
                  <strong>VITE_SUPABASE_URL</strong><br />
                  <span className="text-blue-700">https://ffujpjaaramwhtmzqhlx.supabase.co</span>
                </div>
                <div>
                  <strong>VITE_SUPABASE_ANON_KEY</strong><br />
                  <span className="text-blue-700">eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZmdWpwamFhcmFtd2h0bXpxaGx4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzExMTMzMDcsImV4cCI6MjA0NjY4OTMwN30.Lp-xJGVWG6yI0-Dq66eOxfqW6qyqTOJoqzw5lE_ggaE</span>
                </div>
              </div>

              <div>
                <p className="font-semibold mb-1">Après configuration :</p>
                <ol className="list-decimal list-inside space-y-1 ml-2">
                  <li>Allez dans Deployments → Redeploy</li>
                  <li>Attendez la fin du déploiement</li>
                  <li>Testez à nouveau sur https://id0c.com</li>
                </ol>
              </div>
            </div>

            <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded">
              <p className="text-sm text-blue-900">
                <strong>Note:</strong> Les variables doivent impérativement commencer par <code className="bg-blue-100 px-1 rounded">VITE_</code> pour être accessibles côté client.
              </p>
            </div>
          </div>
        )}

        <div className="mt-6 flex justify-end">
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Réessayer
          </button>
        </div>
      </div>
    </div>
  );
}

function DiagnosticItem({
  label,
  status,
  message
}: {
  label: string;
  status: 'pending' | 'success' | 'error';
  message: string;
}) {
  return (
    <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
      {status === 'pending' && <AlertCircle className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />}
      {status === 'success' && <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />}
      {status === 'error' && <XCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />}
      <div className="flex-1 min-w-0">
        <p className="font-medium text-gray-900">{label}</p>
        <p className="text-sm text-gray-600 break-all">{message}</p>
      </div>
    </div>
  );
}
