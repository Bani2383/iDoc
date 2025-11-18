import { useState } from 'react';
import { Users, UserCheck, UserCog } from 'lucide-react';
import { UserManager } from './UserManager';
import { AdminClientsView } from './AdminClientsView';
import { AdminUserActivityPanel } from './AdminUserActivityPanel';

export function UserManagementHub() {
  const [activeSubTab, setActiveSubTab] = useState<'users' | 'clients' | 'activity'>('users');

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-900">Gestion des Utilisateurs & Clients</h2>
        <p className="text-gray-600 mt-1">Gérez vos utilisateurs, clients payants et leur activité</p>
      </div>

      {/* Sub-tabs */}
      <div className="border-b border-gray-200 mb-6">
        <div className="flex space-x-8">
          <button
            onClick={() => setActiveSubTab('users')}
            className={`pb-4 px-1 border-b-2 font-semibold text-sm transition-colors flex items-center space-x-2 ${
              activeSubTab === 'users'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Users className="w-5 h-5" />
            <span>Tous les Utilisateurs</span>
          </button>

          <button
            onClick={() => setActiveSubTab('clients')}
            className={`pb-4 px-1 border-b-2 font-semibold text-sm transition-colors flex items-center space-x-2 ${
              activeSubTab === 'clients'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <UserCheck className="w-5 h-5" />
            <span>Clients & Achats</span>
          </button>

          <button
            onClick={() => setActiveSubTab('activity')}
            className={`pb-4 px-1 border-b-2 font-semibold text-sm transition-colors flex items-center space-x-2 ${
              activeSubTab === 'activity'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <UserCog className="w-5 h-5" />
            <span>Journal d'Activité</span>
          </button>
        </div>
      </div>

      {/* Content */}
      <div>
        {activeSubTab === 'users' && <UserManager />}
        {activeSubTab === 'clients' && <AdminClientsView />}
        {activeSubTab === 'activity' && <AdminUserActivityPanel />}
      </div>
    </div>
  );
}
