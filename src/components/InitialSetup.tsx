import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { sampleTemplates } from '../data/sampleTemplates';
import { CheckCircle, AlertCircle, Loader } from 'lucide-react';

export function InitialSetup() {
  const [status, setStatus] = useState<'checking' | 'empty' | 'populated' | 'error'>('checking');
  const [isPopulating, setIsPopulating] = useState(false);

  useEffect(() => {
    checkTemplates();
  }, []);

  const checkTemplates = async () => {
    try {
      const { data, error } = await supabase
        .from('document_templates')
        .select('id')
        .limit(1);

      if (error) throw error;

      if (data && data.length > 0) {
        setStatus('populated');
      } else {
        setStatus('empty');
      }
    } catch (error) {
      console.error('Error checking templates:', error);
      setStatus('error');
    }
  };

  const populateTemplates = async () => {
    setIsPopulating(true);
    try {
      const { error } = await supabase
        .from('document_templates')
        .insert(sampleTemplates);

      if (error) throw error;

      setStatus('populated');
      window.location.reload(); // Recharger pour voir les nouveaux modèles
    } catch (error) {
      console.error('Error populating templates:', error);
      alert('Erreur lors de l\'ajout des modèles d\'exemple');
    } finally {
      setIsPopulating(false);
    }
  };

  if (status === 'checking') {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <Loader className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
            <p className="text-gray-600">Vérification de la base de données...</p>
          </div>
        </div>
      </div>
    );
  }

  if (status === 'populated') {
    return null; // Tout est OK, ne rien afficher
  }

  if (status === 'error') {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <AlertCircle className="w-8 h-8 text-red-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Erreur de connexion</h3>
            <p className="text-gray-600 mb-4">
              Impossible de se connecter à la base de données. Vérifiez votre configuration Supabase.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Réessayer
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
        <div className="text-center">
          <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Configuration initiale</h3>
          <p className="text-gray-600 mb-6">
            Votre base de données est vide. Voulez-vous ajouter quelques modèles d'exemple pour commencer ?
          </p>
          <div className="space-y-3">
            <button
              onClick={populateTemplates}
              disabled={isPopulating}
              className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
            >
              {isPopulating ? (
                <>
                  <Loader className="w-4 h-4 animate-spin" />
                  <span>Ajout en cours...</span>
                </>
              ) : (
                <span>Ajouter les modèles d'exemple</span>
              )}
            </button>
            <button
              onClick={() => setStatus('populated')}
              className="w-full bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Continuer sans modèles
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}