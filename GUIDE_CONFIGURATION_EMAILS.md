# 📧 Guide de Configuration Emails - iDoc

## ✅ Edge Function Créée!

L'edge function `send-email` a été créée et est prête à être déployée. Elle utilise **Resend** pour l'envoi d'emails professionnels.

---

## 🚀 Étapes de Configuration (30 minutes)

### 1. Créer Compte Resend (5 min)

```
1. Aller sur https://resend.com
2. Sign Up (gratuit)
3. Confirmer votre email
4. Se connecter au dashboard
```

**Plan Gratuit:**
- ✅ 3,000 emails/mois
- ✅ API illimitée
- ✅ Support domaine personnalisé

---

### 2. Ajouter Votre Domaine (5 min)

```
1. Dashboard Resend → Domains
2. Cliquer "Add Domain"
3. Entrer: id0c.com
4. Cliquer "Add"
```

Resend va vous fournir les **enregistrements DNS** à ajouter.

---

### 3. Configurer DNS Records (10 min)

Aller dans votre provider DNS (Cloudflare, Vercel, etc.) et ajouter:

#### Record 1: SPF (Sender Policy Framework)
```
Type: TXT
Name: @
Value: v=spf1 include:_spf.resend.com ~all
TTL: 3600 (ou Auto)
```

#### Record 2: DKIM (DomainKeys)
```
Type: CNAME
Name: resend._domainkey
Value: [copier depuis Resend dashboard]
TTL: 3600 (ou Auto)
```

#### Record 3: Vérification Domaine
```
Type: TXT
Name: _resend
Value: [copier depuis Resend dashboard]
TTL: 3600 (ou Auto)
```

**Note:** La propagation DNS peut prendre de 15 minutes à 48 heures.

---

### 4. Vérifier le Domaine (2 min)

```
1. Retourner sur Resend Dashboard → Domains
2. Cliquer "Verify DNS Records"
3. Attendre validation ✅
```

Si pas vérifié immédiatement:
- Attendre 15-30 minutes
- Re-cliquer "Verify DNS Records"

**Vérifier manuellement:**
```bash
# Vérifier SPF
dig TXT id0c.com

# Vérifier DKIM
dig CNAME resend._domainkey.id0c.com

# Vérifier _resend
dig TXT _resend.id0c.com
```

---

### 5. Obtenir API Key (2 min)

```
1. Dashboard Resend → API Keys
2. Cliquer "Create API Key"
3. Nom: "iDoc Production"
4. Permission: Full Access
5. Cliquer "Create"
6. COPIER la clé (commence par re_...)
```

⚠️ **IMPORTANT:** La clé ne s'affichera qu'une fois! Copiez-la maintenant.

---

### 6. Déployer Edge Functions (5 min)

```bash
# 1. Déployer send-email
supabase functions deploy send-email

# 2. Déployer idoc-alert-notify (mis à jour)
supabase functions deploy idoc-alert-notify

# 3. Configurer secret Resend
supabase secrets set RESEND_API_KEY=re_votre_cle_ici
```

**Vérifier les secrets:**
```bash
supabase secrets list
```

Vous devriez voir:
```
RESEND_API_KEY (configured)
SUPABASE_URL (auto)
SUPABASE_SERVICE_ROLE_KEY (auto)
```

---

### 7. Tester l'Envoi (5 min)

#### A. Via Admin Dashboard

```
1. Aller dans Admin Dashboard
2. Onglet "Notifications"
3. Activer "Enable Email Notifications"
4. Ajouter votre email dans "Email Recipients"
5. Sauvegarder
6. Cliquer "Test Notifications"
```

Vous devriez recevoir un email de test! ✅

#### B. Via API directement

Créer un fichier `test-email.ts`:

```typescript
const supabaseUrl = 'https://your-project.supabase.co';
const supabaseKey = 'your-service-role-key';

const emailPayload = {
  to: ['votre.email@example.com'],
  subject: 'Test Email from iDoc',
  html: `
    <h1>Test Email</h1>
    <p>Si vous recevez ceci, l'intégration Resend fonctionne!</p>
  `,
  from: 'iDoc Alerts <alerts@id0c.com>'
};

const response = await fetch(`${supabaseUrl}/functions/v1/send-email`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${supabaseKey}`,
  },
  body: JSON.stringify(emailPayload)
});

const result = await response.json();
console.log('Result:', result);
```

Exécuter:
```bash
deno run --allow-net test-email.ts
```

---

## 📊 Monitoring

### Dashboard Resend

```
Dashboard → Analytics
```

Vous verrez:
- ✅ Emails envoyés
- ✅ Emails délivrés
- ✅ Bounces
- ✅ Opens (si tracking activé)
- ✅ Clicks (si tracking activé)

### Logs Supabase

```bash
# Voir logs send-email
supabase functions logs send-email

