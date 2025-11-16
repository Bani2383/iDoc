export const sampleTemplates = [
  {
    name: "Contrat de prestation de services",
    category: "professional",
    description: "Contrat standard pour prestations de services entre professionnels",
    slug: "contrat-prestation-services",
    is_active: true,
    sort_order: 1,
    template_content: `CONTRAT DE PRESTATION DE SERVICES

Entre les soussignés :

{client_name}, ci-après dénommé "le Client"
Adresse : {client_address}

Et

{provider_name}, ci-après dénommé "le Prestataire"
Adresse : {provider_address}

ARTICLE 1 - OBJET
Le présent contrat a pour objet la prestation de services suivante :
{service_description}

ARTICLE 2 - DURÉE
La prestation débutera le {start_date} et se terminera le {end_date}.

ARTICLE 3 - PRIX
Le montant total de la prestation s'élève à {total_amount} euros TTC.

ARTICLE 4 - MODALITÉS DE PAIEMENT
{payment_terms}

Fait à {city}, le {contract_date}

Le Client                    Le Prestataire
{client_name}               {provider_name}`,
    template_variables: [
      { name: "client_name", label: "Nom du client", type: "text", required: true },
      { name: "client_address", label: "Adresse du client", type: "textarea", required: true },
      { name: "provider_name", label: "Nom du prestataire", type: "text", required: true },
      { name: "provider_address", label: "Adresse du prestataire", type: "textarea", required: true },
      { name: "service_description", label: "Description du service", type: "textarea", required: true },
      { name: "start_date", label: "Date de début", type: "date", required: true },
      { name: "end_date", label: "Date de fin", type: "date", required: true },
      { name: "total_amount", label: "Montant total", type: "number", required: true },
      { name: "payment_terms", label: "Modalités de paiement", type: "textarea", required: true },
      { name: "city", label: "Ville", type: "text", required: true },
      { name: "contract_date", label: "Date du contrat", type: "date", required: true }
    ],
    instructions: "Remplissez tous les champs pour générer votre contrat de prestation de services personnalisé."
  },
  {
    name: "Lettre de motivation",
    category: "personal",
    description: "Modèle de lettre de motivation professionnelle",
    slug: "lettre-motivation",
    is_active: true,
    sort_order: 2,
    template_content: `{sender_name}
{sender_address}
{sender_phone}
{sender_email}

{city}, le {date}

{company_name}
À l'attention de {recipient_name}
{company_address}

Objet : Candidature pour le poste de {position}

Madame, Monsieur,

{opening_paragraph}

{experience_paragraph}

{motivation_paragraph}

{closing_paragraph}

Je vous prie d'agréer, Madame, Monsieur, l'expression de mes salutations distinguées.

{sender_name}`,
    template_variables: [
      { name: "sender_name", label: "Votre nom", type: "text", required: true },
      { name: "sender_address", label: "Votre adresse", type: "textarea", required: true },
      { name: "sender_phone", label: "Votre téléphone", type: "text", required: true },
      { name: "sender_email", label: "Votre email", type: "text", required: true },
      { name: "city", label: "Ville", type: "text", required: true },
      { name: "date", label: "Date", type: "date", required: true },
      { name: "company_name", label: "Nom de l'entreprise", type: "text", required: true },
      { name: "recipient_name", label: "Nom du destinataire", type: "text", required: false },
      { name: "company_address", label: "Adresse de l'entreprise", type: "textarea", required: true },
      { name: "position", label: "Poste visé", type: "text", required: true },
      { name: "opening_paragraph", label: "Paragraphe d'ouverture", type: "textarea", required: true },
      { name: "experience_paragraph", label: "Paragraphe expérience", type: "textarea", required: true },
      { name: "motivation_paragraph", label: "Paragraphe motivation", type: "textarea", required: true },
      { name: "closing_paragraph", label: "Paragraphe de clôture", type: "textarea", required: true }
    ],
    instructions: "Personnalisez votre lettre de motivation en remplissant les différentes sections."
  },
  {
    name: "Contrat de location",
    category: "professional",
    description: "Contrat de location d'un bien immobilier",
    slug: "contrat-location",
    is_active: true,
    sort_order: 3,
    template_content: `CONTRAT DE LOCATION

Entre les soussignés :

{landlord_name}, propriétaire
Adresse : {landlord_address}
Ci-après dénommé "le Bailleur"

Et

{tenant_name}
Adresse : {tenant_address}
Ci-après dénommé "le Locataire"

ARTICLE 1 - DÉSIGNATION DU LOCAL
Le bailleur donne en location au locataire qui accepte, un logement situé :
{property_address}

Surface habitable : {surface} m²
Nombre de pièces : {rooms}

ARTICLE 2 - DURÉE
Le présent bail est consenti pour une durée de {duration} à compter du {start_date}.

ARTICLE 3 - LOYER
Le loyer mensuel est fixé à {monthly_rent} euros, payable le {payment_day} de chaque mois.

ARTICLE 4 - DÉPÔT DE GARANTIE
Un dépôt de garantie de {deposit} euros est versé à la signature du présent contrat.

ARTICLE 5 - CHARGES
{charges_description}

Fait à {city}, le {contract_date}

Le Bailleur                  Le Locataire
{landlord_name}             {tenant_name}`,
    template_variables: [
      { name: "landlord_name", label: "Nom du propriétaire", type: "text", required: true },
      { name: "landlord_address", label: "Adresse du propriétaire", type: "textarea", required: true },
      { name: "tenant_name", label: "Nom du locataire", type: "text", required: true },
      { name: "tenant_address", label: "Adresse du locataire", type: "textarea", required: true },
      { name: "property_address", label: "Adresse du bien", type: "textarea", required: true },
      { name: "surface", label: "Surface (m²)", type: "number", required: true },
      { name: "rooms", label: "Nombre de pièces", type: "number", required: true },
      { name: "duration", label: "Durée du bail", type: "text", required: true },
      { name: "start_date", label: "Date de début", type: "date", required: true },
      { name: "monthly_rent", label: "Loyer mensuel (€)", type: "number", required: true },
      { name: "payment_day", label: "Jour de paiement", type: "number", required: true },
      { name: "deposit", label: "Dépôt de garantie (€)", type: "number", required: true },
      { name: "charges_description", label: "Description des charges", type: "textarea", required: true },
      { name: "city", label: "Ville", type: "text", required: true },
      { name: "contract_date", label: "Date du contrat", type: "date", required: true }
    ],
    instructions: "Complétez toutes les informations pour générer votre contrat de location."
  }
];