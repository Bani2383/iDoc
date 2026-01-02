import { useState, useEffect } from 'react';
import { User, Briefcase, Home, Save, CheckCircle } from 'lucide-react';
import { supabase, UserProfile } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { LoadingSpinner } from './LoadingSpinner';

export default function UserProfilePage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Partial<UserProfile>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState<'personal' | 'professional' | 'address'>('personal');

  useEffect(() => {
    loadProfile();
  }, [user]);

  const loadProfile = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      if (error) throw error;
      if (data) setProfile(data);
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!user) return;

    setSaving(true);
    setSaved(false);

    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({
          full_name: profile.full_name,
          phone: profile.phone,
          birth_date: profile.birth_date,
          professional_status: profile.professional_status,
          profession: profile.profession,
          company_name: profile.company_name,
          housing_status: profile.housing_status,
          address_line1: profile.address_line1,
          address_line2: profile.address_line2,
          city: profile.city,
          postal_code: profile.postal_code,
          country: profile.country,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (error) throw error;

      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Erreur lors de la sauvegarde du profil');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (field: keyof UserProfile, value: string) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const getCompleteness = (): number => {
    const totalFields = 11;
    const filledFields = [
      profile.full_name,
      profile.phone,
      profile.birth_date,
      profile.address_line1,
      profile.city,
      profile.postal_code,
      profile.country,
      profile.profession,
      profile.professional_status,
      profile.housing_status,
    ].filter(field => field && field !== '').length;

    return Math.round((filledFields / totalFields) * 100);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  const completeness = getCompleteness();

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Mon Profil</h1>
            <p className="text-gray-600 mt-2">
              Complétez votre profil pour activer le pré-remplissage automatique
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-blue-600">{completeness}%</div>
            <div className="text-sm text-gray-600">Complété</div>
          </div>
        </div>

        <div className="mb-6">
          <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setActiveTab('personal')}
              className={`flex-1 py-2 px-4 rounded-md flex items-center justify-center gap-2 transition ${
                activeTab === 'personal'
                  ? 'bg-white text-blue-600 shadow'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <User className="w-4 h-4" />
              <span>Informations Personnelles</span>
            </button>
            <button
              onClick={() => setActiveTab('professional')}
              className={`flex-1 py-2 px-4 rounded-md flex items-center justify-center gap-2 transition ${
                activeTab === 'professional'
                  ? 'bg-white text-blue-600 shadow'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Briefcase className="w-4 h-4" />
              <span>Informations Professionnelles</span>
            </button>
            <button
              onClick={() => setActiveTab('address')}
              className={`flex-1 py-2 px-4 rounded-md flex items-center justify-center gap-2 transition ${
                activeTab === 'address'
                  ? 'bg-white text-blue-600 shadow'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Home className="w-4 h-4" />
              <span>Adresse</span>
            </button>
          </div>
        </div>

        <div className="space-y-6">
          {activeTab === 'personal' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom complet
                </label>
                <input
                  type="text"
                  value={profile.full_name || ''}
                  onChange={(e) => handleChange('full_name', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Jean Dupont"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Téléphone
                </label>
                <input
                  type="tel"
                  value={profile.phone || ''}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="+1 514 123 4567"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date de naissance
                </label>
                <input
                  type="date"
                  value={profile.birth_date || ''}
                  onChange={(e) => handleChange('birth_date', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </>
          )}

          {activeTab === 'professional' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Statut professionnel
                </label>
                <select
                  value={profile.professional_status || ''}
                  onChange={(e) => handleChange('professional_status', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Sélectionnez</option>
                  <option value="Employé">Employé</option>
                  <option value="Indépendant">Indépendant</option>
                  <option value="Étudiant">Étudiant</option>
                  <option value="Retraité">Retraité</option>
                  <option value="Autre">Autre</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Profession
                </label>
                <input
                  type="text"
                  value={profile.profession || ''}
                  onChange={(e) => handleChange('profession', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Développeur Web"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom de l'employeur / Entreprise
                </label>
                <input
                  type="text"
                  value={profile.company_name || ''}
                  onChange={(e) => handleChange('company_name', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Acme Corp"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Statut de logement
                </label>
                <select
                  value={profile.housing_status || ''}
                  onChange={(e) => handleChange('housing_status', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Sélectionnez</option>
                  <option value="Propriétaire">Propriétaire</option>
                  <option value="Locataire">Locataire</option>
                  <option value="Hébergé">Hébergé</option>
                  <option value="Autre">Autre</option>
                </select>
              </div>
            </>
          )}

          {activeTab === 'address' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Adresse (ligne 1)
                </label>
                <input
                  type="text"
                  value={profile.address_line1 || ''}
                  onChange={(e) => handleChange('address_line1', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="123 Rue Principale"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Adresse (ligne 2)
                </label>
                <input
                  type="text"
                  value={profile.address_line2 || ''}
                  onChange={(e) => handleChange('address_line2', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Appartement 4B"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ville
                  </label>
                  <input
                    type="text"
                    value={profile.city || ''}
                    onChange={(e) => handleChange('city', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Montréal"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Code postal
                  </label>
                  <input
                    type="text"
                    value={profile.postal_code || ''}
                    onChange={(e) => handleChange('postal_code', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="H1A 1A1"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pays
                </label>
                <input
                  type="text"
                  value={profile.country || 'Canada'}
                  onChange={(e) => handleChange('country', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </>
          )}
        </div>

        <div className="mt-8 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            {completeness === 100 ? (
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle className="w-5 h-5" />
                <span>Profil complet ! Le pré-remplissage est activé.</span>
              </div>
            ) : (
              <span>Complétez votre profil à 100% pour profiter pleinement du SmartFill</span>
            )}
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2 transition"
          >
            {saving ? (
              <>
                <LoadingSpinner />
                <span>Enregistrement...</span>
              </>
            ) : saved ? (
              <>
                <CheckCircle className="w-5 h-5" />
                <span>Enregistré !</span>
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                <span>Enregistrer</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
