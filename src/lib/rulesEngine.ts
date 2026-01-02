/**
 * Rules Engine for Guided Templates (Idoc)
 *
 * Isolated module for conditional logic, validation, and template routing
 * Does NOT modify existing template system
 */

// ============================================================================
// TYPES
// ============================================================================

export type DocumentType =
  | 'IMMIGRATION_LETTRE'
  | 'VISA_VISITEUR_UNIVERSEL'
  | 'REPONSE_LETTRE'
  | 'INVITATION'
  | 'LETTRE_EXPLICATIVE_GENERIQUE';

export type AuthoriteType = 'IRCC' | 'CAQ';

export type IRCCType = 'CEC' | 'AUTRE_EE' | 'DOC_MANQUANT' | 'FAIRNESS';

export type ObjetVoyage = 'TOURISME' | 'FAMILLE' | 'AFFAIRES' | 'EVENEMENT' | 'AUTRE';

export type HebergementType = 'HOTEL' | 'CHEZ_PROCHE' | 'AUTRE';

export type PriseEnCharge = 'AUCUNE' | 'PARTIELLE' | 'TOTALE';

export type SousTypeLettre =
  | 'REFUS'
  | 'FONDS'
  | 'ATTACHES'
  | 'DECLARATION'
  | 'CHANGEMENT_SITUATION'
  | 'HISTORIQUE_VOYAGE'
  | 'OBJET_SEJOUR'
  | 'RELATION'
  | 'ERREUR'
  | 'ANTECEDENTS'
  | 'RETOUR'
  | 'INTENTION_QUITTER'
  | 'HEBERGEMENT'
  | 'ASSURANCE'
  | 'ACTIVITE_PRO'
  | 'REVENU'
  | 'SOUTIEN_FINANCIER'
  | 'SITUATION_FAMILIALE'
  | 'EVENEMENT'
  | 'PARCOURS_ACADEMIQUE'
  | 'PROJET_PRO'
  | 'DEPENDANCE'
  | 'SEJOUR_COURT'
  | 'DEPASSEMENT'
  | 'HISTORIQUE_EMPLOI';

export interface GuidedTemplateInputs {
  document_type: DocumentType;

  // Immigration lettre
  autorite?: AuthoriteType;
  ircc_type?: IRCCType;
  caq_avis_refus?: boolean;
  periode_sans_etudes?: boolean;
  solde_scolaire?: number;
  assurance_valide?: boolean;

  // Visa visiteur
  visa_visiteur?: {
    pays_destination: string;
    objet_voyage: ObjetVoyage;
    date_depart: string;
    date_retour: string;
    itineraire?: string;
    hebergement_type: HebergementType;
    hebergement_details: string;
    budget_estime: number;
    fonds_disponibles: number;
    source_fonds: string;
    attaches_emploi: string;
    attaches_famille?: string;
    attaches_obligations?: string;
    refus_anterieur: boolean;
    refus_details?: string;
  };

  // Réponse à une lettre
  reponse_lettre?: {
    autorite_lettre: string;
    date_lettre_recue: string;
    echeance_reponse?: string;
    liste_points: string[];
    liste_pieces: string[];
    clarification?: string;
  };

  // Invitation
  invitation?: {
    hote_nom: string;
    hote_date_naissance: string;
    hote_adresse: string;
    visiteur_nom: string;
    visiteur_date_naissance: string;
    visiteur_adresse: string;
    lien_hote_visiteur: string;
    dates_visite: string;
    prise_en_charge: PriseEnCharge;
    prise_en_charge_details?: string;
  };

  // Lettre explicative générique
  sous_type_lettre?: SousTypeLettre;

  // Variables communes
  variables: {
    nom_demandeur: string;
    ville: string;
    pays: string;
    date: string;
    numero_demande?: string;
    date_ita?: string;
    nom_etudiant?: string;
    date_naissance?: string;
    dates_concernees?: string;
    montant_scolarite_total?: number;
    montant_scolarite_paye?: number;
    montant_solde?: number;
    montant_subsistance?: number;
  };
}

