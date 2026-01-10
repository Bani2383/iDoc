import React, { useState, useEffect } from 'react';
import { Bell, AlertTriangle, XCircle, Shield, CheckCircle, X } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface Alert {
  id: string;
  alert_type: 'fallback_used' | 'template_quarantined' | 'kill_switch_activated' | 'shadow_test_failed' | 'high_trust_modification';
  severity: 'critical' | 'high' | 'medium' | 'low';
  template_id?: string;
  template_source?: string;
  template_code?: string;
  environment: 'production' | 'staging' | 'development';
  title: string;
  message: string;
  details: any;
  acknowledged: boolean;
  acknowledged_by?: string;
  acknowledged_at?: string;
  created_at: string;
}

interface AlertsPanelProps {
  compact?: boolean;
}

export const AlertsPanel: React.FC<AlertsPanelProps> = ({ compact = false }) => {
  const { profile } = useAuth();
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'unacknowledged'>('unacknowledged');

  useEffect(() => {
    loadAlerts();
    const interval = setInterval(loadAlerts, 30000);
    return () => clearInterval(interval);
  }, [filter]);

  const loadAlerts = async () => {
    try {
      let query = supabase
        .from('template_alerts')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(compact ? 5 : 50);

      if (filter === 'unacknowledged') {
        query = query.eq('acknowledged', false);
      }

      const { data, error } = await query;

      if (error) throw error;

      setAlerts(data || []);
    } catch (error) {
      console.error('Error loading alerts:', error);
    } finally {
      setLoading(false);
    }
  };

  const acknowledgeAlert = async (alertId: string) => {
    if (!profile) return;

    try {
      const { error } = await supabase
        .from('template_alerts')
        .update({
          acknowledged: true,
          acknowledged_by: profile.id,
          acknowledged_at: new Date().toISOString()
        })
        .eq('id', alertId);

      if (error) throw error;

      loadAlerts();
    } catch (error) {
      console.error('Error acknowledging alert:', error);
    }
  };

  const acknowledgeAll = async () => {
    if (!profile) return;

    try {
      const { error } = await supabase
        .from('template_alerts')
        .update({
          acknowledged: true,
          acknowledged_by: profile.id,
          acknowledged_at: new Date().toISOString()
        })
        .eq('acknowledged', false);

      if (error) throw error;

      loadAlerts();
    } catch (error) {
      console.error('Error acknowledging all alerts:', error);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'low':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <XCircle className="w-5 h-5" />;
      case 'high':
        return <AlertTriangle className="w-5 h-5" />;
      case 'medium':
        return <Bell className="w-5 h-5" />;
      case 'low':
        return <Shield className="w-5 h-5" />;
      default:
        return <Bell className="w-5 h-5" />;
    }
  };

  const getAlertTypeLabel = (type: string) => {
    switch (type) {
      case 'fallback_used':
        return 'Fallback Utilisé';
      case 'template_quarantined':
        return 'Template en Quarantaine';
      case 'kill_switch_activated':
        return 'Kill Switch Activé';
      case 'shadow_test_failed':
        return 'Test Shadow Échoué';
      case 'high_trust_modification':
        return 'Template HIGH Trust Modifié';
      default:
        return type;
    }
  };

  const unacknowledgedCount = alerts.filter(a => !a.acknowledged).length;

  if (profile?.role !== 'admin') {
    return null;
  }

  if (compact) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Bell className="w-5 h-5 text-orange-600" />
            Alertes Récentes
          </h3>
          {unacknowledgedCount > 0 && (
            <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-bold rounded-full">
              {unacknowledgedCount}
            </span>
          )}
        </div>

        {loading ? (
          <div className="text-center py-4">
            <div className="inline-block animate-spin rounded-full h-6 w-6 border-2 border-gray-200 border-t-blue-600"></div>
          </div>
        ) : alerts.length === 0 ? (
          <div className="text-center py-4">
            <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-2" />
            <p className="text-sm text-gray-600">Aucune alerte récente</p>
          </div>
        ) : (
          <div className="space-y-2">
            {alerts.slice(0, 5).map((alert) => (
              <div
                key={alert.id}
                className={`p-3 rounded border-l-4 ${getSeverityColor(alert.severity)}`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      {getSeverityIcon(alert.severity)}
                      <span className="text-xs font-semibold uppercase">
                        {getAlertTypeLabel(alert.alert_type)}
                      </span>
                    </div>
                    <p className="text-sm font-medium truncate">{alert.title}</p>
                    <p className="text-xs mt-1 opacity-75">
                      {new Date(alert.created_at).toLocaleString('fr-FR')}
                    </p>
                  </div>
                  {!alert.acknowledged && (
                    <button
                      onClick={() => acknowledgeAlert(alert.id)}
                      className="p-1 hover:bg-white rounded transition-colors"
                      title="Acquitter"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <Bell className="w-7 h-7 text-orange-600" />
              Centre d'Alertes
            </h2>
            <p className="text-gray-600 mt-1">Événements critiques et notifications système</p>
          </div>
          <div className="flex items-center gap-3">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="unacknowledged">Non acquittées</option>
              <option value="all">Toutes</option>
            </select>
            {unacknowledgedCount > 0 && (
              <button
                onClick={acknowledgeAll}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Tout Acquitter ({unacknowledgedCount})
              </button>
            )}
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-200 border-t-blue-600"></div>
            <p className="mt-2 text-gray-600">Chargement...</p>
          </div>
        ) : alerts.length === 0 ? (
          <div className="text-center py-12">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-gray-900 mb-2">Tout va bien!</h3>
            <p className="text-gray-600">Aucune alerte à afficher</p>
          </div>
        ) : (
          <div className="space-y-3">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className={`p-4 rounded-lg border-l-4 ${getSeverityColor(alert.severity)} ${
                  alert.acknowledged ? 'opacity-60' : ''
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      {getSeverityIcon(alert.severity)}
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold uppercase">
                            {getAlertTypeLabel(alert.alert_type)}
                          </span>
                          <span className="text-xs px-2 py-0.5 bg-white bg-opacity-50 rounded">
                            {alert.environment.toUpperCase()}
                          </span>
                          {alert.acknowledged && (
                            <span className="text-xs px-2 py-0.5 bg-green-100 text-green-800 rounded">
                              Acquittée
                            </span>
                          )}
                        </div>
                        <h3 className="text-base font-bold mt-1">{alert.title}</h3>
                      </div>
                    </div>

                    <p className="text-sm mb-3">{alert.message}</p>

                    {alert.template_code && (
                      <div className="text-xs mb-2">
                        <span className="font-medium">Template:</span>{' '}
                        <code className="px-2 py-1 bg-white bg-opacity-50 rounded">
                          {alert.template_code}
                        </code>
                      </div>
                    )}

                    {alert.details && Object.keys(alert.details).length > 0 && (
                      <details className="text-xs mt-2">
                        <summary className="cursor-pointer font-medium hover:underline">
                          Détails techniques
                        </summary>
                        <pre className="mt-2 p-2 bg-white bg-opacity-50 rounded overflow-x-auto">
                          {JSON.stringify(alert.details, null, 2)}
                        </pre>
                      </details>
                    )}

                    <div className="text-xs mt-3 opacity-75">
                      {new Date(alert.created_at).toLocaleString('fr-FR')}
                      {alert.acknowledged_at && (
                        <span className="ml-4">
                          Acquittée le {new Date(alert.acknowledged_at).toLocaleString('fr-FR')}
                        </span>
                      )}
                    </div>
                  </div>

                  {!alert.acknowledged && (
                    <button
                      onClick={() => acknowledgeAlert(alert.id)}
                      className="px-4 py-2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-lg transition-colors font-medium text-sm"
                    >
                      Acquitter
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
