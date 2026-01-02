export type MappedDocType = {
  document_type: 'IMMIGRATION_LETTRE' | 'VISA_VISITEUR_UNIVERSEL' | 'REPONSE_LETTRE' | 'INVITATION' | 'LETTRE_EXPLICATIVE_GENERIQUE';
  sous_type_lettre?: string;
  autorite?: 'IRCC' | 'CAQ';
  confidence: number;
  hints?: string[];
  suggestedTemplateId?: string;
};

const normalize = (s: string): string =>
  (s || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const hasAny = (q: string, keywords: string[]): boolean =>
  keywords.some(k => q.includes(k));

export function mapFreeTextToDocType(freeText: string): MappedDocType {
  const q = normalize(freeText);

  if (hasAny(q, ['visa visiteur', 'visitor visa', 'tourist visa', 'visa tourisme', 'voyage touristique'])) {
    return {
      document_type: 'VISA_VISITEUR_UNIVERSEL',
      confidence: 0.9,
      suggestedTemplateId: 'visitor_visa_universal'
    };
  }

  if (hasAny(q, ['invitation', 'lettre d invitation', 'host letter', 'inviter', 'heberger'])) {
    return {
      document_type: 'INVITATION',
      confidence: 0.85,
      suggestedTemplateId: 'invitation_letter'
    };
  }

  if (hasAny(q, ['repondre', 'reponse', 'document manquant', 'clarification', 'additional documents', 'fairness'])) {
    return {
      document_type: 'REPONSE_LETTRE',
      confidence: 0.85,
      suggestedTemplateId: 'response_letter'
    };
  }

  if (hasAny(q, ['ircc', 'express entry', 'entree express', 'cec', 'experience canadienne'])) {
    return {
      document_type: 'IMMIGRATION_LETTRE',
      autorite: 'IRCC',
      confidence: 0.8,
      hints: ['ASK_IRCC_TYPE'],
      suggestedTemplateId: 'ircc_cec_funds_exemption'
    };
  }

  if (hasAny(q, ['caq', 'mifi', 'quebec', 'intention de refus', 'etudes quebec'])) {
    return {
      document_type: 'IMMIGRATION_LETTRE',
      autorite: 'CAQ',
      confidence: 0.8,
      hints: ['ASK_CAQ_TYPE'],
      suggestedTemplateId: 'caq_refusal_intent'
    };
  }

  if (hasAny(q, ['refus', 'refuse', 'refused', 'denial', 'rejected', 'rejet'])) {
    return {
      document_type: 'LETTRE_EXPLICATIVE_GENERIQUE',
      sous_type_lettre: 'REFUS',
      confidence: 0.85,
      suggestedTemplateId: 'ircc_refusal_response'
    };
  }

  if (hasAny(q, ['fonds', 'argent', 'finances', 'bank', 'financial', 'proof of funds', 'ressources'])) {
    return {
      document_type: 'LETTRE_EXPLICATIVE_GENERIQUE',
      sous_type_lettre: 'FONDS',
      confidence: 0.8
    };
  }

  if (hasAny(q, ['attaches', 'liens', 'ties', 'return', 'retour', 'quitter'])) {
    return {
      document_type: 'LETTRE_EXPLICATIVE_GENERIQUE',
      sous_type_lettre: 'ATTACHES',
      confidence: 0.75
    };
  }

  if (hasAny(q, ['emploi', 'travail', 'job', 'work', 'employment', 'employeur'])) {
    return {
      document_type: 'LETTRE_EXPLICATIVE_GENERIQUE',
      sous_type_lettre: 'ACTIVITE_PRO',
      confidence: 0.7
    };
  }

  if (hasAny(q, ['voyage', 'travel history', 'historique', 'visas precedents'])) {
    return {
      document_type: 'LETTRE_EXPLICATIVE_GENERIQUE',
      sous_type_lettre: 'HISTORIQUE_VOYAGE',
      confidence: 0.7
    };
  }

  if (hasAny(q, ['erreur', 'mistake', 'omission', 'incorrect', 'correction'])) {
    return {
      document_type: 'LETTRE_EXPLICATIVE_GENERIQUE',
      sous_type_lettre: 'ERREUR',
      confidence: 0.75
    };
  }

  return {
    document_type: 'LETTRE_EXPLICATIVE_GENERIQUE',
    sous_type_lettre: 'OBJET_SEJOUR',
    confidence: 0.5,
    hints: ['GENERIC_FALLBACK']
  };
}

export function getSuggestedQuestions(mapped: MappedDocType): string[] {
  const questions: string[] = [];

  if (mapped.document_type === 'IMMIGRATION_LETTRE') {
    if (mapped.autorite === 'IRCC') {
      questions.push('Quel est le type de votre demande IRCC ? (CEC, FSW, documents manquants...)');
    } else if (mapped.autorite === 'CAQ') {
      questions.push('Avez-vous reçu un avis d\'intention de refus ?');
    } else {
      questions.push('Quelle autorité traite votre demande ? (IRCC ou CAQ)');
    }
  }

  if (mapped.document_type === 'VISA_VISITEUR_UNIVERSEL') {
    questions.push('Quel est le pays de destination ?');
    questions.push('Quel est l\'objet de votre voyage ?');
  }

  if (mapped.confidence < 0.7) {
    questions.push('Pouvez-vous préciser davantage votre situation ?');
  }

  return questions;
}
