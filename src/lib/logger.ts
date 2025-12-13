/**
 * Logger utility for production-safe logging
 * Only logs in development mode to avoid exposing sensitive data in production
 */

type LogLevel = 'log' | 'info' | 'warn' | 'error' | 'debug';

class Logger {
  private isDevelopment: boolean;

  constructor() {
    this.isDevelopment = import.meta.env.DEV;
  }

  /**
   * Log general information (only in development)
   */
  log(...args: any[]): void {
    if (this.isDevelopment) {
      console.log(...args);
    }
  }

  /**
   * Log informational messages (only in development)
   */
  info(...args: any[]): void {
    if (this.isDevelopment) {
      console.info(...args);
    }
  }

  /**
   * Log warnings (only in development)
   */
  warn(...args: any[]): void {
    if (this.isDevelopment) {
      console.warn(...args);
    }
  }

  /**
   * Log errors (always logged, but sanitized in production)
   */
  error(...args: any[]): void {
    if (this.isDevelopment) {
      console.error(...args);
    } else {
      console.error('An error occurred. Check monitoring for details.');
    }
  }

  /**
   * Log debug information (only in development)
   */
  debug(...args: any[]): void {
    if (this.isDevelopment) {
      console.debug(...args);
    }
  }

  /**
   * Log with a specific level
   */
  logWithLevel(level: LogLevel, ...args: any[]): void {
    switch (level) {
      case 'log':
        this.log(...args);
        break;
      case 'info':
        this.info(...args);
        break;
      case 'warn':
        this.warn(...args);
        break;
      case 'error':
        this.error(...args);
        break;
      case 'debug':
        this.debug(...args);
        break;
    }
  }
}

export const logger = new Logger();
export default logger;
