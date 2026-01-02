import React, { useState } from 'react';
import { Beaker, Code, Layers } from 'lucide-react';
import { TemplateLabModule } from './TemplateLabModule';
import AdminIdocLinterEnhanced from './AdminIdocLinterEnhanced';

type ViewMode = 'lab' | 'linter';

export const UnifiedTemplateLab: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('lab');

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-3">
              <Layers className="w-8 h-8 text-purple-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Template Lab & Linter</h1>
                <p className="text-sm text-gray-600">Test, validate and certify templates</p>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setViewMode('lab')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                  viewMode === 'lab'
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Beaker className="w-4 h-4" />
                Template Lab
              </button>
              <button
                onClick={() => setViewMode('linter')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                  viewMode === 'linter'
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Code className="w-4 h-4" />
                iDoc Linter
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        {viewMode === 'lab' ? (
          <TemplateLabModule />
        ) : (
          <AdminIdocLinterEnhanced />
        )}
      </div>
    </div>
  );
};
