# Configuration des Emails avec Votre Domaine

## 📧 Options Recommandées

### Option 1: Resend (RECOMMANDÉ) ⭐

**Pourquoi Resend?**
- ✅ **Simple et moderne**: API claire, setup rapide
- ✅ **Gratuit jusqu'à 3,000 emails/mois**: Parfait pour démarrer
- ✅ **Excellent pour SaaS**: Conçu pour applications web
- ✅ **Dashboard intuitif**: Visualisation emails envoyés
- ✅ **Support TypeScript**: Librairie officielle
- ✅ **Templates HTML**: Support natif

**Tarifs:**
- Gratuit: 3,000 emails/mois
- Pro: $20/mois = 50,000 emails
- Plus: Contact pour volume

**Configuration:**

#### 1. Créer un compte Resend
```
1. Aller sur https://resend.com
2. Sign up (gratuit)
3. Confirmer email
```

#### 2. Vérifier votre domaine
```
1. Dashboard Resend → Domains → Add Domain
2. Entrer votre domaine: id0c.com
3. Copier les enregistrements DNS fournis
```

#### 3. Ajouter DNS Records
Aller dans votre provider DNS (ex: Cloudflare, Vercel, etc.) et ajouter:

```
Type: TXT
Name: _resend
Value: [fourni par Resend]
TTL: Auto

Type: TXT
Name: @
Value: v=spf1 include:resend.io ~all
TTL: Auto

Type: CNAME
Name: resend._domainkey
Value: [fourni par Resend]
TTL: Auto
```

#### 4. Obtenir API Key
```
1. Dashboard Resend → API Keys
2. Create API Key
3. Nom: "iDoc Notifications"
4. Copier la clé (commence par re_...)
```

#### 5. Installer Resend
```bash
npm install resend
```

#### 6. Créer Edge Function
Fichier: `supabase/functions/send-email/index.ts`

```typescript
import { Resend } from 'npm:resend@2.0.0';
import { getCorsHeaders } from '../_shared/cors.ts';

const resend = new Resend(Deno.env.get('RESEND_API_KEY'));
const corsHeaders = getCorsHeaders();

interface EmailRequest {
  to: string[];
  subject: string;
  html: string;
  from?: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const { to, subject, html, from } = await req.json() as EmailRequest;

    const { data, error } = await resend.emails.send({
      from: from || 'iDoc Alerts <alerts@id0c.com>',
      to,
      subject,
      html,
    });

    if (error) {
      return new Response(
        JSON.stringify({ error: error.message }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ success: true, id: data?.id }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
```

#### 7. Déployer et Configurer Secret
```bash
# Déployer
supabase functions deploy send-email

# Configurer secret
supabase secrets set RESEND_API_KEY=re_your_actual_key_here
```

#### 8. Modifier idoc-alert-notify
Remplacer le bloc email dans `idoc-alert-notify/index.ts`:

