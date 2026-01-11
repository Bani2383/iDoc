# 🔍 Identifier Votre Registrar de Domaine

## Qu'est-ce qu'un Registrar?

**Le registrar** = La société où vous avez **acheté votre domaine** id0c.com

```
C'est là où vous avez payé pour:
- Acheter le nom de domaine
- Renouveler chaque année
- Gérer la propriété du domaine
```

**Registrars populaires:**
- GoDaddy
- Namecheap
- Google Domains (maintenant Squarespace Domains)
- OVH
- Gandi
- Cloudflare
- 1&1 IONOS
- Name.com
- Dynadot
- Hover

---

## 🎯 Méthode 1: WHOIS Lookup (La Plus Rapide)

### Outil en ligne (recommandé):

```
1. Aller sur: https://lookup.icann.org/en

2. Entrer: id0c.com

3. Cliquer "Lookup"

4. Chercher la ligne:
   "Registrar: [NOM DU REGISTRAR]"

Exemple:
   Registrar: GoDaddy.com, LLC
   ou
   Registrar: Namecheap, Inc.
   ou
   Registrar: OVH
```

**Autre outil:**
```
https://whois.domaintools.com

Entrer: id0c.com
Chercher: "Registrar"
```

---

## 🎯 Méthode 2: Terminal (Si Vous Êtes Technique)

**Mac/Linux:**
```bash
whois id0c.com | grep -i "registrar"
```

**Résultat attendu:**
```
Registrar: GoDaddy.com, LLC
Registrar WHOIS Server: whois.godaddy.com
Registrar URL: https://www.godaddy.com
Registrar IANA ID: 146
```

---

## 🎯 Méthode 3: Vos Emails/Reçus

Chercher dans vos emails:

```
Mots-clés à chercher:
- "domain registration"
- "domain purchase"
- "domain renewal"
- "id0c.com"
- "confirmation d'achat"
- "renouvellement domaine"

Expéditeurs possibles:
- noreply@godaddy.com
- support@namecheap.com
- domains@google.com
- contact@ovh.com
- etc.
```

L'email de confirmation contiendra le nom du registrar.

---

## 🎯 Méthode 4: Vos Relevés Bancaires

Chercher dans vos transactions:

```
Période: Quand avez-vous acheté id0c.com?

Transactions à chercher:
- GoDaddy (8-15€/an)
- Namecheap (10-15€/an)
- Google Domains (12€/an)
- OVH (8-10€/an)
- etc.

Le nom du registrar apparaît sur le relevé.
```

---

## 🎯 Méthode 5: Vos Comptes en Ligne

Vérifier si vous avez un compte chez:

### GoDaddy
```
https://account.godaddy.com
→ Se connecter
→ Voir "My Products" → "Domains"
```

### Namecheap
```
https://ap.www.namecheap.com
→ Se connecter
→ "Domain List"
```

### Google Domains (maintenant Squarespace)
```
https://domains.google.com
ou
https://domains.squarespace.com
```

### OVH
```
https://www.ovh.com/manager/
→ "Noms de domaine"
```

### Cloudflare
```
https://dash.cloudflare.com
→ "Registrar"
```

---

## ❓ Pourquoi C'est Important?

### Configuration DNS - 2 Scénarios

#### Scénario A: DNS géré par Vercel
```
Si vos nameservers pointent vers Vercel:
→ Configurer DNS directement dans Vercel ✅
→ Pas besoin d'aller chez le registrar

Nameservers Vercel:
- ns1.vercel-dns.com
- ns2.vercel-dns.com
```

#### Scénario B: DNS géré par le Registrar
```
Si vos nameservers pointent vers votre registrar:
→ Configurer DNS chez le registrar (pas Vercel) ⚠️
→ Exemple: GoDaddy, Namecheap, OVH, etc.

Vous devrez:
1. Identifier votre registrar
2. Se connecter chez le registrar
3. Ajouter records DNS là-bas
```

---

## 🔍 Vérifier Où Gérer DNS

### Méthode: Vérifier les Nameservers

**En ligne:**
```
1. Aller sur: https://dnschecker.org

2. Sélectionner type: NS (Nameservers)

3. Entrer: id0c.com

4. Cliquer "Search"

5. Regarder les résultats:
```

**Résultat A - DNS chez Vercel:**
```
ns1.vercel-dns.com
ns2.vercel-dns.com

→ Configurer DNS dans Vercel ✅
→ Suivre: CONNEXION_VERCEL_DNS.md
```

**Résultat B - DNS chez GoDaddy:**
```
ns1.godaddy.com
ns2.godaddy.com

→ Configurer DNS chez GoDaddy ⚠️
→ Se connecter sur godaddy.com
→ Gérer DNS là-bas
```

**Résultat C - DNS chez Namecheap:**
```
dns1.registrar-servers.com
dns2.registrar-servers.com

→ Configurer DNS chez Namecheap ⚠️
→ Se connecter sur namecheap.com
→ Gérer DNS là-bas
```

