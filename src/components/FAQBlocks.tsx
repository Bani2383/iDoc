/**
 * Reusable FAQ Blocks with Schema.org markup
 * SEO-optimized for featured snippets
 */

import { ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQBlockProps {
  title: string;
  items: FAQItem[];
  category: string;
}

export function FAQBlock({ title, items, category }: FAQBlockProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  // Generate Schema.org FAQPage markup
  const schemaMarkup = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": items.map(item => ({
      "@type": "Question",
      "name": item.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": item.answer
      }
    }))
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      {/* Schema.org markup for Google */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaMarkup) }}
      />

      <h2 className="text-3xl font-bold text-gray-900 mb-8">{title}</h2>

      <div className="space-y-4">
        {items.map((item, index) => (
          <div
            key={index}
            className="border border-gray-200 rounded-lg overflow-hidden"
          >
            <button
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              className="w-full px-6 py-4 text-left bg-white hover:bg-gray-50 transition-colors flex items-center justify-between"
              aria-expanded={openIndex === index}
            >
              <h3 className="text-lg font-semibold text-gray-900 pr-4">
                {item.question}
              </h3>
              {openIndex === index ? (
                <ChevronUp className="w-5 h-5 text-gray-500 flex-shrink-0" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0" />
              )}
            </button>

            {openIndex === index && (
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                <p className="text-gray-700 whitespace-pre-line">{item.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// Immigration / IRCC FAQ
export const immigrationFAQ: FAQItem[] = [
  {
    question: "Qu'est-ce qu'une lettre explicative pour l'immigration canadienne ?",
    answer: "Une lettre explicative (Letter of Explanation) est un document que vous devez fournir à IRCC pour clarifier certains aspects de votre demande d'immigration. Elle sert à expliquer des incohérences, des périodes d'inactivité, des refus antérieurs ou toute autre situation nécessitant des précisions."
  },
  {
    question: "Comment structurer une lettre d'intention pour un permis d'études ?",
    answer: "Une lettre d'intention doit inclure :\n1. Votre parcours académique et professionnel\n2. Les raisons du choix du programme et de l'établissement\n3. Votre projet professionnel après les études\n4. Vos liens avec votre pays d'origine\n5. Vos capacités financières\n\nLa lettre doit faire 1 à 2 pages maximum et rester factuelle."
  },
  {
    question: "Puis-je soumettre une nouvelle demande après un refus IRCC ?",
    answer: "Oui, il n'y a généralement pas de délai d'attente imposé après un refus. Vous pouvez soumettre une nouvelle demande dès que vous avez corrigé les problèmes identifiés dans la lettre de refus. Il est essentiel de répondre point par point aux motifs invoqués et d'apporter de nouvelles preuves."
  },
  {
    question: "Combien de temps faut-il pour obtenir une réponse d'IRCC ?",
    answer: "Les délais varient selon le type de demande :\n- Permis d'études : 4 à 16 semaines\n- Permis de travail : 2 à 16 semaines\n- Résidence permanente : 6 à 18 mois\n\nCes délais sont indicatifs et peuvent varier selon la complexité du dossier et le volume de demandes."
  },
  {
    question: "iD0c garantit-il l'approbation de ma demande ?",
    answer: "Non. iD0c est une plateforme d'automatisation documentaire, pas un consultant en immigration. Nous facilitons la rédaction de documents conformes aux standards attendus, mais la décision finale appartient à IRCC. Aucune garantie d'approbation ne peut être fournie."
  }
];

// Lettres de déclaration FAQ
export const declarationFAQ: FAQItem[] = [
  {
    question: "Qu'est-ce qu'une déclaration sur l'honneur ?",
    answer: "Une déclaration sur l'honneur est un document par lequel vous attestez de l'exactitude de faits ou d'informations. Elle engage votre responsabilité personnelle et peut être utilisée dans diverses démarches administratives sans nécessiter la certification d'un notaire."
  },
  {
    question: "Quelle est la valeur juridique d'une déclaration sur l'honneur ?",
    answer: "Une déclaration sur l'honneur engage votre responsabilité. Fournir de fausses informations constitue un délit (faux et usage de faux) passible de sanctions pénales. Toutefois, elle n'a pas la même force probante qu'un acte notarié."
  },
  {
    question: "Dans quels cas utiliser une déclaration sur l'honneur ?",
    answer: "Vous pouvez l'utiliser pour :\n- Prouver votre adresse de résidence\n- Déclarer la perte de documents officiels\n- Attester d'une union de fait\n- Certifier votre situation financière\n- Confirmer l'exactitude d'informations dans un dossier administratif"
  },
  {
    question: "Comment rédiger une déclaration sur l'honneur valable ?",
    answer: "Une déclaration valable doit contenir :\n1. Vos coordonnées complètes (nom, prénom, adresse)\n2. Un objet précis\n3. La formule \"Je soussigné(e)... déclare sur l'honneur...\"\n4. Des faits précis et vérifiables\n5. La mention \"Lu et approuvé\"\n6. Votre signature manuscrite et la date"
  },
  {
    question: "Faut-il faire certifier une déclaration sur l'honneur ?",
    answer: "Non, une déclaration sur l'honneur n'a pas besoin d'être certifiée par un notaire pour être valable dans la plupart des démarches administratives. Toutefois, certains organismes peuvent exiger une attestation notariée pour des procédures spécifiques."
  }
];

// PME / B2B FAQ
export const businessFAQ: FAQItem[] = [
  {
    question: "Quels types de documents peuvent être automatisés dans une PME ?",
    answer: "Les documents RH (contrats d'emploi, lettres de recommandation, attestations), les documents commerciaux (devis, contrats de prestation, NDA) et les documents administratifs (déclarations, lettres de mise en demeure, demandes d'autorisation) peuvent être automatisés."
  },
  {
    question: "Combien coûte l'automatisation documentaire pour une PME ?",
    answer: "Avec iD0c, le coût est de 1,99 à 9,99 CAD par document généré, contre 75 à 160 CAD en coût horaire RH/juridique pour une rédaction manuelle. Une PME embauchant 10 personnes par mois peut économiser environ 18 heures de travail."
  },
  {
    question: "Les documents générés sont-ils conformes au Code du travail du Québec ?",
    answer: "Oui, les modèles proposés par iD0c sont élaborés en conformité avec les lois applicables au Québec et au Canada. Toutefois, pour des contrats à fort enjeu juridique, il est recommandé de faire valider le document par un avocat."
  },
  {
    question: "Peut-on intégrer iD0c avec nos systèmes internes (ERP, CRM) ?",
    answer: "Oui, iD0c propose une API permettant d'intégrer la génération de documents directement dans vos systèmes internes. Contactez notre équipe commerciale pour discuter de votre cas d'usage spécifique."
  },
  {
    question: "Que se passe-t-il si les lois changent ?",
    answer: "iD0c met à jour régulièrement ses modèles juridiques pour refléter les évolutions législatives. En tant qu'utilisateur, vous bénéficiez automatiquement des mises à jour sans intervention de votre part."
  }
];

// Combined FAQ Component
export function ImmigrationFAQ() {
  return (
    <FAQBlock
      title="Questions fréquentes - Immigration Canada"
      items={immigrationFAQ}
      category="immigration"
    />
  );
}

export function DeclarationFAQ() {
  return (
    <FAQBlock
      title="Questions fréquentes - Lettres de déclaration"
      items={declarationFAQ}
      category="declaration"
    />
  );
}

export function BusinessFAQ() {
  return (
    <FAQBlock
      title="Questions fréquentes - Automatisation pour PME"
      items={businessFAQ}
      category="business"
    />
  );
}
