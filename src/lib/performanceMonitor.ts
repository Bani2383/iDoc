/**
 * Performance Monitoring System
 *
 * @description Monitors and logs application performance metrics
 * @module performanceMonitor
 */

interface PerformanceMetric {
  name: string;
  value: number;
  timestamp: number;
  url: string;
}

class PerformanceMonitor {
  private metrics: PerformanceMetric[] = [];
  private readonly maxMetrics = 100;

  /**
   * Initialize performance monitoring
   */
  init() {
    if (typeof window === 'undefined') return;

    // Monitor Core Web Vitals
    this.monitorWebVitals();

    // Monitor page load
    this.monitorPageLoad();

    // Monitor navigation timing
    this.monitorNavigationTiming();
  }

  /**
   * Monitor Core Web Vitals (LCP, FID, CLS)
   */
  private monitorWebVitals() {
    // Largest Contentful Paint (LCP)
    const lcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      this.recordMetric('LCP', lastEntry.startTime);
    });
    lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

    // First Input Delay (FID)
    const fidObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry: PerformanceEntry) => {
        const fidEntry = entry as PerformanceEventTiming;
        if (fidEntry.processingStart) {
          this.recordMetric('FID', fidEntry.processingStart - entry.startTime);
        }
      });
    });
    fidObserver.observe({ entryTypes: ['first-input'] });

    // Cumulative Layout Shift (CLS)
    let clsScore = 0;
    const clsObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry: PerformanceEntry) => {
        const layoutShiftEntry = entry as LayoutShift;
        if (!layoutShiftEntry.hadRecentInput) {
          clsScore += layoutShiftEntry.value;
        }
      });
      this.recordMetric('CLS', clsScore);
    });
    clsObserver.observe({ entryTypes: ['layout-shift'] });
  }

  /**
   * Monitor page load performance
   */
  private monitorPageLoad() {
    window.addEventListener('load', () => {
      setTimeout(() => {
        const perfData = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        if (perfData) {
          this.recordMetric('DOMContentLoaded', perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart);
          this.recordMetric('LoadTime', perfData.loadEventEnd - perfData.fetchStart);
          this.recordMetric('TTFB', perfData.responseStart - perfData.requestStart);
        }
      }, 0);
    });
  }

  /**
   * Monitor navigation timing
   */
  private monitorNavigationTiming() {
    if (performance.timing) {
      const timing = performance.timing;
      const pageLoadTime = timing.loadEventEnd - timing.navigationStart;
      this.recordMetric('PageLoadTime', pageLoadTime);
    }
  }

  /**
   * Record a performance metric
   * @param {string} name - Metric name
   * @param {number} value - Metric value
   */
  recordMetric(name: string, value: number) {
    const metric: PerformanceMetric = {
      name,
      value: Math.round(value),
      timestamp: Date.now(),
      url: window.location.pathname,
    };

    this.metrics.push(metric);

    // Keep only last maxMetrics
    if (this.metrics.length > this.maxMetrics) {
      this.metrics.shift();
    }

    // Log to console in development
    if (import.meta.env.DEV) {
      console.log(`[Performance] ${name}: ${metric.value}ms`);
    }

    // Send to analytics in production
    if (import.meta.env.PROD) {
      this.sendToAnalytics(metric);
    }
  }

  /**
   * Send metrics to analytics service
   * @param {PerformanceMetric} metric - Performance metric to send
   */
  private sendToAnalytics(metric: PerformanceMetric) {
    // In a real application, send to your analytics service
    // Example: Google Analytics, Datadog, New Relic, etc.
    // navigator.sendBeacon('/api/analytics', JSON.stringify(metric));
  }

  /**
   * Get all recorded metrics
   * @returns {PerformanceMetric[]} Array of metrics
   */
  getMetrics(): PerformanceMetric[] {
    return [...this.metrics];
  }

  /**
   * Get average value for a specific metric
   * @param {string} name - Metric name
   * @returns {number} Average value
   */
  getAverageMetric(name: string): number {
    const filtered = this.metrics.filter(m => m.name === name);
    if (filtered.length === 0) return 0;
    const sum = filtered.reduce((acc, m) => acc + m.value, 0);
    return Math.round(sum / filtered.length);
  }

  /**
   * Clear all metrics
   */
  clearMetrics() {
    this.metrics = [];
  }
}

// Export singleton instance
export const performanceMonitor = new PerformanceMonitor();

// Auto-initialize
if (typeof window !== 'undefined') {
  performanceMonitor.init();
}
