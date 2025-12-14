import { useState } from 'react';
import { FileText, Lock, AlertCircle, HelpCircle, ArrowLeft, CreditCard } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface CheckoutPreviewProps {
  documentPreview: string;
  price: number;
  onPayment: () => void;
  onEditData: () => void;
  onBack: () => void;
}

export function CheckoutPreview({
  documentPreview,
  price,
  onPayment,
  onEditData,
  onBack
}: CheckoutPreviewProps) {
  const { t } = useLanguage();
  const [showHelp, setShowHelp] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <button
          onClick={onBack}
          className="mb-6 flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Retour
        </button>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <FileText className="w-6 h-6 text-blue-600" />
              <h2 className="text-2xl font-bold text-slate-900">
                {t('checkout.previewHeader')}
              </h2>
            </div>

            <div className="bg-slate-50 rounded-xl p-6 max-h-[600px] overflow-y-auto border border-slate-200">
              <div className="prose prose-sm max-w-none">
                <div dangerouslySetInnerHTML={{ __html: documentPreview }} />
              </div>
            </div>

            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <button
                onClick={onEditData}
                className="flex-1 px-6 py-3 border-2 border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 transition-colors font-medium"
              >
                {t('checkout.secondaryButton')}
              </button>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="flex items-center justify-between mb-6 pb-6 border-b border-slate-200">
                <span className="text-slate-600 font-medium">
                  {t('checkout.priceLabel')}
                </span>
                <span className="text-3xl font-bold text-slate-900">
                  {price.toFixed(2)} $
                </span>
              </div>

              <button
                onClick={onPayment}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-4 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all transform hover:scale-[1.02] font-semibold text-lg shadow-lg shadow-blue-500/30 flex items-center justify-center gap-3"
              >
                <CreditCard className="w-6 h-6" />
                {t('checkout.primaryButton')}
              </button>

              <div className="flex items-center justify-center gap-2 mt-4 text-sm text-slate-500">
                <Lock className="w-4 h-4" />
                {t('checkout.trustLine')}
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div className="space-y-2">
                  <p className="text-sm text-amber-900 leading-relaxed">
                    {t('checkout.legalLine')}
                  </p>
                  <p className="text-sm text-amber-900 leading-relaxed font-medium">
                    {t('checkout.noGuaranteeLine')}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
              <button
                onClick={() => setShowHelp(!showHelp)}
                className="flex items-start gap-3 w-full text-left"
              >
                <HelpCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-blue-900 mb-1">
                    {t('checkout.helpTitle')}
                  </h3>
                  {showHelp && (
                    <div className="space-y-3 mt-3">
                      <p className="text-sm text-blue-800 leading-relaxed">
                        {t('checkout.helpText')}
                      </p>
                      <a
                        href="/faq"
                        className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
                      >
                        {t('checkout.faqLinkText')} →
                      </a>
                    </div>
                  )}
                </div>
              </button>
            </div>

            <div className="bg-slate-50 rounded-xl p-4">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-slate-900">2m</div>
                  <div className="text-xs text-slate-600 mt-1">Génération</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-slate-900">
                    <Lock className="w-6 h-6 mx-auto" />
                  </div>
                  <div className="text-xs text-slate-600 mt-1">Sécurisé</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-slate-900">24/7</div>
                  <div className="text-xs text-slate-600 mt-1">Support</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
