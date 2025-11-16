import { useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

interface SEOMeta {
  title: string;
  description: string;
  keywords: string;
}

const SEO_META: Record<string, SEOMeta> = {
  fr: {
    title: 'iDoc - Générateur de Documents PDF Sécurisé Gratuit en Ligne',
    description: 'Créez gratuitement vos documents PDF en ligne : contrats de travail, conventions, formulaires administratifs. Génération IA, chiffrement SSL et protection RGPD garantis.',
    keywords: 'générateur pdf gratuit, créer document pdf, contrat travail pdf, formulaire administratif, documents juridiques, signature électronique',
  },
  en: {
    title: 'iDoc - Free Secure PDF Document Generator Online',
    description: 'Create free PDF documents online: employment contracts, agreements, administrative forms. AI generation, SSL encryption and GDPR protection guaranteed.',
    keywords: 'free pdf generator, create pdf document, employment contract pdf, administrative form, legal documents, electronic signature',
  },
  es: {
    title: 'iDoc - Generador Gratuito de Documentos PDF Seguro en Línea',
    description: 'Cree documentos PDF gratis en línea: contratos de trabajo, acuerdos, formularios administrativos. Generación IA, cifrado SSL y protección GDPR garantizados.',
    keywords: 'generador pdf gratis, crear documento pdf, contrato trabajo pdf, formulario administrativo, documentos legales, firma electrónica',
  },
  de: {
    title: 'iDoc - Kostenloser Sicherer PDF-Dokumentengenerator Online',
    description: 'Erstellen Sie kostenlos PDF-Dokumente online: Arbeitsverträge, Vereinbarungen, Verwaltungsformulare. KI-Generierung, SSL-Verschlüsselung und DSGVO-Schutz garantiert.',
    keywords: 'kostenloser pdf generator, pdf dokument erstellen, arbeitsvertrag pdf, verwaltungsformular, rechtsdokumente, elektronische signatur',
  },
  pt: {
    title: 'iDoc - Gerador Gratuito de Documentos PDF Seguro Online',
    description: 'Crie documentos PDF grátis online: contratos de trabalho, acordos, formulários administrativos. Geração IA, criptografia SSL e proteção GDPR garantidos.',
    keywords: 'gerador pdf gratis, criar documento pdf, contrato trabalho pdf, formulário administrativo, documentos legais, assinatura eletrônica',
  },
};

export function LanguageSEO() {
  const { language } = useLanguage();

  useEffect(() => {
    const meta = SEO_META[language] || SEO_META.en;

    document.title = meta.title;

    const updateMetaTag = (name: string, content: string) => {
      let tag = document.querySelector(`meta[name="${name}"]`);
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute('name', name);
        document.head.appendChild(tag);
      }
      tag.setAttribute('content', content);
    };

    updateMetaTag('description', meta.description);
    updateMetaTag('keywords', meta.keywords);

    const updateOGTag = (property: string, content: string) => {
      let tag = document.querySelector(`meta[property="${property}"]`);
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute('property', property);
        document.head.appendChild(tag);
      }
      tag.setAttribute('content', content);
    };

    updateOGTag('og:title', meta.title);
    updateOGTag('og:description', meta.description);
    updateOGTag('og:locale', `${language}_${language.toUpperCase()}`);

    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', `https://idoc.app/${language === 'en' ? '' : language}`);

  }, [language]);

  return null;
}
