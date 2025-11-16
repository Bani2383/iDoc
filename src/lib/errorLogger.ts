/**
 * Error Logging Service
 *
 * Centralized error logging with analytics integration
 */

interface ErrorContext {
  userId?: string;
  component?: string;
  action?: string;
  metadata?: Record<string, unknown>;
}

interface ErrorLogEntry {
  message: string;
  stack?: string;
  timestamp: number;
  url: string;
  userAgent: string;
  context?: ErrorContext;
}

class ErrorLogger {
  private errors: ErrorLogEntry[] = [];
  private maxQueueSize = 20;
  private endpoint = '/api/errors';

  /**
   * Log an error
   */
  logError(error: Error, context?: ErrorContext): void {
    const errorEntry: ErrorLogEntry = {
      message: error.message,
      stack: error.stack,
      timestamp: Date.now(),
      url: window.location.href,
      userAgent: navigator.userAgent,
      context,
    };

    this.errors.push(errorEntry);

    // Log to console in development
    if (import.meta.env.DEV) {
      console.error('[ErrorLogger]', {
        message: error.message,
        context,
        stack: error.stack,
      });
    }

    // Send to analytics
    this.trackError(errorEntry);

    // Flush if queue is full
    if (this.errors.length >= this.maxQueueSize) {
      this.flush();
    }
  }

  /**
   * Log a custom error message
   */
  logMessage(message: string, level: 'error' | 'warning' | 'info' = 'error', context?: ErrorContext): void {
    const error = new Error(message);
    error.name = level.toUpperCase();
    this.logError(error, context);
  }

  /**
   * Track error in analytics
   */
  private trackError(errorEntry: ErrorLogEntry): void {
    const win = window as { gtag?: (...args: unknown[]) => void };
    if (win.gtag) {
      win.gtag('event', 'exception', {
        description: errorEntry.message,
        fatal: false,
        ...errorEntry.context,
      });
    }
  }

  /**
   * Flush errors to server
   */
  async flush(): Promise<void> {
    if (this.errors.length === 0) return;

    const errorsToSend = [...this.errors];
    this.errors = [];

    try {
      if (navigator.sendBeacon) {
        navigator.sendBeacon(this.endpoint, JSON.stringify(errorsToSend));
      } else {
        await fetch(this.endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(errorsToSend),
          keepalive: true,
        });
      }
    } catch (sendError) {
      // Failed to send errors - log to console in dev
      if (import.meta.env.DEV) {
        console.error('[ErrorLogger] Failed to send errors:', sendError);
      }
    }
  }

  /**
   * Get recent errors (for debugging)
   */
  getRecentErrors(): ErrorLogEntry[] {
    return [...this.errors];
  }

  /**
   * Clear error queue
   */
  clear(): void {
    this.errors = [];
  }
}

// Export singleton
export const errorLogger = new ErrorLogger();

// Auto-flush on page unload
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    errorLogger.flush();
  });

  // Global error handler
  window.addEventListener('error', (event) => {
    errorLogger.logError(event.error || new Error(event.message), {
      component: 'global',
      action: 'uncaught_error',
    });
  });

  // Unhandled promise rejection handler
  window.addEventListener('unhandledrejection', (event) => {
    errorLogger.logError(
      event.reason instanceof Error ? event.reason : new Error(String(event.reason)),
      {
        component: 'global',
        action: 'unhandled_rejection',
      }
    );
  });
}

// Helper function for error boundaries
export function logComponentError(error: Error, componentName: string, errorInfo?: { componentStack?: string }): void {
  errorLogger.logError(error, {
    component: componentName,
    action: 'component_error',
    metadata: errorInfo ? { componentStack: errorInfo.componentStack } : undefined,
  });
}
