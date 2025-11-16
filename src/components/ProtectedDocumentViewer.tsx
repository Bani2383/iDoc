import { useEffect, useRef, useState } from 'react';
import { X, Download, Shield, AlertTriangle, FileSignature } from 'lucide-react';
import { SignaturePad } from './SignaturePad';

interface GeneratedDocument {
  id: string;
  document_type: string;
  pdf_url: string | null;
}

interface ProtectedDocumentViewerProps {
  document: GeneratedDocument;
  onClose: () => void;
}

export function ProtectedDocumentViewer({ document, onClose }: ProtectedDocumentViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [showSignaturePad, setShowSignaturePad] = useState(false);
  const [signature, setSignature] = useState<string | null>(null);

  useEffect(() => {
    const preventScreenshot = (e: KeyboardEvent) => {
      if (
        (e.ctrlKey && e.shiftKey && (e.key === 'S' || e.key === 's')) ||
        (e.metaKey && e.shiftKey && (e.key === '3' || e.key === '4' || e.key === '5')) ||
        e.key === 'PrintScreen'
      ) {
        e.preventDefault();
        alert('Les captures d\'écran sont désactivées pour protéger ce document.');
        return false;
      }
    };

    const preventContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      return false;
    };

    const preventCopy = (e: ClipboardEvent) => {
      e.preventDefault();
      return false;
    };

    const preventDrag = (e: DragEvent) => {
      e.preventDefault();
      return false;
    };

    window.document.addEventListener('keydown', preventScreenshot);
    window.document.addEventListener('contextmenu', preventContextMenu);
    window.document.addEventListener('copy', preventCopy);
    window.document.addEventListener('cut', preventCopy);
    window.document.addEventListener('dragstart', preventDrag);

    const style = window.document.createElement('style');
    style.innerHTML = `
      .protected-content {
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
        -webkit-touch-callout: none;
        pointer-events: auto;
      }
      .protected-content * {
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
      }
    `;
    window.document.head.appendChild(style);

    const observer = new MutationObserver(() => {
      if (window.document.hidden || window.document.visibilityState === 'hidden') {
        const overlay = window.document.createElement('div');
        overlay.style.cssText = `
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: black;
          z-index: 9999;
        `;
        overlay.id = 'protection-overlay';
        window.document.body.appendChild(overlay);
      } else {
        const overlay = window.document.getElementById('protection-overlay');
        if (overlay) overlay.remove();
      }
    });

    observer.observe(window.document.documentElement, { attributes: true, attributeFilter: ['hidden'] });

    return () => {
      window.document.removeEventListener('keydown', preventScreenshot);
      window.document.removeEventListener('contextmenu', preventContextMenu);
      window.document.removeEventListener('copy', preventCopy);
      window.document.removeEventListener('cut', preventCopy);
      window.document.removeEventListener('dragstart', preventDrag);
      style.remove();
      observer.disconnect();
      const overlay = window.document.getElementById('protection-overlay');
      if (overlay) overlay.remove();
    };
  }, []);

  const handleDownload = () => {
    if (document.pdf_url) {
      const link = window.document.createElement('a');
      link.href = document.pdf_url;
      link.download = `${document.document_type}.pdf`;
      link.click();
    }
  };

  const handleSaveSignature = (signatureData: string) => {
    setSignature(signatureData);
    setShowSignaturePad(false);
  };

  return (
    <div className="fixed inset-0 bg-gray-900 z-50 flex flex-col">
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Shield className="w-6 h-6 text-blue-600" />
          <div>
            <h2 className="text-xl font-bold text-gray-900">{document.document_type}</h2>
            <p className="text-sm text-gray-600">Document protégé</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowSignaturePad(true)}
            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all flex items-center space-x-2"
          >
            <FileSignature className="w-4 h-4" />
            <span>Ajouter une signature</span>
          </button>
          <button
            onClick={handleDownload}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <Download className="w-4 h-4" />
            <span>Télécharger PDF</span>
          </button>
          <button
            onClick={onClose}
            className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
      </header>

      <div className="flex-1 overflow-hidden bg-gray-100">
        <div className="h-full flex flex-col items-center justify-center p-8 space-y-6">
          {signature && (
            <div className="bg-white border-2 border-blue-200 rounded-lg p-6 max-w-2xl">
              <div className="flex items-start space-x-4">
                <FileSignature className="w-8 h-8 text-blue-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-lg font-bold text-blue-900 mb-2">Signature ajoutée avec succès</h3>
                  <p className="text-sm text-blue-800 mb-4">
                    Votre signature a été ajoutée au document. Vous pouvez maintenant le télécharger.
                  </p>
                  <img src={signature} alt="Signature" className="border border-gray-300 rounded bg-white p-2 max-w-xs" />
                </div>
              </div>
            </div>
          )}

          <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-6 max-w-2xl">
            <div className="flex items-start space-x-4">
              <AlertTriangle className="w-8 h-8 text-yellow-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-bold text-yellow-900 mb-2">Protection du document activée</h3>
                <ul className="space-y-2 text-sm text-yellow-800">
                  <li>• Les captures d'écran sont désactivées</li>
                  <li>• Le clic droit est désactivé</li>
                  <li>• La copie de texte est désactivée</li>
                  <li>• Utilisez le bouton "Ajouter une signature" pour signer le document</li>
                  <li>• Utilisez le bouton "Télécharger PDF" pour obtenir le document</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        ref={containerRef}
        className="protected-content"
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          top: 0,
          left: 0,
          pointerEvents: 'none',
          zIndex: -1,
        }}
      />

      {showSignaturePad && (
        <SignaturePad
          onClose={() => setShowSignaturePad(false)}
          onSave={handleSaveSignature}
        />
      )}
    </div>
  );
}
