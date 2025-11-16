import { useRef, useState, useEffect } from 'react';
import { X, Edit3, Upload, Type, Eraser, Check } from 'lucide-react';

interface SignaturePadProps {
  onClose: () => void;
  onSave: (signatureData: string) => void;
}

export function SignaturePad({ onClose, onSave }: SignaturePadProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [signatureMode, setSignatureMode] = useState<'draw' | 'type' | 'upload'>('draw');
  const [typedSignature, setTypedSignature] = useState('');
  const [signatureFont, setSignatureFont] = useState('Brush Script MT');

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  }, []);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (signatureMode !== 'draw') return;
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing || signatureMode !== 'draw') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setTypedSignature('');
  };

  const handleTypedSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas || !typedSignature) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = `48px ${signatureFont}`;
    ctx.fillStyle = '#000000';
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'center';
    ctx.fillText(typedSignature, canvas.width / 2, canvas.height / 2);
  };

  useEffect(() => {
    if (signatureMode === 'type' && typedSignature) {
      handleTypedSignature();
    }
  }, [typedSignature, signatureFont, signatureMode]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const scale = Math.min(canvas.width / img.width, canvas.height / img.height);
        const x = (canvas.width - img.width * scale) / 2;
        const y = (canvas.height - img.height * scale) / 2;

        ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const signatureData = canvas.toDataURL('image/png');
    onSave(signatureData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">Ajouter votre signature</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setSignatureMode('draw')}
              className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-lg font-semibold transition-colors ${
                signatureMode === 'draw'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Edit3 className="w-5 h-5" />
              <span>Dessiner</span>
            </button>
            <button
              onClick={() => setSignatureMode('type')}
              className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-lg font-semibold transition-colors ${
                signatureMode === 'type'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Type className="w-5 h-5" />
              <span>Taper</span>
            </button>
            <button
              onClick={() => setSignatureMode('upload')}
              className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-lg font-semibold transition-colors ${
                signatureMode === 'upload'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Upload className="w-5 h-5" />
              <span>Importer</span>
            </button>
          </div>

          {signatureMode === 'type' && (
            <div className="mb-4 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Votre nom complet
                </label>
                <input
                  type="text"
                  value={typedSignature}
                  onChange={(e) => setTypedSignature(e.target.value)}
                  placeholder="Jean Dupont"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Style de signature
                </label>
                <select
                  value={signatureFont}
                  onChange={(e) => setSignatureFont(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="Brush Script MT">Manuscrit élégant</option>
                  <option value="cursive">Cursif</option>
                  <option value="Dancing Script">Calligraphie</option>
                  <option value="Great Vibes">Élégant</option>
                </select>
              </div>
            </div>
          )}

          {signatureMode === 'upload' && (
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Importer une image de votre signature
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="text-sm text-gray-500 mt-2">
                Formats acceptés: JPG, PNG, GIF (max 5MB)
              </p>
            </div>
          )}

          <div className="border-2 border-gray-300 rounded-lg bg-white mb-4">
            <canvas
              ref={canvasRef}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={stopDrawing}
              className="w-full h-64 cursor-crosshair touch-none"
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={clearCanvas}
              className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors flex items-center justify-center space-x-2"
            >
              <Eraser className="w-5 h-5" />
              <span>Effacer</span>
            </button>
            <button
              onClick={handleSave}
              className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
            >
              <Check className="w-5 h-5" />
              <span>Valider la signature</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
