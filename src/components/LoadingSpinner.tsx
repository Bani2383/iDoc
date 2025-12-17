import { memo } from 'react';

interface LoadingSpinnerProps {
  text?: string;
}

export const LoadingSpinner = memo(function LoadingSpinner({ text = 'Chargement...' }: LoadingSpinnerProps) {
  return (
    <div
      className="min-h-screen bg-white flex items-center justify-center"
      role="status"
      aria-live="polite"
      aria-label={text}
    >
      <div className="text-center">
        <div
          className="inline-block w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"
          aria-hidden="true"
        />
        <p className="text-gray-600">{text}</p>
      </div>
    </div>
  );
});
