import { useState, useEffect } from 'react';
import { Save, Globe, DollarSign, FileText, Mail } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { supabase } from '../lib/supabase';

interface SiteSettings {
  id: string;
  site_name: string;
  site_description: string;
  default_document_price: number;
  contact_email: string;
  enable_ai_generation: boolean;
  enable_guest_access: boolean;
  max_documents_per_user: number;
  updated_at: string;
}

export function SiteSettingsManager() {
  const { theme } = useTheme();
  const [settings, setSettings] = useState<SiteSettings>({
    id: '',
    site_name: 'iDoc',
    site_description: 'Créez facilement tous vos documents',
    default_document_price: 9.99,
    contact_email: 'contact@idoc.com',
    enable_ai_generation: true,
    enable_guest_access: true,
    max_documents_per_user: 100,
    updated_at: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .maybeSingle();

      if (error && error.code !== 'PGRST116') throw error;

      if (data) {
        setSettings(data);
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
      setMessage({ type: 'error', text: 'Erreur lors du chargement des paramètres' });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);

    try {
      const { data, error } = await supabase
        .from('site_settings')
        .upsert({
          ...settings,
          id: settings.id || '00000000-0000-0000-0000-000000000001',
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;

      setSettings(data);
      setMessage({ type: 'success', text: 'Paramètres sauvegardés avec succès' });

      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      console.error('Error saving settings:', error);
      setMessage({ type: 'error', text: 'Erreur lors de la sauvegarde des paramètres' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Paramètres du site</h2>
          <p className="text-gray-600 mt-1">Configurez les paramètres généraux de la plateforme</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? 'Sauvegarde...' : 'Sauvegarder'}</span>
        </button>
      </div>

      {message && (
        <div
          className={`p-4 rounded-lg ${
            message.type === 'success'
              ? 'bg-green-50 border border-green-200 text-green-700'
              : 'bg-red-50 border border-red-200 text-red-700'
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center space-x-2">
            <Globe className={`w-5 h-5 ${theme === 'minimal' ? 'text-gray-900' : 'text-blue-600'}`} />
            <span>Informations générales</span>
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Nom du site
              </label>
              <input
                type="text"
                value={settings.site_name}
                onChange={(e) => setSettings({ ...settings, site_name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={settings.site_description}
                onChange={(e) => setSettings({ ...settings, site_description: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center space-x-2">
            <Mail className={`w-5 h-5 ${theme === 'minimal' ? 'text-gray-900' : 'text-blue-600'}`} />
            <span>Contact</span>
          </h3>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Email de contact
            </label>
            <input
              type="email"
              value={settings.contact_email}
              onChange={(e) => setSettings({ ...settings, contact_email: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center space-x-2">
            <DollarSign className={`w-5 h-5 ${theme === 'minimal' ? 'text-gray-900' : 'text-blue-600'}`} />
            <span>Tarification</span>
          </h3>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Prix par défaut des documents
            </label>
            <div className="relative">
              <input
                type="number"
                step="0.01"
                min="0"
                value={settings.default_document_price}
                onChange={(e) => setSettings({ ...settings, default_document_price: parseFloat(e.target.value) })}
                className="w-full px-4 py-2 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center space-x-2">
            <FileText className={`w-5 h-5 ${theme === 'minimal' ? 'text-gray-900' : 'text-blue-600'}`} />
            <span>Fonctionnalités</span>
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="block text-sm font-semibold text-gray-900">
                  Génération IA
                </label>
                <p className="text-sm text-gray-600">Permettre la génération de documents par IA</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.enable_ai_generation}
                  onChange={(e) => setSettings({ ...settings, enable_ai_generation: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="block text-sm font-semibold text-gray-900">
                  Accès invité
                </label>
                <p className="text-sm text-gray-600">Permettre aux visiteurs non connectés d'utiliser le site</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.enable_guest_access}
                  onChange={(e) => setSettings({ ...settings, enable_guest_access: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Nombre maximum de documents par utilisateur
              </label>
              <input
                type="number"
                min="1"
                value={settings.max_documents_per_user}
                onChange={(e) => setSettings({ ...settings, max_documents_per_user: parseInt(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
