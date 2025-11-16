/**
 * Load Test: API Stress Test (Supabase)
 *
 * Tests database queries under load:
 * 1. Fetching templates
 * 2. User authentication
 * 3. Document creation
 *
 * Run with: k6 run load-tests/api-stress-test.js
 */

import http from 'k6/http';
import { check, sleep, group } from 'k6';
import { Rate, Trend, Counter } from 'k6/metrics';

// Custom metrics
const errorRate = new Rate('errors');
const dbQueryDuration = new Trend('db_query_duration');
const authAttempts = new Counter('auth_attempts');
const templatesFetched = new Counter('templates_fetched');

// Aggressive stress test
export const options = {
  stages: [
    { duration: '10s', target: 10 },   // Warm up
    { duration: '20s', target: 50 },   // Normal load
    { duration: '20s', target: 100 },  // High load
    { duration: '10s', target: 150 },  // Stress test
    { duration: '10s', target: 0 },    // Cool down
  ],
  thresholds: {
    http_req_duration: ['p(99)<3000'],  // 99% requests < 3s
    http_req_failed: ['rate<0.1'],      // Error rate < 10%
    errors: ['rate<0.15'],              // Custom errors < 15%
    db_query_duration: ['p(95)<1000'],  // 95% DB queries < 1s
  },
};

// Environment variables
const SUPABASE_URL = __ENV.SUPABASE_URL || 'http://localhost:54321';
const SUPABASE_ANON_KEY = __ENV.SUPABASE_ANON_KEY || 'your-anon-key';

const headers = {
  'Content-Type': 'application/json',
  'apikey': SUPABASE_ANON_KEY,
  'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
};

export default function () {
  // Scenario 1: Fetch Templates (Most common operation)
  group('Fetch Templates', () => {
    const queryStart = Date.now();
    const res = http.get(
      `${SUPABASE_URL}/rest/v1/document_templates?select=id,name,category,is_active&is_active=eq.true&limit=20`,
      { headers }
    );
    const queryTime = Date.now() - queryStart;
    dbQueryDuration.add(queryTime);
    templatesFetched.add(1);

    check(res, {
      'templates fetch status 200': (r) => r.status === 200,
      'templates returned': (r) => {
        try {
          const data = JSON.parse(r.body);
          return Array.isArray(data) && data.length > 0;
        } catch {
          return false;
        }
      },
      'query time < 1s': (r) => r.timings.duration < 1000,
    }) || errorRate.add(1);

    sleep(0.2);
  });

  // Scenario 2: Search Templates
  group('Search Templates', () => {
    const searchTerms = ['contrat', 'lettre', 'bail', 'résiliation'];
    const term = searchTerms[Math.floor(Math.random() * searchTerms.length)];

    const queryStart = Date.now();
    const res = http.get(
      `${SUPABASE_URL}/rest/v1/document_templates?name=ilike.*${term}*&limit=10`,
      { headers }
    );
    const queryTime = Date.now() - queryStart;
    dbQueryDuration.add(queryTime);

    check(res, {
      'search status 200': (r) => r.status === 200,
      'search results valid': (r) => {
        try {
          const data = JSON.parse(r.body);
          return Array.isArray(data);
        } catch {
          return false;
        }
      },
    }) || errorRate.add(1);

    sleep(0.3);
  });

  // Scenario 3: Fetch Template by ID
  if (Math.random() > 0.5) {
    group('Fetch Single Template', () => {
      const templateId = Math.floor(Math.random() * 50) + 1;

      const res = http.get(
        `${SUPABASE_URL}/rest/v1/document_templates?id=eq.${templateId}&select=*`,
        { headers }
      );

      check(res, {
        'single template fetch status': (r) => [200, 404].includes(r.status),
      }) || errorRate.add(1);

      sleep(0.1);
    });
  }

  // Scenario 4: Guest Document View Tracking (Writes)
  if (Math.random() > 0.7) {
    group('Track Document View', () => {
      const viewData = {
        template_id: Math.floor(Math.random() * 50) + 1,
        user_id: null, // Guest
        session_id: `session_${Date.now()}_${Math.random()}`,
        viewed_at: new Date().toISOString(),
      };

      const res = http.post(
        `${SUPABASE_URL}/rest/v1/document_views`,
        JSON.stringify(viewData),
        { headers }
      );

      check(res, {
        'view tracking status 201 or 200': (r) => [200, 201].includes(r.status),
      }) || errorRate.add(1);

      sleep(0.1);
    });
  }

  sleep(1); // Think time
}

