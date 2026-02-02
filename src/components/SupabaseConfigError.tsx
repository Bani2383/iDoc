import { AlertCircle, ExternalLink, RefreshCw } from 'lucide-react';
import { getSupabaseConfigErrors } from '../lib/supabaseClient';

export default function SupabaseConfigError() {
  const errors = getSupabaseConfigErrors();

  const handleReload = () => {
    window.location.reload();
  };

  const openDebugPage = () => {
    window.open('/debug/supabase', '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="bg-gray-800 rounded-2xl shadow-2xl overflow-hidden border border-gray-700">
          <div className="bg-gradient-to-r from-red-600 to-red-700 p-6">
            <div className="flex items-center gap-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-full p-3">
                <AlertCircle className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Configuration Error</h1>
                <p className="text-red-100">Supabase connection not configured</p>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-6">
            <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-red-300 mb-3">Configuration Issues:</h3>
              <ul className="space-y-2">
                {errors.map((error, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-red-200">
                    <span className="text-red-400 mt-1">•</span>
                    <span>{error}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-gray-700/50 rounded-lg p-5">
              <h3 className="text-lg font-semibold text-white mb-3">Expected Configuration:</h3>
              <div className="space-y-3">
                <div>
                  <div className="text-sm text-gray-400 mb-1">VITE_SUPABASE_URL</div>
                  <div className="font-mono text-sm bg-gray-900 p-3 rounded border border-gray-600 text-green-400">
                    https://your-project-ref.supabase.co
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-400 mb-1">VITE_SUPABASE_ANON_KEY</div>
                  <div className="font-mono text-sm bg-gray-900 p-3 rounded border border-gray-600 text-green-400">
                    eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-5">
              <h3 className="text-lg font-semibold text-blue-300 mb-3">How to Fix on Vercel:</h3>
              <ol className="space-y-2 text-gray-300">
                <li className="flex gap-3">
                  <span className="font-bold text-blue-400">1.</span>
                  <span>Go to <span className="font-semibold">Vercel Dashboard</span> → Your Project</span>
                </li>
                <li className="flex gap-3">
                  <span className="font-bold text-blue-400">2.</span>
                  <span>Click <span className="font-semibold">Settings</span> → <span className="font-semibold">Environment Variables</span></span>
                </li>
                <li className="flex gap-3">
                  <span className="font-bold text-blue-400">3.</span>
                  <span>Add <span className="font-mono bg-gray-700 px-2 py-1 rounded">VITE_SUPABASE_URL</span></span>
                </li>
                <li className="flex gap-3">
                  <span className="font-bold text-blue-400">4.</span>
                  <span>Add <span className="font-mono bg-gray-700 px-2 py-1 rounded">VITE_SUPABASE_ANON_KEY</span></span>
                </li>
                <li className="flex gap-3">
                  <span className="font-bold text-blue-400">5.</span>
                  <span>Check <span className="font-semibold">Production, Preview, Development</span></span>
                </li>
                <li className="flex gap-3">
                  <span className="font-bold text-blue-400">6.</span>
                  <span>Go to <span className="font-semibold">Deployments</span> → Click <span className="font-semibold">Redeploy</span></span>
                </li>
                <li className="flex gap-3">
                  <span className="font-bold text-blue-400">7.</span>
                  <span>Wait 1-2 minutes and reload this page</span>
                </li>
              </ol>
            </div>

            <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4">
              <h3 className="text-yellow-300 font-semibold mb-2">⚠️ Important Notes:</h3>
              <ul className="space-y-1 text-sm text-yellow-200">
                <li>• Variable names MUST start with <span className="font-mono">VITE_</span> (required by Vite)</li>
                <li>• After adding variables, you MUST redeploy (changes don't apply automatically)</li>
                <li>• Remove any incorrectly named variables (e.g., URL_SUPABASE_VITE)</li>
                <li>• Never use SERVICE_ROLE_KEY in frontend code (security risk)</li>
              </ul>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleReload}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
              >
                <RefreshCw className="w-5 h-5" />
                Reload Page
              </button>
              <button
                onClick={openDebugPage}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-lg transition-colors"
              >
                <ExternalLink className="w-5 h-5" />
                Open Debug Panel
              </button>
            </div>
          </div>

          <div className="bg-gray-900/50 px-6 py-4 text-center text-sm text-gray-400">
            <p>Need help? Check the <span className="font-mono text-blue-400">vercel-config.html</span> file in your project root.</p>
            <p className="mt-1">Or visit <a href="/debug/supabase" className="text-blue-400 hover:underline">Debug Panel</a> for detailed diagnostics.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
