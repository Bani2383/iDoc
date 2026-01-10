import React, { useState, useEffect } from 'react';
import { Eye, X, AlertTriangle, CheckCircle, FileText, ArrowLeftRight } from 'lucide-react';
import { getAllMockProfiles, getMockDataForTemplate, renderPreviewWithMockData, type MockDataProfile } from '../lib/businessPreview';
import { runRenderSmokeTest } from '../lib/templateSafety';

interface BusinessPreviewModalProps {
  template: any;
  currentVersion?: any;
  onClose: () => void;
  onPublish?: () => void;
}

export const BusinessPreviewModal: React.FC<BusinessPreviewModalProps> = ({
  template,
  currentVersion,
  onClose,
  onPublish,
}) => {
  const [selectedProfile, setSelectedProfile] = useState<MockDataProfile | null>(null);
  const [mockProfiles, setMockProfiles] = useState<MockDataProfile[]>([]);
  const [previewOutput, setPreviewOutput] = useState<string>('');
  const [currentVersionOutput, setCurrentVersionOutput] = useState<string>('');
  const [showComparison, setShowComparison] = useState(false);
  const [smokeTestResult, setSmokeTestResult] = useState<any>(null);

  useEffect(() => {
    const profiles = getAllMockProfiles();
    setMockProfiles(profiles);
    setSelectedProfile(profiles[0]);
  }, []);

  useEffect(() => {
    if (selectedProfile && template) {
      generatePreview();
    }
  }, [selectedProfile, template]);

  const generatePreview = () => {
    if (!selectedProfile) return;

    try {
      // Run smoke test
      const smokeTest = runRenderSmokeTest(template);
      setSmokeTestResult(smokeTest);

      // Get mock data for this template
      const mockData = getMockDataForTemplate(template, selectedProfile.type);

      // Extract template content
      let content = template.template_content;
      if (typeof content === 'object') {
        if (content.fr || content.en) {
          content = content.fr || content.en;
        } else if (Array.isArray(content)) {
          content = content.map((section: any) => {
            if (typeof section === 'string') return section;
            if (section.content) return section.content;
            if (section.template) return section.template;
            return '';
          }).join('\n\n');
        } else {
          content = JSON.stringify(content);
        }
      }

      // Render with mock data
      const rendered = renderPreviewWithMockData(content, mockData);
      setPreviewOutput(rendered);

      // Render current version if available
      if (currentVersion) {
        let currentContent = currentVersion.template_content;
        if (typeof currentContent === 'object') {
          currentContent = currentContent.fr || currentContent.en || JSON.stringify(currentContent);
        }
        const currentRendered = renderPreviewWithMockData(currentContent, mockData);
        setCurrentVersionOutput(currentRendered);
      }
    } catch (error: any) {
      setPreviewOutput(`[ERREUR DE RENDU]\n${error.message}`);
    }
  };

  const getTrustLevelColor = (level: string) => {
    switch (level) {
      case 'HIGH':
        return 'text-red-600 bg-red-100';
      case 'MEDIUM':
        return 'text-orange-600 bg-orange-100';
      case 'LOW':
        return 'text-green-600 bg-green-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const canPublish = smokeTestResult?.success && (!template.trust_level || template.trust_level !== 'HIGH' || confirm('Ce template a un niveau HIGH trust. Confirmer la publication?'));

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-7xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <Eye className="w-7 h-7 text-blue-600" />
              Preview Métier - {template.template_code || template.name}
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Prévisualisation réaliste avec données de test - Requis avant publication
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Controls */}
        <div className="p-6 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <label className="text-sm font-medium text-gray-700">Profil de données:</label>
              <select
                value={selectedProfile?.type || 'standard'}
                onChange={(e) => {
                  const profile = mockProfiles.find(p => p.type === e.target.value);
                  setSelectedProfile(profile || null);
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                {mockProfiles.map(profile => (
                  <option key={profile.type} value={profile.type}>
                    {profile.name} - {profile.description}
                  </option>
                ))}
              </select>
            </div>

            {currentVersion && (
              <button
                onClick={() => setShowComparison(!showComparison)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                  showComparison
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                <ArrowLeftRight className="w-4 h-4" />
                Comparer avec Version Actuelle
              </button>
            )}
          </div>

          {/* Template Info */}
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <span className="font-medium text-gray-700">Niveau de Confiance:</span>
              <span className={`px-3 py-1 rounded font-bold ${getTrustLevelColor(template.trust_level || 'MEDIUM')}`}>
                {template.trust_level || 'MEDIUM'}
              </span>
            </div>
            {template.trust_level === 'HIGH' && (
              <div className="flex items-center gap-2 text-red-600">
                <AlertTriangle className="w-4 h-4" />
                <span className="font-medium">Confirmation supplémentaire requise</span>
              </div>
            )}
          </div>

          {/* Smoke Test Results */}
          {smokeTestResult && (
            <div className={`mt-4 p-4 rounded-lg border-l-4 ${
              smokeTestResult.success
                ? 'bg-green-50 border-green-500'
                : 'bg-red-50 border-red-500'
            }`}>
              <div className="flex items-center gap-2 mb-2">
                {smokeTestResult.success ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                )}
                <span className="font-bold">
                  {smokeTestResult.success ? 'Smoke Test Réussi' : 'Smoke Test Échoué'}
                </span>
              </div>
              {smokeTestResult.error && (
                <p className="text-sm text-red-800 mb-2">Erreur: {smokeTestResult.error}</p>
              )}
              {smokeTestResult.warnings && smokeTestResult.warnings.length > 0 && (
                <div className="text-sm">
                  <p className="font-medium mb-1">Avertissements ({smokeTestResult.warnings.length}):</p>
                  <ul className="list-disc list-inside space-y-1">
                    {smokeTestResult.warnings.map((warning: string, idx: number) => (
                      <li key={idx} className="text-orange-700">{warning}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Preview Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {showComparison && currentVersion ? (
            <div className="grid grid-cols-2 gap-6">
              {/* Current Version */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-gray-600" />
                  Version Actuelle (Production)
                </h3>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 whitespace-pre-wrap font-mono text-sm">
                  {currentVersionOutput || 'Aucune version actuelle'}
                </div>
              </div>

              {/* New Version */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-600" />
                  Nouvelle Version (Proposée)
                </h3>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 whitespace-pre-wrap font-mono text-sm">
                  {previewOutput}
                </div>
              </div>
            </div>
          ) : (
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                Rendu Final (tel que vu par l'utilisateur)
              </h3>
              <div className="bg-white border-2 border-blue-200 rounded-lg p-6 shadow-inner whitespace-pre-wrap">
                {previewOutput}
              </div>
            </div>
          )}

          {/* Mock Data Details */}
          {selectedProfile && (
            <details className="mt-6">
              <summary className="cursor-pointer font-bold text-gray-900 hover:text-blue-600 mb-2">
                Voir les données de test utilisées
              </summary>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <pre className="text-xs overflow-x-auto">
                  {JSON.stringify(getMockDataForTemplate(template, selectedProfile.type), null, 2)}
                </pre>
              </div>
            </details>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            {template.preview_required !== false && (
              <p className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-orange-600" />
                <span>Preview métier obligatoire avant publication</span>
              </p>
            )}
          </div>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors font-medium"
            >
              Annuler
            </button>
            {onPublish && (
              <button
                onClick={() => {
                  if (!smokeTestResult?.success) {
                    alert('Le smoke test a échoué. Impossible de publier.');
                    return;
                  }
                  if (template.trust_level === 'HIGH') {
                    if (!confirm('Ce template a un niveau HIGH trust. Confirmer la publication?')) {
                      return;
                    }
                  }
                  onPublish();
                  onClose();
                }}
                disabled={!smokeTestResult?.success}
                className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                  smokeTestResult?.success
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                Publier en Production
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
