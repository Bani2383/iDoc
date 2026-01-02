# Plan de tests SEO + Conversion (prêt à l'exécution)

## A) Tests SEO techniques

### 1. Indexabilité et crawl
**Objectif:** S'assurer que toutes les pages SEO sont crawlables et indexables

**Tests à exécuter:**
```bash
# Test 1: Vérifier HTTP status
curl -I https://id0c.com/modele/visa-visiteur-lettre-motivation
# Expected: 200 OK

# Test 2: Vérifier robots.txt
curl https://id0c.com/robots.txt | grep -i "disallow: /modele"
# Expected: aucune correspondance (pas de blocage)

# Test 3: Vérifier sitemap
curl https://id0c.com/sitemap.xml | grep "/modele/"
# Expected: présence des URLs /modele/*
```

**Checklist manuelle:**
- [ ] Chaque URL `/modele/[slug]` retourne 200 OK
- [ ] Aucune directive noindex dans les meta tags
- [ ] Canonical tag présent et correct
- [ ] Sitemap.xml inclut toutes les pages `/modele/*`
- [ ] Google Search Console: 0 erreur d'indexation

**Critères de succès:** 100% des pages accessibles et indexables

---

### 2. Métadonnées et balises
**Objectif:** Valider la présence et qualité des métadonnées SEO

**Tests automatisés:**
```javascript
// Test dans navigateur (Console DevTools)
document.querySelector('title').textContent.length // 55-60 chars
document.querySelector('meta[name="description"]').content.length // 150-160 chars
document.querySelectorAll('h1').length // exactly 1
document.querySelector('h1').textContent // contains main keyword
document.querySelector('link[rel="canonical"]').href // clean URL
```

**Checklist par page:**
- [ ] Title: 55-60 caractères, mot-clé au début
- [ ] Meta description: 150-160 caractères, CTA clair
- [ ] 1 seul H1 contenant le mot-clé principal
- [ ] H2 structurés (2-4 par page)
- [ ] Canonical URL sans paramètres
- [ ] Open Graph tags (og:title, og:description, og:image)

**Critères de succès:** 100% conformité sur toutes les pages

---

### 3. Performance (Core Web Vitals)
**Objectif:** LCP < 2.5s, FID < 100ms, CLS < 0.1

**Outils de test:**
- PageSpeed Insights: https://pagespeed.web.dev/
- Chrome DevTools Lighthouse
- WebPageTest.org

**Tests à effectuer:**
```bash
# Test performance avec Lighthouse CLI
npx lighthouse https://id0c.com/modele/visa-visiteur-lettre-motivation \
  --only-categories=performance \
  --chrome-flags="--headless" \
  --output=json
```

**Métriques cibles:**
- **LCP:** < 2.5s (Good) — élément le plus large visible
- **FID:** < 100ms (Good) — délai première interaction
- **CLS:** < 0.1 (Good) — stabilité visuelle
- **Performance Score:** > 90/100

**Actions si échec:**
- LCP > 2.5s → Lazy load images, optimiser images (WebP)
- FID > 100ms → Réduire JS bloquant, defer scripts
- CLS > 0.1 → Dimensions fixes pour images, éviter dynamic content

**Critères de succès:** 90%+ des pages "Good" pour tous les Core Web Vitals

---

### 4. Structured Data (Schema.org)
**Objectif:** Valider les rich snippets pour FAQ et WebPage

**Validation:**
```bash
# Test avec Google Rich Results Test
https://search.google.com/test/rich-results?url=https://id0c.com/modele/visa-visiteur-lettre-motivation
```

**Schema markup attendu:**
```json
{
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "...",
      "acceptedAnswer": { "@type": "Answer", "text": "..." }
    }
  ]
}
```

**Checklist:**
- [ ] Schema FAQPage valide (0 erreurs)
- [ ] Minimum 3 questions par page
- [ ] Pas de contenu promotionnel dans les réponses
- [ ] Structured data visible dans GSC

**Critères de succès:** 0 erreur dans Google Rich Results Test

