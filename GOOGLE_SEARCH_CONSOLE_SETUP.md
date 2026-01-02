# Google Search Console - Configuration complète

## Étape 1 : Vérifier la propriété du site

### A. Accéder à Google Search Console
1. Allez sur https://search.google.com/search-console
2. Connectez-vous avec votre compte Google
3. Cliquez sur "Ajouter une propriété"

### B. Choisir le type de propriété
**Option recommandée : Propriété de type "Domaine"**
- Entrez : `id0c.com`
- Cette option couvre automatiquement tous les sous-domaines et protocoles (http, https, www, non-www)

**Alternative : Propriété de type "Préfixe d'URL"**
- Entrez : `https://id0c.com`
- Plus simple mais couvre uniquement l'URL exacte

### C. Vérifier la propriété

**Méthode 1 : Enregistrement DNS (Recommandée pour propriété "Domaine")**
1. Google vous donnera un enregistrement TXT
2. Ajoutez cet enregistrement à votre DNS (chez votre hébergeur ou registrar)
3. Exemple : `google-site-verification=ABC123XYZ...`
4. Attendez quelques minutes (propagation DNS)
5. Cliquez sur "Vérifier"

**Méthode 2 : Fichier HTML (Pour propriété "Préfixe d'URL")**
1. Téléchargez le fichier HTML fourni par Google
2. Placez-le dans `/public/` de votre projet
3. Déployez en production
4. Le fichier sera accessible à `https://id0c.com/google[...].html`
5. Cliquez sur "Vérifier"

**Méthode 3 : Balise HTML (Pour propriété "Préfixe d'URL")**
1. Google vous donnera une balise meta
2. Ajoutez-la dans le `<head>` de votre `index.html`
3. Exemple : `<meta name="google-site-verification" content="ABC123..." />`
4. Déployez en production
5. Cliquez sur "Vérifier"

## Étape 2 : Soumettre le sitemap

### A. Vérifier que le sitemap est accessible
1. Allez sur https://id0c.com/sitemap.xml dans votre navigateur
2. Vérifiez que le fichier XML s'affiche correctement
3. Confirmez que les 6 nouvelles URLs `/modele/*` sont présentes

### B. Soumettre le sitemap à Google Search Console
1. Dans Google Search Console, allez dans "Sitemaps" (menu de gauche)
2. Entrez l'URL du sitemap : `sitemap.xml`
3. Cliquez sur "Envoyer"
4. Statut devrait passer à "Réussite" après quelques minutes

### C. Vérifier l'indexation
1. Attendez 24-48h pour que Google explore les nouvelles pages
2. Vérifiez dans "Couverture" (menu de gauche)
3. Les URLs `/modele/*` devraient apparaître dans "Pages valides"

## Étape 3 : Configurer les paramètres de crawl

### A. Exploration > robots.txt
1. Allez dans "Exploration" > "Tester le fichier robots.txt"
2. Vérifiez que `/modele/*` n'est PAS bloqué
3. Le fichier devrait contenir :
```
User-agent: *
Allow: /

Sitemap: https://id0c.com/sitemap.xml
```

### B. Paramètres d'exploration
1. Allez dans "Paramètres" (menu de gauche)
2. Vérifiez le taux d'exploration : "Laisser Google optimiser" (recommandé)
3. Aucun changement nécessaire sauf si vous avez des problèmes de bande passante

## Étape 4 : Demander l'indexation des pages SEO

### A. Méthode rapide : Inspection d'URL
1. Dans Google Search Console, utilisez l'outil "Inspection d'URL" (en haut)
2. Entrez chaque URL de page SEO :
   - `https://id0c.com/modele/lettre-explicative-refus-visa`
   - `https://id0c.com/modele/lettre-explicative-fonds-insuffisants`
   - `https://id0c.com/modele/visa-visiteur-lettre-motivation`
   - `https://id0c.com/modele/repondre-lettre-immigration-documents`
   - `https://id0c.com/modele/lettre-invitation-visa-canada`
   - `https://id0c.com/modele/caq-avis-intention-refus`
3. Cliquez sur "Demander l'indexation" pour chaque page
4. Google les explorera en priorité (quelques heures à quelques jours)

