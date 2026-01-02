export type SeoPage = {
  slug: string;
  h1: string;
  docTypeSeed: any;
  metaTitle: string;
  metaDescription: string;
  silo: "visa" | "etudes" | "refus" | "lettres";
  faq: { q: string; a: string }[];
};

export const SEO_PAGES: SeoPage[] = [
  {
    slug: "lettre-explicative-refus-visa",
    silo: "refus",
    h1: "Lettre explicative – Refus de visa (modèle PDF)",
    metaTitle: "Lettre explicative refus de visa – Modèle PDF gratuit | iDoc",
    metaDescription: "Modèle de lettre explicative après refus de visa. Générez un PDF structuré et professionnel en quelques minutes.",
    docTypeSeed: {
      template_id: "ircc_refusal_response",
      document_type: "LETTRE_EXPLICATIVE_GENERIQUE",
      sous_type_lettre: "REFUS"
    },
    faq: [
      {
        q: "Que mettre dans une lettre après refus de visa ?",
        a: "Restez factuel: expliquez les motifs du refus, clarifiez les malentendus, présentez les documents mis à jour, et démontrez votre intention de conformité aux exigences."
      },
      {
        q: "Faut-il joindre des preuves à la lettre ?",
        a: "Oui, joignez uniquement les pièces justificatives qui répondent directement aux motifs de refus mentionnés dans la décision."
      },
      {
        q: "Est-ce un avis juridique ?",
        a: "Non. Ce modèle est fourni à titre informatif uniquement. Vous demeurez responsable du contenu de votre demande."
      }
    ]
  },
  {
    slug: "lettre-explicative-fonds-insuffisants",
    silo: "visa",
    h1: "Lettre explicative – Fonds insuffisants (modèle PDF)",
    metaTitle: "Lettre explicative fonds insuffisants – Modèle PDF | iDoc",
    metaDescription: "Expliquez vos ressources financières et leur provenance. Modèle PDF professionnel prêt à générer.",
    docTypeSeed: {
      template_id: "ircc_cec_funds_exemption",
      document_type: "LETTRE_EXPLICATIVE_GENERIQUE",
      sous_type_lettre: "FONDS"
    },
    faq: [
      {
        q: "Que prouver concernant les fonds ?",
        a: "Démontrez les montants disponibles, leur provenance légitime, leur stabilité dans le temps, et leur disponibilité immédiate."
      },
      {
        q: "Puis-je inclure un soutien familial ?",
        a: "Oui, vous pouvez mentionner un soutien financier d'un tiers et joindre les documents du garant si applicable."
      },
      {
        q: "Le modèle fonctionne pour tous les pays ?",
        a: "Oui, le modèle est adaptable. Ajustez le destinataire et les exigences selon le pays de destination."
      }
    ]
  },
  {
    slug: "visa-visiteur-lettre-motivation",
    silo: "visa",
    h1: "Visa visiteur – Lettre de motivation (tous pays) – PDF",
    metaTitle: "Visa visiteur lettre de motivation – Modèle PDF universel | iDoc",
    metaDescription: "Modèle universel de lettre pour visa visiteur: objet du voyage, finances, attaches, hébergement. PDF immédiat.",
    docTypeSeed: {
      template_id: "visitor_visa_universal",
      document_type: "VISA_VISITEUR_UNIVERSEL"
    },
    faq: [
      {
        q: "Quels éléments inclure dans la lettre ?",
        a: "Incluez l'objet du voyage, les dates précises, l'hébergement prévu, le budget et les fonds disponibles, ainsi que vos liens d'attache avec votre pays de résidence."
      },
      {
        q: "Dois-je indiquer un itinéraire détaillé ?",
        a: "Oui, un résumé clair de votre itinéraire améliore la compréhension et démontre la planification de votre voyage."
      },
      {
        q: "Comment expliquer un refus antérieur ?",
        a: "Mentionnez la date du refus, le motif invoqué, et expliquez précisément ce qui a changé dans votre situation depuis."
      }
    ]
  },
  {
    slug: "repondre-lettre-immigration-documents",
    silo: "lettres",
    h1: "Répondre à une lettre d'immigration (documents/clarification) – PDF",
    metaTitle: "Réponse lettre immigration – Modèle PDF structuré | iDoc",
    metaDescription: "Structurez votre réponse aux demandes d'immigration: points demandés, pièces jointes, clarifications. PDF généré.",
    docTypeSeed: {
      template_id: "response_letter",
      document_type: "REPONSE_LETTRE"
    },
    faq: [
      {
        q: "Comment structurer la réponse ?",
        a: "Listez d'abord tous les points soulevés dans la lettre reçue, puis énumérez les pièces jointes fournies, et clarifiez brièvement si nécessaire."
      },
      {
        q: "Dois-je respecter une échéance stricte ?",
        a: "Oui, notez la date limite dans la lettre reçue et soumettez votre réponse complète avant l'échéance pour éviter le rejet."
      },
      {
        q: "Le PDF remplace-t-il les pièces justificatives ?",
        a: "Non, le PDF structure votre réponse mais vous devez impérativement joindre tous les documents demandés."
      }
    ]
  },
  {
    slug: "lettre-invitation-visa-canada",
    silo: "visa",
    h1: "Lettre d'invitation pour visa Canada – Modèle PDF",
    metaTitle: "Lettre invitation visa Canada – Modèle PDF officiel | iDoc",
    metaDescription: "Modèle de lettre d'invitation conforme aux exigences IRCC. Générez votre PDF en quelques clics.",
    docTypeSeed: {
      template_id: "invitation_letter",
      document_type: "INVITATION"
    },
    faq: [
      {
        q: "Qui peut émettre une lettre d'invitation ?",
        a: "Tout résident permanent ou citoyen canadien peut inviter un proche. L'hôte doit fournir ses informations complètes et preuve de statut."
      },
      {
        q: "Quelles informations obligatoires inclure ?",
        a: "Informations de l'hôte et du visiteur (noms complets, dates de naissance, adresses), dates de visite, lien entre les personnes, et détails de prise en charge."
      },
      {
        q: "La lettre garantit-elle l'obtention du visa ?",
        a: "Non, la lettre d'invitation est un document d'appui. La décision finale appartient aux autorités d'immigration."
      }
    ]
  },
  {
    slug: "caq-avis-intention-refus",
    silo: "etudes",
    h1: "CAQ – Réponse à l'avis d'intention de refus – Modèle PDF",
    metaTitle: "CAQ avis intention de refus – Modèle de réponse PDF | iDoc",
    metaDescription: "Répondez à un avis d'intention de refus du MIFI pour votre demande de CAQ. Modèle structuré et conforme.",
    docTypeSeed: {
      template_id: "caq_refusal_intent",
      document_type: "IMMIGRATION_LETTRE",
      autorite: "CAQ"
    },
    faq: [
      {
        q: "Quel délai pour répondre à l'avis ?",
        a: "Généralement 20 jours ouvrables à partir de la réception de l'avis. Vérifiez la date limite précise sur votre avis."
      },
      {
        q: "Quels motifs sont souvent soulevés ?",
        a: "Capacité financière insuffisante, interruption d'études non justifiée, assurance maladie non valide, ou incohérences dans le dossier."
      },
      {
        q: "Dois-je fournir de nouveaux documents ?",
        a: "Oui, si votre situation a changé ou si les documents initiaux étaient incomplets. Joignez toute pièce pertinente actualisée."
      }
    ]
  }
];

export function getSeoPageBySlug(slug: string): SeoPage | undefined {
  return SEO_PAGES.find(p => p.slug === slug);
}

export function getSeoPagesBySilo(silo: SeoPage['silo']): SeoPage[] {
  return SEO_PAGES.filter(p => p.silo === silo);
}
