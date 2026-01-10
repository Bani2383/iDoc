/**
 * Business Preview System
 *
 * Generates realistic mock data for template previews
 * Ensures templates are tested with real-world scenarios before production
 */

export interface MockDataProfile {
  type: 'standard' | 'edge_case' | 'stress_test';
  name: string;
  description: string;
  data: Record<string, any>;
}

// Realistic mock names with accents and edge cases
const MOCK_NAMES = [
  'Jean Dupont',
  'Marie-Claire Lefèvre',
  'François O\'Brien',
  'Léa Saint-Martin',
  'José García-Rodríguez',
  'Amélie van den Berg',
  'محمد الأحمد', // Arabic
  '李明', // Chinese
  'Nguyễn Văn A', // Vietnamese
];

const MOCK_ADDRESSES = [
  '123 Rue de la Paix, 75001 Paris, France',
  '456 Boulevard Saint-Laurent, Montréal, QC H2X 2T3',
  '789 Main Street, Apartment 4B, Toronto, ON M5H 2N2',
  '12 Chemin des Érables, Québec, QC G1R 4P5',
];

const MOCK_EMAILS = [
  'jean.dupont@example.com',
  'marie-claire.lefevre@test.org',
  'francois.obrien+test@domain.ca',
  'contact@société-exemple.fr',
];

const MOCK_PHONE_NUMBERS = [
  '+1 (514) 555-0123',
  '+33 1 42 86 82 00',
  '1-800-555-1234',
  '514.555.9876',
];

const MOCK_DATES = [
  '2024-01-15',
  '15/01/2024',
  'January 15, 2024',
  '15 janvier 2024',
];

const MOCK_AMOUNTS = [
  '$1,234.56',
  '1 234,56 €',
  'CAD 5,678.90',
  '€12.345,67',
];

const MOCK_LONG_TEXT = `
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis
nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.

Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore
eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt
in culpa qui officia deserunt mollit anim id est laborum.

Section avec caractères spéciaux: é à ç ô ù € £ ¥ © ® ™ « » — …
`.trim();

const MOCK_COUNTRIES = [
  'Canada',
  'France',
  'États-Unis',
  'Royaume-Uni',
  'Allemagne',
];

const MOCK_PROVINCES = [
  'Québec',
  'Ontario',
  'Colombie-Britannique',
  'Alberta',
  'Île-du-Prince-Édouard',
];

/**
 * Generate standard realistic mock data
 */
export const generateStandardMockData = (): Record<string, any> => {
  return {
    // Personal information
    applicant_name: MOCK_NAMES[0],
    applicant_first_name: 'Jean',
    applicant_last_name: 'Dupont',
    full_name: 'Jean Dupont',
    name: 'Jean Dupont',

    // Contact
    email: MOCK_EMAILS[0],
    phone: MOCK_PHONE_NUMBERS[0],
    telephone: MOCK_PHONE_NUMBERS[0],

    // Address
    address: MOCK_ADDRESSES[0],
    street_address: '123 Rue de la Paix',
    city: 'Paris',
    province: 'Île-de-France',
    postal_code: '75001',
    country: 'France',

    // Dates
    date: new Date().toISOString().split('T')[0],
    today: new Date().toLocaleDateString('fr-FR'),
    current_date: new Date().toLocaleDateString('fr-FR'),
    submission_date: '15/01/2024',
    birth_date: '01/01/1990',
    start_date: '01/09/2024',
    end_date: '31/08/2025',

    // Document references
    application_number: 'APP-2024-001234',
    reference_number: 'REF-2024-5678',
    file_number: 'FILE-2024-9012',
    case_number: 'CASE-2024-3456',

    // Financial
    amount: '$1,234.56',
    total_amount: '$5,678.90',
    fee: '$150.00',
    tuition_fees: '$15,000.00 CAD',

    // Educational
    institution_name: 'Université de Montréal',
    program_name: 'Maîtrise en Informatique',
    program_level: 'Graduate',
    study_period: '2024-2025',

    // Immigration
    visa_type: 'Study Permit',
    permit_type: 'Student Visa',
    nationality: 'Française',
    passport_number: 'FR123456789',

    // Boolean values
    is_approved: true,
    has_dependents: false,
    requires_medical: true,

    // Long text fields
    description: MOCK_LONG_TEXT.split('\n')[0],
    explanation: 'Ceci est une explication détaillée avec des caractères accentués: é, à, ç, ô',
    reason: 'Demande de permis pour études supérieures',
    comments: 'Aucun commentaire additionnel',
    notes: 'Notes importantes pour le dossier',

    // Common fields
    officer_name: 'Agent Smith',
    officer_title: 'Immigration Officer',
    office_location: 'Ottawa, ON',
  };
};

/**
 * Generate edge case mock data (testing boundaries)
 */