**Note :** Vous pouvez demander l'indexation de ~10 URLs par jour maximum.

## Étape 5 : Configurer les alertes et rapports

### A. Recevoir des notifications par email
1. Allez dans "Paramètres" > "Utilisateurs et autorisations"
2. Ajoutez votre email si ce n'est pas déjà fait
3. Allez dans "Paramètres" > "Notifications par e-mail"
4. Activez :
   - Problèmes de couverture critiques
   - Problèmes de sécurité
   - Actions manuelles (pénalités)
   - Erreurs de structured data

### B. Créer un rapport personnalisé
1. Allez dans "Performances" (menu de gauche)
2. Ajoutez des filtres :
   - Page : contient `/modele/`
3. Comparez avec la période précédente
4. Exportez les données régulièrement (CSV)

## Étape 6 : Surveiller les performances SEO

### A. Métriques à surveiller (hebdomadaire)

**1. Performances**
- Allez dans "Performances" > filtrez par `/modele/*`
- Surveillez :
  - **Impressions totales** : Nombre de fois où vos pages apparaissent dans les résultats
  - **Clics totaux** : Nombre de clics reçus
  - **CTR moyen** : Taux de clic (objectif : > 3%)
  - **Position moyenne** : Position dans les résultats (objectif : < 10)

**2. Couverture**
- Allez dans "Couverture"
- Vérifiez que toutes les pages `/modele/*` sont dans "Valide"
- Pas d'erreurs ni d'avertissements

**3. Core Web Vitals**
- Allez dans "Expérience" > "Core Web Vitals"
- Vérifiez que les pages `/modele/*` ont des scores "Bons" :
  - LCP < 2.5s
  - FID < 100ms
  - CLS < 0.1

**4. Structured Data (Rich Results)**
- Allez dans "Améliorations" > "FAQ"
- Vérifiez que les FAQs de vos pages SEO sont détectées
- Pas d'erreurs ni d'avertissements

### B. Requêtes à surveiller

Allez dans "Performances" > "Requêtes" et surveillez ces mots-clés :

**Silo Refus (priorité haute)**
- lettre explicative refus visa
- lettre après refus visa
- visa refused explanation letter
- lettre reconsidération visa

**Silo Visa**
- visa visiteur lettre motivation
- lettre motivation visa touriste
- preuves financières visa
- lettre invitation visa canada

**Silo Études**
- CAQ intention de refus
- lettre explicative interruption études
- permis études lettre

**Silo Lettres**
- répondre lettre immigration
- response letter immigration
- document missing explanation

### C. Actions si performances faibles

**Si position moyenne > 20 :**
1. Vérifiez la qualité du contenu (minimum 300 mots)
2. Ajoutez des variations du mot-clé principal
3. Améliorez le maillage interne (liens vers pages du même silo)
4. Ajoutez des liens externes de qualité pointant vers votre page

**Si CTR < 2% :**
1. Optimisez le titre (meta title) : plus accrocheur, bénéfice clair
2. Améliorez la description (meta description) : appel à l'action fort
3. Ajoutez des rich snippets (FAQPage schema est déjà en place)

**Si impressions faibles (< 100/mois après 2 mois) :**
1. Le mot-clé est peut-être trop concurrentiel ou trop niche
2. Créez du contenu support (articles de blog) avec liens vers la page SEO
3. Partagez la page sur réseaux sociaux pour signaler à Google

## Étape 7 : Intégration avec Google Analytics (optionnel mais recommandé)

### A. Lier GSC avec GA4
1. Dans Google Search Console, allez dans "Paramètres"
2. Cliquez sur "Associer une propriété Google Analytics"
3. Sélectionnez votre propriété GA4
4. Confirmez l'association

### B. Avantages de l'intégration
- Voir les données GSC directement dans GA4
- Combiner les métriques de recherche avec le comportement sur site
- Analyser le parcours complet : recherche → landing → conversion

## Étape 8 : Tests de validation

### A. Test de rich results
1. Allez sur https://search.google.com/test/rich-results
2. Entrez chaque URL `/modele/*`
3. Vérifiez que "FAQPage" est détecté sans erreur

