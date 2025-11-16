/**
 * Performance Monitor Tests
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { performanceMonitor } from '../performanceMonitor';

describe('PerformanceMonitor', () => {
  beforeEach(() => {
    performanceMonitor.clearMetrics();
  });

  it('records metrics correctly', () => {
    performanceMonitor.recordMetric('test-metric', 100);
    const metrics = performanceMonitor.getMetrics();

    expect(metrics).toHaveLength(1);
    expect(metrics[0].name).toBe('test-metric');
    expect(metrics[0].value).toBe(100);
  });

  it('calculates average metric', () => {
    performanceMonitor.recordMetric('LCP', 1000);
    performanceMonitor.recordMetric('LCP', 1500);
    performanceMonitor.recordMetric('LCP', 2000);

    const average = performanceMonitor.getAverageMetric('LCP');
    expect(average).toBe(1500);
  });

  it('limits stored metrics to maxMetrics', () => {
    for (let i = 0; i < 150; i++) {
      performanceMonitor.recordMetric('test', i);
    }

    const metrics = performanceMonitor.getMetrics();
    expect(metrics.length).toBeLessThanOrEqual(100);
  });

  it('returns 0 for non-existent metric average', () => {
    const average = performanceMonitor.getAverageMetric('non-existent');
    expect(average).toBe(0);
  });

  it('clears metrics correctly', () => {
    performanceMonitor.recordMetric('test', 100);
    expect(performanceMonitor.getMetrics()).toHaveLength(1);

    performanceMonitor.clearMetrics();
    expect(performanceMonitor.getMetrics()).toHaveLength(0);
  });

  it('includes correct metadata in metrics', () => {
    performanceMonitor.recordMetric('test', 123.456);
    const metrics = performanceMonitor.getMetrics();

    expect(metrics[0].value).toBe(123); // Rounded
    expect(metrics[0]).toHaveProperty('timestamp');
    expect(metrics[0]).toHaveProperty('url');
  });
});
