/**
 * Guided Template Preview
 *
 * @description Preview generated document with conditional sections and payment flow
 * Integrates with existing payment system
 */

import { useState, useEffect } from 'react';
import { X, Download, Edit2, CreditCard, Lock, FileText } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { pdfGenerator } from '../lib/pdfGenerator';
import {
  GuidedTemplateEngine,
  GuidedTemplateConfig,
  TemplateVariant,
  TemplateSection,
} from '../lib/guidedTemplateEngine';

interface GuidedTemplatePreviewProps {
  configId: string;
  formData: Record<string, any>;
  onBack: () => void;
  onEdit: () => void;
}

export function GuidedTemplatePreview({
  configId,
  formData,
  onBack,
  onEdit,
}: GuidedTemplatePreviewProps) {
  const { user, profile } = useAuth();
  const [config, setConfig] = useState<GuidedTemplateConfig | null>(null);
  const [variant, setVariant] = useState<TemplateVariant | null>(null);
  const [sections, setSections] = useState<TemplateSection[]>([]);
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [showPayment, setShowPayment] = useState(false);

  useEffect(() => {
    fetchAndGenerate();
  }, [configId, formData]);

  const fetchAndGenerate = async () => {
    try {
      const { data, error } = await supabase
        .from('guided_template_configs')
        .select('*')
        .eq('id', configId)
        .single();

      if (error) throw error;
      if (data) {
        const templateConfig = data.config as GuidedTemplateConfig;
        setConfig(templateConfig);

        const engine = new GuidedTemplateEngine(templateConfig);
        engine.setFormData(formData);

        const result = engine.generateDocument();
        setVariant(result.variant);
        setSections(result.sections);
        setContent(result.content);
      }
    } catch (error) {
      console.error('Error fetching config:', error);
    } finally {
      setLoading(false);
    }
  };

  const userTier = profile?.subscription_tier || 'free';
  const canDownloadPDF = config?.pricing.free_tier.includes('pdf_download') || userTier === 'premium';
  const canEditDocument = config?.pricing.premium_tier.includes('document_edit') && userTier === 'premium';
  const canDownloadDocx = config?.pricing.premium_tier.includes('docx_download') && userTier === 'premium';

  const handleDownloadPDF = async () => {
    if (!canDownloadPDF) {
      setShowPayment(true);
      return;
    }

    if (!config || !variant) return;

    try {
      const fullContent = sections
        .map((section) => `${section.title}\n\n${section.content}`)
        .join('\n\n---\n\n');

      const blob = await pdfGenerator.generatePDF({
        title: config.name,
        content: fullContent,
        fields: formData,
        metadata: {
          author: user?.email,
          subject: config.description,
        },
      });

      await pdfGenerator.downloadPDF(
        blob,
        `${config.name.replace(/\s+/g, '-')}-${Date.now()}`
      );

      if (user) {
        await supabase.from('guided_template_submissions').upsert({
          user_id: user.id,
          config_id: configId,
          form_data: formData,
          selected_variant: variant.id,
          generated_content: fullContent,
          status: 'completed',
        });
      }
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF');
    }
  };

  const handleUpgrade = () => {
    window.dispatchEvent(
      new CustomEvent('navigate', { detail: { view: 'subscriptions' } })
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!config || !variant) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 text-center">
        <p className="text-red-600 mb-4">Error loading document preview</p>
        <button
          onClick={onBack}
          className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
        >
          Go Back
        </button>
      </div>
    );
  }

  if (showPayment) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-6">
            <Lock className="w-16 h-16 text-blue-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Upgrade to Premium
            </h2>
            <p className="text-gray-600">
              Unlock full document access and advanced features
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
            <h3 className="font-semibold text-gray-900 mb-3">Premium Features:</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-600" />
                Download as PDF and DOCX
              </li>
              <li className="flex items-center gap-2">
                <Edit2 className="w-4 h-4 text-blue-600" />
                Edit documents after generation
              </li>
              <li className="flex items-center gap-2">
                <Download className="w-4 h-4 text-blue-600" />
                Access to all template variants
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <button
              onClick={handleUpgrade}
              className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
            >
              <CreditCard className="w-5 h-5" />
              View pricing plans
            </button>
            <button
              onClick={() => setShowPayment(false)}
              className="w-full px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Go back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{config.name}</h2>
            <p className="text-sm text-gray-600 mt-1">
              Using variant: {variant.name}
            </p>
          </div>
          <button
            onClick={onBack}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {!canDownloadPDF && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-yellow-800">
              <strong>Free Preview:</strong> Upgrade to premium to download this document
            </p>
          </div>
        )}

        <div className="prose max-w-none mb-8 bg-gray-50 p-6 rounded-lg max-h-96 overflow-y-auto">
          <h1 className="text-2xl font-bold mb-6">{config.name}</h1>

          {sections.map((section) => (
            <div key={section.id} className="mb-6">
              <h2 className="text-xl font-semibold mb-3 text-gray-800">
                {section.title}
              </h2>
              <div
                className="text-gray-700 whitespace-pre-wrap"
                dangerouslySetInnerHTML={{ __html: section.content }}
              />
            </div>
          ))}

          {variant.description && (
            <div className="mt-8 pt-6 border-t border-gray-200 text-sm text-gray-500">
              <p>{variant.description}</p>
            </div>
          )}
        </div>

        <div className="flex gap-3">
          <button
            onClick={onEdit}
            className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
          >
            <Edit2 className="w-5 h-5" />
            Edit
          </button>

          <button
            onClick={handleDownloadPDF}
            className={`flex-1 px-6 py-3 rounded-lg transition-colors flex items-center justify-center gap-2 ${
              canDownloadPDF
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-300 text-gray-600 cursor-not-allowed'
            }`}
          >
            {canDownloadPDF ? (
              <>
                <Download className="w-5 h-5" />
                Download PDF
              </>
            ) : (
              <>
                <Lock className="w-5 h-5" />
                Upgrade to download
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
