import React, { useEffect, useState } from 'react';
import { FileText, Activity, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface DossierDetail {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  clients: { full_name: string; email: string; phone: string };
  created_at: string;
}

export const DossierDetailView: React.FC<{ dossierId: string }> = ({ dossierId }) => {
  const [dossier, setDossier] = useState<DossierDetail | null>(null);
  const [documents, setDocuments] = useState<any[]>([]);
  const [activity, setActivity] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDossierDetail();
  }, [dossierId]);

  const fetchDossierDetail = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const response = await fetch(`${supabaseUrl}/functions/v1/dossiers-api/${dossierId}`, {
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
        },
      });

      const data = await response.json();
      setDossier(data.dossier);
      setDocuments(data.documents);
      setActivity(data.activity);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const response = await fetch(`${supabaseUrl}/functions/v1/dossiers-api/update-status`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
          'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
        },
        body: JSON.stringify({
          dossier_id: dossierId,
          new_status: newStatus,
        }),
      });

      if (response.ok) {
        alert('Statut mis à jour!');
        fetchDossierDetail();
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const getStatusIcon = (status: string) => {
    const icons: Record<string, any> = {
      draft: Clock,
      in_review: AlertCircle,
      approved: CheckCircle,
      signed: CheckCircle,
      archived: FileText,
    };
    const Icon = icons[status] || Clock;
    return <Icon className="w-5 h-5" />;
  };

  if (loading || !dossier) {
    return <div className="text-center py-16"><div className="inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div></div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{dossier.title}</h1>
            <p className="text-gray-600">{dossier.description}</p>
          </div>
          <div className="flex items-center space-x-2">
            {getStatusIcon(dossier.status)}
            <span className="text-lg font-semibold">{dossier.status}</span>
          </div>
        </div>

        {/* Client Info */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 border-t pt-4">
          <div>
            <p className="text-sm text-gray-600">Client</p>
            <p className="font-semibold">{dossier.clients.full_name}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Email</p>
            <p className="font-semibold">{dossier.clients.email}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Téléphone</p>
            <p className="font-semibold">{dossier.clients.phone || '-'}</p>
          </div>
        </div>
      </div>

      {/* Workflow */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-bold mb-4">Workflow</h2>
        <div className="flex space-x-2">
          {['draft', 'in_review', 'approved', 'signed', 'archived'].map(status => (
            <button
              key={status}
              onClick={() => handleStatusChange(status)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                dossier.status === status
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Documents */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">Documents ({documents.length})</h2>
          <div className="space-y-3">
            {documents.map(doc => (
              <div key={doc.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <FileText className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="font-medium">Document {doc.document_id.substring(0, 8)}</p>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      doc.status === 'signed' ? 'bg-green-100 text-green-800' :
                      doc.status === 'approved' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {doc.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
            {documents.length === 0 && (
              <p className="text-gray-500 text-center py-4">Aucun document</p>
            )}
          </div>
        </div>

        {/* Activity */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4 flex items-center space-x-2">
            <Activity className="w-5 h-5" />
            <span>Activité</span>
          </h2>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {activity.map(act => (
              <div key={act.id} className="border-l-4 border-blue-600 pl-4 py-2">
                <p className="font-medium">{act.activity_type}</p>
                <p className="text-sm text-gray-600">{act.user_profiles?.full_name || 'Système'}</p>
                <p className="text-xs text-gray-500">{new Date(act.created_at).toLocaleString('fr-FR')}</p>
                {act.details && Object.keys(act.details).length > 0 && (
                  <pre className="text-xs bg-gray-50 p-2 mt-1 rounded">{JSON.stringify(act.details, null, 2)}</pre>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
