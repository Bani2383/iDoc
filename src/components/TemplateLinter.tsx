import React, { useState } from 'react';
import { AlertCircle, CheckCircle, Code, Search, AlertTriangle, Play } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface LintResult {
  ok: boolean;
  varsUsed: string[];
  unknownVars: string[];
  hasPlaceholders: boolean;
  sections?: {
    sectionCode: string;
    varsUsed: string[];
    unknownVars: string[];
  }[];
  metadata?: {
    requiredVariables: string[];
    optionalVariables: string[];
  };
}

interface TemplateLinterProps {
  templateId: string;
  templateContent: string;
  schemaFields: any[];
}

export const TemplateLinter: React.FC<TemplateLinterProps> = ({
  templateId,
  templateContent,
  schemaFields
}) => {
  const [lintResult, setLintResult] = useState<LintResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [testInputs, setTestInputs] = useState<Record<string, string>>({});

  React.useEffect(() => {
    const initialInputs: Record<string, string> = {};
    schemaFields.forEach((field: any) => {
      initialInputs[field.name] = field.placeholder || '';
    });
    setTestInputs(initialInputs);
  }, [schemaFields]);

  const handleLint = async () => {
    setLoading(true);
    setError('');
    setLintResult(null);

    try {
      const result = lintTemplate(templateContent, testInputs);
      setLintResult(result);

      if (!result.ok) {
        setError(`Found ${result.unknownVars.length} unknown variables`);
      }
    } catch (err: any) {
      setError(err.message || 'Lint failed');
    } finally {
      setLoading(false);
    }
  };

  const lintTemplate = (content: string, inputs: Record<string, string>): LintResult => {
    const varsUsed: string[] = [];
    const unknownVars: string[] = [];
    let hasPlaceholders = false;

    const placeholderRegex = /\[TODO\]|\[FIXME\]|\[XXX\]|TODO:|FIXME:/gi;
    if (placeholderRegex.test(content)) {
      hasPlaceholders = true;
    }

    const varRegex = /\{\{([^}]+)\}\}/g;
    let match;

    while ((match = varRegex.exec(content)) !== null) {
      const varName = match[1].trim();

      if (varName.startsWith('#') || varName.startsWith('/')) continue;
      if (varName === 'this') continue;

      const helperMatch = varName.match(/^(\w+)\s+(.+)/);
      if (helperMatch) {
        const helper = helperMatch[1];
        const knownHelpers = ['if', 'unless', 'each', 'with', 'eq', 'ne', 'lt', 'gt', 'and', 'or', 'not', 'boolFR'];
        if (knownHelpers.includes(helper)) continue;
      }

      if (!varsUsed.includes(varName)) {
        varsUsed.push(varName);
      }

      const fieldNames = schemaFields.map(f => f.name);
      if (!fieldNames.includes(varName) && !inputs[varName]) {
        if (!unknownVars.includes(varName)) {
          unknownVars.push(varName);
        }
      }
    }

    return {
      ok: unknownVars.length === 0 && !hasPlaceholders,
      varsUsed,
      unknownVars,
      hasPlaceholders,
      metadata: {
        requiredVariables: schemaFields.filter(f => f.required).map(f => f.name),
        optionalVariables: schemaFields.filter(f => !f.required).map(f => f.name),
      }
    };
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center gap-3 mb-6">
        <Code className="w-6 h-6 text-blue-600" />
        <div>
          <h2 className="text-xl font-bold text-gray-900">Template Linter</h2>
          <p className="text-sm text-gray-600">Validate template variables and structure</p>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Test Inputs (for validation)
          </label>
          <div className="space-y-2 max-h-64 overflow-y-auto border rounded-lg p-4">
            {schemaFields.map((field: any) => (
              <div key={field.name} className="flex items-center gap-3">
                <label className="text-sm font-medium text-gray-700 w-32">
                  {field.label}:
                </label>
                <input
                  type="text"
                  value={testInputs[field.name] || ''}
                  onChange={(e) => setTestInputs({ ...testInputs, [field.name]: e.target.value })}
                  className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder={field.placeholder}
                />
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={handleLint}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Linting...
            </>
          ) : (
            <>
              <Search className="w-5 h-5" />
              Run Lint Check
            </>
          )}
        </button>

        {lintResult && (
          <div className="mt-6 space-y-4 border-t pt-6">
            <div className={`p-4 rounded-lg ${
              lintResult.ok ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
            }`}>
              <div className="flex items-center gap-2 mb-2">
                {lintResult.ok ? (
                  <>
                    <CheckCircle className="w-6 h-6 text-green-600" />
                    <span className="font-semibold text-green-900">Template Valid</span>
                  </>
                ) : (
                  <>
                    <AlertTriangle className="w-6 h-6 text-red-600" />
                    <span className="font-semibold text-red-900">Issues Found</span>
                  </>
                )}
              </div>
              <p className="text-sm text-gray-700">
                {lintResult.ok
                  ? 'All variables are properly defined and no placeholders detected.'
                  : 'Please fix the issues below before approval.'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 rounded-lg p-4">
                <p className="text-sm text-blue-700 font-medium mb-1">Variables Used</p>
                <p className="text-2xl font-bold text-blue-900">{lintResult.varsUsed.length}</p>
                {lintResult.varsUsed.length > 0 && (
                  <div className="mt-2 space-y-1">
                    {lintResult.varsUsed.slice(0, 5).map(v => (
                      <p key={v} className="text-xs text-blue-700 font-mono">{v}</p>
                    ))}
                    {lintResult.varsUsed.length > 5 && (
                      <p className="text-xs text-blue-600">+{lintResult.varsUsed.length - 5} more...</p>
                    )}
                  </div>
                )}
              </div>

              <div className={`rounded-lg p-4 ${
                lintResult.unknownVars.length > 0 ? 'bg-red-50' : 'bg-green-50'
              }`}>
                <p className={`text-sm font-medium mb-1 ${
                  lintResult.unknownVars.length > 0 ? 'text-red-700' : 'text-green-700'
                }`}>
                  Unknown Variables
                </p>
                <p className={`text-2xl font-bold ${
                  lintResult.unknownVars.length > 0 ? 'text-red-900' : 'text-green-900'
                }`}>
                  {lintResult.unknownVars.length}
                </p>
                {lintResult.unknownVars.length > 0 && (
                  <div className="mt-2 space-y-1">
                    {lintResult.unknownVars.map(v => (
                      <p key={v} className="text-xs text-red-700 font-mono bg-red-100 px-2 py-1 rounded">
                        {v}
                      </p>
                    ))}
                  </div>
                )}
              </div>

              <div className={`rounded-lg p-4 ${
                lintResult.hasPlaceholders ? 'bg-orange-50' : 'bg-green-50'
              }`}>
                <p className={`text-sm font-medium mb-1 ${
                  lintResult.hasPlaceholders ? 'text-orange-700' : 'text-green-700'
                }`}>
                  Placeholders
                </p>
                <p className={`text-2xl font-bold ${
                  lintResult.hasPlaceholders ? 'text-orange-900' : 'text-green-900'
                }`}>
                  {lintResult.hasPlaceholders ? 'Found' : 'None'}
                </p>
                {lintResult.hasPlaceholders && (
                  <p className="text-xs text-orange-700 mt-2">
                    TODO/FIXME markers detected
                  </p>
                )}
              </div>
            </div>

            {lintResult.metadata && (
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3">Schema Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">
                      Required Fields ({lintResult.metadata.requiredVariables.length})
                    </p>
                    <div className="space-y-1">
                      {lintResult.metadata.requiredVariables.map(v => (
                        <p key={v} className="text-xs text-gray-600 font-mono bg-white px-2 py-1 rounded">
                          {v} *
                        </p>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">
                      Optional Fields ({lintResult.metadata.optionalVariables.length})
                    </p>
                    <div className="space-y-1">
                      {lintResult.metadata.optionalVariables.map(v => (
                        <p key={v} className="text-xs text-gray-600 font-mono bg-white px-2 py-1 rounded">
                          {v}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {!lintResult.ok && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h3 className="font-semibold text-yellow-900 mb-2 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5" />
                  Action Required
                </h3>
                <ul className="list-disc list-inside text-sm text-yellow-800 space-y-1">
                  {lintResult.unknownVars.length > 0 && (
                    <li>Add missing variables to schema or remove from template</li>
                  )}
                  {lintResult.hasPlaceholders && (
                    <li>Replace all TODO/FIXME placeholders with actual content</li>
                  )}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
