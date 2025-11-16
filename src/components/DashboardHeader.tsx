/**
 * DashboardHeader Component
 *
 * @description Dashboard header with user info and navigation tabs
 * @component
 */

import { Shield, LogOut, Palette, LucideIcon } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

interface NavItem {
  id: 'home' | 'documents' | 'profile' | 'billing';
  label: string;
  icon: LucideIcon;
}

interface DashboardHeaderProps {
  /** User profile information */
  profile: {
    full_name: string | null;
    role: 'admin' | 'client';
  } | null;
  /** User email */
  userEmail: string | undefined;
  /** Current active page */
  currentPage: 'home' | 'profile' | 'billing' | 'documents';
  /** Navigation items */
  navItems: NavItem[];
  /** Handler for page navigation */
  onNavigate: (page: 'home' | 'profile' | 'billing' | 'documents') => void;
  /** Handler for sign out */
  onSignOut: () => Promise<void>;
  /** Handler to toggle theme */
  onToggleTheme: () => void;
  /** Colors based on theme */
  colors: {
    tabActive: string;
    tabInactive: string;
  };
}

/**
 * Renders the dashboard header with navigation
 *
 * @param {DashboardHeaderProps} props - Component props
 * @returns {JSX.Element} Dashboard header UI
 */
export function DashboardHeader({
  profile,
  userEmail,
  currentPage,
  navItems,
  onNavigate,
  onSignOut,
  onToggleTheme,
  colors
}: DashboardHeaderProps) {
  const { theme } = useTheme();

  return (
    <header className={theme === 'minimal' ? 'bg-white border-b border-black' : 'bg-white border-b border-gray-200'}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">DocGen Pro</h1>
            <div className="flex items-center space-x-3 mt-1">
              <span className="text-sm text-gray-600">
                {profile?.full_name || userEmail}
              </span>
              <span
                className={`px-2 py-1 rounded-full text-xs font-semibold ${
                  profile?.role === 'admin'
                    ? 'bg-red-100 text-red-700'
                    : 'bg-blue-100 text-blue-700'
                }`}
                role="status"
                aria-label={`Rôle: ${profile?.role === 'admin' ? 'Administrateur' : 'Client'}`}
              >
                {profile?.role === 'admin' ? 'Administrateur' : 'Client'}
              </span>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            {profile?.role === 'admin' && (
              <a
                href="/admin"
                onClick={(e) => {
                  e.preventDefault();
                  window.location.reload();
                }}
                className="flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                aria-label="Accéder au panneau d'administration"
              >
                <Shield className="w-4 h-4" aria-hidden="true" />
                <span>Admin</span>
              </a>
            )}
            <button
              onClick={onToggleTheme}
              className="flex items-center space-x-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
              aria-label="Changer le thème"
            >
              <Palette className="w-4 h-4" aria-hidden="true" />
              <span>Thème</span>
            </button>
            <button
              onClick={onSignOut}
              className="flex items-center space-x-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
              aria-label="Se déconnecter"
            >
              <LogOut className="w-4 h-4" aria-hidden="true" />
              <span>Déconnexion</span>
            </button>
          </div>
        </div>

        <nav className="flex space-x-1 -mb-px" role="navigation" aria-label="Navigation du tableau de bord">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                aria-label={`Naviguer vers ${item.label}`}
                aria-current={isActive ? 'page' : undefined}
                className={`flex items-center space-x-2 px-4 py-3 border-b-2 font-medium transition-colors ${
                  isActive
                    ? colors.tabActive
                    : colors.tabInactive
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? (theme === 'minimal' ? 'text-black' : 'text-blue-600') : 'text-gray-500'}`} aria-hidden="true" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