**Résultat D - DNS chez Cloudflare:**
```
ns1.cloudflare.com
ns2.cloudflare.com

→ Configurer DNS chez Cloudflare ⚠️
→ Se connecter sur cloudflare.com
→ Gérer DNS là-bas
```

---

## 📋 Checklist: Identifier Votre Situation

```
Étape 1: Identifier le Registrar
[ ] WHOIS lookup sur icann.org
[ ] Registrar trouvé: ______________

Étape 2: Vérifier les Nameservers
[ ] dnschecker.org → Type NS
[ ] Nameservers: ______________

Étape 3: Déterminer Où Gérer DNS
[ ] Option A: Nameservers = Vercel
    → Gérer DNS dans Vercel ✅

[ ] Option B: Nameservers = Registrar/Autre
    → Gérer DNS chez registrar ⚠️
```

---

## 🎯 Cas d'Usage Typiques

### Cas 1: Domaine chez GoDaddy, Hébergement Vercel

**Situation actuelle:**
```
Registrar: GoDaddy
Hébergement: Vercel
Nameservers: ns1.godaddy.com (DNS chez GoDaddy)
```

**Pour configurer emails:**
```
1. Se connecter sur account.godaddy.com
2. Aller dans "My Products" → "Domains"
3. Cliquer sur id0c.com
4. Cliquer "Manage DNS"
5. Ajouter records email (MX, TXT, etc.)
```

**Alternative (recommandé):**
```
1. Changer nameservers vers Vercel:
   - Dans GoDaddy: Modifier nameservers
   - Mettre: ns1.vercel-dns.com, ns2.vercel-dns.com

2. Attendre 24-48h (propagation)

3. Gérer DNS dans Vercel:
   - Plus simple
   - Tout au même endroit
   - Suivre CONNEXION_VERCEL_DNS.md
```

---

### Cas 2: Domaine chez Namecheap, Hébergement Vercel

**Situation actuelle:**
```
Registrar: Namecheap
Hébergement: Vercel
Nameservers: dns1.registrar-servers.com (DNS chez Namecheap)
```

**Pour configurer emails:**
```
1. Se connecter sur ap.www.namecheap.com
2. Cliquer "Domain List"
3. Cliquer "Manage" à côté de id0c.com
4. Aller dans "Advanced DNS"
5. Ajouter records email
```

**Alternative (recommandé):**
```
1. Dans Namecheap: "Domain" → "Nameservers"
2. Sélectionner "Custom DNS"
3. Entrer:
   - ns1.vercel-dns.com
   - ns2.vercel-dns.com
4. Sauvegarder
5. Attendre 24-48h
6. Gérer DNS dans Vercel
```

---

### Cas 3: DNS déjà chez Vercel

**Situation actuelle:**
```
Registrar: N'importe lequel
Hébergement: Vercel
Nameservers: ns1.vercel-dns.com (DNS chez Vercel) ✅
```

**Pour configurer emails:**
```
Super simple! Suivre: CONNEXION_VERCEL_DNS.md

1. Se connecter sur vercel.com
2. Project → Settings → Domains → id0c.com
3. Ajouter records DNS
4. Terminé! ✅
```

---

## 🚀 Recommandation

**Pour simplifier votre vie:**

```
1. Identifier votre registrar (WHOIS)

2. Vérifier vos nameservers (dnschecker.org)

3. Si nameservers ≠ Vercel:
   → Changer vers Vercel
   → ns1.vercel-dns.com
   → ns2.vercel-dns.com

4. Avantages:
   ✅ Tout géré au même endroit
   ✅ Interface simple Vercel
   ✅ Moins de complications
   ✅ Meilleures performances

5. Gérer DNS dans Vercel:
   → Suivre CONNEXION_VERCEL_DNS.md
   → Ajouter records email
   → Terminé!
```

---

## 📞 Aide par Registrar

### GoDaddy
```
Support: https://www.godaddy.com/help
Documentation DNS: https://www.godaddy.com/help/manage-dns-records-680
```

### Namecheap
```
Support: https://www.namecheap.com/support/
Documentation DNS: https://www.namecheap.com/support/knowledgebase/article.aspx/317/2237/
```

### OVH
```
Support: https://www.ovh.com/fr/support/
Documentation DNS: https://docs.ovh.com/fr/domains/
```

### Cloudflare
```
Support: https://support.cloudflare.com
Documentation DNS: https://developers.cloudflare.com/dns/
```

---

## 🎉 Résumé

**Pour identifier votre registrar:**

```
Méthode la plus rapide:
1. Aller sur https://lookup.icann.org/en
2. Entrer: id0c.com
3. Chercher ligne "Registrar:"
4. Vous avez votre réponse! ✅

Ensuite:
1. Vérifier nameservers (dnschecker.org)
2. Décider où gérer DNS:
   - Vercel (recommandé)
   - Registrar (si préférence)
3. Suivre guide approprié
4. Configurer emails
```

---

**Temps total: 2 minutes pour identifier votre registrar**

**Prochaine étape:** Une fois registrar identifié, décider où gérer DNS et configurer vos emails! 🚀
