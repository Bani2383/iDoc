import React, { useState } from 'react';
import { TemplateLabManager } from './TemplateLabManager';
import { TemplateLabDetail } from './TemplateLabDetail';
import { ArrowLeft } from 'lucide-react';

export const TemplateLabModule: React.FC = () => {
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);

  if (selectedTemplateId) {
    return (
      <div>
        <button
          onClick={() => setSelectedTemplateId(null)}
          className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Retour à la liste</span>
        </button>
        <TemplateLabDetail templateId={selectedTemplateId} onBack={() => setSelectedTemplateId(null)} />
      </div>
    );
  }

  return <TemplateLabManager onSelectTemplate={setSelectedTemplateId} />;
};
