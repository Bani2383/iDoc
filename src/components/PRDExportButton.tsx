import React, { useState } from 'react';
import { FileDown, CheckCircle } from 'lucide-react';
import { generatePRDPDF } from '../lib/prdPdfGenerator';

export default function PRDExportButton() {
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);

  const handleExport = async () => {
    setGenerating(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      generatePRDPDF();
      setGenerated(true);
      setTimeout(() => setGenerated(false), 3000);
    } catch (error) {
      console.error('Erreur lors de la génération du PDF:', error);
      alert('Erreur lors de la génération du PDF');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <button
      onClick={handleExport}
      disabled={generating}
      className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
    >
      {generated ? (
        <>
          <CheckCircle className="w-5 h-5" />
          <span>PDF téléchargé !</span>
        </>
      ) : (
        <>
          <FileDown className="w-5 h-5" />
          <span>{generating ? 'Génération...' : 'Exporter le PRD (PDF)'}</span>
        </>
      )}
    </button>
  );
}