---

## B) Tests SEO sémantiques

### 5. Qualité et densité du contenu
**Objectif:** Contenu pertinent, naturel, optimisé pour le mot-clé

**Métriques à mesurer:**
- Nombre de mots par page: minimum 300, cible 400-600
- Densité mot-clé principal: 1-2% (naturel)
- Variations du mot-clé: présence de synonymes
- Lisibilité: niveau Flesch-Kincaid > 60

**Test manuel:**
```
Mot-clé: "visa visiteur lettre motivation"
Occurrences dans:
- Title: 1
- H1: 1
- Body: 2-3 (naturel)
- Meta description: 1
Total: 5-6 occurrences sur ~400 mots = 1.25% ✓
```

**Critères de succès:**
- Contenu > 300 mots
- Densité 1-2%
- Pas de keyword stuffing

---

### 6. Maillage interne (Internal linking)
**Objectif:** 3-5 liens internes pertinents par page

**Test automatisé:**
```javascript
// Console DevTools
const internalLinks = Array.from(document.querySelectorAll('a'))
  .filter(a => a.href.includes('id0c.com') && !a.href.includes('#'))
  .map(a => a.href);
console.log('Internal links:', internalLinks.length);
// Expected: 3-5 liens minimum
```

**Checklist maillage:**
- [ ] 2-4 liens vers pages du même silo
- [ ] 1 lien vers hub `/idoc`
- [ ] 1 lien vers silo connexe
- [ ] Anchor text descriptif (pas de "cliquez ici")
- [ ] Liens ouvrent dans même onglet (sauf externes)

**Critères de succès:** 3-5 liens internes pertinents par page

---

## C) Tests conversion (UX)

### 7. Funnel de conversion
**Objectif:** Tracker le parcours de l'utilisateur depuis SEO jusqu'à génération

**Événements à tracker (GA4):**
```javascript
// 1. Landing sur page SEO
gtag('event', 'view_seo_page', { slug: 'visa-visiteur-lettre-motivation' });

// 2. Clic CTA "Générer le document"
gtag('event', 'click_cta_generate', { slug: 'visa-visiteur-lettre-motivation' });

// 3. Début wizard
gtag('event', 'wizard_start', { source: 'seo_page' });

// 4. Complétion wizard
gtag('event', 'wizard_complete', { template_id: 'visitor_visa_universal' });

// 5. Génération PDF
gtag('event', 'generate_pdf', { template_id: '...', user_tier: 'free' });

// 6. Upgrade view
gtag('event', 'upgrade_view', { trigger: 'paywall' });
```

**Métriques de conversion:**
| Étape | Métrique | Objectif |
|-------|----------|----------|
| SEO → CTA | CTR CTA | > 10% |
| CTA → Wizard start | Transition rate | > 90% |
| Wizard → Preview | Completion rate | > 60% |
| Preview → Generate | Generate rate | > 50% |
| Generate → Upgrade view | Paywall trigger | 100% (free) |
| Upgrade view → Purchase | Conversion rate | 3-5% |

**Critères de succès:** Completion rate > 60% et upgrade conversion > 3%

---

### 8. Tests A/B recommandés

#### Test 1: CTA principal
**Variante A (contrôle):** "Générer le document"
**Variante B:** "Créer ma lettre gratuitement"
**Variante C:** "Télécharger le PDF"

**Hypothèse:** Variante B (+clarification "gratuit") augmente CTR de 15-20%
**Métrique:** CTR du CTA
**Taille échantillon:** 1000 visites par variante
**Durée:** 2 semaines

#### Test 2: Position FAQ
**Variante A (contrôle):** FAQ en bas de page
**Variante B:** FAQ avant le premier CTA

**Hypothèse:** FAQ avant CTA rassure et augmente conversion
**Métrique:** CTR CTA + completion rate
**Taille échantillon:** 1000 visites par variante
**Durée:** 2 semaines

#### Test 3: Nombre d'exemples dans champ libre
**Variante A:** 3 exemples de situations
**Variante B:** 6 exemples de situations