export const generateEdgeCaseMockData = (): Record<string, any> => {
  return {
    // Names with special characters
    applicant_name: MOCK_NAMES[6], // Arabic name
    full_name: 'José García-Rodríguez',
    name: 'Nguyễn Văn A',

    // Long names
    applicant_first_name: 'Jean-François-Marie-Joseph',
    applicant_last_name: 'de la Fontaine-Saint-Martin',

    // Complex addresses
    address: '456 Boulevard Saint-Laurent, Appartement 1234-B, Montréal, QC H2X 2T3, Canada',
    street_address: '789 Chemin des Érables, Bureau 5000',

    // Edge case emails
    email: 'test+filtering@sub-domain.example-site.com',

    // Various phone formats
    phone: '+1 (514) 555-0123 ext. 456',

    // Empty/missing optional fields
    middle_name: '',
    secondary_phone: '',
    comments: '',

    // Very long text
    description: MOCK_LONG_TEXT,
    explanation: MOCK_LONG_TEXT + '\n\n' + MOCK_LONG_TEXT,

    // Edge case amounts
    amount: '$0.01',
    total_amount: '$999,999.99',

    // Edge case dates
    date: '2024-12-31',
    birth_date: '1900-01-01',

    // Special characters in text
    reason: 'Demande urgente: caractères spéciaux © ® ™ € £ ¥ — « » …',

    // Arrays/lists (if applicable)
    dependents: ['Child 1', 'Child 2', 'Child 3'],
    documents: ['Passport', 'Birth Certificate', 'Proof of Funds'],
  };
};

/**
 * Generate stress test mock data (maximum values)
 */
export const generateStressTestMockData = (): Record<string, any> => {
  const veryLongText = MOCK_LONG_TEXT.repeat(10);
  const veryLongName = 'Jean-François-Marie-Joseph-André-Pierre-Paul-Michel-Georges-Louis-Antoine';

  return {
    applicant_name: veryLongName,
    full_name: veryLongName + ' ' + veryLongName,

    address: '123456789 Boulevard Extrêmement Long avec Beaucoup de Caractères Spéciaux et Accents É À Ç Ô Ù, Appartement 9999-Z, Ville-Très-Longue-Nom, Province QC H0H 0H0',

    email: 'very-long-email-address-for-testing-purposes+with+many+characters@extremely-long-domain-name-for-stress-testing.example.com',

    description: veryLongText,
    explanation: veryLongText,
    reason: veryLongText,

    // Many items
    dependents: Array(50).fill(0).map((_, i) => `Dependent ${i + 1}`),
    documents: Array(100).fill(0).map((_, i) => `Document ${i + 1}`),

    // Extreme amounts
    amount: '$999,999,999.99',
    total_amount: '$1,234,567,890.00',
  };
};

/**
 * Get all mock data profiles
 */
export const getAllMockProfiles = (): MockDataProfile[] => {
  return [
    {
      type: 'standard',
      name: 'Cas Standard',
      description: 'Données réalistes typiques',
      data: generateStandardMockData(),
    },
    {
      type: 'edge_case',
      name: 'Cas Limites',
      description: 'Caractères spéciaux, noms complexes, valeurs extrêmes',
      data: generateEdgeCaseMockData(),
    },
    {
      type: 'stress_test',
      name: 'Test de Stress',
      description: 'Valeurs maximales, textes très longs',
      data: generateStressTestMockData(),
    },
  ];
};

/**
 * Get mock data by profile type
 */
export const getMockDataByType = (type: 'standard' | 'edge_case' | 'stress_test'): Record<string, any> => {
  switch (type) {
    case 'edge_case':
      return generateEdgeCaseMockData();
    case 'stress_test':
      return generateStressTestMockData();
    default:
      return generateStandardMockData();
  }
};

/**
 * Merge template variables with mock data
 * Only includes variables that the template actually uses
 */
export const getMockDataForTemplate = (
  template: any,
  profileType: 'standard' | 'edge_case' | 'stress_test' = 'standard'
): Record<string, any> => {
  const mockData = getMockDataByType(profileType);
  const result: Record<string, any> = {};

  // Extract required variables
  const requiredVars = template.required_variables?.fields || [];
  const optionalVars = template.optional_variables?.fields || [];

  const allVars = [
    ...requiredVars.map((f: any) => f.name || f),
    ...optionalVars.map((f: any) => f.name || f),
  ];

  // Only include variables that the template uses
  allVars.forEach((varName: string) => {
    if (mockData[varName] !== undefined) {
      result[varName] = mockData[varName];
    } else {
      // Generate fallback value based on variable name
      result[varName] = generateFallbackValue(varName);
    }
  });

  return result;
};

/**
 * Generate a fallback value for unknown variables
 */
const generateFallbackValue = (varName: string): any => {
  const lowerName = varName.toLowerCase();

  if (lowerName.includes('name')) return 'Jean Dupont';
  if (lowerName.includes('email')) return 'example@test.com';
  if (lowerName.includes('phone') || lowerName.includes('telephone')) return '+1 (514) 555-0123';
  if (lowerName.includes('address')) return '123 Rue Example';
  if (lowerName.includes('date')) return new Date().toLocaleDateString('fr-FR');
  if (lowerName.includes('amount') || lowerName.includes('price') || lowerName.includes('cost')) return '$100.00';
  if (lowerName.includes('number') || lowerName.includes('ref')) return 'REF-2024-001';
  if (lowerName.includes('description') || lowerName.includes('reason')) return 'Description exemple';
  if (lowerName.startsWith('is_') || lowerName.startsWith('has_')) return true;

  return `[${varName}]`;
};

/**
 * Render template with mock data (simple string replacement)
 */
export const renderPreviewWithMockData = (
  templateContent: string,
  mockData: Record<string, any>
): string => {
  let result = templateContent;

  // Simple variable replacement {{varName}}
  Object.keys(mockData).forEach(key => {
    const regex = new RegExp(`\\{\\{\\s*${key}\\s*\\}\\}`, 'g');
    const value = mockData[key];
    const stringValue = typeof value === 'object' ? JSON.stringify(value) : String(value);
    result = result.replace(regex, stringValue);
  });

  return result;
};
