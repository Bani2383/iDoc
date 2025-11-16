import { ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: "Comment créer un document PDF en ligne gratuitement ?",
    answer: "Sur iDoc, créer un document PDF est simple et gratuit. Sélectionnez un modèle (contrat de travail, convention, formulaire), remplissez les champs demandés, et téléchargez votre document au format PDF. Aucune installation requise, tout se fait en ligne dans votre navigateur."
  },
  {
    question: "Quels types de documents juridiques puis-je générer ?",
    answer: "iDoc propose des modèles de contrats de travail, conventions de service, contrats de location, formulaires administratifs, politiques de confidentialité, conditions d'utilisation, et bien d'autres documents juridiques pour particuliers et professionnels."
  },
  {
    question: "Mes documents PDF sont-ils sécurisés sur iDoc ?",
    answer: "Oui, tous vos documents PDF sont protégés par chiffrement SSL et stockés dans un cloud sécurisé. Nous respectons le RGPD, vos données sont chiffrées et vos documents ne sont jamais partagés. Vous seul avez accès à vos PDF avec une sécurité maximale."
  },
  {
    question: "Puis-je utiliser iDoc sans créer de compte ?",
    answer: "Oui ! Vous pouvez générer un document en mode invité sans inscription. Pour sauvegarder et accéder à vos documents ultérieurement, la création d'un compte gratuit est nécessaire. Vos documents invités peuvent être récupérés lors de votre inscription."
  },
  {
    question: "L'outil de génération avec IA est-il fiable juridiquement ?",
    answer: "Notre IA est entraînée sur des modèles juridiques validés, mais nous recommandons toujours de faire vérifier vos documents importants par un avocat. iDoc est un outil d'aide à la rédaction pour les documents courants et les premiers brouillons."
  },
  {
    question: "Combien coûte l'utilisation d'iDoc ?",
    answer: "iDoc est entièrement gratuit pour la génération de documents de base. Vous pouvez créer, modifier et télécharger vos documents PDF sans frais cachés ni abonnement obligatoire."
  },
  {
    question: "Puis-je modifier mes documents après génération ?",
    answer: "Oui, vous pouvez modifier vos documents à tout moment depuis votre espace client. Les modifications sont sauvegardées automatiquement et vous pouvez télécharger une nouvelle version PDF mise à jour."
  },
  {
    question: "Les documents générés sont-ils conformes à la législation française ?",
    answer: "Nos modèles sont conçus pour être conformes à la législation française en vigueur. Cependant, chaque situation étant unique, nous recommandons de consulter un professionnel du droit pour des cas complexes ou des enjeux importants."
  }
];

export function FAQSection() {
  const { theme } = useTheme();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section
      className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16"
      itemScope
      itemType="https://schema.org/FAQPage"
    >
      <div className="text-center mb-12">
        <h2 className={theme === 'minimal' ? 'text-3xl sm:text-4xl font-light text-black mb-4 tracking-tight' : 'text-3xl sm:text-4xl font-bold text-gray-900 mb-4'} style={theme === 'minimal' ? { fontFamily: 'serif' } : {}}>
          Questions Fréquentes
        </h2>
        <p className={theme === 'minimal' ? 'text-xs text-gray-700 tracking-wide leading-loose' : 'text-lg text-gray-600'} style={theme === 'minimal' ? { fontFamily: 'serif' } : {}}>
          Tout ce que vous devez savoir sur la génération de documents PDF en ligne
        </p>
      </div>

      <div className={theme === 'minimal' ? 'space-y-px bg-black' : 'space-y-4'}>
        {faqs.map((faq, index) => (
          <article
            key={index}
            className={theme === 'minimal' ? 'bg-white overflow-hidden' : 'bg-white rounded-xl shadow-md overflow-hidden border border-gray-100'}
            itemScope
            itemProp="mainEntity"
            itemType="https://schema.org/Question"
          >
            <button
              onClick={() => toggleFAQ(index)}
              className={theme === 'minimal' ? 'w-full px-6 py-5 text-left flex items-center justify-between hover:bg-gray-50 transition-colors' : 'w-full px-6 py-5 text-left flex items-center justify-between hover:bg-gray-50 transition-colors'}
              aria-expanded={openIndex === index}
            >
              <h3
                className={theme === 'minimal' ? 'text-sm font-light text-black pr-8 tracking-tight' : 'text-lg font-semibold text-gray-900 pr-8'}
                itemProp="name"
                style={theme === 'minimal' ? { fontFamily: 'serif' } : {}}
              >
                {faq.question}
              </h3>
              {openIndex === index ? (
                <ChevronUp className={theme === 'minimal' ? 'w-5 h-5 text-black flex-shrink-0' : 'w-6 h-6 text-blue-600 flex-shrink-0'} />
              ) : (
                <ChevronDown className={theme === 'minimal' ? 'w-5 h-5 text-gray-600 flex-shrink-0' : 'w-6 h-6 text-gray-400 flex-shrink-0'} />
              )}
            </button>

            {openIndex === index && (
              <div
                className="px-6 pb-5"
                itemScope
                itemProp="acceptedAnswer"
                itemType="https://schema.org/Answer"
              >
                <p
                  className={theme === 'minimal' ? 'text-xs text-gray-700 leading-loose tracking-wide' : 'text-gray-700 leading-relaxed'}
                  itemProp="text"
                  style={theme === 'minimal' ? { fontFamily: 'serif' } : {}}
                >
                  {faq.answer}
                </p>
              </div>
            )}
          </article>
        ))}
      </div>

      <div className={theme === 'minimal' ? 'mt-12 bg-white border border-black p-8 text-center' : 'mt-12 bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl p-8 text-center border border-blue-200'}>
        <h3 className={theme === 'minimal' ? 'text-xl font-light text-black mb-3 tracking-tight' : 'text-2xl font-bold text-gray-900 mb-3'} style={theme === 'minimal' ? { fontFamily: 'serif' } : {}}>
          Vous avez d'autres questions ?
        </h3>
        <p className={theme === 'minimal' ? 'text-xs text-gray-700 mb-6 tracking-wide leading-loose' : 'text-gray-700 mb-6'} style={theme === 'minimal' ? { fontFamily: 'serif' } : {}}>
          Notre équipe d'experts est là pour vous aider à créer vos documents en toute confiance.
        </p>
        <button className={theme === 'minimal' ? 'px-8 py-3 bg-black text-white text-xs tracking-[0.2em] hover:bg-gray-800 transition-colors border border-black' : 'px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors shadow-md'} style={theme === 'minimal' ? { fontFamily: 'serif' } : {}}>
          {theme === 'minimal' ? 'CONTACTER UN EXPERT' : 'Besoin d\'aide ? Parlez à un expert'}
        </button>
      </div>
    </section>
  );
}
