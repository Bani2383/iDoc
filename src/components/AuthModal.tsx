import { useState } from 'react';
import { X, Mail, Lock, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

interface AuthModalProps {
  onClose: () => void;
  defaultMode?: 'signin' | 'signup';
}

export function AuthModal({ onClose, defaultMode = 'signin' }: AuthModalProps) {
  const { theme } = useTheme();
  const [mode, setMode] = useState<'signin' | 'signup'>(defaultMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { signIn, signUp } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (mode === 'signin') {
        await signIn(email, password);
      } else {
        await signUp(email, password, fullName);
      }
      onClose();
    } catch (err) {
      const error = err as Error;
      setError(error.message || 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={theme === 'minimal' ? 'bg-white border-2 border-black max-w-md w-full p-8 relative' : 'bg-white rounded-xl max-w-md w-full p-8 relative'}>
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Fermer la modal d'authentification"
        >
          <X className="w-6 h-6" aria-hidden="true" />
        </button>

        <h2 className={theme === 'minimal' ? 'text-xl font-light text-black mb-6 tracking-tight' : 'text-2xl font-bold text-gray-900 mb-6'} style={theme === 'minimal' ? { fontFamily: 'serif' } : {}}>
          {mode === 'signin' ? 'Connexion' : 'Créer un compte'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <div>
              <label htmlFor="fullName" className={theme === 'minimal' ? 'block text-xs font-light text-black mb-2 tracking-wide' : 'block text-sm font-semibold text-gray-900 mb-2'} style={theme === 'minimal' ? { fontFamily: 'serif' } : {}}>
                Nom complet
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" aria-hidden="true" />
                <input
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  className={theme === 'minimal' ? 'w-full pl-10 pr-4 py-3 border border-black focus:ring-1 focus:ring-black focus:border-black outline-none text-sm' : 'w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none'}
                  placeholder="Jean Dupont"
                  style={theme === 'minimal' ? { fontFamily: 'serif' } : {}}
                />
              </div>
            </div>
          )}

          <div>
            <label htmlFor="email" className={theme === 'minimal' ? 'block text-xs font-light text-black mb-2 tracking-wide' : 'block text-sm font-semibold text-gray-900 mb-2'} style={theme === 'minimal' ? { fontFamily: 'serif' } : {}}>
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" aria-hidden="true" />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className={theme === 'minimal' ? 'w-full pl-10 pr-4 py-3 border border-black focus:ring-1 focus:ring-black focus:border-black outline-none text-sm' : 'w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none'}
                placeholder="vous@exemple.com"
                style={theme === 'minimal' ? { fontFamily: 'serif' } : {}}
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className={theme === 'minimal' ? 'block text-xs font-light text-black mb-2 tracking-wide' : 'block text-sm font-semibold text-gray-900 mb-2'} style={theme === 'minimal' ? { fontFamily: 'serif' } : {}}>
              Mot de passe
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" aria-hidden="true" />
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className={theme === 'minimal' ? 'w-full pl-10 pr-4 py-3 border border-black focus:ring-1 focus:ring-black focus:border-black outline-none text-sm' : 'w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none'}
                placeholder="••••••••"
                style={theme === 'minimal' ? { fontFamily: 'serif' } : {}}
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm" role="alert" aria-live="polite">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className={theme === 'minimal' ? 'w-full bg-black text-white py-3 text-xs tracking-[0.2em] hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed border border-black' : 'w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'}
            style={theme === 'minimal' ? { fontFamily: 'serif' } : {}}
            aria-busy={loading}
          >
            {loading ? 'Chargement...' : mode === 'signin' ? (theme === 'minimal' ? 'SE CONNECTER' : 'Se connecter') : (theme === 'minimal' ? 'CRÉER UN COMPTE' : 'Créer un compte')}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => {
              setMode(mode === 'signin' ? 'signup' : 'signin');
              setError('');
            }}
            className={theme === 'minimal' ? 'text-black hover:text-gray-700 font-light text-xs tracking-wide' : 'text-blue-600 hover:text-blue-700 font-semibold'}
            style={theme === 'minimal' ? { fontFamily: 'serif' } : {}}
            aria-label={mode === 'signin' ? 'Basculer vers la création de compte' : 'Basculer vers la connexion'}
          >
            {mode === 'signin' ? 'Créer un compte' : 'Déjà un compte ? Se connecter'}
          </button>
        </div>
      </div>
    </div>
  );
}