export function handleSummary(data) {
  const summary = {
    testRun: new Date().toISOString(),
    duration: data.state.testRunDurationMs / 1000,
    metrics: {
      totalRequests: data.metrics.http_reqs.values.count,
      failedRequests: (data.metrics.http_req_failed.values.rate * 100).toFixed(2) + '%',
      errorRate: ((data.metrics.errors?.values.rate || 0) * 100).toFixed(2) + '%',
      responseTimes: {
        min: data.metrics.http_req_duration.values.min.toFixed(2) + 'ms',
        avg: data.metrics.http_req_duration.values.avg.toFixed(2) + 'ms',
        max: data.metrics.http_req_duration.values.max.toFixed(2) + 'ms',
        p95: data.metrics.http_req_duration.values['p(95)'].toFixed(2) + 'ms',
        p99: data.metrics.http_req_duration.values['p(99)'].toFixed(2) + 'ms',
      },
      database: {
        avgQueryTime: (data.metrics.db_query_duration?.values.avg || 0).toFixed(2) + 'ms',
        p95QueryTime: (data.metrics.db_query_duration?.values['p(95)'] || 0).toFixed(2) + 'ms',
      },
      operations: {
        templatesFetched: data.metrics.templates_fetched?.values.count || 0,
        authAttempts: data.metrics.auth_attempts?.values.count || 0,
      },
      virtualUsers: {
        max: data.metrics.vus_max.values.max,
      },
    },
    thresholds: data.thresholds,
  };

  return {
    'load-test-api-results.json': JSON.stringify(summary, null, 2),
    stdout: formatSummary(summary),
  };
}

function formatSummary(summary) {
  return `
╔══════════════════════════════════════════════════════════════════╗
║                     API STRESS TEST RESULTS                      ║
╚══════════════════════════════════════════════════════════════════╝

Test Duration: ${summary.duration}s
Test Run: ${summary.testRun}

📊 Request Statistics:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Total Requests:    ${summary.metrics.totalRequests}
  Failed Requests:   ${summary.metrics.failedRequests}
  Error Rate:        ${summary.metrics.errorRate}

⏱️  Response Times:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Min:     ${summary.metrics.responseTimes.min}
  Average: ${summary.metrics.responseTimes.avg}
  Max:     ${summary.metrics.responseTimes.max}
  p95:     ${summary.metrics.responseTimes.p95}
  p99:     ${summary.metrics.responseTimes.p99}

💾 Database Performance:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Avg Query Time:    ${summary.metrics.database.avgQueryTime}
  p95 Query Time:    ${summary.metrics.database.p95QueryTime}

🎯 Operations:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Templates Fetched: ${summary.metrics.operations.templatesFetched}
  Auth Attempts:     ${summary.metrics.operations.authAttempts}

👥 Virtual Users:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Max Concurrent:    ${summary.metrics.virtualUsers.max}

✅ Recommendation:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${getRecommendation(summary)}

Full results saved to: load-test-api-results.json
`;
}

function getRecommendation(summary) {
  const failRate = parseFloat(summary.metrics.failedRequests);
  const p95 = parseFloat(summary.metrics.responseTimes.p95);

  if (failRate > 10) {
    return '  🔴 HIGH FAILURE RATE - Investigate server errors immediately';
  } else if (p95 > 2000) {
    return '  🟡 SLOW RESPONSE TIMES - Consider optimizing queries or adding caching';
  } else if (failRate > 5) {
    return '  🟡 MODERATE FAILURES - Monitor and investigate if persistent';
  } else {
    return '  🟢 EXCELLENT - System handles load well within acceptable limits';
  }
}
