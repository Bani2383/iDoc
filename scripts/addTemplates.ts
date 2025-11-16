import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { join } from 'path';

function loadEnv() {
  const envPath = join(process.cwd(), '.env');
  const envContent = readFileSync(envPath, 'utf-8');
  const env: Record<string, string> = {};

  envContent.split('\n').forEach(line => {
    const match = line.match(/^([^=:#]+)=(.*)$/);
    if (match) {
      const key = match[1].trim();
      const value = match[2].trim();
      env[key] = value;
    }
  });

  return env;
}

const env = loadEnv();
const supabaseUrl = env.VITE_SUPABASE_URL;
const supabaseKey = env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase credentials in .env file');
}

const supabase = createClient(supabaseUrl, supabaseKey);

interface TemplateInput {
  title: string;
  slug: string;
  category: string;
  tags: string[];
  description: string;
  content: string;
  price: number;
  visibility: string;
  protect_screenshot: boolean;
  disable_copy: boolean;
  locale: string;
}

function extractVariables(content: string) {
  const variablePattern = /\{\{(\w+)\}\}/g;
  const matches = content.matchAll(variablePattern);
  const variables = new Set<string>();

  for (const match of matches) {
    variables.add(match[1]);
  }

  return Array.from(variables).map(name => {
    let label = name.replace(/_/g, ' ');
    label = label.charAt(0).toUpperCase() + label.slice(1);

    let type: 'text' | 'textarea' | 'date' | 'number' | 'email' = 'text';

    if (name.includes('address') || name.includes('description') ||
        name.includes('obligations') || name.includes('terms') ||
        name.includes('purpose') || name.includes('conditions')) {
      type = 'textarea';
    } else if (name.includes('date') || name.includes('dob')) {
      type = 'date';
    } else if (name.includes('amount') || name.includes('price') ||
               name.includes('mileage') || name.includes('deposit')) {
      type = 'number';
    } else if (name.includes('email')) {
      type = 'email';
    }

    return {
      name,
      label,
      type,
      required: true
    };
  });
}

function convertContent(content: string): string {
  return content.replace(/\{\{(\w+)\}\}/g, '{$1}');
}

const templates: TemplateInput[] = [
  {
    title: "Contrat de service complet",
    slug: "contrat-de-service-complet",
    category: "Documents professionnels",
    tags: ["contrat", "service", "prestataire"],
    description: "Contrat détaillé entre un prestataire et un client pour la réalisation de prestations de services.",
    content: "CONTRAT DE SERVICE\n\nEntre les soussignés :\n1. {{client_name}}, ci-après « Le Client »\n2. {{provider_name}}, ci-après « Le Prestataire »\n\n1. Objet du contrat : {{services_description}}\n2. Durée : Début {{start_date}}, Fin {{end_date}}\n3. Rémunération : {{amount}} {{currency}}, payable selon {{payment_terms}}\n4. Obligations du Prestataire : {{provider_obligations}}\n5. Obligations du Client : {{client_obligations}}\n6. Propriété intellectuelle : {{ip_rights}}\n7. Confidentialité : {{confidentiality_terms}}\n8. Résiliation : {{termination_terms}}\n9. Litiges : {{dispute_resolution}}\n\nFait à {{location}}, le {{date}}\n\nSignatures :\n{{client_name}} / {{provider_name}}",
    price: 0,
    visibility: "public",
    protect_screenshot: true,
    disable_copy: true,
    locale: "fr"
  },
  {
    title: "Lettre d'invitation - Visa Canada complet",
    slug: "lettre-invitation-visa-canada-complet",
    category: "Documents personnels",
    tags: ["visa", "immigration", "invitation"],
    description: "Lettre d'invitation complète pour une demande de visa visiteur au Canada.",
    content: "{{host_name}}\n{{host_address}}\n{{host_city}}, {{host_province}}\n{{host_postal_code}}\n{{date}}\n\nÀ : L'Ambassade du Canada\n\nObjet : Lettre d'invitation pour {{guest_name}}\n\nJe soussigné {{host_name}}, résidant à {{host_address}}, invite {{guest_name}} (né(e) le {{guest_dob}}), demeurant à {{guest_address}}, à séjourner au Canada du {{visit_start}} au {{visit_end}} afin de {{visit_purpose}}.\n\nJe m'engage à fournir hébergement et soutien financier pendant toute la durée du séjour.\n\nSignature : {{host_name}}",
    price: 0,
    visibility: "public",
    protect_screenshot: true,
    disable_copy: false,
    locale: "fr"
  },
  {
    title: "Reconnaissance de dette complète",
    slug: "reconnaissance-de-dette-complet",
    category: "Documents personnels",
    tags: ["dette", "finance"],
    description: "Engagement écrit d'un emprunteur envers un prêteur pour le remboursement d'une somme.",
    content: "Je soussigné(e) {{debtor_name}}, reconnais devoir à {{creditor_name}} la somme de {{amount}} {{currency}}, remboursable selon {{repayment_terms}}.\n\nFait à {{location}}, le {{date}}\n\nSignatures :\n{{debtor_name}} / {{creditor_name}}",
    price: 0,
    visibility: "public",
    protect_screenshot: true,
    disable_copy: true,
    locale: "fr"
  },
  {
    title: "Contrat de location saisonnière complet",
    slug: "contrat-location-saisonniere-complet",
    category: "Documents personnels",
    tags: ["location", "saisonniere", "bail"],
    description: "Contrat complet entre propriétaire et locataire pour une location de courte durée.",
    content: "Entre {{owner_name}} (Propriétaire) et {{renter_name}} (Locataire)\nAdresse : {{property_address}}\nPériode : {{rental_start}} à {{rental_end}}\nLoyer : {{total_rent}}, Caution : {{security_deposit}}\n\nObligations du locataire : {{renter_obligations}}\nObligations du propriétaire : {{owner_obligations}}\nRésiliation : {{termination_terms}}\n\nFait à {{location}}, le {{date}}\n\nSignatures :\n{{owner_name}} / {{renter_name}}",
    price: 0,
    visibility: "public",
    protect_screenshot: true,
    disable_copy: true,
    locale: "fr"
  },
  {
    title: "Contrat de vente véhicule d'occasion complet",
    slug: "contrat-vente-vehicule-occasion-complet",
    category: "Documents personnels",
    tags: ["vente", "vehicule", "occasion"],
    description: "Acte de vente complet entre un vendeur et un acheteur pour un véhicule d'occasion.",
    content: "Vendeur : {{seller_name}}\nAcheteur : {{buyer_name}}\nVéhicule : {{vehicle_make}} {{vehicle_model}} {{vehicle_year}} - VIN : {{vin}}\nKilométrage : {{mileage}}\nCouleur : {{color}}\nPrix de vente : {{sale_price}} {{currency}}\nConditions : {{sale_conditions}}\n\nFait à {{location}}, le {{date}}\n\nSignatures :\n{{seller_name}} / {{buyer_name}}",
    price: 0,
    visibility: "public",
    protect_screenshot: true,
    disable_copy: false,
    locale: "fr"
  },
  {
    title: "Lettre de représentation IRCC",
    slug: "lettre-representation-ircc-client",
    category: "Documents immigration",
    tags: ["ircc", "lettre", "immigration"],
    description: "Lettre de représentation rédigée par le demandeur pour son dossier IRCC.",
    content: "À : IRCC\nRéf : {{file_number}}\n\nJe soussigné(e) {{applicant_name}}, né(e) le {{dob}}, demeurant à {{address}}, représente moi-même dans le cadre de ma demande de {{application_type}}.\n\nJe fournis les informations et documents nécessaires à l'étude de mon dossier et certifie l'exactitude de toutes les données soumises.\n\nDate : {{date}}\nSignature : {{applicant_name}}",
    price: 0,
    visibility: "public",
    protect_screenshot: true,
    disable_copy: true,
    locale: "fr"
  },
  {
    title: "Demande PEQ - Étudiant ou Travailleur",
    slug: "demande-peq-client",
    category: "Documents immigration",
    tags: ["peq", "immigration", "québec"],
    description: "Lettre et déclaration pour la demande du Programme de l'expérience québécoise (PEQ), remplie par le demandeur.",
    content: "Objet : Demande de certificat de sélection du Québec (PEQ)\n\nJe soussigné(e) {{applicant_name}}, né(e) le {{dob}}, demeurant à {{address}}, souhaite présenter ma demande pour le Programme de l'expérience québécoise (PEQ).\n\nDétails de ma situation :\n- Statut actuel : {{current_status}}\n- Formation / emploi : {{education_or_employment}}\n- Durée au Québec : {{duration}}\n\nJe certifie l'exactitude de toutes les informations fournies et joins les documents requis.\n\nDate : {{date}}\nSignature : {{applicant_name}}",
    price: 0,
    visibility: "public",
    protect_screenshot: true,
    disable_copy: true,
    locale: "fr"
  },
  {
    title: "Demande PSTQ ou Entrée Express",
    slug: "demande-pstq-ee-client",
    category: "Documents immigration",
    tags: ["pstq", "entree-express", "immigration", "québec"],
    description: "Lettre ou déclaration rédigée par le demandeur pour sa demande PSTQ ou Entrée Express.",
    content: "Objet : Demande de résidence permanente - {{program_type}}\n\nJe soussigné(e) {{applicant_name}}, né(e) le {{dob}}, demeurant à {{address}}, soumets ma demande pour le programme {{program_type}}.\n\nInformations personnelles et qualifications :\n- Statut actuel : {{current_status}}\n- Diplôme(s) : {{education}}\n- Expérience professionnelle : {{work_experience}}\n- Compétences linguistiques : {{language_skills}}\n\nJe certifie l'exactitude de toutes les informations fournies et joins les documents requis.\n\nDate : {{date}}\nSignature : {{applicant_name}}",
    price: 0,
    visibility: "public",
    protect_screenshot: true,
    disable_copy: true,
    locale: "fr"
  }
];

async function addTemplates() {
  console.log('Starting template insertion...\n');

  for (const template of templates) {
    console.log(`Processing: ${template.title}`);

    const variables = extractVariables(template.content);
    const convertedContent = convertContent(template.content);

    const { data, error } = await supabase
      .from('document_templates')
      .insert({
        name: template.title,
        slug: template.slug,
        category: template.category,
        description: template.description,
        template_content: convertedContent,
        template_variables: variables,
        is_active: true,
        sort_order: 0
      })
      .select();

    if (error) {
      console.error(`  ❌ Error: ${error.message}`);
    } else {
      console.log(`  ✅ Added successfully (${variables.length} variables)`);
    }
  }

  console.log('\n✅ All templates processed!');
}

addTemplates().catch(console.error);
