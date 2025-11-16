import { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Save, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { supabase } from '../lib/supabase';

export function ClientProfilePage() {
  const { user, profile, refreshProfile } = useAuth();
  const { theme } = useTheme();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const [formData, setFormData] = useState({
    full_name: profile?.full_name || '',
    email: user?.email || '',
    phone_number: profile?.phone_number || '',
    postal_address: profile?.postal_address || '',
    billing_email: profile?.billing_email || user?.email || ''
  });

  useEffect(() => {
    setFormData({
      full_name: profile?.full_name || '',
      email: user?.email || '',
      phone_number: profile?.phone_number || '',
      postal_address: profile?.postal_address || '',
      billing_email: profile?.billing_email || user?.email || ''
    });
  }, [profile, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const { error: profileError } = await supabase
        .from('user_profiles')
        .update({
          full_name: formData.full_name,
          phone_number: formData.phone_number,
          postal_address: formData.postal_address,
          billing_email: formData.billing_email
        })
        .eq('id', user?.id);

      if (profileError) throw profileError;

      if (formData.email !== user?.email) {
        const { error: emailError } = await supabase.auth.updateUser({
          email: formData.email
        });

        if (emailError) throw emailError;
        setMessage({
          type: 'success',
          text: 'Profil mis à jour. Un email de confirmation a été envoyé à votre nouvelle adresse.'
        });
      } else {
        setMessage({ type: 'success', text: 'Profil mis à jour avec succès' });
      }

      await refreshProfile();
    } catch (error) {
      const err = error as Error;
      console.error('Error updating profile:', error);
      setMessage({ type: 'error', text: err.message || 'Erreur lors de la mise à jour' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Mon Compte</h1>
        <p className="text-gray-600">Gérez vos informations personnelles</p>
      </div>

      {message && (
        <div className={`mb-6 p-4 rounded-lg flex items-start space-x-3 ${
          message.type === 'success'
            ? (theme === 'minimal' ? 'bg-gray-100 border border-gray-300' : 'bg-green-50 border border-green-200')
            : (theme === 'minimal' ? 'bg-gray-100 border border-gray-400' : 'bg-red-50 border border-red-200')
        }`}>
          {message.type === 'success' ? (
            <CheckCircle className={`w-5 h-5 flex-shrink-0 mt-0.5 ${theme === 'minimal' ? 'text-gray-900' : 'text-green-600'}`} />
          ) : (
            <AlertCircle className={`w-5 h-5 flex-shrink-0 mt-0.5 ${theme === 'minimal' ? 'text-gray-900' : 'text-red-600'}`} />
          )}
          <p className={message.type === 'success'
            ? (theme === 'minimal' ? 'text-gray-900' : 'text-green-800')
            : (theme === 'minimal' ? 'text-gray-900' : 'text-red-800')
          }>
            {message.text}
          </p>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm">
        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-6">
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <User className={`w-5 h-5 mr-2 ${theme === 'minimal' ? 'text-gray-900' : 'text-blue-600'}`} />
                Informations personnelles
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Nom complet
                  </label>
                  <input
                    type="text"
                    value={formData.full_name}
                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                    className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent ${theme === 'minimal' ? 'focus:ring-gray-900' : 'focus:ring-blue-500'}`}
                    placeholder="Jean Dupont"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <Mail className="w-4 h-4 inline mr-1" />
                    Email principal
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent ${theme === 'minimal' ? 'focus:ring-gray-900' : 'focus:ring-blue-500'}`}
                    placeholder="jean.dupont@example.com"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Un email de confirmation sera envoyé si vous modifiez cette adresse
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <Phone className="w-4 h-4 inline mr-1" />
                    Téléphone
                  </label>
                  <input
                    type="tel"
                    value={formData.phone_number}
                    onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                    className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent ${theme === 'minimal' ? 'focus:ring-gray-900' : 'focus:ring-blue-500'}`}
                    placeholder="+33 6 12 34 56 78"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <MapPin className="w-4 h-4 inline mr-1" />
                    Adresse postale
                  </label>
                  <textarea
                    value={formData.postal_address}
                    onChange={(e) => setFormData({ ...formData, postal_address: e.target.value })}
                    rows={3}
                    className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent ${theme === 'minimal' ? 'focus:ring-gray-900' : 'focus:ring-blue-500'}`}
                    placeholder="123 Rue de la Paix&#10;75001 Paris&#10;France"
                  />
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <Mail className={`w-5 h-5 mr-2 ${theme === 'minimal' ? 'text-gray-900' : 'text-blue-600'}`} />
                Informations de facturation
              </h2>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email de facturation
                </label>
                <input
                  type="email"
                  value={formData.billing_email}
                  onChange={(e) => setFormData({ ...formData, billing_email: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="facturation@example.com"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Les factures seront envoyées à cette adresse
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 px-6 py-4 rounded-b-lg flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Dernière modification: {profile?.updated_at
                ? new Date(profile.updated_at).toLocaleDateString('fr-FR', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })
                : 'Jamais'}
            </p>
            <button
              type="submit"
              disabled={loading}
              className={`flex items-center space-x-2 text-white px-6 py-2 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${theme === 'minimal' ? 'bg-black hover:bg-gray-800' : 'bg-blue-600 hover:bg-blue-700'}`}
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Enregistrement...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Enregistrer</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