```typescript
// Send Email
if (settings.email_enabled && settings.email_recipients?.length > 0) {
  try {
    const emailPayload = {
      to: settings.email_recipients,
      subject: `[iDoc Alert] ${notification.severity} - ${notification.alert_type}`,
      html: `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #f8f9fa; padding: 20px; border-left: 4px solid #dc3545; margin-bottom: 20px; }
    .severity { font-size: 24px; font-weight: bold; margin-bottom: 10px; }
    .message { background: white; padding: 15px; border: 1px solid #ddd; margin-bottom: 20px; }
    .details { background: #f8f9fa; padding: 15px; font-family: monospace; font-size: 12px; }
    .footer { text-align: center; color: #666; font-size: 12px; margin-top: 30px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="severity">${emoji} ${notification.severity} Alert</div>
      <div>${notification.alert_type}</div>
      ${notification.template_id ? `<div>Template: ${notification.template_id}</div>` : ''}
    </div>
    <div class="message">${notification.message}</div>
    ${notification.details ? `
      <div class="details">
        <strong>Details:</strong><br>
        ${JSON.stringify(notification.details, null, 2)}
      </div>
    ` : ''}
    <div class="footer">
      <p>iDoc Template Management System</p>
      <p>Alert ID: ${notification.alert_id}</p>
    </div>
  </div>
</body>
</html>
      `,
      from: 'iDoc Alerts <alerts@id0c.com>'
    };

    // Appeler edge function send-email
    const emailResponse = await fetch(`${supabaseUrl}/functions/v1/send-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabaseKey}`,
      },
      body: JSON.stringify(emailPayload)
    });

    if (emailResponse.ok) {
      results.email_sent = true;
      await supabase
        .from('template_alerts')
        .update({ sent_email: true })
        .eq('id', notification.alert_id);
    } else {
      const errorText = await emailResponse.text();
      throw new Error(`Email send failed: ${errorText}`);
    }

  } catch (error) {
    console.error('Email sending failed:', error);
    results.errors.push(`Email: ${error.message}`);
  }
}
```

---

### Option 2: SendGrid

**Pourquoi SendGrid?**
- ✅ Large et établi
- ✅ 100 emails/jour gratuit
- ✅ Analytics détaillés
- ✅ Support templates

**Inconvénients:**
- ⚠️ Interface complexe
- ⚠️ Setup plus long

**Configuration:**

#### 1. Créer compte
```
https://sendgrid.com/free/
```

#### 2. Vérifier domaine
```
Settings → Sender Authentication → Authenticate Domain
```

#### 3. API Key
```
Settings → API Keys → Create API Key
```

#### 4. Code
```typescript
import { getCorsHeaders } from '../_shared/cors.ts';

const SENDGRID_API_KEY = Deno.env.get('SENDGRID_API_KEY');
const corsHeaders = getCorsHeaders();

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  const { to, subject, html, from } = await req.json();

  const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${SENDGRID_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      personalizations: [{
        to: to.map((email: string) => ({ email })),
      }],
      from: {
        email: from || 'alerts@id0c.com',
        name: 'iDoc Alerts'
      },
      subject,
      content: [{
        type: 'text/html',
        value: html
      }]
    })
  });

  if (!response.ok) {
    const error = await response.text();
    return new Response(
      JSON.stringify({ error }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  return new Response(
    JSON.stringify({ success: true }),
    { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
});
```

---

### Option 3: Mailgun

**Pourquoi Mailgun?**
- ✅ 5,000 emails/mois gratuit (3 mois)
- ✅ API puissante
- ✅ Logs détaillés

**Configuration:**

#### 1. Compte + Domaine
```
https://mailgun.com
→ Add Domain
→ Suivre instructions DNS
```

#### 2. API Key
```
Settings → API Keys → Private API key
```

#### 3. Code
```typescript
const MAILGUN_API_KEY = Deno.env.get('MAILGUN_API_KEY');
const MAILGUN_DOMAIN = Deno.env.get('MAILGUN_DOMAIN'); // ex: mg.id0c.com

Deno.serve(async (req: Request) => {
  const { to, subject, html, from } = await req.json();

  const formData = new FormData();
  formData.append('from', from || 'iDoc Alerts <alerts@id0c.com>');
  formData.append('to', to.join(','));
  formData.append('subject', subject);
  formData.append('html', html);

  const response = await fetch(
    `https://api.mailgun.net/v3/${MAILGUN_DOMAIN}/messages`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${btoa(`api:${MAILGUN_API_KEY}`)}`,
      },
      body: formData
    }
  );

  const result = await response.json();

  return new Response(
    JSON.stringify(result),
    {
      status: response.ok ? 200 : 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    }
  );
});
```

---

## 🎯 Recommandation: Resend

**Pourquoi je recommande Resend?**

1. **Le plus simple**: Setup en 15 minutes
2. **Moderne**: Conçu pour 2024+
3. **Gratuit suffisant**: 3,000 emails/mois
4. **Excellent DX**: Documentation claire
5. **TypeScript first**: Intégration naturelle

---

## 📋 Checklist Complète

### Phase 1: Configuration Service Email

- [ ] Créer compte service (Resend recommandé)
- [ ] Ajouter domaine id0c.com
- [ ] Configurer DNS records (SPF, DKIM, DMARC)
- [ ] Attendre vérification DNS (15min - 48h)
- [ ] Obtenir API key
- [ ] Tester envoi depuis dashboard service

### Phase 2: Intégration iDoc

- [ ] Installer package npm (ex: `npm install resend`)
- [ ] Créer edge function `send-email`
- [ ] Déployer: `supabase functions deploy send-email`
- [ ] Configurer secret: `supabase secrets set RESEND_API_KEY=...`
- [ ] Modifier `idoc-alert-notify` pour utiliser nouvelle function
- [ ] Re-déployer: `supabase functions deploy idoc-alert-notify`

### Phase 3: Configuration iDoc

- [ ] Admin Dashboard → Notifications
- [ ] Activer email notifications
- [ ] Ajouter emails destinataires
- [ ] Cliquer "Test Notifications"
- [ ] Vérifier réception email dans inbox
- [ ] Vérifier pas dans spam

### Phase 4: DNS Optimal (Recommandé)

- [ ] SPF record configuré
- [ ] DKIM record configuré
- [ ] DMARC policy configurée
- [ ] Reverse DNS (rDNS) si VPS/Serveur
- [ ] Test: mail-tester.com (score 10/10)

---

## 🔒 DNS Records Essentiels

### SPF (Sender Policy Framework)
```
Type: TXT
Name: @
Value: v=spf1 include:_spf.resend.com ~all
TTL: 3600
```

### DKIM (DomainKeys Identified Mail)
```
Type: CNAME
Name: resend._domainkey
Value: [fourni par Resend]
TTL: 3600
```

### DMARC (Domain Message Authentication)
```
Type: TXT
Name: _dmarc
Value: v=DMARC1; p=quarantine; rua=mailto:dmarc@id0c.com
TTL: 3600
```

**Explication:**
- `p=quarantine`: Emails non conformes vont en spam
- `p=reject`: Emails non conformes rejetés (plus strict)
- `rua=mailto:`: Reçoit rapports DMARC

---

## ✅ Tester la Configuration

### Test 1: Mail Tester
```
1. Aller sur https://www.mail-tester.com
2. Noter l'adresse email affichée
3. Envoyer email test à cette adresse
4. Cliquer "Then check your score"
5. Objectif: 10/10
```

### Test 2: MXToolbox
```
1. https://mxtoolbox.com/SuperTool.aspx
2. Taper: id0c.com
3. Vérifier:
   - SPF Record ✅
   - DKIM Record ✅
   - DMARC Record ✅
   - Blacklist Check ✅
