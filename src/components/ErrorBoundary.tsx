/**
 * Error Boundary Component
 *
 * @description Catches React errors and displays fallback UI
 * @component
 */

import { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface ErrorBoundaryProps {
  /** Child components */
  children: ReactNode;
  /** Optional fallback component */
  fallback?: ReactNode;
  /** Optional error handler callback */
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * Error Boundary to catch and handle React errors gracefully
 *
 * @class ErrorBoundary
 * @extends {Component<ErrorBoundaryProps, ErrorBoundaryState>}
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  /**
   * Update state when error is caught
   */
  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
    };
  }

  /**
   * Log error details
   */
  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('ErrorBoundary caught an error:', error, errorInfo);

    // Send error to monitoring service
    if (import.meta.env.PROD) {
      this.logErrorToService(error, errorInfo);
    }

    // Call optional error handler
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  /**
   * Log error to monitoring service
   */
  private logErrorToService(error: Error, errorInfo: ErrorInfo): void {
    // In production, send to error tracking service
    // Example: Sentry, LogRocket, Datadog, etc.
    const errorData = {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
      url: window.location.href,
      userAgent: navigator.userAgent,
    };

    // Send to analytics endpoint
    if (navigator.sendBeacon) {
      navigator.sendBeacon('/api/errors', JSON.stringify(errorData));
    }
  }

  /**
   * Reset error state
   */
  resetError = (): void => {
    this.setState({
      hasError: false,
      error: null,
    });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <div
          className="min-h-screen flex items-center justify-center bg-gray-50 px-4"
          role="alert"
          aria-live="assertive"
        >
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <AlertCircle className="w-8 h-8 text-red-600" aria-hidden="true" />
            </div>

            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Oops! Une erreur est survenue
            </h1>

            <p className="text-gray-600 mb-6">
              {this.state.error?.message ||
                "Quelque chose s'est mal passé. Veuillez réessayer."}
            </p>

            {import.meta.env.DEV && this.state.error && (
              <details className="mb-6 text-left">
                <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
                  Détails techniques
                </summary>
                <pre className="mt-2 p-4 bg-gray-100 rounded text-xs overflow-auto max-h-40">
                  {this.state.error.stack}
                </pre>
              </details>
            )}

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={this.resetError}
                className="flex items-center justify-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                aria-label="Réessayer"
              >
                <RefreshCw className="w-4 h-4" aria-hidden="true" />
                <span>Réessayer</span>
              </button>

              <button
                onClick={() => window.location.href = '/'}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                aria-label="Retour à l'accueil"
              >
                Retour à l'accueil
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * HOC to wrap component with ErrorBoundary
 *
 * @param {Component} Component - Component to wrap
 * @param {ReactNode} fallback - Optional fallback UI
 * @returns {Component} Wrapped component
 */
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  fallback?: ReactNode
) {
  return function WithErrorBoundaryWrapper(props: P) {
    return (
      <ErrorBoundary fallback={fallback}>
        <Component {...props} />
      </ErrorBoundary>
    );
  };
}
