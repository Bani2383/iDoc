import { createClient } from 'npm:@supabase/supabase-js@2.57.4';
import { getCorsHeaders } from '../_shared/cors.ts';

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const corsHeaders = getCorsHeaders();

interface TestProfile {
  name: string;
  data: Record<string, any>;
  description: string;
}

interface TestResult {
  profile: string;
  passed: boolean;
  errors: string[];
  warnings: string[];
  execution_time_ms: number;
  output_preview?: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseKey);
    const { template_id, profiles } = await req.json();

    if (!template_id) {
      return new Response(
        JSON.stringify({ error: 'template_id is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { data: template, error: templateError } = await supabase
      .from('idoc_guided_templates')
      .select('*')
      .eq('id', template_id)
      .single();

    if (templateError || !template) {
      return new Response(
        JSON.stringify({ error: 'Template not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const testProfiles: TestProfile[] = profiles || [
      {
        name: 'standard',
        description: 'Standard user with typical data',
        data: {
          full_name: 'John Doe',
          email: 'john.doe@example.com',
          phone: '+1-555-0100',
          address: '123 Main St, City, Country',
          date: new Date().toISOString().split('T')[0],
          amount: '1000',
          description: 'Standard test case'
        }
      },
      {
        name: 'edge_case',
        description: 'Edge case with special characters and long text',
        data: {
          full_name: 'François O\'Brien-Müller',
          email: 'test+special@example.co.uk',
          phone: '+33-1-23-45-67-89',
          address: '123 Rue de l\'Église, Montréal, Québec, Canada',
          date: '2024-12-31',
          amount: '999999.99',
          description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. '.repeat(10)
        }
      },
      {
        name: 'minimal',
        description: 'Minimal data - only required fields',
        data: {
          full_name: 'A',
          email: 'a@b.c',
          date: '2024-01-01'
        }
      }
    ];

    const results: TestResult[] = [];

    for (const profile of testProfiles) {
      const startTime = Date.now();
      const testResult: TestResult = {
        profile: profile.name,
        passed: true,
        errors: [],
        warnings: [],
        execution_time_ms: 0,
        output_preview: ''
      };

      try {
        const fields = template.fields || [];
        for (const field of fields) {
          if (field.required && !profile.data[field.id]) {
            testResult.errors.push(`Missing required field: ${field.label || field.id}`);
            testResult.passed = false;
          }

          const value = profile.data[field.id];
          if (value) {
            if (field.type === 'email' && !value.includes('@')) {
              testResult.errors.push(`Invalid email format for: ${field.id}`);
              testResult.passed = false;
            }
            if (field.type === 'number' && isNaN(Number(value))) {
              testResult.errors.push(`Invalid number format for: ${field.id}`);
              testResult.passed = false;
            }
            if (field.validation?.pattern) {
              const regex = new RegExp(field.validation.pattern);
              if (!regex.test(value)) {
                testResult.errors.push(`Pattern validation failed for: ${field.id}`);
                testResult.passed = false;
              }
            }
          }
        }

        let output = template.content_template || '';
        for (const [key, value] of Object.entries(profile.data)) {
          const placeholder = `{{${key}}}`;
          if (output.includes(placeholder)) {
            output = output.replace(new RegExp(placeholder.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), String(value));
          }
        }

        const remainingPlaceholders = output.match(/{{[^}]+}}/g);
        if (remainingPlaceholders && remainingPlaceholders.length > 0) {
          testResult.warnings.push(`Unfilled placeholders: ${remainingPlaceholders.join(', ')}`);
        }

        if (output.length < 50) {
          testResult.warnings.push('Generated output seems too short');
        }
        if (output.includes('undefined') || output.includes('null')) {
          testResult.errors.push('Output contains undefined or null values');
          testResult.passed = false;
        }

        testResult.output_preview = output.substring(0, 500);

      } catch (error) {
        testResult.errors.push(`Test execution failed: ${error.message}`);
        testResult.passed = false;
      }

      testResult.execution_time_ms = Date.now() - startTime;
      results.push(testResult);
    }

    const allPassed = results.every(r => r.passed);
    const totalErrors = results.reduce((sum, r) => sum + r.errors.length, 0);
    const totalWarnings = results.reduce((sum, r) => sum + r.warnings.length, 0);

    const { error: insertError } = await supabase
      .from('shadow_test_results')
      .insert({
        template_id,
        test_profile: 'comprehensive',
        passed: allPassed,
        errors_count: totalErrors,
        warnings_count: totalWarnings,
        execution_time_ms: results.reduce((sum, r) => sum + r.execution_time_ms, 0),
        test_data: { profiles: testProfiles.map(p => ({ name: p.name, description: p.description })) },
        result_data: { results }
      });

    if (insertError) {
      console.error('Failed to save shadow test results:', insertError);
    }

    await supabase
      .from('idoc_guided_templates')
      .update({ shadow_tested_at: new Date().toISOString() })
      .eq('id', template_id);

    return new Response(
      JSON.stringify({
        template_id,
        overall_passed: allPassed,
        total_errors: totalErrors,
        total_warnings: totalWarnings,
        profiles_tested: results.length,
        results
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Shadow test error:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});