```

### Test 3: Email depuis iDoc
```
1. Admin Dashboard → Notifications
2. Configurer email
3. "Test Notifications"
4. Vérifier inbox
5. Vérifier headers email (View Original)
6. Confirmer SPF/DKIM pass
```

---

## 🎨 Emails Professionnels

### Adresses Recommandées

```
alerts@id0c.com       - Alertes système
no-reply@id0c.com     - Notifications automatiques
support@id0c.com      - Support client
hello@id0c.com        - Contact général
team@id0c.com         - Équipe interne
```

### Templates HTML

Pour emails professionnels, utiliser:
- [MJML](https://mjml.io): Framework email responsive
- [React Email](https://react.email): Templates React
- [Foundation Emails](https://get.foundation/emails.html): Framework CSS

---

## 💰 Comparaison Coûts

### Gratuit (démarrage)
- **Resend**: 3,000 emails/mois
- **SendGrid**: 100 emails/jour = 3,000/mois
- **Mailgun**: 5,000/mois (3 premiers mois)

### Payant (croissance)
- **Resend Pro**: $20/mois = 50,000 emails
- **SendGrid Essentials**: $20/mois = 50,000 emails
- **Mailgun Flex**: $35/mois = 50,000 emails

### Enterprise
- **Resend**: Contact
- **SendGrid**: À partir $90/mois
- **Amazon SES**: $0.10 / 1000 emails

**Recommandation:** Commencer gratuit → Resend Pro si croissance

---

## 🚨 Erreurs Courantes

### 1. "Domain not verified"
**Solution:** Attendre propagation DNS (jusqu'à 48h)
```bash
# Vérifier DNS propagé
dig TXT id0c.com
nslookup -type=TXT id0c.com
```

### 2. "Emails in spam"
**Solutions:**
- Configurer SPF + DKIM + DMARC
- Réchauffer IP (envoyer progressivement)
- Éviter mots spam ("free", "urgent", etc.)
- Ajouter lien désabonnement

### 3. "API authentication failed"
**Solution:**
- Vérifier API key correcte
- Vérifier secret Supabase: `supabase secrets list`
- Re-set si nécessaire

### 4. "Rate limit exceeded"
**Solution:**
- Vérifier limites plan gratuit
- Implémenter retry logic
- Upgrader plan si nécessaire

---

## 📊 Monitoring

### Métriques à Tracker

```typescript
// Dans votre code
interface EmailMetrics {
  sent: number;
  delivered: number;
  bounced: number;
  opened: number;
  clicked: number;
  complained: number;
}
```

**Dashboard Resend/SendGrid fournit:**
- Taux de délivrance
- Taux d'ouverture
- Taux de clic
- Bounces (soft/hard)
- Spam complaints

---

## 🎯 Next Steps

**Immédiat (Aujourd'hui):**
1. Créer compte Resend
2. Ajouter domaine id0c.com
3. Configurer DNS records
4. Obtenir API key

**Court terme (Cette semaine):**
1. Créer edge function send-email
2. Déployer et tester
3. Modifier idoc-alert-notify
4. Configurer dans Admin Dashboard
5. Tester notifications end-to-end

**Moyen terme (Ce mois):**
1. Monitorer métriques emails
2. Optimiser templates HTML
3. Configurer DMARC reports
4. A/B test subject lines
5. Créer emails transactionnels (confirmation, etc.)

---

## 📖 Ressources

**Documentation:**
- Resend: https://resend.com/docs
- SendGrid: https://docs.sendgrid.com
- Mailgun: https://documentation.mailgun.com

**Outils:**
- Mail Tester: https://www.mail-tester.com
- MXToolbox: https://mxtoolbox.com
- DMARC Analyzer: https://dmarc.org

**Templates:**
- MJML: https://mjml.io
- React Email: https://react.email
- Email Love: https://emaillove.com

---

**Besoin d'aide pour la configuration?** Je peux vous guider étape par étape! 🚀
