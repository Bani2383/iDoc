# Guide de déploiement - Pages SEO /modele/

## Pré-requis

- [x] Routing intégré dans App.tsx
- [x] Sitemap.xml mis à jour avec les 6 pages SEO
- [x] Build réussi (testé localement)
- [x] Variables d'environnement Supabase configurées

## Étape 1 : Vérifications avant déploiement

### A. Build local
```bash
npm run build
```

**Vérifier :**
- Build réussi sans erreurs TypeScript
- Taille des bundles acceptable (< 500KB par chunk principal)
- Tous les lazy imports fonctionnent

### B. Test en local
```bash
npm run preview
```

**Tester manuellement :**
1. Accédez à http://localhost:4173
2. Testez chaque URL de page SEO :
   - `/modele/lettre-explicative-refus-visa`
   - `/modele/lettre-explicative-fonds-insuffisants`
   - `/modele/visa-visiteur-lettre-motivation`
   - `/modele/repondre-lettre-immigration-documents`
   - `/modele/lettre-invitation-visa-canada`
   - `/modele/caq-avis-intention-refus`

**Vérifier pour chaque page :**
- [ ] Page se charge sans erreur
- [ ] Contenu correct (H1, description, FAQ)
- [ ] CTA "Générer le document" fonctionne
- [ ] Liens "Modèles similaires" fonctionnent
- [ ] Responsive (mobile + desktop)
- [ ] Pas d'erreur console

### C. Vérifier le sitemap
```bash
cat public/sitemap.xml | grep "/modele/"
```

**Doit afficher les 6 URLs :**
```xml
<loc>https://id0c.com/modele/lettre-explicative-refus-visa</loc>
<loc>https://id0c.com/modele/lettre-explicative-fonds-insuffisants</loc>
<loc>https://id0c.com/modele/visa-visiteur-lettre-motivation</loc>
<loc>https://id0c.com/modele/repondre-lettre-immigration-documents</loc>
<loc>https://id0c.com/modele/lettre-invitation-visa-canada</loc>
<loc>https://id0c.com/modele/caq-avis-intention-refus</loc>
```

## Étape 2 : Déploiement sur Vercel

### A. Via Git (Recommandé)

**1. Commit les changements**
```bash
git add .
git commit -m "feat: Add SEO landing pages /modele/* with enhanced NLP mapper"
git push origin main
```

**2. Vercel déploie automatiquement**
- Vercel détecte le push sur `main`
- Build automatique lancé
- Preview deployment créé
- Si succès, déploiement en production

**3. Suivre le déploiement**
- Allez sur https://vercel.com/[votre-projet]
- Cliquez sur le dernier déploiement
- Vérifiez les logs en temps réel

### B. Via CLI Vercel (Alternative)

**1. Installer Vercel CLI (si pas déjà fait)**
```bash
npm i -g vercel
```

**2. Login**
```bash
vercel login
```

**3. Déployer**
```bash
# Preview deployment (pour tester)
vercel

# Production deployment
vercel --prod
```

## Étape 3 : Vérifications post-déploiement

### A. Test des URLs en production

**Tester chaque page SEO :**
```bash
curl -I https://id0c.com/modele/lettre-explicative-refus-visa
# Doit retourner: HTTP/2 200
```

**Ou dans le navigateur :**
1. https://id0c.com/modele/lettre-explicative-refus-visa
2. https://id0c.com/modele/lettre-explicative-fonds-insuffisants
3. https://id0c.com/modele/visa-visiteur-lettre-motivation
4. https://id0c.com/modele/repondre-lettre-immigration-documents
5. https://id0c.com/modele/lettre-invitation-visa-canada
6. https://id0c.com/modele/caq-avis-intention-refus

**Vérifier :**
- [ ] Page charge en < 3 secondes
- [ ] Contenu complet affiché
- [ ] Pas d'erreur console
- [ ] Responsive sur mobile

### B. Vérifier le sitemap en production
```bash
curl https://id0c.com/sitemap.xml | grep "/modele/"
```

**Doit afficher les 6 URLs.**

### C. Test de routing
1. Accédez à une page SEO
2. Cliquez sur un lien interne (ex: "Autre situation")
3. Vérifiez que la navigation fonctionne sans rechargement complet
4. Utilisez le bouton retour du navigateur
5. Vérifiez que l'historique fonctionne

