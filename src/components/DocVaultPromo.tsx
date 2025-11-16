import React from 'react';
import { Shield, Star, Zap, Lock } from 'lucide-react';

const DocVaultPromo: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 py-16">
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl p-8 lg:p-12 shadow-xl border-2 border-blue-200">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl mb-4 shadow-lg">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
            Découvrez DocVault
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Sauvegardez, organisez et accédez à tous vos documents en toute sécurité
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <Lock className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              Stockage Sécurisé
            </h3>
            <p className="text-sm text-gray-600">
              Cryptage de niveau bancaire pour protéger vos documents sensibles
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <Zap className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              Accès Instantané
            </h3>
            <p className="text-sm text-gray-600">
              Retrouvez n'importe quel document en quelques secondes
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <Star className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              Organisation Auto
            </h3>
            <p className="text-sm text-gray-600">
              Classification intelligente par catégorie et date
            </p>
          </div>
        </div>

        <div className="text-center">
          <button className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-lg hover:shadow-xl hover:scale-105 transition-all">
            Commencer avec DocVault
          </button>
          <p className="mt-4 text-sm text-gray-500">
            Inclus gratuitement avec votre premier document
          </p>
        </div>
      </div>
    </div>
  );
};

export default DocVaultPromo;
