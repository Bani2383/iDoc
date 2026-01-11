# 🔍 IDENTIFIER VOTRE REGISTRAR - id0c.com

Le domaine id0c.com est enregistré chez un **registrar** (bureau d'enregistrement). Ce n'est probablement PAS Bolt.

---

## 🎯 ÉTAPE 1: IDENTIFIER LE REGISTRAR

### Méthode A: WHOIS Lookup

Allez sur: **https://whois.domaintools.com/id0c.com**

Cherchez dans les résultats:
```
Registrar: [NOM DU REGISTRAR]
Registrar URL: [URL]
```

**Exemples courants**:
- GoDaddy (godaddy.com)
- Namecheap (namecheap.com)  
- OVH (ovh.com)
- Gandi (gandi.net)
- Google Domains → Squarespace (squarespace.com)
- Cloudflare (cloudflare.com)
- Name.com
- 1&1 IONOS
- Hostinger

### Méthode B: Vérifier vos emails

Cherchez dans votre boîte email:
```
Sujet: "domain registration"
Sujet: "id0c.com"
Sujet: "domain renewal"
```

Ces emails proviennent du registrar.

---

## 🚀 SOLUTION RAPIDE: SANS CHANGER NAMESERVERS

Si vous voulez avancer rapidement SANS changer nameservers:

### 1. Connecter domaine à Vercel

```
1. Vercel Dashboard → Settings → Domains
2. Add Domain → "id0c.com"
3. Vercel vous donne des valeurs DNS
```

### 2. Ajouter records DNS chez votre registrar actuel

Où que soit votre domaine, ajoutez ces records:

```
A      @        76.76.21.21
CNAME  www      cname.vercel-dns.com
```

### 3. Configurer Resend

```
TXT    @                    v=spf1 include:_spf.resend.com ~all
TXT    _dmarc               v=DMARC1; p=none; rua=mailto:postmaster@id0c.com
CNAME  resend._domainkey    [depuis Resend Dashboard]
TXT    _resend              [depuis Resend Dashboard]
```

### 4. Valider

```bash
./scripts/validate-dns-setup.sh
```

**Résultat**: Même fonctionnalité, sans changer nameservers !

---

## 📍 OÙ TROUVER LA CONFIG DNS

### GoDaddy
```
1. https://dcc.godaddy.com/
2. My Products → Domains → id0c.com
3. DNS ou Manage DNS
```

### Namecheap
```
1. https://ap.namecheap.com/
2. Domain List → Manage
3. Advanced DNS
```

### OVH
```
1. https://www.ovh.com/manager/
2. Noms de domaine → id0c.com
3. Zone DNS
```

### Cloudflare
```
1. https://dash.cloudflare.com/
2. id0c.com → DNS
```

---

## 💡 INFO IMPORTANTE

**Bolt.new N'EST PAS un registrar de domaines.**

Bolt est une plateforme de développement. Votre domaine est enregistré ailleurs.

**Vous n'êtes PAS obligé de changer les nameservers !**

Vous pouvez simplement ajouter les records DNS chez votre registrar actuel.

---

**Question**: Où avez-vous acheté id0c.com ?
