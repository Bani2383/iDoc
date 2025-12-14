import React from 'react';

interface SchemaMarkupProps {
  schema: Record<string, any>;
}

export function SchemaMarkup({ schema }: SchemaMarkupProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export const ImmigrationFAQSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What is an IRCC explanation letter?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "An IRCC explanation letter is a written document used to clarify a situation or element of an immigration application, such as a study gap, financial information, or background details, in a factual and coherent manner."
      }
    },
    {
      "@type": "Question",
      "name": "Can an explanation letter guarantee approval?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "No. An explanation letter cannot guarantee approval. It can help clarify information and improve the overall coherence of an application."
      }
    },
    {
      "@type": "Question",
      "name": "When should I include a proof of funds explanation letter?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "A proof of funds explanation letter is recommended when bank statements show large deposits, multiple sources of funds, transfers, or any elements that require context to understand the origin and availability of the funds."
      }
    },
    {
      "@type": "Question",
      "name": "Is a letter of intent required for a study permit application?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "While not always mandatory, a letter of intent is commonly included to explain the study plan, the logic of the applicant's background, and their intention to respect the conditions of temporary stay in Canada."
      }
    },
    {
      "@type": "Question",
      "name": "Can I use a letter generated online for IRCC?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, provided the letter is clear, factual, consistent with the application documents, and does not replace legal advice."
      }
    }
  ]
};

export const ArticleSchema = (article: {
  title: string;
  description: string;
  author?: string;
  datePublished: string;
  dateModified?: string;
  image?: string;
}) => ({
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": article.title,
  "description": article.description,
  "author": {
    "@type": "Organization",
    "name": article.author || "iD0c"
  },
  "publisher": {
    "@type": "Organization",
    "name": "iD0c",
    "logo": {
      "@type": "ImageObject",
      "url": "https://id0c.com/Logo.PNG"
    }
  },
  "datePublished": article.datePublished,
  "dateModified": article.dateModified || article.datePublished,
  ...(article.image && {
    "image": article.image
  })
});

export const BreadcrumbSchema = (items: { name: string; url: string }[]) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": items.map((item, index) => ({
    "@type": "ListItem",
    "position": index + 1,
    "name": item.name,
    "item": item.url
  }))
});

export const HowToSchema = (howTo: {
  name: string;
  description: string;
  steps: { name: string; text: string }[];
}) => ({
  "@context": "https://schema.org",
  "@type": "HowTo",
  "name": howTo.name,
  "description": howTo.description,
  "step": howTo.steps.map((step, index) => ({
    "@type": "HowToStep",
    "position": index + 1,
    "name": step.name,
    "text": step.text
  }))
});