### D. Test du CTA "Générer le document"
1. Sur une page SEO, cliquez sur "Générer le document"
2. Vérifiez que l'utilisateur est redirigé vers `/idoc`
3. Vérifiez que les champs sont pré-remplis (seed data)
4. Testez la génération d'un PDF

## Étape 4 : Monitoring initial

### A. Vérifier les Core Web Vitals (PageSpeed Insights)
```bash
# Tester 2-3 pages SEO
open "https://pagespeed.web.dev/analysis?url=https://id0c.com/modele/lettre-explicative-refus-visa"
```

**Objectifs :**
- LCP < 2.5s
- FID < 100ms
- CLS < 0.1
- Performance Score > 85

### B. Vérifier le structured data
```bash
# Rich Results Test
open "https://search.google.com/test/rich-results?url=https://id0c.com/modele/lettre-explicative-refus-visa"
```

**Vérifier :**
- [ ] FAQPage détecté
- [ ] 0 erreurs
- [ ] Questions/réponses bien formatées

### C. Vérifier l'ergonomie mobile
```bash
# Mobile-Friendly Test
open "https://search.google.com/test/mobile-friendly?url=https://id0c.com/modele/lettre-explicative-refus-visa"
```

**Doit afficher :** "La page est adaptée aux mobiles"

## Étape 5 : Google Search Console (Post-déploiement)

### A. Demander l'indexation immédiate
1. Allez sur https://search.google.com/search-console
2. Utilisez "Inspection d'URL" (barre en haut)
3. Pour chaque URL `/modele/*` :
   - Entrez l'URL complète
   - Cliquez sur "Demander l'indexation"
4. Répétez pour les 6 pages

**Note :** Limite de ~10 demandes par jour. Priorisez les pages les plus importantes.

### B. Vérifier le sitemap
1. Dans GSC, allez dans "Sitemaps"
2. Vérifiez que `sitemap.xml` est listé
3. Si ce n'est pas déjà fait, soumettez-le :
   - Entrez : `sitemap.xml`
   - Cliquez sur "Envoyer"
4. Statut devrait être "Réussite" après quelques minutes
5. Vérifiez que les 6 nouvelles URLs sont détectées

### C. Suivre l'indexation (dans les 24-48h)
1. Allez dans "Couverture" (menu de gauche)
2. Filtrez par `/modele/`
3. Vérifiez que les pages passent de "Découvert – non indexé" à "Valide"

## Étape 6 : Tests de conversion (72h après déploiement)

### A. Analytics (GA4)
Si Google Analytics est configuré :
1. Vérifiez que les pages `/modele/*` enregistrent des vues
2. Créez un rapport personnalisé filtrant sur `/modele/`
3. Surveillez :
   - Pages vues
   - Taux de rebond
   - Clics sur CTA "Générer"
   - Completions du wizard

### B. Test utilisateur manuel
1. Partagez une URL de page SEO avec 5 personnes (collègues, amis)
2. Demandez-leur de :
   - Lire la page
   - Cliquer sur "Générer le document"
   - Compléter le wizard
3. Collectez feedback :
   - Clarté du contenu ?
   - CTA visible et compréhensible ?
   - Difficultés dans le wizard ?

### C. Monitoring des erreurs
1. Vérifiez les logs Vercel
2. Cherchez des erreurs 404, 500 sur `/modele/*`
3. Vérifiez la console du navigateur (erreurs JS)

## Étape 7 : Optimisations post-lancement

### A. Ajuster selon les Core Web Vitals

**Si LCP > 2.5s :**
```bash
# Optimiser les images
npm install --save-dev @squoosh/lib
# Utiliser lazy loading agressif
# Preload critical resources
```

**Si CLS > 0.1 :**
- Ajouter dimensions fixes pour tous les éléments (images, containers)
- Éviter d'injecter du contenu dynamiquement au-dessus du fold

### B. A/B Testing (après 2 semaines)
Si trafic suffisant (> 100 visites/semaine) :
1. Tester variantes de CTA :
   - "Générer le document" vs "Créer ma lettre gratuite"
2. Tester position de FAQ :
   - Avant CTA vs après CTA