# Voir logs idoc-alert-notify
supabase functions logs idoc-alert-notify
```

---

## 🎯 Utilisation en Production

### Différents Types d'Emails

Vous pouvez maintenant envoyer:

#### 1. Alertes Système (déjà configuré)
```typescript
// Automatique via idoc-alert-notify
// Quand une alerte template est détectée
```

#### 2. Notifications Utilisateur
```typescript
const emailResponse = await fetch(`${supabaseUrl}/functions/v1/send-email`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${supabaseAnonKey}`,
  },
  body: JSON.stringify({
    to: ['client@example.com'],
    subject: 'Votre document est prêt',
    html: `
      <h1>Votre document est prêt!</h1>
      <p>Vous pouvez le télécharger maintenant.</p>
      <a href="https://id0c.com/documents/123">Télécharger</a>
    `,
    from: 'iDoc <no-reply@id0c.com>'
  })
});
```

#### 3. Confirmations de Commande
```typescript
await fetch(`${supabaseUrl}/functions/v1/send-email`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${supabaseAnonKey}`,
  },
  body: JSON.stringify({
    to: [userEmail],
    subject: 'Confirmation de paiement - iDoc',
    html: generateInvoiceHTML(orderDetails),
    from: 'iDoc Billing <billing@id0c.com>'
  })
});
```

#### 4. Emails Marketing
```typescript
// Pour bulk emails, utiliser batch API
const recipients = ['user1@email.com', 'user2@email.com'];

