import React, { useState, useRef, useEffect } from 'react';
import { Upload, Download, X, Edit3, ZoomIn, ZoomOut, Move, AlignLeft, AlignRight, AlignCenter, Type } from 'lucide-react';
import { SignaturePad } from './SignaturePad';
import { jsPDF } from 'jspdf';
import { logger } from '../lib/logger';

interface SignaturePosition {
  x: number;
  y: number;
  width: number;
  height: number;
  signatureData: string;
}

interface PDFSignatureEditorProps {
  onClose: () => void;
  onComplete?: (signedPdfBlob: Blob) => void;
}

export const PDFSignatureEditor: React.FC<PDFSignatureEditorProps> = ({ onClose, onComplete }) => {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfDataUrl, setPdfDataUrl] = useState<string | null>(null);
  const [showSignaturePad, setShowSignaturePad] = useState(false);
  const [showTextSignature, setShowTextSignature] = useState(false);
  const [textSignature, setTextSignature] = useState('');
  const [signatures, setSignatures] = useState<SignaturePosition[]>([]);
  const [currentSignature, setCurrentSignature] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [draggedSignatureIndex, setDraggedSignatureIndex] = useState<number | null>(null);
  const [zoom, setZoom] = useState(1);
  const [isPaid, setIsPaid] = useState(false);
  const [mousePosition, setMousePosition] = useState<{ x: number; y: number } | null>(null);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    logger.debug('PDFSignatureEditor mounted');
    return () => {
      logger.debug('PDFSignatureEditor unmounted');
    };
  }, []);

  useEffect(() => {
    if (pdfDataUrl && canvasRef.current) {
      renderPdfToCanvas();
    }
  }, [pdfDataUrl, zoom, signatures, mousePosition]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf' && !file.type.startsWith('image/')) {
      alert('Veuillez uploader un fichier PDF ou une image');
      return;
    }

    setPdfFile(file);

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setPdfDataUrl(dataUrl);
    };
    reader.readAsDataURL(file);
  };

  const renderPdfToCanvas = async () => {
    if (!pdfDataUrl || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (pdfFile?.type.startsWith('image/')) {
      const img = new Image();
      img.onload = () => {
        canvas.width = img.width * zoom;
        canvas.height = img.height * zoom;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        renderSignatures();
      };
      img.src = pdfDataUrl;
    } else {
      canvas.width = 800 * zoom;
      canvas.height = 1000 * zoom;
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = 'black';
      ctx.font = '20px Arial';
      ctx.fillText('Aperçu du PDF', 50, 50);
      ctx.fillText('(Bibliothèque PDF complète requise pour le rendu)', 50, 80);
      renderSignatures();
    }
  };

  const renderSignatures = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    signatures.forEach((sig) => {
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, sig.x * zoom, sig.y * zoom, sig.width * zoom, sig.height * zoom);
      };
      img.src = sig.signatureData;
    });

    if (currentSignature && mousePosition) {
      const img = new Image();
      img.onload = () => {
        ctx.save();
        ctx.globalAlpha = 0.5;
        ctx.drawImage(img, mousePosition.x * zoom, mousePosition.y * zoom, 200 * zoom, 80 * zoom);
        ctx.restore();
      };
      img.src = currentSignature;
    }
  };

  const handleAddSignature = (signatureData: string) => {
    setCurrentSignature(signatureData);
    setShowSignaturePad(false);
  };

  const createTextSignature = () => {
    if (!textSignature.trim()) return;

    const canvas = document.createElement('canvas');
    canvas.width = 400;
    canvas.height = 120;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'black';
    ctx.font = 'italic 48px "Brush Script MT", cursive';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(textSignature, canvas.width / 2, canvas.height / 2);

    const signatureData = canvas.toDataURL();
    setCurrentSignature(signatureData);
    setShowTextSignature(false);
    setTextSignature('');
  };

  const placeSignatureAt = (position: 'bottom-right' | 'bottom-left' | 'center' | 'top-right') => {
    if (!currentSignature || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const width = 200;
    const height = 80;
    const padding = 50;

    let x = 0;
    let y = 0;

    switch (position) {
      case 'bottom-right':
        x = (canvas.width / zoom) - width - padding;
        y = (canvas.height / zoom) - height - padding;
        break;
      case 'bottom-left':
        x = padding;
        y = (canvas.height / zoom) - height - padding;
        break;
      case 'center':
        x = (canvas.width / zoom) / 2 - width / 2;
        y = (canvas.height / zoom) / 2 - height / 2;
        break;
      case 'top-right':
        x = (canvas.width / zoom) - width - padding;
        y = padding;
        break;
    }

    const newSignature: SignaturePosition = {
      x,
      y,
      width,
      height,
      signatureData: currentSignature
    };

    setSignatures([...signatures, newSignature]);
    setCurrentSignature(null);
    renderPdfToCanvas();
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!currentSignature || !canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / zoom;
    const y = (e.clientY - rect.top) / zoom;

    const newSignature: SignaturePosition = {
      x,
      y,
      width: 200,
      height: 80,
      signatureData: currentSignature
    };

    setSignatures([...signatures, newSignature]);
    setCurrentSignature(null);
    renderPdfToCanvas();
  };

  const handleSignatureDragStart = (index: number, e: React.MouseEvent) => {
    setIsDragging(true);
    setDraggedSignatureIndex(index);
    e.stopPropagation();
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / zoom;
    const y = (e.clientY - rect.top) / zoom;

    if (currentSignature && !isDragging) {
      setMousePosition({ x, y });
    }

    if (isDragging && draggedSignatureIndex !== null) {
      const updatedSignatures = [...signatures];
      updatedSignatures[draggedSignatureIndex] = {
        ...updatedSignatures[draggedSignatureIndex],
        x,
        y
      };
      setSignatures(updatedSignatures);
      renderPdfToCanvas();
    }
  };

  const handleSignatureDragEnd = () => {
    setIsDragging(false);
    setDraggedSignatureIndex(null);
  };

  const handlePayment = async () => {
    alert('Simulation de paiement: 1,99$ pour signature électronique');
    setIsPaid(true);
  };

  const handleDownload = async () => {
    if (!isPaid) {
      alert('Veuillez effectuer le paiement avant de télécharger');
      return;
    }

    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const doc = new jsPDF({
      orientation: canvas.width > canvas.height ? 'landscape' : 'portrait',
      unit: 'px',
      format: [canvas.width, canvas.height]
    });

    const imgData = canvas.toDataURL('image/jpeg', 0.95);
    doc.addImage(imgData, 'JPEG', 0, 0, canvas.width, canvas.height);

    const blob = doc.output('blob');

    if (onComplete) {
      onComplete(blob);
    }

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `document-signe-${Date.now()}.pdf`;
    link.click();
    URL.revokeObjectURL(url);

    alert('✅ Document signé téléchargé avec succès!');
  };

  const handleRemoveSignature = (index: number) => {
    const updatedSignatures = signatures.filter((_, i) => i !== index);
    setSignatures(updatedSignatures);
    renderPdfToCanvas();
  };

  return (
    <div className="fixed inset-0 bg-gray-900 z-[9999] overflow-hidden">
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Signature de document PDF</h1>
              <p className="text-sm text-gray-600 mt-1">
                Uploadez votre document et ajoutez votre signature électronique
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Mobile Sidebar Toggle */}
        <button
          onClick={() => setShowMobileSidebar(!showMobileSidebar)}
          className="sm:hidden fixed bottom-4 left-4 bg-blue-600 text-white rounded-full p-4 shadow-lg z-50"
        >
          <Edit3 className="w-6 h-6" />
        </button>

        {/* Main Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Sidebar - Tools */}
          <div className={`${showMobileSidebar ? 'fixed inset-0 z-40 bg-white' : 'hidden'} sm:block sm:relative sm:w-80 bg-white border-r border-gray-200 p-6 overflow-y-auto`}>
            {/* Close button for mobile */}
            {showMobileSidebar && (
              <button
                onClick={() => setShowMobileSidebar(false)}
                className="sm:hidden absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            )}
            <div className="space-y-6">
              {/* Upload Section */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4">1. Charger le document</h3>
                {!pdfFile ? (
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-blue-500 transition-colors">
                    <label className="cursor-pointer">
                      <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-sm font-semibold text-gray-700 mb-1">
                        Cliquez pour uploader
                      </p>
                      <p className="text-xs text-gray-500">PDF ou Image (max 10MB)</p>
                      <input
                        type="file"
                        accept=".pdf,image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                ) : (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <p className="text-sm font-semibold text-green-800 mb-1">
                      ✓ Document chargé
                    </p>
                    <p className="text-xs text-green-600">{pdfFile.name}</p>
                    <button
                      onClick={() => {
                        setPdfFile(null);
                        setPdfDataUrl(null);
                        setSignatures([]);
                      }}
                      className="mt-2 text-xs text-red-600 hover:text-red-800"
                    >
                      Changer de document
                    </button>
                  </div>
                )}
              </div>

              {/* Signature Section */}
              {pdfFile && (
                <>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-4">
                      2. Ajouter une signature
                    </h3>
                    <div className="space-y-2">
                      <button
                        onClick={() => setShowSignaturePad(true)}
                        className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                      >
                        <Edit3 className="w-5 h-5" />
                        <span>Dessiner ma signature</span>
                      </button>
                      <button
                        onClick={() => setShowTextSignature(true)}
                        className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors flex items-center justify-center space-x-2"
                      >
                        <Type className="w-5 h-5" />
                        <span>Taper ma signature</span>
                      </button>
                    </div>
                    {currentSignature && (
                      <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-3">
                        <p className="text-xs text-blue-800 font-semibold mb-3">
                          Signature prête - Placement rapide:
                        </p>
                        <div className="grid grid-cols-2 gap-2 mb-3">
                          <button
                            onClick={() => placeSignatureAt('bottom-right')}
                            className="flex items-center justify-center space-x-1 bg-white border border-blue-300 text-blue-700 py-2 px-3 rounded text-xs hover:bg-blue-50 transition-colors"
                          >
                            <AlignRight className="w-3 h-3" />
                            <span>Bas droite</span>
                          </button>
                          <button
                            onClick={() => placeSignatureAt('bottom-left')}
                            className="flex items-center justify-center space-x-1 bg-white border border-blue-300 text-blue-700 py-2 px-3 rounded text-xs hover:bg-blue-50 transition-colors"
                          >
                            <AlignLeft className="w-3 h-3" />
                            <span>Bas gauche</span>
                          </button>
                          <button
                            onClick={() => placeSignatureAt('center')}
                            className="flex items-center justify-center space-x-1 bg-white border border-blue-300 text-blue-700 py-2 px-3 rounded text-xs hover:bg-blue-50 transition-colors"
                          >
                            <AlignCenter className="w-3 h-3" />
                            <span>Centre</span>
                          </button>
                          <button
                            onClick={() => placeSignatureAt('top-right')}
                            className="flex items-center justify-center space-x-1 bg-white border border-blue-300 text-blue-700 py-2 px-3 rounded text-xs hover:bg-blue-50 transition-colors"
                          >
                            <AlignRight className="w-3 h-3" />
                            <span>Haut droite</span>
                          </button>
                        </div>
                        <p className="text-xs text-blue-600 mb-2">ou cliquez sur le document</p>
                        <img src={currentSignature} alt="Signature" className="w-full h-auto border border-blue-200 rounded" />
                      </div>
                    )}
                  </div>

                  {/* Signatures List */}
                  {signatures.length > 0 && (
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-4">
                        Signatures ajoutées ({signatures.length})
                      </h3>
                      <div className="space-y-2">
                        {signatures.map((sig, index) => (
                          <div
                            key={index}
                            className="bg-gray-50 border border-gray-200 rounded-lg p-3 flex items-center justify-between"
                          >
                            <div className="flex items-center space-x-3">
                              <Move className="w-4 h-4 text-gray-400" />
                              <span className="text-sm text-gray-700">Signature {index + 1}</span>
                            </div>
                            <button
                              onClick={() => handleRemoveSignature(index)}
                              className="text-red-600 hover:text-red-800 text-sm"
                            >
                              Supprimer
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Zoom Controls */}
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Zoom</h3>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setZoom(Math.max(0.5, zoom - 0.1))}
                        className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center"
                      >
                        <ZoomOut className="w-4 h-4" />
                      </button>
                      <span className="text-sm font-semibold text-gray-900 w-16 text-center">
                        {Math.round(zoom * 100)}%
                      </span>
                      <button
                        onClick={() => setZoom(Math.min(2, zoom + 0.1))}
                        className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center"
                      >
                        <ZoomIn className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Payment & Download */}
                  <div className="pt-6 border-t border-gray-200">
                    {!isPaid ? (
                      <div>
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                          <p className="text-sm font-semibold text-yellow-900 mb-2">
                            Prix: 1,99$ 💳
                          </p>
                          <p className="text-xs text-yellow-700">
                            Signez et téléchargez votre document après le paiement
                          </p>
                        </div>
                        <button
                          onClick={handlePayment}
                          disabled={signatures.length === 0}
                          className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                        >
                          Payer et télécharger
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={handleDownload}
                        className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                      >
                        <Download className="w-5 h-5" />
                        <span>Télécharger le PDF signé</span>
                      </button>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Canvas Area */}
          <div
            ref={containerRef}
            className="flex-1 bg-gray-800 overflow-auto p-8 flex items-center justify-center"
          >
            {pdfDataUrl ? (
              <div className="bg-white shadow-2xl rounded-lg overflow-hidden">
                <canvas
                  ref={canvasRef}
                  onClick={handleCanvasClick}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleSignatureDragEnd}
                  onMouseLeave={() => setMousePosition(null)}
                  className={`max-w-full ${currentSignature ? 'cursor-crosshair' : 'cursor-default'}`}
                />
              </div>
            ) : (
              <div className="text-center text-white">
                <Upload className="w-20 h-20 mx-auto mb-4 opacity-50" />
                <p className="text-xl font-semibold mb-2">Aucun document chargé</p>
                <p className="text-gray-400">Uploadez un PDF ou une image pour commencer</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Signature Pad Modal */}
      {showSignaturePad && (
        <SignaturePad
          onClose={() => setShowSignaturePad(false)}
          onSave={handleAddSignature}
        />
      )}

      {/* Text Signature Modal */}
      {showTextSignature && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-[10000] flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900">Taper ma signature</h3>
              <button
                onClick={() => {
                  setShowTextSignature(false);
                  setTextSignature('');
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Votre nom complet
                </label>
                <input
                  type="text"
                  value={textSignature}
                  onChange={(e) => setTextSignature(e.target.value)}
                  placeholder="Jean Dupont"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  autoFocus
                />
              </div>
              {textSignature && (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <p className="text-xs text-gray-600 mb-2">Aperçu:</p>
                  <div className="bg-white p-4 rounded border border-gray-200 text-center">
                    <span style={{ fontFamily: '"Brush Script MT", cursive', fontSize: '32px' }}>
                      {textSignature}
                    </span>
                  </div>
                </div>
              )}
              <button
                onClick={createTextSignature}
                disabled={!textSignature.trim()}
                className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Créer la signature
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
