# Guide de Lancement - Stratégie Volume Maximale

## Récapitulatif de la Stratégie

Tu as maintenant un système complet optimisé pour le VOLUME MAXIMAL de transactions:

### Composants Créés

1. **ExpressPaymentModal** - Checkout ultra-rapide en 10 secondes
2. **FOMONotification** - Preuve sociale temps réel
3. **CreditsGamification** - Système de fidélisation
4. **ExitIntentPopup** - Récupération visiteurs
5. **Système de Crédits** - Tables Supabase complètes
6. **Stripe Integration** - Edge function checkout-credits

### Prix Volume (0.49€ - 14.99€)

```
✅ 1 crédit → 0.49€
✅ 5 crédits → 1.99€ (-20%)
✅ 10 crédits + 1 bonus → 2.99€ (-40%) ⭐ POPULAIRE
✅ 25 crédits + 3 bonus → 5.99€ (-50%)
✅ 50 crédits + 10 bonus → 8.99€ (-60%)
✅ 100 crédits + 20 bonus → 14.99€ (-70%)
```

## Checklist de Lancement Immédiat

### Phase 1: Configuration (1 heure)

- [ ] **Stripe Setup**
  ```bash
  # 1. Aller sur https://dashboard.stripe.com
  # 2. Créer compte ou se connecter
  # 3. Aller dans Developers → API Keys
  # 4. Copier la clé secrète (sk_test_...)
  # 5. Dans Supabase Dashboard:
  #    Settings → Edge Functions → Add Secret
  #    Nom: STRIPE_SECRET_KEY
  #    Valeur: sk_test_...
  ```

- [ ] **Webhook Stripe**
  ```bash
  # Dans Stripe Dashboard:
  # Developers → Webhooks → Add endpoint
  # URL: https://[PROJET].supabase.co/functions/v1/stripe-webhook
  # Events: checkout.session.completed, payment_intent.succeeded
  ```

- [ ] **Variables Frontend**
  ```bash
  # Fichier .env
  VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
  ```

- [ ] **Test Paiement**
  ```bash
  # Carte test: 4242 4242 4242 4242
  # Faire un achat test de 1 crédit
  # Vérifier crédits ajoutés
  ```

### Phase 2: Tests (2 heures)

- [ ] Tester chaque pack de crédits
- [ ] Vérifier Apple Pay / Google Pay
- [ ] Tester mode invité (sans compte)
- [ ] Vérifier notifications FOMO apparaissent
- [ ] Confirmer compteur documents augmente
- [ ] Tester programme parrainage
- [ ] Vérifier daily streak fonctionne

### Phase 3: Contenu (3 heures)

- [ ] **CGV (Conditions Générales de Vente)**
  ```markdown
  # À créer avec:
  - Description produit (crédits virtuels)
  - Prix et packs disponibles
  - Durée validité (6 mois)
  - Politique remboursement (24h)
  - Contact support
  ```

- [ ] **Page Légale**
  ```
  /legal → Créer composant LegalPages.tsx
  - CGV
  - Mentions légales
  - Politique confidentialité
  - Politique cookies
  ```

- [ ] **FAQ Crédits**
  ```
  - "C'est quoi les crédits?"
  - "Combien de temps sont-ils valables?"
  - "Puis-je être remboursé?"
  - "Les crédits bonus sont-ils permanents?"
  ```

### Phase 4: Marketing (1 jour)

- [ ] **Google Ads - Recherche**
  ```
  Campagne 1: Transactionnel
  Budget: 20€/jour
  Mots-clés:
  - "générer document pdf"
  - "créer cv en ligne"
  - "modèle attestation"
  - "lettre motivation rapide"

  Annonce:
  "Créez Votre Document en 30 Sec
  À partir de 0.49€ · 3 Crédits Gratuits
  +147 Créations Aujourd'hui"

  Landing: ImprovedHomepage avec modal crédits
  ```

- [ ] **Facebook Ads - Conversion**
  ```
  Audience: France, 18-55 ans
  Intérêts: Emploi, Documents admin, Services pro
  Budget: 15€/jour

  Créatif:
  Vidéo 15 sec: "Document en 30 sec pour 49 centimes"
  CTA: "Essayer Gratuitement"
  Pixel: Installer Facebook Pixel pour retargeting
  ```

- [ ] **Contenu Organique**
  ```
  TikTok/Reels:
  - "Comment créer un CV pro en 30 secondes"
  - "L'astuce pour générer n'importe quel document"
  - "Pourquoi je paye 0.49€ pour mes docs"

  Format: Court (15-30 sec), captivant, CTA clair
  Fréquence: 2-3 posts/semaine
  ```

