import React, { useState, useEffect, useRef } from 'react';
import { FileText, ChevronLeft, ChevronRight } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Template {
  id: string;
  name: string;
  category: string;
  description?: string;
}

interface TemplateCarouselProps {
  onSelectTemplate?: (template: Template) => void;
}

const TemplateCarousel: React.FC<TemplateCarouselProps> = ({ onSelectTemplate }) => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadTemplates();
  }, []);

  useEffect(() => {
    if (templates.length === 0 || isPaused) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % templates.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [templates.length, isPaused]);

  const loadTemplates = async () => {
    try {
      const { data, error } = await supabase
        .from('document_templates')
        .select('id, name, category, description')
        .eq('is_active', true)
        .order('name');

      if (error) throw error;

      setTemplates(data || []);
    } catch (err) {
      console.error('Error loading templates:', err);
    }
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + templates.length) % templates.length);
    setIsPaused(true);
    setTimeout(() => setIsPaused(false), 5000);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % templates.length);
    setIsPaused(true);
    setTimeout(() => setIsPaused(false), 5000);
  };

  const getVisibleTemplates = () => {
    if (templates.length === 0) return [];

    const visible = [];
    for (let i = -2; i <= 2; i++) {
      const index = (currentIndex + i + templates.length) % templates.length;
      visible.push({ ...templates[index], offset: i });
    }
    return visible;
  };

  if (templates.length === 0) {
    return null;
  }

  return (
    <section className="bg-gradient-to-br from-slate-50 to-blue-50 py-16 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            Parcourez nos modèles populaires
          </h2>
          <p className="text-gray-600">
            {templates.length} modèles professionnels à votre disposition
          </p>
        </div>

        <div className="relative">
          <div
            ref={carouselRef}
            className="flex items-center justify-center h-80 perspective-1000"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            {getVisibleTemplates().map((item, idx) => {
              const offset = item.offset || 0;
              const isCenter = offset === 0;
              const scale = isCenter ? 1 : 0.7 - Math.abs(offset) * 0.15;
              const translateX = offset * 350;
              const translateZ = isCenter ? 0 : -Math.abs(offset) * 100;
              const opacity = isCenter ? 1 : 0.4 - Math.abs(offset) * 0.1;
              const zIndex = 10 - Math.abs(offset);

              return (
                <div
                  key={`${item.id}-${idx}`}
                  className="absolute transition-all duration-500 ease-out"
                  style={{
                    transform: `translateX(${translateX}px) translateZ(${translateZ}px) scale(${scale})`,
                    opacity,
                    zIndex,
                  }}
                >
                  <div
                    className={`bg-white rounded-2xl shadow-xl p-8 w-80 h-64 flex flex-col justify-between cursor-pointer transform transition-all ${
                      isCenter ? 'hover:shadow-2xl hover:scale-105' : ''
                    }`}
                    onClick={() => isCenter && onSelectTemplate?.(item)}
                  >
                    <div>
                      <div className="flex items-start justify-between mb-4">
                        <div className="bg-blue-100 p-3 rounded-lg">
                          <FileText className="w-8 h-8 text-blue-600" />
                        </div>
                        <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                          {item.category}
                        </span>
                      </div>

                      <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                        {item.name}
                      </h3>

                      {item.description && (
                        <p className="text-sm text-gray-600 line-clamp-3">
                          {item.description}
                        </p>
                      )}
                    </div>

                    {isCenter && (
                      <button className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all">
                        Utiliser ce modèle
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <button
            onClick={goToPrevious}
            className="absolute left-0 top-1/2 -translate-y-1/2 bg-white p-4 rounded-full shadow-lg hover:shadow-xl hover:scale-110 transition-all z-20"
            aria-label="Template précédent"
          >
            <ChevronLeft className="w-6 h-6 text-gray-700" />
          </button>

          <button
            onClick={goToNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 bg-white p-4 rounded-full shadow-lg hover:shadow-xl hover:scale-110 transition-all z-20"
            aria-label="Template suivant"
          >
            <ChevronRight className="w-6 h-6 text-gray-700" />
          </button>
        </div>

        <div className="flex justify-center mt-8 space-x-2">
          {templates.slice(0, Math.min(20, templates.length)).map((_, idx) => (
            <button
              key={idx}
              onClick={() => {
                setCurrentIndex(idx);
                setIsPaused(true);
                setTimeout(() => setIsPaused(false), 5000);
              }}
              className={`h-2 rounded-full transition-all ${
                idx === currentIndex % 20
                  ? 'w-8 bg-blue-600'
                  : 'w-2 bg-gray-300 hover:bg-gray-400'
              }`}
              aria-label={`Aller au template ${idx + 1}`}
            />
          ))}
        </div>

        <div className="text-center mt-8">
          <p className="text-sm text-gray-500">
            {isPaused ? '⏸️ Pause' : '▶️ Lecture automatique'} • {currentIndex + 1} / {templates.length}
          </p>
        </div>
      </div>

      <style>{`
        .perspective-1000 {
          perspective: 1000px;
        }

        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </section>
  );
};

export default TemplateCarousel;