3. Tester nombre d'exemples dans descriptions

### C. Améliorer le contenu (basé sur GSC)
Après 1 mois :
1. Analysez les "Requêtes" dans GSC
2. Identifiez les requêtes avec :
   - Position moyenne entre 11-20 (page 2)
   - CTR < 1%
3. Ajoutez ces termes dans le contenu de vos pages
4. Optimisez titles/descriptions pour améliorer CTR

## Étape 8 : Expansion (optionnel)

### A. Créer de nouvelles pages SEO
Basé sur les données GSC (mois 2-3) :
1. Identifiez les requêtes avec volume mais pas de page dédiée
2. Ajoutez de nouvelles pages dans `/src/idoc/seo/slugs.ts`
3. Déployez
4. Soumettez à GSC

### B. Créer du contenu support
1. Rédigez 2-3 articles de blog par mois
2. Liez vers les pages `/modele/*` pertinentes
3. Exemple : "Comment répondre à un refus de visa" → lien vers `/modele/lettre-explicative-refus-visa`

### C. Link building
1. Partenariats avec sites complémentaires
2. Guest posts sur blogs immigration
3. Mentions dans forums/communautés (Reddit, Facebook groups)

## Checklist finale de déploiement

### Avant déploiement
- [ ] Build local réussi
- [ ] Test preview local réussi
- [ ] Toutes les pages SEO fonctionnent
- [ ] Sitemap.xml inclut les nouvelles URLs
- [ ] Variables d'environnement configurées

### Déploiement
- [ ] Code poussé sur Git
- [ ] Build Vercel réussi
- [ ] Deployment preview testé
- [ ] Deployed to production

### Post-déploiement (immédiat)
- [ ] Toutes les URLs /modele/* accessibles (HTTP 200)
- [ ] Sitemap.xml accessible
- [ ] Pas d'erreurs console
- [ ] Mobile-friendly test réussi
- [ ] Core Web Vitals "Good"
- [ ] Rich results valides (FAQPage)

### Post-déploiement (24-48h)
- [ ] Pages demandées à l'indexation (GSC)
- [ ] Sitemap soumis à GSC
- [ ] Premières impressions dans GSC
- [ ] Analytics enregistre les vues

### Post-déploiement (1 semaine)
- [ ] Toutes les pages indexées (GSC Couverture)
- [ ] Premières requêtes de recherche identifiées
- [ ] Aucun problème critique (GSC Notifications)
- [ ] CTR CTA > 5% (minimum acceptable)

### Post-déploiement (1 mois)
- [ ] Analyse complète des performances SEO
- [ ] Rapport mensuel créé
- [ ] Optimisations identifiées et priorisées
- [ ] Plan pour mois 2 établi

## Rollback en cas de problème

Si un problème critique est détecté en production :

### Rollback via Vercel UI
1. Allez sur https://vercel.com/[votre-projet]/deployments
2. Trouvez le dernier déploiement stable (avant les changements)
3. Cliquez sur les 3 points → "Promote to Production"
4. Confirmez

### Rollback via CLI
```bash
vercel rollback [deployment-url]
```

### Rollback via Git
```bash
git revert HEAD
git push origin main
```

## Support et ressources

### Documentation
- Guide SEO : `/docs/idoc/SEO_STRATEGIE.md`
- Plan de tests : `/docs/idoc/TESTS_SEO_CONVERSION.md`
- Configuration GSC : `/GOOGLE_SEARCH_CONSOLE_SETUP.md`
- Implémentation : `/SEO_IMPLEMENTATION.md`

### Outils utiles
- PageSpeed Insights : https://pagespeed.web.dev/
- Rich Results Test : https://search.google.com/test/rich-results
- Mobile-Friendly Test : https://search.google.com/test/mobile-friendly
- Google Search Console : https://search.google.com/search-console

### Monitoring
- Vercel Dashboard : https://vercel.com/dashboard
- Google Search Console : https://search.google.com/search-console
- Google Analytics (si configuré) : https://analytics.google.com

---

**Note finale :** Ce guide suppose que Vercel est déjà configuré pour votre projet. Si ce n'est pas le cas, suivez d'abord le guide d'installation Vercel : https://vercel.com/docs
