import { useState } from 'react';
import { Sparkles, X } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface AIDocumentGeneratorProps {
  onClose: () => void;
  onSuccess?: () => void;
}

export function AIDocumentGenerator({ onClose, onSuccess }: AIDocumentGeneratorProps) {
  const { user } = useAuth();
  const [documentType, setDocumentType] = useState('');
  const [description, setDescription] = useState('');
  const [generating, setGenerating] = useState(false);

  const handleGenerate = async () => {
    if (!documentType.trim()) return;

    setGenerating(true);

    try {
      // Note: This would be replaced with actual AI API call in production
      // const aiPrompt = `Créez un document juridique professionnel de type "${documentType}".
      // ${description ? `Détails: ${description}` : ''}
      // Le document doit être complet, professionnel et conforme aux normes juridiques canadiennes.`;

      const content = `DOCUMENT GÉNÉRÉ PAR IA

TYPE: ${documentType}

${description ? `DESCRIPTION: ${description}\n` : ''}
---

[Ce document serait généré par une vraie IA. Pour l'instant, ceci est un placeholder.]

Ce document de type "${documentType}" contient toutes les clauses standard nécessaires pour ce type de document juridique.

SECTION 1: INTRODUCTION
${documentType} établi conformément aux lois applicables.

SECTION 2: PARTIES
Les parties impliquées dans ce document s'engagent à respecter toutes les clauses et conditions stipulées.

SECTION 3: CONDITIONS GÉNÉRALES
[Les conditions spécifiques seraient générées ici basées sur le type de document]

SECTION 4: SIGNATURES
___________________________
Partie 1

___________________________
Partie 2

Date: _______________
`;

      const { error } = await supabase
        .from('generated_documents')
        .insert([{
          user_id: user?.id,
          document_type: documentType,
          content: content,
          variables: { description },
          status: 'generated',
          price: 0,
        }]);

      if (error) throw error;

      alert(`Document "${documentType}" généré avec succès!`);
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error('Error generating document:', error);
      alert('Erreur lors de la génération du document');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full p-8 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="flex items-center space-x-3 mb-6">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Génération par IA</h2>
            <p className="text-gray-600">Créez un document personnalisé</p>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <label htmlFor="documentType" className="block text-sm font-semibold text-gray-900 mb-2">
              Type de document <span className="text-red-500">*</span>
            </label>
            <input
              id="documentType"
              type="text"
              value={documentType}
              onChange={(e) => setDocumentType(e.target.value)}
              placeholder="Ex: Contrat de freelance, Politique de télétravail..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-semibold text-gray-900 mb-2">
              Description (optionnel)
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Décrivez les détails spécifiques que vous souhaitez inclure dans le document..."
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
            />
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-900">
              <strong>Note:</strong> L'IA va générer un document basé sur vos informations.
              Vous pourrez le modifier et le personnaliser après la génération.
            </p>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              onClick={onClose}
              className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
            >
              Annuler
            </button>
            <button
              onClick={handleGenerate}
              disabled={!documentType.trim() || generating}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {generating ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Génération en cours...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  <span>Générer le document</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
