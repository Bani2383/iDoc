/**
 * Guided Template Flow - Main Orchestrator
 *
 * @description Orchestrates the complete guided template flow: Browse -> Wizard -> Preview
 * This is the main entry point for the NEW guided template feature
 */

import { useState } from 'react';
import { GuidedTemplateBrowser } from './GuidedTemplateBrowser';
import { GuidedTemplateWizard } from './GuidedTemplateWizard';
import { GuidedTemplatePreview } from './GuidedTemplatePreview';

type FlowStep = 'browser' | 'wizard' | 'preview';

interface GuidedTemplateFlowProps {
  onClose?: () => void;
}

export function GuidedTemplateFlow({ onClose }: GuidedTemplateFlowProps) {
  const [currentStep, setCurrentStep] = useState<FlowStep>('browser');
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Record<string, any>>({});

  const handleSelectTemplate = (templateId: string) => {
    setSelectedTemplateId(templateId);
    setCurrentStep('wizard');
  };

  const handleBackFromWizard = () => {
    setSelectedTemplateId(null);
    setFormData({});
    setCurrentStep('browser');
  };

  const handlePreview = (data: Record<string, any>) => {
    setFormData(data);
    setCurrentStep('preview');
  };

  const handleBackFromPreview = () => {
    setCurrentStep('browser');
  };

  const handleEditFromPreview = () => {
    setCurrentStep('wizard');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {currentStep === 'browser' && (
        <GuidedTemplateBrowser
          onSelectTemplate={handleSelectTemplate}
          onBack={onClose}
        />
      )}

      {currentStep === 'wizard' && selectedTemplateId && (
        <GuidedTemplateWizard
          configId={selectedTemplateId}
          onBack={handleBackFromWizard}
          onPreview={handlePreview}
        />
      )}

      {currentStep === 'preview' && selectedTemplateId && (
        <GuidedTemplatePreview
          configId={selectedTemplateId}
          formData={formData}
          onBack={handleBackFromPreview}
          onEdit={handleEditFromPreview}
        />
      )}
    </div>
  );
}