export interface ValidationError {
  field: string;
  message: string;
  rule: string;
}

export interface TemplateRoute {
  template_id: string;
  sections_to_include: string[];
  sections_to_exclude: string[];
}

// ============================================================================
// VALIDATORS
// ============================================================================

export class RulesEngine {
  /**
   * Validates that return date is after departure date
   */
  static validateDateRetourAfterDateDepart(
    date_depart: string,
    date_retour: string
  ): ValidationError | null {
    const depart = new Date(date_depart);
    const retour = new Date(date_retour);

    if (retour <= depart) {
      return {
        field: 'visa_visiteur.date_retour',
        message: 'La date de retour doit être après la date de départ',
        rule: 'date_retour_after_date_depart'
      };
    }

    return null;
  }

  /**
   * Validates that available funds are sufficient vs budget
   */
  static validateFondsSuffisantsVsBudget(
    fonds_disponibles: number,
    budget_estime: number,
    min_ratio: number = 1.0
  ): ValidationError | null {
    if (fonds_disponibles < budget_estime * min_ratio) {
      return {
        field: 'visa_visiteur.fonds_disponibles',
        message: `Les fonds disponibles (${fonds_disponibles}) doivent couvrir au moins ${min_ratio * 100}% du budget estimé (${budget_estime})`,
        rule: 'fonds_suffisants_vs_budget'
      };
    }

    return null;
  }

  /**
   * Validates refus details are provided when refus_anterieur is true
   */
  static validateRefusDetails(
    refus_anterieur: boolean,
    refus_details?: string
  ): ValidationError | null {
    if (refus_anterieur && (!refus_details || refus_details.trim().length < 10)) {
      return {
        field: 'visa_visiteur.refus_details',
        message: 'Vous devez expliquer le refus antérieur (minimum 10 caractères)',
        rule: 'refus_details_required'
      };
    }

    return null;
  }

  /**
   * Validates all inputs based on document type
   */
  static validate(inputs: GuidedTemplateInputs): ValidationError[] {
    const errors: ValidationError[] = [];

    // Common validations
    if (!inputs.variables.nom_demandeur || inputs.variables.nom_demandeur.length < 2) {
      errors.push({
        field: 'variables.nom_demandeur',
        message: 'Le nom du demandeur est requis (minimum 2 caractères)',
        rule: 'required_field'
      });
    }

    if (!inputs.variables.ville || inputs.variables.ville.length < 2) {
      errors.push({
        field: 'variables.ville',
        message: 'La ville est requise',
        rule: 'required_field'
      });
    }

    if (!inputs.variables.pays || inputs.variables.pays.length < 2) {
      errors.push({
        field: 'variables.pays',
        message: 'Le pays est requis',
        rule: 'required_field'
      });
    }

    // Document type specific validations
    switch (inputs.document_type) {
      case 'VISA_VISITEUR_UNIVERSEL':
        if (!inputs.visa_visiteur) {
          errors.push({
            field: 'visa_visiteur',
            message: 'Les informations du visa visiteur sont requises',
            rule: 'required_object'
          });
          break;
        }

        // Date validation
        const dateError = this.validateDateRetourAfterDateDepart(
          inputs.visa_visiteur.date_depart,
          inputs.visa_visiteur.date_retour
        );
        if (dateError) errors.push(dateError);

        // Funds validation
        const fundsError = this.validateFondsSuffisantsVsBudget(
          inputs.visa_visiteur.fonds_disponibles,
          inputs.visa_visiteur.budget_estime
        );
        if (fundsError) errors.push(fundsError);

        // Refus details validation
        const refusError = this.validateRefusDetails(
          inputs.visa_visiteur.refus_anterieur,
          inputs.visa_visiteur.refus_details
        );
        if (refusError) errors.push(refusError);
        break;

      case 'IMMIGRATION_LETTRE':
        if (!inputs.autorite) {
          errors.push({
            field: 'autorite',
            message: 'L\'autorité (IRCC ou CAQ) est requise',
            rule: 'required_field'
          });
        }

        if (inputs.autorite === 'IRCC' && !inputs.ircc_type) {
          errors.push({
            field: 'ircc_type',
            message: 'Le type de demande IRCC est requis',
            rule: 'required_if'
          });
        }

        if (inputs.autorite === 'IRCC' && inputs.ircc_type === 'CEC' && !inputs.variables.date_ita) {
          errors.push({
            field: 'variables.date_ita',
            message: 'La date de l\'ITA est requise pour les demandes CEC',
            rule: 'required_if'
          });
        }

        if (inputs.autorite === 'CAQ' && !inputs.variables.nom_etudiant) {
          errors.push({
            field: 'variables.nom_etudiant',
            message: 'Le nom de l\'étudiant est requis pour les demandes CAQ',
            rule: 'required_if'
          });
        }
        break;

      case 'REPONSE_LETTRE':
        if (!inputs.reponse_lettre) {
          errors.push({
            field: 'reponse_lettre',
            message: 'Les informations de réponse sont requises',
            rule: 'required_object'
          });
          break;
        }

        if (!inputs.reponse_lettre.liste_points || inputs.reponse_lettre.liste_points.length === 0) {
          errors.push({
            field: 'reponse_lettre.liste_points',
            message: 'Au moins un point doit être listé',
            rule: 'min_items'
          });
        }

        if (!inputs.reponse_lettre.liste_pieces || inputs.reponse_lettre.liste_pieces.length === 0) {
          errors.push({
            field: 'reponse_lettre.liste_pieces',
            message: 'Au moins une pièce jointe doit être listée',
            rule: 'min_items'
          });
        }
        break;

      case 'INVITATION':
        if (!inputs.invitation) {
          errors.push({
            field: 'invitation',
            message: 'Les informations d\'invitation sont requises',
            rule: 'required_object'
          });
        }
        break;
    }

    return errors;
  }