### Phase 5: Optimisation Continue

- [ ] **A/B Tests Prix** (Semaine 1-2)
  ```javascript
  Test 1: Pack 10 crédits
  - Variant A: 2.99€ (actuel)
  - Variant B: 2.49€
  - Variant C: 3.49€

  Mesure: Taux conversion, Revenue total
  Durée: 1 semaine, 1000 visiteurs min
  ```

- [ ] **A/B Tests CTA** (Semaine 2-3)
  ```javascript
  Test 2: Bouton paiement
  - Variant A: "Acheter X crédits - Y€"
  - Variant B: "Obtenir X crédits maintenant"
  - Variant C: "Télécharger avec X crédits"

  Mesure: CTR, Conversion
  ```

- [ ] **Analytics Quotidiennes**
  ```sql
  -- À checker chaque jour
  SELECT
    COUNT(*) as transactions,
    SUM(amount_paid) as revenue,
    AVG(amount_paid) as avg_basket,
    COUNT(DISTINCT user_id) as unique_buyers
  FROM credit_purchases
  WHERE DATE(created_at) = CURRENT_DATE
  AND status = 'completed';
  ```

## Métriques de Succès

### Semaine 1 (Objectifs Minimaux)
```
✅ 50 transactions
✅ 200€ revenue
✅ Taux conversion 5%
✅ 0 erreurs paiement
```

### Mois 1 (Objectifs Réalistes)
```
✅ 1000 transactions
✅ 750€ revenue
✅ Taux conversion 10%
✅ 100 utilisateurs récurrents
```

### Mois 3 (Objectifs Ambitieux)
```
✅ 4500 transactions
✅ 3000€ revenue
✅ Taux conversion 15%
✅ 500 utilisateurs actifs
```

### Mois 6 (Objectifs Explosifs)
```
✅ 20000 transactions
✅ 15000€ revenue
✅ Taux conversion 20%
✅ 2000 utilisateurs actifs
```

## Automatisations Critiques

### 1. Email Automation

```javascript
// À configurer dans Supabase Edge Function
const emailSequences = {
  // Après signup
  welcome: {
    trigger: 'user_created',
    delay: '0 minutes',
    subject: '🎁 Tes 3 crédits gratuits t\'attendent!',
    cta: 'Créer mon premier document'
  },

  // Après 1er document
  firstDoc: {
    trigger: 'first_document_created',
    delay: '5 minutes',
    subject: '✅ Bravo! Et si tu essayais un autre doc?',
    cta: 'Pack 10 crédits à -40%'
  },

  // Crédits presque épuisés
  lowCredits: {
    trigger: 'credits_balance < 2',
    delay: 'immediate',
    subject: '⚠️ Plus que 2 crédits restants',
    cta: 'Recharger maintenant'
  },

  // Abandonné panier
  abandoned: {
    trigger: 'checkout_started_not_completed',
    delay: '30 minutes',
    subject: '🔥 -50% sur ta commande (expire dans 2h)',
    cta: 'Finaliser mon achat'
  },

  // Inactif 7 jours
  inactive: {
    trigger: 'last_activity > 7 days',
    delay: '0',
    subject: '😢 Tu nous manques! Voici 2 crédits bonus',
    cta: 'Retourner sur iDoc'
  }
};
```

### 2. Push Notifications

```javascript
// À implémenter via service worker
const pushNotifications = {
  dailyBonus: {
    time: '10:00',
    message: '🎁 Ton crédit quotidien est dispo!'
  },

  streakRisk: {
    trigger: 'no_login_today && time === 20:00',
    message: '🔥 Ne perds pas ta série de 5 jours!'
  },

  newTemplate: {
    trigger: 'new_template_published',
    message: '🆕 Nouveau modèle: {template_name}'
  },

  friendJoined: {
    trigger: 'referral_signup',
    message: '👋 {friend_name} t\'a rejoint! +3 crédits'
  }
};
```

### 3. Retargeting Auto

```javascript
// Facebook Pixel + Google Ads
const audiences = {
  visitedNotBought: {
    days: 30,
    offer: '-50% premier achat',
    budget: '10€/jour'
  },

  boughtOnce: {
    days: 60,
    offer: 'Pack 25 crédits -50%',
    budget: '15€/jour'
  },

  highValue: {
    criteria: 'total_spent > 20€',
    offer: 'Programme VIP exclusif',
    budget: '20€/jour'
  }
};
```

## Scaling Plan

### Mois 1-3: Validation
```
Focus: Product-Market Fit
- Itérer sur pricing
- Optimiser UX checkout
- Tester différents messages
- Collecter feedback users

Budget Marketing: 500€/mois
Objectif: 3000€ revenue
```

