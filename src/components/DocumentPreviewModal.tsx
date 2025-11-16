import { X, FileText, Download, CheckCircle, Clock, Shield } from 'lucide-react';
import { DocumentTemplate } from '../lib/supabase';

interface DocumentPreviewModalProps {
  template: DocumentTemplate;
  onClose: () => void;
  onStartFilling: () => void;
  viewCount?: number;
  recentDownloads?: number;
}

export function DocumentPreviewModal({
  template,
  onClose,
  onStartFilling,
  viewCount = 0,
  recentDownloads = 0,
}: DocumentPreviewModalProps) {
  interface FieldItem {
    label?: string;
    name?: string;
  }

  const parseFields = (jsonContent: string): string[] => {
    try {
      const parsed = JSON.parse(jsonContent) as { fields?: FieldItem[] };
      if (parsed.fields && Array.isArray(parsed.fields)) {
        return parsed.fields.map((f) => f.label || f.name || '').filter(Boolean);
      }
      return [];
    } catch {
      return [];
    }
  };

  const fields = parseFields(template.json_content || '{}');
  const estimatedTime = Math.max(3, Math.ceil(fields.length / 3));

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden animate-scale-in">
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FileText className="w-6 h-6" />
            <h3 className="text-xl font-bold">{template.name}</h3>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {(viewCount > 0 || recentDownloads > 0) && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6 flex items-center gap-3">
              <div className="bg-green-500 w-2 h-2 rounded-full animate-pulse"></div>
              <p className="text-sm text-gray-700">
                <strong className="text-green-700">
                  {recentDownloads} personnes
                </strong>{' '}
                ont téléchargé ce document cette semaine
              </p>
            </div>
          )}

          <div className="bg-blue-50 rounded-xl p-6 mb-6">
            <h4 className="font-bold text-gray-900 mb-3">À propos de ce document</h4>
            <p className="text-gray-700 leading-relaxed mb-4">{template.description}</p>

            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Clock className="w-6 h-6 text-blue-600" />
                </div>
                <p className="text-sm font-semibold text-gray-900">{estimatedTime} min</p>
                <p className="text-xs text-gray-600">Temps estimé</p>
              </div>

              <div className="text-center">
                <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <p className="text-sm font-semibold text-gray-900">{fields.length} champs</p>
                <p className="text-xs text-gray-600">À remplir</p>
              </div>

              <div className="text-center">
                <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Shield className="w-6 h-6 text-purple-600" />
                </div>
                <p className="text-sm font-semibold text-gray-900">Conforme</p>
                <p className="text-xs text-gray-600">Légalement</p>
              </div>
            </div>
          </div>

          <div className="bg-white border-2 border-gray-200 rounded-xl p-6 mb-6">
            <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              Informations requises
            </h4>

            {fields.length > 0 ? (
              <div className="space-y-2">
                {fields.slice(0, 8).map((field, index) => (
                  <div key={index} className="flex items-center gap-3 py-2 border-b border-gray-100 last:border-0">
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700 text-sm">{field}</span>
                  </div>
                ))}
                {fields.length > 8 && (
                  <p className="text-sm text-gray-500 italic pt-2">
                    + {fields.length - 8} autres champs...
                  </p>
                )}
              </div>
            ) : (
              <p className="text-gray-600 text-sm">
                Les champs requis seront affichés lors de la saisie.
              </p>
            )}
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
            <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
              <Download className="w-5 h-5 text-yellow-600" />
              Ce que vous obtiendrez
            </h4>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                Document PDF professionnel et imprimable
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                Conforme aux standards légaux
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                Téléchargement instantané après paiement
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                Option de signature électronique disponible
              </li>
            </ul>
          </div>
        </div>

        <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm text-gray-600 mb-1">Prix unique, aucun abonnement</p>
              <p className="text-3xl font-bold text-blue-600">1,99$</p>
            </div>
            <button
              onClick={onStartFilling}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:from-blue-700 hover:to-indigo-700 transition-all transform hover:scale-105 shadow-lg flex items-center gap-2"
            >
              Remplir ce document
              <Download className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
