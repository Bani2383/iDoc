/**
 * LoadingSpinner Component
 *
 * @description Displays a centered loading spinner with optional text
 * @component
 */

interface LoadingSpinnerProps {
  /** The text to display below the spinner */
  text?: string;
}

/**
 * A reusable loading spinner component with animation
 *
 * @param {LoadingSpinnerProps} props - Component props
 * @returns {JSX.Element} Loading spinner UI
 */
export function LoadingSpinner({ text = 'Chargement...' }: LoadingSpinnerProps) {
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
}