  /**
   * Routes to the correct template based on inputs
   */
  static routeToTemplate(inputs: GuidedTemplateInputs): TemplateRoute {
    const route: TemplateRoute = {
      template_id: '',
      sections_to_include: [],
      sections_to_exclude: []
    };

    // Select base template
    if (inputs.document_type === 'VISA_VISITEUR_UNIVERSEL') {
      route.template_id = 'VISITEUR_universel';
    } else if (inputs.document_type === 'REPONSE_LETTRE') {
      route.template_id = 'REPONSE_lettre';
    } else if (inputs.document_type === 'INVITATION') {
      route.template_id = 'INVITATION_hote';
    } else if (inputs.document_type === 'LETTRE_EXPLICATIVE_GENERIQUE') {
      route.template_id = `LETTRE_EXPLICATIVE_${inputs.sous_type_lettre || 'GENERIQUE'}`;
    } else if (inputs.document_type === 'IMMIGRATION_LETTRE') {
      if (inputs.autorite === 'IRCC') {
        if (inputs.ircc_type === 'CEC') {
          route.template_id = 'IRCC_CEC_dispense_fonds';
        } else if (inputs.ircc_type === 'FAIRNESS') {
          route.template_id = 'IRCC_fairness';
        } else {
          route.template_id = 'IRCC_generique';
        }
      } else if (inputs.autorite === 'CAQ') {
        if (inputs.caq_avis_refus) {
          route.template_id = 'CAQ_intention_refus';
        } else {
          route.template_id = 'CAQ_simple';
        }
      }
    }

    // Determine sections to include/exclude
    if (inputs.autorite === 'CAQ' && inputs.periode_sans_etudes) {
      route.sections_to_include.push('Article_14');
    }

    if (inputs.solde_scolaire !== undefined) {
      if (inputs.solde_scolaire > 0) {
        route.sections_to_include.push('Capacite_financiere_detaillee');
        route.sections_to_exclude.push('Capacite_financiere_abregee');
      } else {
        route.sections_to_include.push('Capacite_financiere_abregee');
        route.sections_to_exclude.push('Capacite_financiere_detaillee');
      }
    }

    if (inputs.autorite === 'CAQ' && inputs.assurance_valide === false) {
      route.sections_to_include.push('Article_15');
    }

    // Always append disclaimer
    route.sections_to_include.push('Disclaimer_Idoc');

    return route;
  }

