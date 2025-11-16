import { TrendingUp, Eye, Download } from 'lucide-react';
import { useEffect, useState } from 'react';

interface DocumentFOMOBadgeProps {
  templateId: string;
  variant?: 'compact' | 'full';
}

export function DocumentFOMOBadge({ templateId, variant = 'compact' }: DocumentFOMOBadgeProps) {
  const [stats, setStats] = useState({
    weeklyDownloads: 0,
    viewsToday: 0,
    trending: false,
  });

  useEffect(() => {
    generateStats();
  }, [templateId]);

  const generateStats = () => {
    const hash = templateId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const weeklyDownloads = 25 + (hash % 175);
    const viewsToday = 50 + (hash % 250);
    const trending = weeklyDownloads > 100;

    setStats({
      weeklyDownloads,
      viewsToday,
      trending,
    });
  };

  if (variant === 'compact') {
    return (
      <div className="flex items-center gap-2 text-xs">
        {stats.trending && (
          <span className="inline-flex items-center gap-1 bg-orange-100 text-orange-700 px-2 py-1 rounded-full font-semibold">
            <TrendingUp className="w-3 h-3" />
            Populaire
          </span>
        )}
        <span className="inline-flex items-center gap-1 text-gray-600">
          <Download className="w-3 h-3" />
          {stats.weeklyDownloads} cette semaine
        </span>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-xl p-4">
      <div className="flex items-center gap-3 mb-3">
        <div className="bg-orange-500 w-2 h-2 rounded-full animate-pulse"></div>
        <span className="font-bold text-gray-900 text-sm">Activité en temps réel</span>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Eye className="w-4 h-4 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">{stats.viewsToday}</span>
          </div>
          <p className="text-xs text-gray-600">vues aujourd'hui</p>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-1">
            <Download className="w-4 h-4 text-green-600" />
            <span className="text-2xl font-bold text-gray-900">{stats.weeklyDownloads}</span>
          </div>
          <p className="text-xs text-gray-600">téléchargements (7j)</p>
        </div>
      </div>

      {stats.trending && (
        <div className="mt-3 pt-3 border-t border-orange-200">
          <div className="flex items-center gap-2 text-orange-700">
            <TrendingUp className="w-4 h-4" />
            <span className="text-xs font-semibold">
              Document très demandé cette semaine
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
