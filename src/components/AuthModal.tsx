import { useState } from 'react';
import { X, Mail, Lock, User, Zap } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

interface AuthModalProps {
  onClose: () => void;
  defaultMode?: 'signin' | 'signup' | 'quick';
}

export function AuthModal({ onClose, defaultMode = 'signin' }: AuthModalProps) {
  const { theme } = useTheme();
  const [mode, setMode] = useState<'signin' | 'signup' | 'quick'>(defaultMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [quickSignupSuccess, setQuickSignupSuccess] = useState(false);

  const { signIn, signUp } = useAuth();

  const generatePassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let pass = '';
    for (let i = 0; i < 12; i++) {
      pass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return pass;
  };

  const handleQuickSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const generatedPassword = generatePassword();
      await signUp(email, generatedPassword, '');
      setQuickSignupSuccess(true);

      setTimeout(() => {
        onClose();
      }, 3000);
    } catch (err) {
      const error = err as Error;
      setError(error.message || 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

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

  if (mode === 'quick') {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl max-w-md w-full p-8 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Fermer"
          >
            <X className="w-6 h-6" />
          </button>

          {quickSignupSuccess ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Compte créé!</h3>
              <p className="text-gray-600 mb-4">
                Votre compte a été créé avec succès. Vous êtes maintenant connecté!
              </p>
              <p className="text-sm text-gray-500">
                Redirection automatique...
              </p>
            </div>
          ) : (
            <>
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Inscription Express</h2>
                <p className="text-gray-600">Créez votre compte en 5 secondes</p>
              </div>

              <form onSubmit={handleQuickSignup} className="space-y-4">
                <div>
                  <label htmlFor="quick-email" className="block text-sm font-semibold text-gray-900 mb-2">
                    Votre email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      id="quick-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      placeholder="vous@exemple.com"
                      autoComplete="email"
                    />
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <Zap className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-blue-800">
                      <p className="font-semibold mb-1">Inscription automatique</p>
                      <p>Un mot de passe sécurisé sera créé automatiquement. Vous pourrez le modifier dans votre profil.</p>
                    </div>
                  </div>
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
                >
                  {loading ? (
                    <span className="flex items-center justify-center space-x-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Création en cours...</span>
                    </span>
                  ) : (
                    <span className="flex items-center justify-center space-x-2">
                      <Zap className="w-5 h-5" />
                      <span>Créer mon compte instantanément</span>
                    </span>
                  )}
                </button>
              </form>

              <div className="mt-6 text-center space-y-2">
                <button
                  onClick={() => setMode('signup')}
                  className="text-gray-600 hover:text-gray-800 text-sm"
                >
                  Préférez-vous choisir votre mot de passe?
                </button>
                <div className="text-gray-400">ou</div>
                <button
                  onClick={() => setMode('signin')}
                  className="text-blue-600 hover:text-blue-700 font-semibold text-sm"
                >
                  Déjà un compte? Se connecter
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

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
              <label htmlFor="fullName" className={theme === 'minimal' ? 'block text-xs font-light text-black mb-2 tracking-wide' : 'block text-sm font-medium text-gray-700 mb-2'} style={theme === 'minimal' ? { fontFamily: 'serif' } : {}}>
                Nom complet <span className="text-gray-400 text-xs">(optionnel)</span>
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" aria-hidden="true" />
                <input
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
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
                autoComplete="email"
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
                autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
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

          {mode === 'signup' && (
            <button
              type="button"
              onClick={() => setMode('quick')}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 flex items-center justify-center space-x-2"
            >
              <Zap className="w-5 h-5" />
              <span>Inscription Express (5 sec)</span>
            </button>
          )}
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
