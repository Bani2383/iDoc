# Stratégie SEO par silo (visa / études / refus / lettres)

## Objectif
Capter la longue traîne des requêtes "écrire une lettre..." et "modèle PDF..." avec des pages evergreen optimisées pour la conversion.

## Architecture par silos

### Silo 1 — Visa (intention transactionnelle élevée)
**Pages actives:**
- `/modele/visa-visiteur-lettre-motivation` ✅
- `/modele/lettre-explicative-fonds-insuffisants` ✅
- `/modele/lettre-invitation-visa-canada` ✅

**Pages à ajouter:**
- `/modele/lettre-explicative-liens-attache`
- `/modele/lettre-explicative-intention-retour`
- `/modele/lettre-explicative-hebergement-voyage`

**Mots-clés cibles:**
- visa visiteur lettre motivation
- lettre motivation visa touriste
- preuves financières visa
- liens d'attache visa
- lettre invitation visa

**Volume estimé:** 2 000-5 000 recherches/mois (FR+EN)

### Silo 2 — Études (Canada / Québec)
**Pages actives:**
- `/modele/caq-avis-intention-refus` ✅

**Pages à ajouter:**
- `/modele/lettre-explicative-interruption-etudes`
- `/modele/lettre-explicative-projet-etudes`
- `/modele/lettre-motivation-permis-etudes`
- `/modele/caq-renouvellement-lettre`

**Mots-clés cibles:**
- CAQ intention de refus
- lettre explicative interruption études
- projet d'études lettre
- permis études canada lettre

**Volume estimé:** 1 500-3 000 recherches/mois

### Silo 3 — Refus (le plus demandé)
**Pages actives:**
- `/modele/lettre-explicative-refus-visa` ✅

**Pages à ajouter:**
- `/modele/lettre-reconsideration-visa`
- `/modele/lettre-explicative-erreur-omission`
- `/modele/lettre-explicative-antecedents`
- `/modele/reponse-refus-ircc`

**Mots-clés cibles:**
- lettre après refus visa
- visa refused explanation letter
- reconsideration letter
- lettre explicative refus

**Volume estimé:** 5 000-10 000 recherches/mois (très forte demande)

### Silo 4 — Lettres administratives
**Pages actives:**
- `/modele/repondre-lettre-immigration-documents` ✅

**Pages à ajouter:**
- `/modele/lettre-reponse-documents-manquants`
- `/modele/lettre-fairness-ircc`
- `/modele/mise-a-jour-dossier-immigration`

**Mots-clés cibles:**
- respond to immigration letter
- additional documents letter
- fairness letter IRCC
- document missing explanation

**Volume estimé:** 1 000-2 000 recherches/mois

## Architecture technique des pages SEO

### Structure HTML optimale
```html
<main>
  <breadcrumb>Accueil / Modèles / {titre}</breadcrumb>
  <h1>{Titre avec mot-clé principal}</h1>
  <p>{Description 120-150 mots}</p>

  <CTA primaire>Générer le document</CTA>
  <CTA secondaire>Autre situation</CTA>

  <section>Pourquoi ce modèle (3 bénéfices)</section>
  <section>FAQ (3-5 questions)</section>
  <section>Modèles similaires (3 liens internes)</section>
  <section>Disclaimer</section>
</main>
```

### Métadonnées SEO par page
- **Title:** 55-60 caractères, mot-clé au début
- **Description:** 150-160 caractères, appel à l'action
- **Canonical:** URL propre sans paramètres
- **Schema.org:** FAQPage + WebPage
- **hreflang:** fr-CA (priorité), en-CA, fr-FR

### Optimisations techniques
1. **Performance:**
   - LCP < 2.5s (lazy loading images)
   - FID < 100ms (minimal JS)
   - CLS < 0.1 (dimensions fixes)

2. **Contenu:**
   - Minimum 300 mots par page
   - 1 H1, 2-4 H2, H3 si nécessaire
   - Densité mot-clé: 1-2% naturel
   - 3-5 liens internes vers même silo

3. **Conversion:**
   - CTA visible sans scroll (above the fold)
   - Bouton contrasté (noir sur blanc)
   - Texte action: "Générer" plutôt que "Créer"

## Maillage interne (interlinking)

### Règles de maillage
1. Chaque page renvoie vers 2-4 pages du même silo
2. 1 lien vers la page hub `/idoc` (entrée libre)
3. 1 lien vers silo connexe (ex: visa → études)
4. Footer: liens vers tous les silos

### Exemple pour `/modele/visa-visiteur-lettre-motivation`:
**Liens internes:**
- → `/modele/lettre-explicative-fonds-insuffisants` (même silo)
- → `/modele/lettre-invitation-visa-canada` (même silo)
- → `/modele/lettre-explicative-refus-visa` (silo connexe)
- → `/idoc` (hub principal)

### Structure de navigation
```
/idoc (hub)
  ├── /modele/* (pages SEO par slug)
  ├── /generateurs/* (si applicable)
  └── /blog/articles/* (contenu support)
```

## Stratégie de contenu

### Phase 1 (Actuel): Core pages
✅ 6 pages SEO actives couvrant 70% des intentions

### Phase 2 (Q1 2026): Expansion
- Ajouter 10-15 pages pour couvrir long tail
- Focus sur requêtes 100-500 recherches/mois
- Cibler variantes régionales (France, Belgique, Suisse)

### Phase 3 (Q2 2026): Content hub
- Articles blog support (guides détaillés)
- Études de cas anonymisées
- Comparateurs de situations

## KPIs SEO à suivre

### Métriques organiques
- **Impressions:** +50% Q1 2026
- **Clics organiques:** +80% Q1 2026
- **CTR moyen:** > 3% (actuellement ~1.5%)
- **Position moyenne:** Top 10 pour 60% des mots-clés

### Métriques de conversion
- **CTR CTA sur SEO pages:** > 10%
- **Completion wizard depuis SEO:** > 60%
- **SEO → Premium upgrade:** 3-5%

### Métriques techniques
- **Core Web Vitals:** 90%+ des pages "Good"
- **Index coverage:** 100% des pages SEO indexées
- **Mobile usability:** 0 erreurs

## Actions prioritaires

### Immédiat (Semaine 1)
✅ Déployer 6 pages SEO core
- [ ] Soumettre sitemap XML à Google Search Console
- [ ] Configurer suivi GA4 pour pages `/modele/*`
- [ ] Tester structured data (validator.schema.org)

### Court terme (Mois 1)
- [ ] Créer 5 pages additionnelles (expansion long tail)
- [ ] Optimiser maillage interne automatique
- [ ] A/B test CTA (texte + placement)
- [ ] Ajouter rich snippets (FAQ markup)

### Moyen terme (Mois 2-3)
- [ ] Analyser search queries GSC
- [ ] Créer contenu pour requêtes opportunistes
- [ ] Link building (partenariats, guest posts)
- [ ] Expansion multilingue (EN priorité)
