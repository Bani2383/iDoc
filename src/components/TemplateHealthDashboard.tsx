import React, { useState, useEffect } from 'react';
import { Activity, AlertTriangle, CheckCircle, XCircle, Shield, TrendingUp, Clock } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface HealthMetrics {
  totalTemplates: number;
  verifiedTemplates: number;
  eligibleProduction: number;
  quarantined: number;
  fallbackCount24h: number;
  fallbackCount7d: number;
  topRiskyTemplates: Array<{
    id: string;
    template_code: string;
    fallback_count: number;
    quarantine_reason?: string;
  }>;
}

interface SystemStatus {
  color: 'green' | 'orange' | 'red';
  label: string;
  message: string;
}

export const TemplateHealthDashboard: React.FC = () => {
  const { profile } = useAuth();
  const [metrics, setMetrics] = useState<HealthMetrics>({
    totalTemplates: 0,
    verifiedTemplates: 0,
    eligibleProduction: 0,
    quarantined: 0,
    fallbackCount24h: 0,
    fallbackCount7d: 0,
    topRiskyTemplates: []
  });
  const [systemStatus, setSystemStatus] = useState<SystemStatus>({
    color: 'green',
    label: 'Production Stable',
    message: 'Tous les systèmes fonctionnent normalement'
  });
  const [loading, setLoading] = useState(true);
  const [killSwitch, setKillSwitch] = useState(false);
  const [readOnlyMode, setReadOnlyMode] = useState(false);
  const [unacknowledgedAlerts, setUnacknowledgedAlerts] = useState(0);

  useEffect(() => {
    loadHealthMetrics();
    const interval = setInterval(loadHealthMetrics, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadHealthMetrics = async () => {
    try {
      const [idocData, killSwitchData, readOnlyData, fallbacks24h, fallbacks7d, alertsCount] = await Promise.all([
        supabase
          .from('idoc_guided_templates')
          .select('id, template_code, status, eligible_for_production, quarantined, fallback_count, quarantine_reason')
          .order('fallback_count', { ascending: false }),
        supabase
          .from('system_settings')
          .select('value')
          .eq('key', 'template_kill_switch')
          .single(),
        supabase
          .from('system_settings')
          .select('value')
          .eq('key', 'read_only_emergency_mode')
          .single(),
        supabase
          .from('template_render_fallbacks')
          .select('id', { count: 'exact' })
          .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()),
        supabase
          .from('template_render_fallbacks')
          .select('id', { count: 'exact' })
          .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()),
        supabase
          .from('template_alerts')
          .select('id', { count: 'exact' })
          .eq('acknowledged', false)
      ]);

      const templates = idocData.data || [];
      const killSwitchEnabled = killSwitchData.data?.value?.enabled || false;
      const readOnlyEnabled = readOnlyData.data?.value?.enabled || false;

      const newMetrics: HealthMetrics = {
        totalTemplates: templates.length,
        verifiedTemplates: templates.filter(t => t.status === 'verified').length,
        eligibleProduction: templates.filter(t => t.eligible_for_production).length,
        quarantined: templates.filter(t => t.quarantined).length,
        fallbackCount24h: fallbacks24h.count || 0,
        fallbackCount7d: fallbacks7d.count || 0,
        topRiskyTemplates: templates
          .filter(t => t.fallback_count > 0 || t.quarantined)
          .slice(0, 5)
          .map(t => ({
            id: t.id,
            template_code: t.template_code,
            fallback_count: t.fallback_count,
            quarantine_reason: t.quarantine_reason
          }))
      };

      setMetrics(newMetrics);
      setKillSwitch(killSwitchEnabled);
      setReadOnlyMode(readOnlyEnabled);
      setUnacknowledgedAlerts(alertsCount.count || 0);

      const status = calculateSystemStatus(newMetrics, killSwitchEnabled, readOnlyEnabled);
      setSystemStatus(status);
    } catch (error) {
      console.error('Error loading health metrics:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateSystemStatus = (m: HealthMetrics, killSwitchOn: boolean, readOnlyOn: boolean): SystemStatus => {
    if (killSwitchOn) {
      return {
        color: 'red',
        label: 'Kill Switch Activé',
        message: 'Tous les templates utilisent le fallback de sécurité'
      };
    }

    if (readOnlyOn) {
      return {
        color: 'orange',
        label: 'Mode Stabilité Activé',
        message: 'Modifications temporairement désactivées - Lecture seule'
      };
    }

    if (m.quarantined > 0 || m.fallbackCount24h > 10) {
      return {
        color: 'red',
        label: 'Attention Requise',
        message: `${m.quarantined} template(s) en quarantaine, ${m.fallbackCount24h} fallbacks (24h)`
      };
    }

    const verificationRate = m.totalTemplates > 0 ? (m.verifiedTemplates / m.totalTemplates) * 100 : 0;

    if (verificationRate < 50 || m.fallbackCount24h > 5) {
      return {
        color: 'orange',
        label: 'Surveillance Recommandée',
        message: `${verificationRate.toFixed(0)}% de templates vérifiés, ${m.fallbackCount24h} fallbacks (24h)`
      };
    }

    return {
      color: 'green',
      label: 'Production Stable',
      message: 'Tous les systèmes fonctionnent normalement'
    };
  };

  const toggleKillSwitch = async () => {
    if (!profile || profile.role !== 'admin') return;

    try {
      const newState = !killSwitch;
      const { error } = await supabase
        .from('system_settings')
        .update({
          value: {
            enabled: newState,
            reason: newState ? 'Activé manuellement via dashboard' : '',
            enabled_at: newState ? new Date().toISOString() : null,
            enabled_by: newState ? profile.id : null
          },
          updated_by: profile.id,
          updated_at: new Date().toISOString()
        })
        .eq('key', 'template_kill_switch');

      if (error) throw error;

      setKillSwitch(newState);
      loadHealthMetrics();
    } catch (error) {
      console.error('Error toggling kill switch:', error);
      alert('Erreur lors de la modification du kill switch');
    }
  };

  const toggleReadOnlyMode = async () => {
    if (!profile || profile.role !== 'admin') return;

    try {
      const newState = !readOnlyMode;

      if (newState && !confirm('Activer le mode stabilité? Toutes les modifications seront bloquées.')) {
        return;
      }

      const { error } = await supabase
        .from('system_settings')
        .update({
          value: {
            enabled: newState,
            reason: newState ? 'Mode stabilité activé manuellement' : '',
            enabled_at: newState ? new Date().toISOString() : null,
            enabled_by: newState ? profile.id : null
          },
          updated_by: profile.id,
          updated_at: new Date().toISOString()
        })
        .eq('key', 'read_only_emergency_mode');

      if (error) throw error;

      setReadOnlyMode(newState);
      loadHealthMetrics();
    } catch (error) {
      console.error('Error toggling read-only mode:', error);
      alert('Erreur lors de la modification du mode lecture seule');
    }
  };

  if (profile?.role !== 'admin') {
    return (
      <div className="text-center py-12">
        <Shield className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Accès Restreint</h2>
        <p className="text-gray-600">Cette section est réservée aux administrateurs.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-200 border-t-blue-600"></div>
        <p className="mt-2 text-gray-600">Chargement des métriques...</p>
      </div>
    );
  }

  const statusColors = {
    green: 'bg-green-100 text-green-800 border-green-300',
    orange: 'bg-orange-100 text-orange-800 border-orange-300',
    red: 'bg-red-100 text-red-800 border-red-300'
  };

  const statusIcons = {
    green: <CheckCircle className="w-6 h-6" />,
    orange: <AlertTriangle className="w-6 h-6" />,
    red: <XCircle className="w-6 h-6" />
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <Activity className="w-7 h-7 text-blue-600" />
              Santé des Templates
            </h2>
            <p className="text-gray-600 mt-1">Surveillance en temps réel de la stabilité du système</p>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-500 mb-1">Dernière mise à jour</div>
            <div className="text-sm font-medium text-gray-900 flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {new Date().toLocaleTimeString('fr-FR')}
            </div>
          </div>
        </div>
      </div>

      {/* System Status */}
      <div className={`rounded-lg border-2 p-6 ${statusColors[systemStatus.color]}`}>
        <div className="flex items-center gap-4">
          <div className="flex-shrink-0">
            {statusIcons[systemStatus.color]}
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold">{systemStatus.label}</h3>
            <p className="text-sm mt-1">{systemStatus.message}</p>
          </div>
        </div>
      </div>

      {/* Kill Switch */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Shield className="w-5 h-5 text-red-600" />
              Kill Switch Global
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Force tous les templates à utiliser le fallback de sécurité
            </p>
          </div>
          <button
            onClick={toggleKillSwitch}
            className={`
              px-6 py-3 rounded-lg font-semibold transition-colors
              ${killSwitch
                ? 'bg-red-600 text-white hover:bg-red-700'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }
            `}
          >
            {killSwitch ? 'DÉSACTIVER' : 'ACTIVÉ'}
          </button>
        </div>
        {killSwitch && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded">
            <p className="text-sm text-red-800">
              ⚠️ Le kill switch est activé. Tous les templates utilisent actuellement le fallback de sécurité.
              Aucun template personnalisé n'est rendu en production.
            </p>
          </div>
        )}
      </div>

      {/* Read-Only Emergency Mode */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Shield className="w-5 h-5 text-orange-600" />
              Mode Stabilité (Read-Only)
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Bloque toutes les modifications pour stabiliser le système
            </p>
          </div>
          <button
            onClick={toggleReadOnlyMode}
            className={`
              px-6 py-3 rounded-lg font-semibold transition-colors
              ${readOnlyMode
                ? 'bg-orange-600 text-white hover:bg-orange-700'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }
            `}
          >
            {readOnlyMode ? 'ACTIVÉ' : 'DÉSACTIVÉ'}
          </button>
        </div>
        {readOnlyMode && (
          <div className="mt-4 p-4 bg-orange-50 border border-orange-200 rounded">
            <p className="text-sm text-orange-800">
              🔒 Mode stabilité activé. Toutes les modifications (édition templates, publications, corrections automatiques) sont temporairement bloquées. L'accès en lecture reste possible.
            </p>
          </div>
        )}
      </div>

      {/* Alerts Summary */}
      {unacknowledgedAlerts > 0 && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-6 h-6 text-red-600" />
            <div className="flex-1">
              <p className="text-sm font-bold text-red-900">
                {unacknowledgedAlerts} alerte{unacknowledgedAlerts > 1 ? 's' : ''} non acquittée{unacknowledgedAlerts > 1 ? 's' : ''}
              </p>
              <p className="text-sm text-red-700 mt-1">
                Des événements critiques nécessitent votre attention
              </p>
            </div>
            <a
              href="#alerts"
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium text-sm"
            >
              Voir les Alertes
            </a>
          </div>
        </div>
      )}

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Templates"
          value={metrics.totalTemplates}
          icon={<Activity className="w-5 h-5" />}
          color="blue"
        />
        <MetricCard
          title="Vérifiés"
          value={metrics.verifiedTemplates}
          subtitle={`${metrics.totalTemplates > 0 ? ((metrics.verifiedTemplates / metrics.totalTemplates) * 100).toFixed(0) : 0}%`}
          icon={<CheckCircle className="w-5 h-5" />}
          color="green"
        />
        <MetricCard
          title="Éligibles Production"
          value={metrics.eligibleProduction}
          subtitle={`${metrics.totalTemplates > 0 ? ((metrics.eligibleProduction / metrics.totalTemplates) * 100).toFixed(0) : 0}%`}
          icon={<Shield className="w-5 h-5" />}
          color="purple"
        />
        <MetricCard
          title="En Quarantaine"
          value={metrics.quarantined}
          icon={<XCircle className="w-5 h-5" />}
          color="red"
        />
      </div>

      {/* Fallback Usage */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-orange-600" />
            Fallbacks Utilisés (24h)
          </h3>
          <div className="text-4xl font-bold text-orange-600">{metrics.fallbackCount24h}</div>
          <p className="text-sm text-gray-600 mt-2">
            Nombre de fois où le fallback a été utilisé dans les dernières 24h
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-orange-600" />
            Fallbacks Utilisés (7j)
          </h3>
          <div className="text-4xl font-bold text-orange-600">{metrics.fallbackCount7d}</div>
          <p className="text-sm text-gray-600 mt-2">
            Nombre de fois où le fallback a été utilisé dans les 7 derniers jours
          </p>
        </div>
      </div>

      {/* Top Risky Templates */}
      {metrics.topRiskyTemplates.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-yellow-600" />
            Top 5 Templates à Risque
          </h3>
          <div className="space-y-3">
            {metrics.topRiskyTemplates.map((template) => (
              <div
                key={template.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200"
              >
                <div className="flex-1">
                  <div className="font-medium text-gray-900">{template.template_code}</div>
                  {template.quarantine_reason && (
                    <div className="text-sm text-red-600 mt-1">
                      Quarantaine: {template.quarantine_reason}
                    </div>
                  )}
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-red-600">{template.fallback_count}</div>
                  <div className="text-xs text-gray-600">Fallbacks</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

interface MetricCardProps {
  title: string;
  value: number;
  subtitle?: string;
  icon: React.ReactNode;
  color: 'blue' | 'green' | 'purple' | 'red' | 'orange';
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, subtitle, icon, color }) => {
  const colors = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    purple: 'bg-purple-50 text-purple-600',
    red: 'bg-red-50 text-red-600',
    orange: 'bg-orange-50 text-orange-600'
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-3">
        <div className={`p-2 rounded-lg ${colors[color]}`}>
          {icon}
        </div>
      </div>
      <div className="text-3xl font-bold text-gray-900">{value}</div>
      <div className="text-sm text-gray-600 mt-1">{title}</div>
      {subtitle && (
        <div className="text-xs text-gray-500 mt-1">{subtitle}</div>
      )}
    </div>
  );
};
