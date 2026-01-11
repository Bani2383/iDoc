import React, { useState, useEffect } from 'react';
import { Bell, Mail, MessageSquare, Save, TestTube, CheckCircle, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface AlertSettings {
  id: string;
  email_enabled: boolean;
  email_recipients: string[];
  slack_enabled: boolean;
  slack_webhook_url: string | null;
  min_severity_level: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
}

export default function AlertNotificationSettings() {
  const [settings, setSettings] = useState<AlertSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [emailEnabled, setEmailEnabled] = useState(false);
  const [emailRecipients, setEmailRecipients] = useState('');
  const [slackEnabled, setSlackEnabled] = useState(false);
  const [slackWebhookUrl, setSlackWebhookUrl] = useState('');
  const [minSeverity, setMinSeverity] = useState<'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'>('MEDIUM');

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('alert_settings')
        .select('*')
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setSettings(data);
        setEmailEnabled(data.email_enabled);
        setEmailRecipients((data.email_recipients || []).join(', '));
        setSlackEnabled(data.slack_enabled);
        setSlackWebhookUrl(data.slack_webhook_url || '');
        setMinSeverity(data.min_severity_level);
      } else {
        await createDefaultSettings();
      }
    } catch (err: any) {
      setError(`Failed to load settings: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const createDefaultSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('alert_settings')
        .insert({
          email_enabled: false,
          email_recipients: [],
          slack_enabled: false,
          slack_webhook_url: null,
          min_severity_level: 'MEDIUM'
        })
        .select()
        .single();

      if (error) throw error;
      setSettings(data);
    } catch (err: any) {
      console.error('Failed to create default settings:', err);
    }
  };

  const saveSettings = async () => {
    try {
      setSaving(true);
      setError('');
      setSuccess('');

      const emailRecipientsArray = emailRecipients
        .split(',')
        .map(email => email.trim())
        .filter(email => email.length > 0);

      if (emailEnabled && emailRecipientsArray.length === 0) {
        setError('Please provide at least one email recipient');
        return;
      }

      if (slackEnabled && !slackWebhookUrl.trim()) {
        setError('Please provide a Slack webhook URL');
        return;
      }

      const updatedSettings = {
        email_enabled: emailEnabled,
        email_recipients: emailRecipientsArray,
        slack_enabled: slackEnabled,
        slack_webhook_url: slackWebhookUrl.trim() || null,
        min_severity_level: minSeverity
      };

      const { error } = await supabase
        .from('alert_settings')
        .update(updatedSettings)
        .eq('id', settings!.id);

      if (error) throw error;

      setSuccess('Settings saved successfully!');
      await loadSettings();
    } catch (err: any) {
      setError(`Failed to save settings: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  const testNotifications = async () => {
    try {
      setTesting(true);
      setError('');
      setSuccess('');

      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Not authenticated');

      const testAlert = {
        alert_id: 'test-' + Date.now(),
        severity: 'MEDIUM',
        alert_type: 'test_notification',
        message: 'This is a test notification from iDoc Alert System. If you receive this, your notifications are configured correctly!',
        details: {
          timestamp: new Date().toISOString(),
          test: true
        }
      };

      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const response = await fetch(`${supabaseUrl}/functions/v1/idoc-alert-notify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify(testAlert),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Test notification failed');
      }

      let message = 'Test notification sent!\n\n';
      if (result.email_sent) message += 'Email: Sent\n';
      if (result.slack_sent) message += 'Slack: Sent\n';
      if (result.errors && result.errors.length > 0) {
        message += '\nErrors:\n' + result.errors.join('\n');
      }

      setSuccess(message);
    } catch (err: any) {
      setError(`Failed to send test notification: ${err.message}`);
    } finally {
      setTesting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <p className="text-gray-500">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Bell className="w-8 h-8 text-blue-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Alert Notifications</h1>
              <p className="text-sm text-gray-600">Configure email and Slack notifications for template alerts</p>
            </div>
          </div>

          <button
            onClick={testNotifications}
            disabled={testing || (!emailEnabled && !slackEnabled)}
            className="bg-green-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {testing ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Testing...
              </>
            ) : (
              <>
                <TestTube className="w-4 h-4" />
                Test Notifications
              </>
            )}
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-800 whitespace-pre-line">{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-green-800 whitespace-pre-line">{success}</p>
          </div>
        )}

        <div className="space-y-6">
          <div className="bg-blue-50 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-2">Minimum Severity Level</h3>
            <p className="text-sm text-blue-700 mb-3">
              Only send notifications for alerts at or above this severity level
            </p>
            <select
              value={minSeverity}
              onChange={(e) => setMinSeverity(e.target.value as any)}
              className="w-full px-4 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="LOW">LOW - All alerts</option>
              <option value="MEDIUM">MEDIUM - Important alerts</option>
              <option value="HIGH">HIGH - Critical alerts only</option>
              <option value="CRITICAL">CRITICAL - Emergency alerts only</option>
            </select>
          </div>

          <div className="border-t pt-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Mail className="w-6 h-6 text-gray-700" />
                <div>
                  <h3 className="font-semibold text-gray-900">Email Notifications</h3>
                  <p className="text-sm text-gray-600">Send alerts via email</p>
                </div>
              </div>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={emailEnabled}
                  onChange={(e) => setEmailEnabled(e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700">Enabled</span>
              </label>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Recipients (comma-separated)
                </label>
                <input
                  type="text"
                  value={emailRecipients}
                  onChange={(e) => setEmailRecipients(e.target.value)}
                  disabled={!emailEnabled}
                  placeholder="admin@example.com, team@example.com"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:text-gray-500"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Enter one or more email addresses separated by commas
                </p>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <p className="text-sm text-yellow-800">
                  <strong>Note:</strong> Email functionality requires SMTP configuration in production.
                  Currently, emails are logged to the console for development purposes.
                </p>
              </div>
            </div>
          </div>

          <div className="border-t pt-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <MessageSquare className="w-6 h-6 text-gray-700" />
                <div>
                  <h3 className="font-semibold text-gray-900">Slack Notifications</h3>
                  <p className="text-sm text-gray-600">Send alerts to Slack channel</p>
                </div>
              </div>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={slackEnabled}
                  onChange={(e) => setSlackEnabled(e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700">Enabled</span>
              </label>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Slack Webhook URL
                </label>
                <input
                  type="text"
                  value={slackWebhookUrl}
                  onChange={(e) => setSlackWebhookUrl(e.target.value)}
                  disabled={!slackEnabled}
                  placeholder="https://hooks.slack.com/services/YOUR/WEBHOOK/URL"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:text-gray-500 font-mono text-sm"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Get your webhook URL from Slack App settings
                </p>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-sm text-blue-800 mb-2">
                  <strong>How to get a Slack Webhook URL:</strong>
                </p>
                <ol className="text-sm text-blue-700 space-y-1 list-decimal list-inside">
                  <li>Go to api.slack.com/apps</li>
                  <li>Create a new app or select existing one</li>
                  <li>Enable Incoming Webhooks</li>
                  <li>Add new webhook to workspace</li>
                  <li>Copy the webhook URL</li>
                </ol>
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-6 border-t">
            <button
              onClick={saveSettings}
              disabled={saving}
              className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {saving ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Save Settings
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
