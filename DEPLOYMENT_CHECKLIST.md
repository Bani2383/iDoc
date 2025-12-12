# 🚀 Checklist de Déploiement iDoc

## ✅ AVANT LE DÉPLOIEMENT

### 1. Configuration Base de Données
- [x] Supabase configuré et accessible
- [x] 45+ migrations appliquées
- [x] 107 templates actifs
- [x] 21 articles de blog publiés
- [ ] **Créer un admin dans `user_profiles` avec `role='admin'`**

### 2. Variables d'Environnement
Vérifier que toutes les variables sont configurées dans Vercel/Production:

**Supabase (CRITIQUE)**
```bash
VITE_SUPABASE_URL=https://votre-projet.supabase.co
VITE_SUPABASE_ANON_KEY=votre_anon_key
```

**Stripe (si paiements activés)**
```bash
VITE_STRIPE_PUBLIC_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

### 3. Configuration Domaine
- [x] Domaine acheté (id0c.com)
- [ ] DNS configuré
- [ ] SSL/HTTPS activé automatiquement
- [ ] Redirections www → non-www (ou inverse)

### 4. Contenu & SEO
- [x] 107 templates configurés
- [x] 21 articles SEO publiés
- [ ] **Générer sitemap.xml** (voir section ci-dessous)
- [ ] Vérifier robots.txt
- [ ] Ajouter Google Analytics (optionnel)
- [ ] Ajouter Google Search Console

### 5. Pages Légales (IMPORTANT)
- [ ] **Page Mentions Légales**
- [ ] **Conditions Générales d'Utilisation (CGU)**
- [ ] **Politique de Confidentialité (RGPD)**
- [ ] **Conditions Générales de Vente (CGV)** si paiements

---

## 🔨 DÉPLOIEMENT SUR VERCEL

### Étape 1: Installation Vercel CLI
```bash
npm install -g vercel
```

### Étape 2: Connexion
```bash
vercel login
```

### Étape 3: Premier déploiement
```bash
vercel
```

### Étape 4: Configuration variables d'environnement
Via dashboard Vercel:
1. Aller dans Settings → Environment Variables
2. Ajouter toutes les variables ci-dessus
3. Redéployer

### Étape 5: Production
```bash
vercel --prod
```

---

## 📊 APRÈS LE DÉPLOIEMENT

### 1. Tests Essentiels
- [ ] Page d'accueil charge correctement
- [ ] Inscription/Connexion fonctionne
- [ ] Génération de document fonctionne
- [ ] Téléchargement PDF fonctionne
- [ ] Signature électronique fonctionne
- [ ] Responsive mobile OK
- [ ] Pas d'erreurs console

### 2. SEO & Performance
- [ ] Générer et soumettre sitemap à Google Search Console
- [ ] Test vitesse (PageSpeed Insights > 90)
- [ ] Test mobile-friendly
- [ ] Balises meta correctes
- [ ] Open Graph pour réseaux sociaux

### 3. Monitoring
- [ ] Configurer Sentry (erreurs) - optionnel
- [ ] Configurer Google Analytics
- [ ] Activer alertes Vercel
- [ ] Tester backup base de données Supabase

### 4. Marketing
- [ ] Créer comptes réseaux sociaux
- [ ] Préparer posts de lancement
- [ ] Email à liste beta testeurs
- [ ] Soumettre à Product Hunt (optionnel)

---

## 🔧 COMMANDES UTILES

### Générer sitemap dynamique
```bash
npx ts-node scripts/generateDynamicSitemap.ts
```

### Build local test
```bash
npm run build
npm run preview
```

### Vérifier types TypeScript
```bash
npm run typecheck
```

### Déploiement urgence (rollback)
```bash
vercel rollback
```

---

## ⚠️ POINTS D'ATTENTION

### Sécurité
- ✅ RLS activé sur toutes les tables
- ✅ Toutes les politiques testées
- ⚠️ **NE JAMAIS commiter les clés API**
- ⚠️ Utiliser variables d'environnement

### Performance
- ✅ Images lazy-loaded
- ✅ Service Worker PWA
- ✅ Code splitting automatique (Vite)
- ⚠️ Vérifier bundle size < 500KB gzippé

### Légal
- ⚠️ **RGPD obligatoire avant lancement EU**
- ⚠️ Cookies consent si analytics
- ⚠️ CGU/CGV pour protection juridique

---

## 📞 SUPPORT POST-LANCEMENT

### Issues connues
- Migration: Aucune connue actuellement
- Build: Build réussi (1.8 MB total)
- Tests: Playwright configuré

### Contact urgence
- Supabase: dashboard.supabase.com
- Vercel: vercel.com/dashboard
- Documentation: docs.idoc.com (à créer)

---

## ✨ OPTIMISATIONS POST-LANCEMENT

### Semaine 1
- [ ] Analyser comportement utilisateurs (Hotjar)
- [ ] Corriger bugs reportés
- [ ] Optimiser pages les plus visitées

### Mois 1
- [ ] A/B testing pricing page
- [ ] Ajouter plus de templates selon demandes
- [ ] Mettre en place email marketing

### Trimestre 1
- [ ] API publique
- [ ] Intégrations tierces
- [ ] Programme affiliation

---

## 🎯 MÉTRIQUES DE SUCCÈS

**Objectifs premiers 3 mois:**
- 1000+ utilisateurs inscrits
- 10 000+ documents générés
- 100+ abonnements Pro
- Taux conversion 2-5%
- NPS > 50

---

**✅ Site prêt au lancement une fois cette checklist complétée!**
