import { useEffect } from 'react';
import { Mic, ArrowRight } from 'lucide-react';

interface QuickVoicePageProps {
  templateCode: string;
  templateTitle: string;
  price: number;
  onCreateNow: () => void;
}

export function QuickVoicePage({
  templateCode,
  templateTitle,
  price,
  onCreateNow
}: QuickVoicePageProps) {
  useEffect(() => {
    document.title = `${templateTitle} - iDoc - $${price.toFixed(2)}`;
  }, [templateTitle, price]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full p-12 text-center">
        {/* Voice Icon */}
        <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-8 animate-pulse">
          <Mic className="w-12 h-12 text-white" />
        </div>

        {/* Title */}
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          {templateTitle}
        </h1>

        {/* Quick Description */}
        <p className="text-xl text-gray-600 mb-8">
          Modèle professionnel prêt à personnaliser en 30 secondes.
        </p>

        {/* Price */}
        <div className="bg-blue-50 border-2 border-blue-600 rounded-2xl p-6 mb-8">
          <div className="text-5xl font-bold text-blue-600 mb-2">
            {price.toFixed(2)} $
          </div>
          <p className="text-gray-600">
            Téléchargement instantané • PDF
          </p>
        </div>

        {/* CTA Button */}
        <button
          onClick={onCreateNow}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-6 rounded-xl font-bold text-2xl hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 shadow-2xl flex items-center justify-center space-x-3"
        >
          <span>Créer maintenant</span>
          <ArrowRight className="w-8 h-8" />
        </button>

        {/* Trust Line */}
        <p className="mt-6 text-sm text-gray-500">
          ✓ 10,000+ documents créés • ✓ Note 4.8/5 • ✓ 30+ langues
        </p>

        {/* Voice Optimized Meta */}
        <div className="mt-8 text-xs text-gray-400">
          <p>Optimisé pour Siri, Google Assistant, Alexa</p>
        </div>
      </div>
    </div>
  );
}

// Quick Voice Routes Generator
export const generateQuickVoiceRoutes = () => {
  return [
    {
      path: '/quick/attestation-residence',
      code: 'attestation_residence',
      title: 'Attestation de résidence',
      price: 1.99,
      description: 'Modèle d\'attestation de résidence prêt à personnaliser. Créez votre document en 30 secondes pour 1,99$.'
    },
    {
      path: '/quick/lettre-motivation',
      code: 'lettre_motivation',
      title: 'Lettre de motivation',
      price: 1.99,
      description: 'Lettre de motivation professionnelle. Créez votre document en 30 secondes pour 1,99$.'
    },
    {
      path: '/quick/cv-professionnel',
      code: 'cv_professionnel',
      title: 'CV professionnel',
      price: 1.99,
      description: 'CV professionnel moderne. Créez votre document en 30 secondes pour 1,99$.'
    },
    {
      path: '/quick/lettre-recommandation',
      code: 'lettre_recommandation',
      title: 'Lettre de recommandation',
      price: 1.99,
      description: 'Lettre de recommandation prête à personnaliser. Créez votre document en 30 secondes pour 1,99$.'
    },
    {
      path: '/quick/contrat-location',
      code: 'contrat_location',
      title: 'Contrat de location',
      price: 1.99,
      description: 'Contrat de location simple. Créez votre document en 30 secondes pour 1,99$.'
    },
    {
      path: '/quick/attestation-travail',
      code: 'attestation_travail',
      title: 'Attestation de travail',
      price: 1.99,
      description: 'Attestation de travail. Créez votre document en 30 secondes pour 1,99$.'
    },
    {
      path: '/quick/lettre-plainte',
      code: 'lettre_plainte',
      title: 'Lettre de plainte',
      price: 1.99,
      description: 'Lettre de plainte formelle. Créez votre document en 30 secondes pour 1,99$.'
    },
    {
      path: '/quick/facture',
      code: 'facture',
      title: 'Facture professionnelle',
      price: 1.99,
      description: 'Facture professionnelle. Créez votre document en 30 secondes pour 1,99$.'
    },
    {
      path: '/quick/devis',
      code: 'devis',
      title: 'Devis',
      price: 1.99,
      description: 'Devis professionnel. Créez votre document en 30 secondes pour 1,99$.'
    },
    {
      path: '/quick/demande-conge',
      code: 'demande_conge',
      title: 'Demande de congé',
      price: 1.99,
      description: 'Demande de congé. Créez votre document en 30 secondes pour 1,99$.'
    }
  ];
};
