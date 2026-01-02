# Templates Guidés Disponibles

## Vue d'ensemble

**9 templates professionnels prêts à l'emploi**

Tous les templates utilisent le système de modèles guidés avec :
- ✅ Logique conditionnelle intelligente
- ✅ Validation avancée des champs
- ✅ Sections dynamiques
- ✅ Génération adaptative de documents
- ✅ Support multiformat (PDF gratuit, DOCX premium)

---

## 1. IRCC Refusal Letter Response
**Catégorie**: Immigration
**ID**: `ircc-refusal-response`

### Description
Répondez professionnellement à un refus d'IRCC avec des arguments structurés selon votre situation.

### Caractéristiques
- **5 étapes** conditionnelles
- **2 variantes** de document (Financial / Ties to Home)
- **Logique avancée** : Affiche des questions spécifiques selon le motif de refus

### Cas d'usage
- Refus pour insuffisance de fonds
- Refus pour attaches insuffisantes au pays d'origine
- Refus pour historique de voyage
- Refus pour documentation d'emploi

### Sections conditionnelles
- Clarification financière (si motif = insufficient_funds)
- Preuve d'attaches au pays (si motif = ties_to_home)
- Informations sur la propriété (si propriété = oui)

---

## 2. Visa Visiteur Universel
**Catégorie**: Immigration
**ID**: `visiteur-universel`

### Description
Lettre universelle pour demande de visa visiteur - adaptable à tous les pays et toutes les situations.

### Caractéristiques
- **6 étapes** structurées
- **Adaptatif** selon l'objet du voyage (tourisme, famille, affaires, événement)
- **Validation financière** : Compare budget vs fonds disponibles

### Cas d'usage
- Visa touristique
- Visite familiale
- Voyage d'affaires
- Participation à un événement

### Sections conditionnelles
- Objet touristique (si objet = TOURISME)
- Objet familial (si objet = FAMILLE)
- Objet professionnel (si objet = AFFAIRES)
- Historique de refus (si refus_anterieur = true)

---

## 3. CAQ - Réponse Simple
**Catégorie**: Immigration
**ID**: `caq-simple`

### Description
Réponse professionnelle pour demande de CAQ (Québec) - situation standard.

### Caractéristiques
- **3 étapes** ciblées
- **Gestion Article 14** : Période sans études
- **Gestion Article 15** : Assurance maladie
- **Gestion financière** : Solde scolaire (0 ou >0)

### Cas d'usage
- Première demande de CAQ
- Renouvellement de CAQ
- Réponse à demande de clarifications

### Sections conditionnelles
- Article 14 - Explication période sans études (si période_sans_etudes = true)
- Finances détaillées (si solde > 0)
- Finances abrégées (si solde = 0)
- Article 15 - Engagement assurance (si assurance_valide = false)

---

## 4. CAQ - Intention de Refus
**Catégorie**: Immigration
**ID**: `caq-intention-refus`

### Description
Répondez efficacement à un avis d'intention de refus de CAQ avec des arguments solides.

### Caractéristiques
- **3 étapes** stratégiques
- **Analyse des motifs** de refus
- **Contre-arguments** structurés
- **Documents additionnels** à fournir

### Cas d'usage
- Réponse à intention de refus
- Contestation de décision
- Reconsidération de demande

### Sections
- Introduction formelle
- Répétition des motifs invoqués
- Arguments de réponse détaillés
- Liste des documents additionnels
- Demande de reconsidération

---

## 5. IRCC CEC - Dispense de Fonds
**Catégorie**: Immigration
**ID**: `ircc-cec`

### Description
Lettre pour candidats Express Entry CEC demandant la dispense de preuve de fonds.

### Caractéristiques
- **3 étapes** spécifiques CEC
- **Focus emploi** au Canada
- **Justification** de l'établissement permanent

### Cas d'usage
- Entrée Express catégorie CEC
- Demande de dispense de fonds
- Candidats déjà établis au Canada

### Sections
- Introduction avec numéro ITA
- Situation professionnelle actuelle (employeur, poste, durée, revenu)
- Justification de la dispense
- Documents d'appui

---

## 6. IRCC Fairness Letter
**Catégorie**: Immigration
**ID**: `ircc-fairness`

### Description
Demande d'équité procédurale auprès d'IRCC - Invocation du droit à la justice naturelle.

### Caractéristiques
- **2 étapes** focalisées
- **Base légale** : Équité procédurale
- **Analyse d'impact** sur la décision

### Cas d'usage
- Manquement à l'équité procédurale
- Droits non respectés
- Demande de réévaluation équitable

### Sections
- Invocation du droit à l'équité
- Description du problème procédural
- Impact sur la décision
- Demande de reconsidération

---

## 7. IRCC - Lettre Générique
**Catégorie**: Immigration
**ID**: `ircc-generique`

### Description
Template flexible pour toute correspondance avec IRCC - Universel et adaptable.

### Caractéristiques
- **3 étapes** modulables
- **6 types de demandes** (Express Entry, Famille, Études, Travail, Visiteur, Autre)
- **Contenu libre** personnalisable

### Cas d'usage
- Documents additionnels
- Clarifications
- Mises à jour de dossier
- Communications générales avec IRCC

### Sections conditionnelles
- Documents joints (si documents_joints non vide)

---

## 8. Réponse à Lettre Officielle
**Catégorie**: Légal
**ID**: `reponse-lettre`

### Description
Template universel pour répondre à toute lettre officielle de manière professionnelle.

### Caractéristiques
- **4 étapes** structurées
- **Format formel** avec références
- **Suivi de deadline** (optionnel)