### Mois 4-6: Croissance
```
Focus: Acquisition Scale
- Multiplier canaux qui marchent
- Lancer partenariats B2B
- Automatiser onboarding
- Programme ambassadeurs

Budget Marketing: 2000€/mois
Objectif: 15000€ revenue
ROI Target: 3x
```

### Mois 7-12: Domination
```
Focus: Market Leadership
- Expansion européenne
- API pour intégrations
- White-label pour entreprises
- Levée de fonds optionnelle

Budget Marketing: 10000€/mois
Objectif: 90000€ revenue
ROI Target: 5x
```

## Support & Troubleshooting

### Problèmes Fréquents

**❌ Stripe webhook ne fonctionne pas**
```bash
# Solution:
1. Vérifier URL webhook dans Stripe Dashboard
2. Tester avec stripe CLI: stripe trigger checkout.session.completed
3. Checker logs dans Supabase: Edge Functions → stripe-webhook → Logs
4. Confirmer STRIPE_SECRET_KEY configuré
```

**❌ Crédits non ajoutés après paiement**
```sql
-- Debug:
SELECT * FROM credit_purchases
WHERE stripe_session_id = 'cs_test_...'
ORDER BY created_at DESC;

-- Si status = 'pending', webhook pas reçu
-- Si status = 'completed', vérifier:
SELECT credits_balance FROM user_profiles WHERE id = '...';
```

**❌ Notifications FOMO n'apparaissent pas**
```javascript
// Vérifier dans console navigateur:
// Doit afficher toutes les 15 secondes
// Checker que FOMONotification est bien importé dans App.tsx
```

**❌ Paiement refusé**
```
Causes communes:
1. Carte test incorrecte (utiliser 4242 4242 4242 4242)
2. Mode test/prod mismatch (clés API)
3. Stripe account pas activé
4. 3D Secure mal configuré

Solution: Vérifier Stripe Dashboard → Payments → Failed
```

## Ressources Utiles

### Documentation
- Stripe Docs: https://stripe.com/docs
- Supabase Docs: https://supabase.com/docs
- React Docs: https://react.dev

### Outils Analytics
- Google Analytics 4 (gratuit)
- Stripe Dashboard (inclus)
- Supabase Analytics (inclus)

### Support
- Stripe Support: support@stripe.com
- Supabase Discord: https://discord.supabase.com
- iDoc GitHub: [lien repo]

## Checklist Pre-Launch Production

### Technique
- [ ] Tests complets paiements
- [ ] Backup base données configuré
- [ ] Monitoring erreurs (Sentry)
- [ ] SSL/HTTPS activé
- [ ] CDN configuré (images)
- [ ] Cache optimisé

### Légal
- [ ] CGV publiées
- [ ] Mentions légales
- [ ] Politique confidentialité RGPD
- [ ] Cookies banner
- [ ] Contact support visible

### Marketing
- [ ] Google Analytics installé
- [ ] Facebook Pixel installé
- [ ] SEO meta tags
- [ ] Sitemap.xml
- [ ] robots.txt
- [ ] Favicon

### Business
- [ ] Compte bancaire business
- [ ] Numéro SIRET/TVA
- [ ] Assurance RC Pro
- [ ] Comptabilité configurée

## Commandes Rapides

```bash
# Déployer edge functions
npm run deploy-functions

# Build production
npm run build

# Tester localement
npm run dev

# Appliquer migrations
supabase db push

# Voir logs Stripe webhook
supabase functions logs stripe-webhook

# Backup base données
supabase db dump > backup.sql
```

## Contact & Questions

Pour toute question sur l'implémentation:
- Consulter STRATEGIE_VOLUME_MAXIMAL.md (stratégie complète)
- Consulter CONFIGURATION_STRIPE_VOLUME.md (config Stripe détaillée)
- Ouvrir issue GitHub
- Email support

---

## 🚀 Message Final

Tu as maintenant TOUT ce qu'il faut pour générer un volume massif de transactions:

✅ **Système complet** - De A à Z fonctionnel
✅ **Prix agressifs** - 0.49€ pour démarrer
✅ **UX optimisée** - Checkout en 10 secondes
✅ **Gamification** - Fidélisation automatique
✅ **FOMO** - Preuve sociale en temps réel
✅ **Stripe intégré** - Paiements sécurisés
✅ **Analytics** - Suivi temps réel

**Next Step:** Configure Stripe et lance ta première campagne Google Ads à 20€/jour!

**Objectif Mois 1:** 1000 transactions = 750€

**GO! 🔥**