### B. Test d'exploration
1. Dans GSC, utilisez "Inspection d'URL"
2. Cliquez sur "Tester l'URL en direct"
3. Vérifiez que la page se charge correctement pour Googlebot
4. Pas de ressources bloquées (CSS, JS, images)

### C. Test mobile
1. Dans GSC, allez dans "Expérience" > "Ergonomie mobile"
2. Vérifiez que toutes les pages `/modele/*` sont "Adaptées aux mobiles"
3. Pas d'erreurs de contenu trop large ou texte trop petit

## Étape 9 : Suivi et reporting

### A. Créer un tableau de bord hebdomadaire

**Semaine 1-4 (Phase de lancement)**
- Vérifier indexation (toutes les pages indexées ?)
- Suivre premières impressions
- Identifier premiers mots-clés générant du trafic

**Mois 2-3 (Phase de croissance)**
- Analyser tendances (impressions, clics, CTR, position)
- Identifier pages performantes vs sous-performantes
- Ajuster contenu des pages sous-performantes
- Créer du contenu support (articles de blog)

**Mois 4+ (Phase d'optimisation)**
- Comparer avec période précédente
- Calculer ROI SEO (trafic organique → conversions)
- Identifier nouvelles opportunités de mots-clés
- Expansion : créer nouvelles pages SEO

### B. Template de rapport mensuel

```markdown
## Rapport SEO - Pages /modele/* - [Mois Année]

### Résumé exécutif
- Impressions totales : X (+/- Y%)
- Clics totaux : X (+/- Y%)
- CTR moyen : X% (+/- Y pp)
- Position moyenne : X (+/- Y)

### Top 3 pages performantes
1. [URL] - X clics - Position moy. Y
2. [URL] - X clics - Position moy. Y
3. [URL] - X clics - Position moy. Y

### Top 5 requêtes
1. [Requête] - X impressions - Y clics - Position Z
2. [Requête] - X impressions - Y clics - Position Z
...

### Problèmes détectés
- [Liste des erreurs/avertissements GSC]
- [Pages non indexées]
- [Core Web Vitals à améliorer]

### Actions du mois prochain
- [ ] Action 1
- [ ] Action 2
- [ ] Action 3
```

## Étape 10 : Checklist finale

### Avant déploiement
- [ ] Propriété GSC vérifiée
- [ ] Sitemap.xml soumis
- [ ] robots.txt ne bloque pas `/modele/*`
- [ ] 6 pages SEO demandées à l'indexation
- [ ] Rich results testés (FAQPage valide)
- [ ] Mobile-friendly testé
- [ ] Core Web Vitals vérifiés

### Première semaine
- [ ] Vérifier que toutes les pages sont indexées
- [ ] Configurer alertes email
- [ ] Créer rapport de performances initial
- [ ] Lier avec Google Analytics (si applicable)

### Premier mois
- [ ] Analyser premières requêtes de recherche
- [ ] Identifier pages avec CTR < 2% (optimiser titles/descriptions)
- [ ] Créer 2-3 articles de blog avec liens vers pages SEO
- [ ] Partager pages SEO sur réseaux sociaux

### Deuxième mois
- [ ] Comparer avec mois 1
- [ ] Créer 2-3 nouvelles pages SEO pour long tail
- [ ] Améliorer maillage interne
- [ ] Commencer link building (guest posts, partenariats)

## Ressources utiles

### Documentation officielle
- Guide GSC : https://support.google.com/webmasters
- Rich Results Test : https://search.google.com/test/rich-results
- PageSpeed Insights : https://pagespeed.web.dev/

### Outils complémentaires
- Google Analytics 4 : https://analytics.google.com
- Schema.org validator : https://validator.schema.org
- Mobile-Friendly Test : https://search.google.com/test/mobile-friendly

### Articles de référence
- Google Search Central Blog : https://developers.google.com/search/blog
- Core Web Vitals Guide : https://web.dev/vitals/

## Support

Pour toute question :
1. Consultez la documentation officielle Google Search Console
2. Vérifiez les guides dans `/docs/idoc/SEO_STRATEGIE.md`
3. Consultez le plan de tests dans `/docs/idoc/TESTS_SEO_CONVERSION.md`
