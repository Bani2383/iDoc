import { useState, useEffect } from 'react';
import { Users, Shield, User, Mail, Calendar, Edit, Trash2, X, Save } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { supabase } from '../lib/supabase';

interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
  role: 'admin' | 'client';
  created_at: string;
  updated_at: string;
  postal_address?: string | null;
  phone_number?: string | null;
  billing_email?: string | null;
}

export function UserManager() {
  const { theme } = useTheme();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState<UserProfile | null>(null);
  const [editForm, setEditForm] = useState<UserProfile | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateUserRole = async (userId: string, newRole: 'admin' | 'client') => {
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({ role: newRole })
        .eq('id', userId);

      if (error) throw error;
      
      setUsers(users.map(user => 
        user.id === userId ? { ...user, role: newRole } : user
      ));
      
      alert(`Rôle mis à jour avec succès`);
    } catch (error) {
      console.error('Error updating user role:', error);
      alert('Erreur lors de la mise à jour du rôle');
    }
  };

  const deleteUser = async (userId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) return;

    try {
      const { error: profileError } = await supabase
        .from('user_profiles')
        .delete()
        .eq('id', userId);

      if (profileError) throw profileError;

      setUsers(users.filter(user => user.id !== userId));
      alert('Utilisateur supprimé avec succès');
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Erreur lors de la suppression');
    }
  };

  const handleEditUser = (user: UserProfile) => {
    setEditingUser(user);
    setEditForm({ ...user });
  };

  const handleSaveUser = async () => {
    if (!editForm) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({
          full_name: editForm.full_name,
          postal_address: editForm.postal_address,
          phone_number: editForm.phone_number,
          billing_email: editForm.billing_email,
          updated_at: new Date().toISOString(),
        })
        .eq('id', editForm.id);

      if (error) throw error;

      setUsers(users.map(user => user.id === editForm.id ? editForm : user));
      setEditingUser(null);
      setEditForm(null);
      alert('Utilisateur mis à jour avec succès');
    } catch (error) {
      console.error('Error updating user:', error);
      alert('Erreur lors de la mise à jour');
    } finally {
      setSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingUser(null);
    setEditForm(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const adminCount = users.filter(u => u.role === 'admin').length;
  const clientCount = users.filter(u => u.role === 'client').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gestion des utilisateurs</h2>
          <p className="text-gray-600 mt-1">
            {users.length} utilisateur{users.length > 1 ? 's' : ''} au total
          </p>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-600">Total</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{users.length}</p>
            </div>
            <Users className={`w-12 h-12 ${theme === 'minimal' ? 'text-gray-900' : 'text-blue-600'}`} />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-600">Administrateurs</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{adminCount}</p>
            </div>
            <Shield className={`w-12 h-12 ${theme === 'minimal' ? 'text-gray-900' : 'text-red-600'}`} />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-600">Clients</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{clientCount}</p>
            </div>
            <User className={`w-12 h-12 ${theme === 'minimal' ? 'text-gray-900' : 'text-green-600'}`} />
          </div>
        </div>
      </div>

      {/* Liste des utilisateurs */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Utilisateur
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Rôle
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Inscription
              </th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className={`w-4 h-4 ${theme === 'minimal' ? 'text-gray-900' : 'text-blue-600'}`} />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">
                        {user.full_name || 'Nom non renseigné'}
                      </div>
                      <div className="text-xs text-gray-500">ID: {user.id.slice(0, 8)}...</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  <div className="flex items-center space-x-2">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span>{user.email}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm">
                  <select
                    value={user.role}
                    onChange={(e) => updateUserRole(user.id, e.target.value as 'admin' | 'client')}
                    className={`px-3 py-1 rounded-full text-xs font-semibold border-0 ${
                      user.role === 'admin' 
                        ? 'bg-red-100 text-red-700' 
                        : 'bg-blue-100 text-blue-700'
                    }`}
                  >
                    <option value="client">Client</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span>{new Date(user.created_at).toLocaleDateString('fr-FR')}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-right">
                  <div className="flex items-center justify-end space-x-2">
                    <button
                      onClick={() => handleEditUser(user)}
                      className={`p-2 rounded-lg transition-colors ${theme === 'minimal' ? 'text-black hover:bg-gray-100' : 'text-blue-600 hover:bg-blue-50'}`}
                      title="Modifier"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteUser(user.id)}
                      className={`p-2 rounded-lg transition-colors ${theme === 'minimal' ? 'text-black hover:bg-gray-100' : 'text-red-600 hover:bg-red-50'}`}
                      title="Supprimer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {users.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm">
          <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Aucun utilisateur</h3>
          <p className="text-gray-600">Les utilisateurs apparaîtront ici une fois inscrits.</p>
        </div>
      )}

      {editingUser && editForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900">Modifier l'utilisateur</h3>
              <button
                onClick={handleCancelEdit}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Nom complet
                </label>
                <input
                  type="text"
                  value={editForm.full_name || ''}
                  onChange={(e) => setEditForm({ ...editForm, full_name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Nom complet"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={editForm.email}
                  disabled
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                />
                <p className="text-xs text-gray-500 mt-1">L'email ne peut pas être modifié</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Adresse postale
                </label>
                <textarea
                  value={editForm.postal_address || ''}
                  onChange={(e) => setEditForm({ ...editForm, postal_address: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Adresse postale complète"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Numéro de téléphone
                </label>
                <input
                  type="tel"
                  value={editForm.phone_number || ''}
                  onChange={(e) => setEditForm({ ...editForm, phone_number: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="+33 6 12 34 56 78"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email de facturation
                </label>
                <input
                  type="email"
                  value={editForm.billing_email || ''}
                  onChange={(e) => setEditForm({ ...editForm, billing_email: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="email@exemple.com"
                />
              </div>
            </div>

            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-end space-x-3">
              <button
                onClick={handleCancelEdit}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors font-semibold"
              >
                Annuler
              </button>
              <button
                onClick={handleSaveUser}
                disabled={saving}
                className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 font-semibold"
              >
                <Save className="w-4 h-4" />
                <span>{saving ? 'Sauvegarde...' : 'Enregistrer'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}