  /**
   * Intelligently maps free text input to document type and subtype
   */
  static interpretFreeText(text: string): Partial<GuidedTemplateInputs> {
    const lowerText = text.toLowerCase().trim();

    // Visa visiteur
    if (lowerText.includes('visa visiteur') || lowerText.includes('tourist visa')) {
      return { document_type: 'VISA_VISITEUR_UNIVERSEL' };
    }

    // Invitation
    if (lowerText.includes('invitation') || lowerText.includes('lettre d\'invitation')) {
      return { document_type: 'INVITATION' };
    }

    // Réponse à une lettre
    if (lowerText.includes('répondre') || lowerText.includes('réponse à') || lowerText.includes('document manquant')) {
      return { document_type: 'REPONSE_LETTRE' };
    }

    // Refus
    if (lowerText.includes('refus')) {
      return {
        document_type: 'LETTRE_EXPLICATIVE_GENERIQUE',
        sous_type_lettre: 'REFUS'
      };
    }

    // Fonds
    if (lowerText.includes('fonds') || lowerText.includes('insuffisant') || lowerText.includes('argent')) {
      return {
        document_type: 'LETTRE_EXPLICATIVE_GENERIQUE',
        sous_type_lettre: 'FONDS'
      };
    }

    // Attaches
    if (lowerText.includes('attache') || lowerText.includes('lien') || lowerText.includes('retour')) {
      return {
        document_type: 'LETTRE_EXPLICATIVE_GENERIQUE',
        sous_type_lettre: 'ATTACHES'
      };
    }

    // IRCC / CAQ
    if (lowerText.includes('ircc') || lowerText.includes('immigration canada')) {
      return {
        document_type: 'IMMIGRATION_LETTRE',
        autorite: 'IRCC'
      };
    }

    if (lowerText.includes('caq') || lowerText.includes('québec')) {
      return {
        document_type: 'IMMIGRATION_LETTRE',
        autorite: 'CAQ'
      };
    }

    // Default: generic letter
    return {
      document_type: 'LETTRE_EXPLICATIVE_GENERIQUE'
    };
  }

  /**
   * Generates SEO-friendly slug for template
   */
  static generateSlug(inputs: GuidedTemplateInputs): string {
    const parts: string[] = ['lettre'];

    if (inputs.document_type === 'VISA_VISITEUR_UNIVERSEL') {
      parts.push('visa-visiteur');
      if (inputs.visa_visiteur?.pays_destination) {
        parts.push(inputs.visa_visiteur.pays_destination.toLowerCase().replace(/\s+/g, '-'));
      }
    } else if (inputs.document_type === 'INVITATION') {
      parts.push('invitation-visa');
    } else if (inputs.document_type === 'REPONSE_LETTRE') {
      parts.push('reponse-immigration');
    } else if (inputs.document_type === 'LETTRE_EXPLICATIVE_GENERIQUE' && inputs.sous_type_lettre) {
      parts.push('explicative');
      parts.push(inputs.sous_type_lettre.toLowerCase().replace(/_/g, '-'));
    } else if (inputs.document_type === 'IMMIGRATION_LETTRE') {
      if (inputs.autorite === 'IRCC') {
        parts.push('ircc');
        if (inputs.ircc_type) {
          parts.push(inputs.ircc_type.toLowerCase().replace(/_/g, '-'));
        }
      } else if (inputs.autorite === 'CAQ') {
        parts.push('caq');
        if (inputs.caq_avis_refus) {
          parts.push('refus');
        }
      }
    }

    return parts.join('-');
  }

  /**
   * Generates filename for PDF export
   */
  static generateFilename(inputs: GuidedTemplateInputs): string {
    const date = inputs.variables.date.replace(/\//g, '-');
    const nom = inputs.variables.nom_demandeur.replace(/\s+/g, '_');
    const slug = this.generateSlug(inputs);

    return `${slug}_${nom}_${date}.pdf`;
  }
}
