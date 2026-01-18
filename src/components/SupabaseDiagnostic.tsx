import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { AlertCircle, CheckCircle, XCircle } from 'lucide-react';

export function SupabaseDiagnostic() {
  const [status, setStatus] = useState<{
    envVarsLoaded: boolean;
    supabaseUrl: string | undefined;
    hasAnonKey: boolean;
    connectionTest: 'pending' | 'success' | 'error';
    errorMessage?: string;
  }>({
    envVarsLoaded: false,
    supabaseUrl: undefined,
    hasAnonKey: false,
    connectionTest: 'pending'
  });

  useEffect(() => {
    const checkConnection = async () => {
      const url = import.meta.env.VITE_SUPABASE_URL;
      const hasKey = !!import.meta.env.VITE_SUPABASE_ANON_KEY;

      setStatus(prev => ({
        ...prev,
        envVarsLoaded: !!(url && hasKey),
        supabaseUrl: url,
        hasAnonKey: hasKey
      }));

      if (url && hasKey) {
        try {
          const { error } = await supabase
            .from('document_templates')
            .select('count')
            .limit(1);

          if (error) {
            setStatus(prev => ({
              ...prev,
              connectionTest: 'error',
              errorMessage: error.message
            }));
          } else {
            setStatus(prev => ({
              ...prev,
              connectionTest: 'success'
            }));
          }
        } catch (err) {
          setStatus(prev => ({
            ...prev,
            connectionTest: 'error',
            errorMessage: String(err)
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
            label="VITE_SUPABASE_ANON_KEY"
            status={status.hasAnonKey ? 'success' : 'error'}
            message={status.hasAnonKey ? 'Définie' : 'Non définie'}
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
            <h3 className="font-semibold text-red-900 mb-2">
              Solution:
            </h3>
            <ol className="list-decimal list-inside space-y-2 text-sm text-red-800">
              <li>Vérifier que le serveur de développement est démarré: <code className="bg-red-100 px-2 py-1 rounded">npm run dev</code></li>
              <li>Vérifier que le fichier <code className="bg-red-100 px-2 py-1 rounded">.env</code> existe à la racine</li>
              <li>Vérifier que les variables commencent par <code className="bg-red-100 px-2 py-1 rounded">VITE_</code></li>
              <li>Redémarrer le serveur après modification du .env</li>
              <li>Vider le cache du navigateur (Ctrl+Shift+R)</li>
            </ol>
            <p className="mt-3 text-sm text-red-800">
              Consultez le fichier <code className="bg-red-100 px-2 py-1 rounded">CORRECTION_ERREUR_CONNEXION.md</code> pour plus de détails.
            </p>
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