for (const email of recipients) {
  await fetch(`${supabaseUrl}/functions/v1/send-email`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${supabaseServiceKey}`,
    },
    body: JSON.stringify({
      to: [email],
      subject: 'Newsletter iDoc - Nouveaux Templates',
      html: newsletterHTML,
      from: 'iDoc Team <hello@id0c.com>'
    })
  });

  // Rate limiting: attendre 100ms entre emails
  await new Promise(resolve => setTimeout(resolve, 100));
}
```

---

## 🔒 Sécurité & Best Practices

### 1. Rate Limiting

Limiter à 10 emails/seconde:

```typescript
// Dans send-email/index.ts, ajouter:
const rateLimiter = new Map();

// Vérifier rate limit par IP/user
const clientKey = req.headers.get('x-client-id') || req.headers.get('cf-connecting-ip');
const now = Date.now();
const requests = rateLimiter.get(clientKey) || [];
const recentRequests = requests.filter(t => now - t < 1000);

if (recentRequests.length >= 10) {
  return new Response(
    JSON.stringify({ error: 'Rate limit exceeded' }),
    { status: 429, headers: corsHeaders }
  );
}

rateLimiter.set(clientKey, [...recentRequests, now]);
```

### 2. Validation Emails

```typescript
function isValidEmail(email: string): boolean {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

// Dans send-email/index.ts
const invalidEmails = to.filter(email => !isValidEmail(email));
if (invalidEmails.length > 0) {
  return new Response(
    JSON.stringify({ error: `Invalid emails: ${invalidEmails.join(', ')}` }),
    { status: 400, headers: corsHeaders }
  );
}
```

### 3. Sanitization HTML

```typescript
import DOMPurify from 'npm:isomorphic-dompurify@2.9.0';

// Dans send-email/index.ts
const sanitizedHtml = DOMPurify.sanitize(html, {
  ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'h1', 'h2', 'h3', 'a', 'ul', 'ol', 'li', 'table', 'tr', 'td', 'th'],
  ALLOWED_ATTR: ['href', 'style', 'class']
});
```

### 4. Unsubscribe Link (obligatoire)

```typescript
const emailHtml = `
  ${html}
  <hr style="margin-top: 30px; border: none; border-top: 1px solid #ddd;">
  <p style="text-align: center; color: #666; font-size: 12px;">
    <a href="https://id0c.com/unsubscribe?email=${encodeURIComponent(to[0])}">
      Se désabonner
    </a>
  </p>
`;
```

---

## 🐛 Dépannage

### Emails n'arrivent pas

**1. Vérifier logs:**
```bash
supabase functions logs send-email --tail
```

**2. Vérifier DNS:**
```bash
dig TXT id0c.com
dig CNAME resend._domainkey.id0c.com
```

**3. Vérifier Resend dashboard:**
- Dashboard → Logs
- Voir erreurs delivery

**4. Tester delivrabilité:**
```
https://www.mail-tester.com
Envoyer email test à l'adresse fournie
Score minimum: 8/10
```

### Emails dans Spam

**Solutions:**

1. **Configurer DMARC:**
```
Type: TXT
Name: _dmarc
Value: v=DMARC1; p=quarantine; rua=mailto:dmarc@id0c.com
```

2. **Réchauffer IP progressivement:**
```
Jour 1: 50 emails
Jour 2: 100 emails
Jour 3: 200 emails
...
Après 2 semaines: volume normal
```

3. **Éviter mots spam:**
- Free, Urgent, Act Now
- $$$ , !!!
- ALL CAPS

4. **Ajouter lien désabonnement**

### Erreur "Domain not verified"

```
1. Attendre propagation DNS (jusqu'à 48h)
2. Vérifier records DNS corrects
3. Re-cliquer "Verify" dans Resend
4. Contacter support Resend si persiste
```

### Erreur "RESEND_API_KEY not configured"

```bash
# Re-set le secret
supabase secrets set RESEND_API_KEY=re_votre_cle

# Vérifier
supabase secrets list

# Re-déployer
supabase functions deploy send-email
```

---

## 💰 Limites & Pricing

### Plan Gratuit
- ✅ 3,000 emails/mois
- ✅ 100 emails/jour
- ✅ 1 domaine
- ✅ API complète
- ✅ Logs 30 jours

### Plan Pro ($20/mois)
- ✅ 50,000 emails/mois
- ✅ Emails illimités/jour
- ✅ Domaines illimités
- ✅ Logs 90 jours
- ✅ Support prioritaire

### Dépassement
- $1 par 1,000 emails additionnels
- Pas de coupure service

---

## 📈 Optimisations

### Templates Emails Réutilisables

Créer: `email-templates.ts`

```typescript
export const alertEmailTemplate = (data: {
  severity: string;
  alertType: string;
  message: string;
  templateId?: string;
  details?: any;
  alertId: string;
}) => `
<!DOCTYPE html>
<html>
<head>
  <style>
    /* ... styles ... */
  </style>
</head>
<body>
  <div class="container">
    <!-- Template content -->
  </div>
</body>
</html>
`;

export const welcomeEmailTemplate = (userName: string) => `
  <!-- Welcome email -->
`;

export const invoiceEmailTemplate = (invoiceData: any) => `
  <!-- Invoice email -->
`;
```

Utiliser:
```typescript
import { alertEmailTemplate } from './email-templates.ts';

const html = alertEmailTemplate({
  severity: 'HIGH',
  alertType: 'Template Error',
  message: 'Issue detected',
  alertId: '123'
});
```

### Batch Sending

Pour envoyer à plusieurs destinataires efficacement:

```typescript
// Envoyer à maximum 50 destinataires par appel
const batchSize = 50;
for (let i = 0; i < recipients.length; i += batchSize) {
  const batch = recipients.slice(i, i + batchSize);

  await fetch(`${supabaseUrl}/functions/v1/send-email`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${supabaseKey}`,
    },
    body: JSON.stringify({
      to: batch,
      subject: 'Notification',
      html: emailHtml
    })
  });

  // Rate limiting: 100ms entre batches
  await new Promise(resolve => setTimeout(resolve, 100));
}
```

---

## ✅ Checklist Finale

- [ ] Compte Resend créé
- [ ] Domaine id0c.com ajouté dans Resend
- [ ] DNS SPF configuré
- [ ] DNS DKIM configuré
- [ ] DNS vérifié (status: verified ✅)
- [ ] API Key Resend obtenue
- [ ] Edge function send-email déployée
- [ ] Edge function idoc-alert-notify déployée
- [ ] Secret RESEND_API_KEY configuré
- [ ] Email test envoyé via Admin Dashboard
- [ ] Email test reçu dans inbox (pas spam)
- [ ] Score mail-tester.com ≥ 8/10
- [ ] Monitoring configuré

---

## 🎉 Félicitations!

Votre système d'emails professionnel est maintenant **opérationnel**!

**Vous pouvez maintenant:**
- ✅ Recevoir alertes système par email
- ✅ Envoyer notifications clients
- ✅ Envoyer confirmations de commande
- ✅ Envoyer newsletters
- ✅ Monitorer délivrabilité

**Prochaines étapes recommandées:**
1. Configurer DMARC pour sécurité maximale
2. Créer templates emails réutilisables
3. Implémenter tracking ouvertures/clics
4. Créer système unsubscribe
5. Monitorer métriques hebdomadaires

---

**Questions ou problèmes?** Consultez:
- Documentation Resend: https://resend.com/docs
- Support Resend: support@resend.com
- Logs Supabase: `supabase functions logs send-email`
