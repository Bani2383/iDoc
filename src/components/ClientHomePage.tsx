import { FileText, Clock, TrendingUp, Sparkles, CreditCard, Users } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

interface ClientHomePageProps {
  onNavigate: (page: string) => void;
  documentsCount: number;
}

export function ClientHomePage({ onNavigate, documentsCount }: ClientHomePageProps) {
  const { profile } = useAuth();
  const { theme } = useTheme();

  const quickActions = theme === 'minimal' ? [
    {
      icon: FileText,
      title: 'Créer un document',
      description: 'Générez un nouveau document professionnel',
      color: 'bg-black',
      hoverColor: 'hover:bg-gray-800',
      action: () => onNavigate('documents-new')
    },
    {
      icon: Sparkles,
      title: 'Générer avec IA',
      description: 'Laissez l\'IA créer votre document',
      color: 'bg-gray-800',
      hoverColor: 'hover:bg-gray-700',
      action: () => onNavigate('documents-ai')
    },
    {
      icon: Clock,
      title: 'Mes documents',
      description: 'Accédez à vos documents existants',
      color: 'bg-gray-700',
      hoverColor: 'hover:bg-gray-600',
      action: () => onNavigate('documents')
    }
  ] : [
    {
      icon: FileText,
      title: 'Créer un document',
      description: 'Générez un nouveau document professionnel',
      color: 'bg-blue-600',
      hoverColor: 'hover:bg-blue-700',
      action: () => onNavigate('documents-new')
    },
    {
      icon: Sparkles,
      title: 'Générer avec IA',
      description: 'Laissez l\'IA créer votre document',
      color: 'bg-gradient-to-r from-blue-600 to-indigo-600',
      hoverColor: 'hover:from-blue-700 hover:to-indigo-700',
      action: () => onNavigate('documents-ai')
    },
    {
      icon: Clock,
      title: 'Mes documents',
      description: 'Accédez à vos documents existants',
      color: 'bg-gray-700',
      hoverColor: 'hover:bg-gray-800',
      action: () => onNavigate('documents')
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Bienvenue, {profile?.full_name || 'Client'}
        </h1>
        <p className="text-gray-600">
          Gérez vos documents professionnels en toute simplicité
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-sm font-medium">Documents générés</span>
            <FileText className={`w-5 h-5 ${theme === 'minimal' ? 'text-gray-900' : 'text-blue-600'}`} />
          </div>
          <p className="text-3xl font-bold text-gray-900">{documentsCount}</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-sm font-medium">Ce mois-ci</span>
            <TrendingUp className={`w-5 h-5 ${theme === 'minimal' ? 'text-gray-900' : 'text-green-600'}`} />
          </div>
          <p className="text-3xl font-bold text-gray-900">0</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-sm font-medium">En attente</span>
            <Clock className={`w-5 h-5 ${theme === 'minimal' ? 'text-gray-900' : 'text-yellow-600'}`} />
          </div>
          <p className="text-3xl font-bold text-gray-900">0</p>
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Actions rapides</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {quickActions.map((action, index) => (
            <button
              key={index}
              onClick={action.action}
              className={`${action.color} ${action.hoverColor} text-white rounded-lg p-6 text-left transition-all transform hover:scale-105 shadow-md`}
            >
              <action.icon className="w-8 h-8 mb-4" />
              <h3 className="text-lg font-bold mb-2">{action.title}</h3>
              <p className="text-sm opacity-90">{action.description}</p>
            </button>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Monétisation</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <button
            onClick={() => onNavigate('pro')}
            className="bg-gradient-to-br from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg p-6 text-left transition-all transform hover:scale-105 shadow-md"
          >
            <CreditCard className="w-8 h-8 mb-4" />
            <h3 className="text-lg font-bold mb-2">iDoc Pro</h3>
            <p className="text-sm opacity-90">Documents illimités et fonctionnalités avancées</p>
            <div className="mt-4 text-2xl font-bold">9,99$/mois</div>
          </button>

          <button
            onClick={() => onNavigate('affiliate')}
            className="bg-gradient-to-br from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white rounded-lg p-6 text-left transition-all transform hover:scale-105 shadow-md"
          >
            <Users className="w-8 h-8 mb-4" />
            <h3 className="text-lg font-bold mb-2">Programme d'affiliation</h3>
            <p className="text-sm opacity-90">Gagnez 30% de commission sur chaque vente</p>
            <div className="mt-4 text-2xl font-bold">30% commission</div>
          </button>
        </div>
      </div>

      <div className={`${theme === 'minimal' ? 'bg-gray-100 border-gray-300' : 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200'} border rounded-lg p-6`}>
        <h2 className="text-xl font-bold text-gray-900 mb-2">
          Besoin d'aide ?
        </h2>
        <p className="text-gray-700 mb-4">
          Notre équipe est là pour vous aider à créer vos documents professionnels.
        </p>
        <button className={`bg-white px-6 py-2 rounded-lg font-semibold transition-colors border ${theme === 'minimal' ? 'text-black border-gray-300 hover:bg-gray-50' : 'text-blue-600 border-blue-200 hover:bg-blue-50'}`}>
          Contacter le support
        </button>
      </div>
    </div>
  );
}
