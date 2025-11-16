import { jsPDF } from 'jspdf';

interface Module {
  icon: string;
  name: string;
  userStory: string;
  acceptanceCriteria: string;
  kpi: string;
}

interface Phase {
  title: string;
  color: [number, number, number];
  modules: Module[];
}

interface TOCEntry {
  title: string;
  page: number;
}

export function generatePRDPDF(): void {
  const doc = new jsPDF();
  const toc: TOCEntry[] = [];
  let currentPage = 1;

  const addHeader = () => {
    doc.setFillColor(0, 102, 204);
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.rect(0, 0, 210, 20, 'F');
    doc.text('PRD iDoc v2.0 - Spécifications Techniques et Fonctionnelles', 105, 12, { align: 'center' });
  };

  const addFooter = (pageNum: number) => {
    doc.setTextColor(128, 128, 128);
    doc.setFontSize(8);
    doc.text(`Page ${pageNum}`, 105, 290, { align: 'center' });
  };

  const phases: Phase[] = [
    {
      title: 'Fondation et Typographie',
      color: [0, 153, 76],
      modules: [
        {
          icon: '🎨',
          name: 'Typographie Montserrat/Roboto',
          userStory: 'Titres et Corps stylés pour UX/branding',
          acceptanceCriteria: 'Montserrat H1-H6, Roboto paragraphe, auto-hébergé WOFF2',
          kpi: 'Look professionnel immédiat',
        },
        {
          icon: '✏️',
          name: 'Profil Utilisateur',
          userStory: 'Stocker Profession, Statut, etc.',
          acceptanceCriteria: 'Champs enregistrés et accessibles pour SmartFill',
          kpi: 'Pré-remplissage précis',
        },
      ],
    },
    {
      title: 'Efficacité et Conversion',
      color: [255, 153, 0],
      modules: [
        {
          icon: '🧭',
          name: 'DocPilot V2',
          userStory: 'Suivi navigation et suggestions',
          acceptanceCriteria: 'Tracking comportemental, CTA inscription',
          kpi: 'Taux de conversion post-suggestion',
        },
        {
          icon: '⚡',
          name: 'SmartFill',
          userStory: 'Pré-remplissage des documents',
          acceptanceCriteria: 'Mapping champs du profil, champs éditables',
          kpi: 'Temps de remplissage réduit',
        },
        {
          icon: '✅',
          name: 'CompliancE-Check',
          userStory: 'Validation avant finalisation',
          acceptanceCriteria: 'Détection erreurs/oublis, suggestions corrections',
          kpi: 'Taux erreur réduit',
        },
        {
          icon: '📁',
          name: 'DocVault',
          userStory: 'Organisation des documents',
          acceptanceCriteria: 'Dossiers, favoris, recherche rapide',
          kpi: 'Engagement utilisateur',
        },
      ],
    },
    {
      title: 'Sécurité et Workflow',
      color: [204, 0, 102],
      modules: [
        {
          icon: '✍️',
          name: 'SignFlow',
          userStory: 'Workflow de signature séquentiel',
          acceptanceCriteria: 'Tableau de bord statut complet',
          kpi: 'Documents signés en temps réel',
        },
        {
          icon: '🕰️',
          name: 'ProofStamp',
          userStory: 'Horodatage légal',
          acceptanceCriteria: 'Intégration dans métadonnées PDF',
          kpi: 'Conformité légale validée',
        },
        {
          icon: '📜',
          name: 'DocHistory',
          userStory: 'Historique des versions',
          acceptanceCriteria: 'Max 10 versions, comparaison visuelle',
          kpi: 'Traçabilité complète',
        },
      ],
    },
    {
      title: 'Automatisation et B2B',
      color: [0, 102, 204],
      modules: [
        {
          icon: '🤖',
          name: 'iDoc Connect API',
          userStory: 'Générer PDF via API RESTful',
          acceptanceCriteria: 'Endpoints GET/POST, Auth Bearer Token',
          kpi: 'Volume PDF généré, Leads B2B qualifiés',
        },
        {
          icon: '🌍',
          name: 'RegulaSmart',
          userStory: 'Adaptabilité légale par juridiction',
          acceptanceCriteria: 'Sélection juridiction, substitution clauses',
          kpi: 'Exactitude légale automatique',
        },
        {
          icon: '📧',
          name: 'BulkSend',
          userStory: 'Envoi groupé personnalisé',
          acceptanceCriteria: 'Import CSV, mapping colonnes, tracking',
          kpi: 'Volume documents générés',
        },
      ],
    },
    {
      title: 'Monétisation et Croissance',
      color: [255, 51, 51],
      modules: [
        {
          icon: '💵',
          name: 'iDoc Standard 1,99$',
          userStory: 'Flux Invité → Paiement → Inscription',
          acceptanceCriteria: 'Paiement express Apple/Google Pay',
          kpi: 'Conversion instantanée 1,99$/transaction',
        },
        {
          icon: '🚀',
          name: 'iDoc Pro 9,99$/mois',
          userStory: 'Upsell vers abonnement',
          acceptanceCriteria: 'Fonctionnalités Pro, essai 7 jours',
          kpi: 'Taux de passage Standard → Pro',
        },
        {
          icon: '🖥️',
          name: 'API B2B iDoc Connect',
          userStory: 'Portail développeur, Sandbox',
          acceptanceCriteria: 'Clés gratuites limitées 100 appels/jour',
          kpi: 'Leads B2B qualifiés, adoption API',
        },
        {
          icon: '📈',
          name: 'Croissance & Échelle',
          userStory: 'Affiliation, Widget embarqué, SEO/SEM',
          acceptanceCriteria: 'Pages optimisées, preuve sociale temps réel',
          kpi: 'Volume de PDF via site tiers, engagement',
        },
      ],
    },
  ];

  addHeader();
  addFooter(currentPage);

  let yPosition = 30;

  phases.forEach((phase, phaseIndex) => {
    const phaseNumber = phaseIndex + 1;

    if (yPosition > 240) {
      doc.addPage();
      currentPage++;
      addHeader();
      addFooter(currentPage);
      yPosition = 30;
    }

    toc.push({ title: `Phase ${phaseNumber}: ${phase.title}`, page: currentPage });

    doc.setFillColor(...phase.color);
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(14);
    doc.rect(10, yPosition, 190, 10, 'F');
    doc.text(`Phase ${phaseNumber}: ${phase.title}`, 105, yPosition + 7, { align: 'center' });
    yPosition += 12;

    doc.setTextColor(0, 0, 0);
    doc.setFillColor(200, 200, 200);
    doc.setFontSize(10);
    doc.rect(10, yPosition, 30, 8, 'FD');
    doc.rect(40, yPosition, 50, 8, 'FD');
    doc.rect(90, yPosition, 60, 8, 'FD');
    doc.rect(150, yPosition, 50, 8, 'FD');

    doc.text('Module', 25, yPosition + 5, { align: 'center' });
    doc.text('User Story', 65, yPosition + 5, { align: 'center' });
    doc.text("Critères d'Acceptation", 120, yPosition + 5, { align: 'center' });
    doc.text('KPI', 175, yPosition + 5, { align: 'center' });
    yPosition += 8;

    phase.modules.forEach((module, moduleIndex) => {
      if (yPosition > 270) {
        doc.addPage();
        currentPage++;
        addHeader();
        addFooter(currentPage);
        yPosition = 30;

        doc.setFillColor(200, 200, 200);
        doc.rect(10, yPosition, 30, 8, 'FD');
        doc.rect(40, yPosition, 50, 8, 'FD');
        doc.rect(90, yPosition, 60, 8, 'FD');
        doc.rect(150, yPosition, 50, 8, 'FD');

        doc.text('Module', 25, yPosition + 5, { align: 'center' });
        doc.text('User Story', 65, yPosition + 5, { align: 'center' });
        doc.text("Critères d'Acceptation", 120, yPosition + 5, { align: 'center' });
        doc.text('KPI', 175, yPosition + 5, { align: 'center' });
        yPosition += 8;
      }

      const fill = moduleIndex % 2 === 0;
      doc.setFillColor(fill ? 245 : 255, fill ? 245 : 255, fill ? 245 : 255);

      doc.rect(10, yPosition, 30, 8, 'FD');
      doc.rect(40, yPosition, 50, 8, 'FD');
      doc.rect(90, yPosition, 60, 8, 'FD');
      doc.rect(150, yPosition, 50, 8, 'FD');

      doc.setFontSize(9);
      doc.text(`${phaseNumber}.${moduleIndex + 1} ${module.name}`, 12, yPosition + 5);
      doc.text(doc.splitTextToSize(module.userStory, 48)[0], 42, yPosition + 5);
      doc.text(doc.splitTextToSize(module.acceptanceCriteria, 58)[0], 92, yPosition + 5);
      doc.text(doc.splitTextToSize(module.kpi, 48)[0], 152, yPosition + 5);

      yPosition += 8;
    });

    yPosition += 5;
  });

  doc.addPage();
  currentPage++;
  addHeader();
  addFooter(currentPage);

  doc.setFontSize(16);
  doc.setTextColor(0, 0, 0);
  doc.text('Table des Matières', 105, 35, { align: 'center' });

  yPosition = 50;
  doc.setFontSize(12);
  toc.forEach((entry) => {
    if (yPosition > 270) {
      doc.addPage();
      currentPage++;
      addHeader();
      addFooter(currentPage);
      yPosition = 30;
    }
    doc.text(`${entry.title}`, 15, yPosition);
    doc.text(`${entry.page}`, 195, yPosition, { align: 'right' });
    yPosition += 8;
  });

  doc.save('iDoc_v2_PRD.pdf');
}
