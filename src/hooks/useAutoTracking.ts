import { useEffect } from 'react';
import { useTrafficTracker } from './useTrafficTracker';

export function useAutoTracking() {
  const { trackConversion, trackEvent } = useTrafficTracker({
    enableTracking: true,
    trackClicks: true,
    trackScrollDepth: true,
    trackTimeOnPage: true
  });

  useEffect(() => {
    const handleFormSubmit = (e: Event) => {
      const form = e.target as HTMLFormElement;
      const formName = form.getAttribute('name') || 'unknown';
      trackEvent('form_submit', { form_name: formName });
    };

    const handleButtonClick = (e: MouseEvent) => {
      const button = (e.target as HTMLElement).closest('button');
      if (button) {
        const buttonText = button.textContent?.trim() || '';
        const isPrimaryAction = button.classList.contains('primary') ||
                               button.textContent?.toLowerCase().includes('acheter') ||
                               button.textContent?.toLowerCase().includes('commencer');

        if (isPrimaryAction) {
          trackEvent('cta_click', { button_text: buttonText });
        }
      }
    };

    const handleVideoPlay = () => {
      trackEvent('video_play');
    };

    const handleVideoComplete = () => {
      trackEvent('video_complete');
      trackConversion('video_watched', 0);
    };

    document.addEventListener('submit', handleFormSubmit);
    document.addEventListener('click', handleButtonClick);

    const videos = document.querySelectorAll('video');
    videos.forEach(video => {
      video.addEventListener('play', handleVideoPlay);
      video.addEventListener('ended', handleVideoComplete);
    });

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const element = entry.target;
          const elementId = element.id || element.className;
          trackEvent('element_view', { element: elementId });
        }
      });
    }, { threshold: 0.5 });

    const importantElements = document.querySelectorAll('[data-track="true"]');
    importantElements.forEach(el => observer.observe(el));

    return () => {
      document.removeEventListener('submit', handleFormSubmit);
      document.removeEventListener('click', handleButtonClick);
      videos.forEach(video => {
        video.removeEventListener('play', handleVideoPlay);
        video.removeEventListener('ended', handleVideoComplete);
      });
      observer.disconnect();
    };
  }, [trackEvent, trackConversion]);

  return { trackConversion, trackEvent };
}
