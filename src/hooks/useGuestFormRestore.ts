/**
 * useGuestFormRestore Hook
 *
 * @description Manages restoration of guest form data after login
 */

import { useEffect, useState } from 'react';

interface SavedFormData {
  formData: Record<string, string>;
  currentStep: number;
  templateId: string;
  timestamp: string;
}

export function useGuestFormRestore() {
  const [savedData, setSavedData] = useState<SavedFormData | null>(null);

  useEffect(() => {
    const keys = Object.keys(localStorage);
    const guestDocKeys = keys.filter(key => key.startsWith('guest_doc_'));

    if (guestDocKeys.length > 0) {
      const latestKey = guestDocKeys.sort((a, b) => {
        const dataA = JSON.parse(localStorage.getItem(a) || '{}');
        const dataB = JSON.parse(localStorage.getItem(b) || '{}');
        return new Date(dataB.timestamp).getTime() - new Date(dataA.timestamp).getTime();
      })[0];

      const data = localStorage.getItem(latestKey);
      if (data) {
        try {
          const parsed = JSON.parse(data);
          setSavedData(parsed);
        } catch (e) {
          console.error('Error parsing saved form data:', e);
        }
      }
    }
  }, []);

  const clearSavedData = (templateId?: string) => {
    if (templateId) {
      localStorage.removeItem(`guest_doc_${templateId}`);
    } else {
      const keys = Object.keys(localStorage);
      keys.filter(key => key.startsWith('guest_doc_')).forEach(key => {
        localStorage.removeItem(key);
      });
    }
    setSavedData(null);
  };

  return { savedData, clearSavedData };
}
