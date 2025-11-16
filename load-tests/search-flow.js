/**
 * Load Test: Search and Template Selection Flow
 *
 * Simulates 50-100 concurrent users:
 * 1. Loading homepage
 * 2. Searching for templates
 * 3. Selecting a template
 * 4. Viewing SmartFill
 *
 * Run with: k6 run load-tests/search-flow.js
 */

import http from 'k6/http';
import { check, sleep, group } from 'k6';
import { Rate, Trend } from 'k6/metrics';

// Custom metrics
const errorRate = new Rate('errors');
const searchDuration = new Trend('search_duration');
const templateLoadDuration = new Trend('template_load_duration');

// Test configuration
export const options = {
  stages: [
    { duration: '30s', target: 20 },  // Ramp up to 20 users
    { duration: '1m', target: 50 },   // Stay at 50 users
    { duration: '1m', target: 100 },  // Ramp up to 100 users
    { duration: '30s', target: 0 },   // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<2000'], // 95% requests < 2s
    http_req_failed: ['rate<0.05'],    // Error rate < 5%
    errors: ['rate<0.1'],              // Custom error rate < 10%
  },
};

// Base URL (update for your environment)
const BASE_URL = __ENV.BASE_URL || 'http://localhost:5173';

export default function () {
  // User journey: Browse → Search → Select Template

  group('Homepage Load', () => {
    const res = http.get(BASE_URL);

    check(res, {
      'homepage status 200': (r) => r.status === 200,
      'homepage load time < 2s': (r) => r.timings.duration < 2000,
      'homepage contains iDoc': (r) => r.body.includes('iDoc'),
    }) || errorRate.add(1);

    sleep(1); // Think time
  });

  group('Search Templates', () => {
    const searchQueries = ['Contrat', 'Lettre', 'Bail', 'Résiliation', 'Location'];
    const query = searchQueries[Math.floor(Math.random() * searchQueries.length)];

    // Simulate API call to search templates
    const searchStart = Date.now();
    const res = http.get(`${BASE_URL}/api/templates?search=${query}`, {
      headers: { 'Content-Type': 'application/json' },
    });
    const searchTime = Date.now() - searchStart;
    searchDuration.add(searchTime);

    check(res, {
      'search status 200 or 404': (r) => [200, 404].includes(r.status),
      'search response time < 500ms': (r) => r.timings.duration < 500,
    }) || errorRate.add(1);

    sleep(0.5);
  });

  group('View Template', () => {
    // Simulate selecting a template
    const templateId = Math.floor(Math.random() * 50) + 1;

    const templateStart = Date.now();
    const res = http.get(`${BASE_URL}/#/template/${templateId}`);
    const templateTime = Date.now() - templateStart;
    templateLoadDuration.add(templateTime);

    check(res, {
      'template load status 200': (r) => r.status === 200,
      'template load time < 1.5s': (r) => r.timings.duration < 1500,
    }) || errorRate.add(1);

    sleep(2); // User reads template details
  });

  group('SmartFill Interaction', () => {
    // Simulate filling out form fields
    const formData = {
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
      city: 'Montreal',
    };

    // In real app, this would be client-side only
    // Just simulate the time spent
    sleep(5); // User fills form for 5 seconds

    check(true, {
      'form interaction simulated': () => true,
    });
  });

  sleep(1); // Think time before next iteration
}

export function handleSummary(data) {
  return {
    'load-test-results.json': JSON.stringify(data, null, 2),
    stdout: textSummary(data, { indent: ' ', enableColors: true }),
  };
}

function textSummary(data, opts) {
  const indent = opts.indent || '';
  const colors = opts.enableColors !== false;

  let summary = `
${indent}Load Test Summary:
${indent}==================
${indent}
${indent}Total Requests: ${data.metrics.http_reqs.values.count}
${indent}Failed Requests: ${data.metrics.http_req_failed.values.rate * 100}%
${indent}
${indent}Response Times:
${indent}  Min: ${data.metrics.http_req_duration.values.min.toFixed(2)}ms
${indent}  Avg: ${data.metrics.http_req_duration.values.avg.toFixed(2)}ms
${indent}  Max: ${data.metrics.http_req_duration.values.max.toFixed(2)}ms
${indent}  p95: ${data.metrics.http_req_duration.values['p(95)'].toFixed(2)}ms
${indent}
${indent}Custom Metrics:
${indent}  Search Duration Avg: ${data.metrics.search_duration?.values.avg?.toFixed(2) || 'N/A'}ms
${indent}  Template Load Avg: ${data.metrics.template_load_duration?.values.avg?.toFixed(2) || 'N/A'}ms
${indent}  Error Rate: ${(data.metrics.errors?.values.rate * 100 || 0).toFixed(2)}%
${indent}
${indent}Virtual Users:
${indent}  Max: ${data.metrics.vus_max.values.max}
`;

  return summary;
}
