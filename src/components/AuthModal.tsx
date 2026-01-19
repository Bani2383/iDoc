import { useState } from 'react';
import { X, Mail, Lock, User, Zap, Github } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

interface AuthModalProps {
  onClose: () => void;
  defaultMode?: 'signin' | 'signup' | 'quick' | 'reset';
}

export function AuthModal({ onClose, defaultMode = 'signin' }: AuthModalProps) {
  const { theme } = useTheme();
  const [mode, setMode] = useState<'signin' | 'signup' | 'quick' | 'reset'>(defaultMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [quickSignupSuccess, setQuickSignupSuccess] = useState(false);

  const { signIn, signUp, resetPassword, signInWithProvider } = useAuth();

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
    setSuccess('');
    setLoading(true);

    try {
      if (mode === 'signin') {
        await signIn(email, password);
        onClose();
      } else if (mode === 'reset') {
        await resetPassword(email);
        setSuccess('Un email de réinitialisation a été envoyé à votre adresse.');
        setTimeout(() => setMode('signin'), 3000);
      } else {
        await signUp(email, password, fullName);
        onClose();
      }
    } catch (err) {
      const error = err as Error;
      setError(error.message || 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (provider: 'google' | 'facebook' | 'twitter' | 'github') => {
    try {
      setError('');
      setLoading(true);
      await signInWithProvider(provider);
    } catch (err) {
      const error = err as Error;
      setError(error.message || 'Une erreur est survenue lors de la connexion');
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

  if (mode === 'reset') {
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

          <h2 className="text-2xl font-bold text-gray-900 mb-2">Mot de passe oublié ?</h2>
          <p className="text-gray-600 mb-6">Entrez votre email pour recevoir un lien de réinitialisation</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="reset-email" className="block text-sm font-semibold text-gray-900 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="reset-email"
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

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {success && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
                {success}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Envoi en cours...' : 'Envoyer le lien de réinitialisation'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setMode('signin');
                setError('');
                setSuccess('');
              }}
              className="text-blue-600 hover:text-blue-700 font-semibold text-sm"
            >
              Retour à la connexion
            </button>
          </div>
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

        {mode === 'signin' && (
          <div className="mt-4 text-right">
            <button
              onClick={() => {
                setMode('reset');
                setError('');
              }}
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              Mot de passe oublié ?
            </button>
          </div>
        )}

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Ou continuer avec</span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => handleSocialLogin('google')}
              disabled={loading}
              className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span className="ml-2 text-sm font-medium text-gray-700">Google</span>
            </button>

            <button
              type="button"
              onClick={() => handleSocialLogin('facebook')}
              disabled={loading}
              className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              <svg className="w-5 h-5" fill="#1877F2" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              <span className="ml-2 text-sm font-medium text-gray-700">Facebook</span>
            </button>

            <button
              type="button"
              onClick={() => handleSocialLogin('twitter')}
              disabled={loading}
              className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              <svg className="w-5 h-5" fill="#1DA1F2" viewBox="0 0 24 24">
                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
              </svg>
              <span className="ml-2 text-sm font-medium text-gray-700">Twitter</span>
            </button>

            <button
              type="button"
              onClick={() => handleSocialLogin('github')}
              disabled={loading}
              className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              <Github className="w-5 h-5" />
              <span className="ml-2 text-sm font-medium text-gray-700">GitHub</span>
            </button>
          </div>
        </div>

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