**Hypothèse:** Plus d'exemples = meilleure compréhension = moins d'abandon
**Métrique:** Wizard completion rate
**Taille échantillon:** 500 complétions par variante
**Durée:** 3 semaines

---

### 9. Tests anti-friction

**Objectif:** Identifier et réduire les points de friction dans le funnel

**Tests utilisateurs (5 participants):**
1. **Tâche:** "Trouvez et générez une lettre pour visa visiteur refusé"
2. **Observer:**
   - Temps pour trouver la bonne page SEO
   - Hésitations sur le CTA
   - Difficultés dans le wizard
   - Erreurs de validation
   - Points d'abandon

**Points de friction courants:**
- [ ] Erreurs de validation incompréhensibles
- [ ] Champs obligatoires non indiqués clairement
- [ ] Perte de données lors du retour en arrière
- [ ] Wizard trop long (> 5 étapes)
- [ ] Paywall inattendu

**Actions correctives:**
- Messages d'erreur en français simple
- Indicateurs visuels pour champs requis
- Sauvegarde automatique (localStorage)
- Barre de progression visible
- Transparence sur limitations free tier

**Critères de succès:** Taux d'abandon < 40% à chaque étape

---

### 10. Tests de compatibilité

**Objectif:** S'assurer que l'expérience est optimale sur tous les devices

**Devices à tester:**
- [ ] Desktop Chrome (Windows)
- [ ] Desktop Safari (macOS)
- [ ] Mobile Chrome (Android)
- [ ] Mobile Safari (iOS)
- [ ] Tablet iPad (iOS)

**Checklist par device:**
- [ ] CTA visible sans scroll (above the fold)
- [ ] Formulaires utilisables (taille inputs, keyboard mobile)
- [ ] Pas de contenu coupé ou débordant
- [ ] Temps de chargement acceptable (< 3s)
- [ ] Boutons cliquables (min 44x44px)

**Critères de succès:** 100% fonctionnel sur tous les devices testés

---

## Planning d'exécution

### Semaine 1: Tests techniques (A1-A4)
- [ ] Jour 1: Indexabilité et crawl
- [ ] Jour 2: Métadonnées et balises
- [ ] Jour 3: Performance (Core Web Vitals)
- [ ] Jour 4: Structured Data
- [ ] Jour 5: Corrections et ré-tests

### Semaine 2: Tests sémantiques et maillage (B5-B6)
- [ ] Jour 1-2: Audit contenu et densité
- [ ] Jour 3-4: Vérification maillage interne
- [ ] Jour 5: Optimisations et ajustements

### Semaine 3-4: Tests conversion (C7-C10)
- [ ] Setup tracking GA4 complet
- [ ] Lancement tests A/B (durée 2-3 semaines)
- [ ] Tests utilisateurs qualitatifs
- [ ] Tests compatibilité multi-devices

### Semaine 5: Analyse et optimisation
- [ ] Analyse résultats A/B tests
- [ ] Priorisation des optimisations
- [ ] Implémentation changements
- [ ] Documentation learnings

---

## Rapports et suivi

### Dashboard SEO (hebdomadaire)
- Impressions / clics organiques (GSC)
- CTR moyen par page
- Positions moyennes par mot-clé
- Core Web Vitals status

### Dashboard conversion (quotidien)
- Trafic SEO → CTA clicks
- Wizard start → completion
- Generate → upgrade view
- Upgrade → payment success

### Alertes à configurer
🚨 **Critique:**
- Baisse > 20% trafic organique (jour/jour)
- Pages SEO retournant 404 ou 500
- Core Web Vitals "Poor" sur page majeure

⚠️ **Attention:**
- CTR CTA < 8% (vs objectif 10%)
- Completion rate < 50% (vs objectif 60%)
- Position moyenne > 15 pour mot-clé core

✅ **Succès:**
- Page atteint Top 3 pour mot-clé cible
- Conversion rate > 5% sur upgrade
- New keyword ranking (position < 20)
