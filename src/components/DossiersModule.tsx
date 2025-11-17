import React, { useState } from 'react';
import { DossiersManager } from './DossiersManager';
import { DossierDetailView } from './DossierDetailView';
import { ArrowLeft } from 'lucide-react';

export const DossiersModule: React.FC = () => {
  const [selectedDossierId, setSelectedDossierId] = useState<string | null>(null);

  if (selectedDossierId) {
    return (
      <div>
        <button
          onClick={() => setSelectedDossierId(null)}
          className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Retour aux dossiers</span>
        </button>
        <DossierDetailView dossierId={selectedDossierId} />
      </div>
    );
  }

  return <DossiersManager onSelectDossier={setSelectedDossierId} />;
};