### Cas d'usage
- Réponse à Immigration
- Réponse à autorités fiscales
- Réponse à organismes gouvernementaux
- Toute correspondance officielle

### Sections conditionnelles
- Clarifications additionnelles (si clarification non vide)

---

## 9. Lettre d'Invitation
**Catégorie**: Immigration
**ID**: `invitation-hote`

### Description
Créez une invitation officielle pour accueillir un visiteur avec prise en charge optionnelle.

### Caractéristiques
- **3 étapes** complètes
- **3 niveaux de prise en charge** (Aucune, Partielle, Totale)
- **Format officiel** reconnu

### Cas d'usage
- Invitation de famille
- Invitation d'amis
- Visa visiteur
- Toute invitation formelle

### Sections conditionnelles
- Prise en charge AUCUNE (si prise_en_charge = AUCUNE)
- Prise en charge PARTIELLE (si prise_en_charge = PARTIELLE)
- Prise en charge TOTALE (si prise_en_charge = TOTALE)

---

## Comparaison Rapide

| Template | Étapes | Variantes | Sections Cond. | Complexité |
|----------|--------|-----------|----------------|------------|
| IRCC Refusal | 5 | 2 | 4 | ⭐⭐⭐⭐ |
| Visa Visiteur | 6 | 1 | 4 | ⭐⭐⭐⭐ |
| CAQ Simple | 3 | 1 | 4 | ⭐⭐⭐ |
| CAQ Intention Refus | 3 | 1 | 0 | ⭐⭐ |
| IRCC CEC | 3 | 1 | 0 | ⭐⭐ |
| IRCC Fairness | 2 | 1 | 0 | ⭐⭐ |
| IRCC Générique | 3 | 1 | 1 | ⭐⭐ |
| Réponse Lettre | 4 | 1 | 1 | ⭐⭐ |
| Invitation | 3 | 1 | 3 | ⭐⭐ |

---

## Fonctionnalités Communes

### Validation Intelligente
Tous les templates incluent :
- Champs requis avec messages clairs
- Validation email
- Validation de dates
- Validation de longueur minimale/maximale
- Messages d'erreur personnalisés

### Logique Conditionnelle
- Champs visibles selon les réponses
- Champs requis conditionnels
- Sections de document dynamiques
- Sélection automatique de variantes

### Tracking et Sauvegarde
- Sauvegarde automatique de brouillon (utilisateurs connectés)
- Barre de progression en temps réel
- Validation par étape
- Récupération de session

### Export et Formats
- **Free tier** : Téléchargement PDF
- **Premium tier** : PDF + DOCX, édition après génération

---

## Utilisation

### Pour les Utilisateurs
1. Cliquez sur "Modèles guidés" dans le header
2. Sélectionnez votre template
3. Suivez le wizard étape par étape
4. Seuls les champs pertinents s'affichent
5. Prévisualisez le document généré
6. Téléchargez en PDF (ou DOCX si premium)

### Pour les Admins
Les templates sont stockés en base de données et peuvent être :
- Modifiés via SQL
- Clonés pour créer des variantes
- Désactivés temporairement (`is_active = false`)
- Versionnés pour A/B testing

---

## Ajout de Nouveaux Templates

Consultez `TEMPLATE_CONFIG_EXAMPLES.md` pour des exemples détaillés.

### Structure de base
```json
{
  "id": "unique-id",
  "name": "Nom du Template",
  "description": "Description courte",
  "category": "immigration|legal|business|personal",
  "steps": [...],
  "variants": [...],
  "default_variant": "variant-id",
  "pricing": {...}
}
```

### Insertion en base
```sql
INSERT INTO guided_template_configs (name, description, category, is_active, config)
VALUES ('Nom', 'Description', 'categorie', true, '{...json...}'::jsonb);
```

---

## Statistiques d'Utilisation

### Templates par Catégorie
- **Immigration** : 8 templates (89%)
- **Légal** : 1 template (11%)

### Types de Documents
- **Réponses à refus** : 3 templates
- **Demandes initiales** : 3 templates
- **Correspondance générale** : 3 templates

### Couverture Géographique
- **Canada** : 7 templates (IRCC, CAQ, Visiteur Canada)
- **Universel** : 2 templates (Visiteur, Réponse lettre)
- **Québec spécifique** : 2 templates (CAQ)

---

## Roadmap Future

### Templates en Développement
- 🔜 Work Permit Support Letter
- 🔜 Study Permit Explanation
- 🔜 Business Visit Letter
- 🔜 Family Sponsorship Letter
- 🔜 PR Application Cover Letter

### Améliorations Prévues
- 🔜 Support multi-langues des templates
- 🔜 Variantes par pays (USA, UK, France, etc.)
- 🔜 AI-powered suggestions de contenu
- 🔜 Templates avec signature électronique intégrée
- 🔜 Export en plus de formats (RTF, HTML)

---

## Support Technique

### Documentation
- `GUIDED_TEMPLATES_INTEGRATION.md` - Architecture complète
- `TEMPLATE_CONFIG_EXAMPLES.md` - Exemples et patterns
- `INTEGRATION_SUMMARY.md` - Guide utilisateur

### Code Source
- `src/lib/guidedTemplateEngine.ts` - Moteur de règles
- `src/components/GuidedTemplate*.tsx` - Composants UI
- `supabase/migrations/*guided*` - Migrations base de données

---

**Dernière mise à jour** : 2 janvier 2026
**Status** : ✅ Production Ready
**Nombre total de templates** : 9
