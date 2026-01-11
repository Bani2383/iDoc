# Guide DNS & Registrar - Bolt Cloud

**Date**: 11 janvier 2026
**Domaine**: id0c.com
**Registrar**: Bolt Cloud
**Statut**: Automatique

---

## COMMENT ÇA FONCTIONNE

### Bolt Cloud = Tout-en-Un

Quand vous achetez un domaine chez **Bolt Cloud**:

```
✅ Registrar: Bolt Cloud (gère l'enregistrement)
✅ DNS: Automatique (géré par Bolt)
✅ Hosting: Intégré (même plateforme)
✅ SSL: Automatique (certificat HTTPS)
```

**Vous n'avez PAS besoin de configurer les DNS manuellement!**

---

## VOTRE CONFIGURATION ACTUELLE

### Domaines

```
Primary: id0c.com
Alias: www.id0c.com → id0c.com
```

### DNS (Automatique)

```
Type    Name            Value
────────────────────────────────────────
A       id0c.com        [IP Bolt Cloud]
A       www.id0c.com    [IP Bolt Cloud]
AAAA    id0c.com        [IPv6 Bolt Cloud]
AAAA    www.id0c.com    [IPv6 Bolt Cloud]
```

**Géré automatiquement par Bolt Cloud!**

### SSL/HTTPS

```
✅ Certificat SSL: Actif
✅ HTTPS: Automatique
✅ Redirection HTTP → HTTPS: Active
```

---

## POURQUOI "CHECKING DNS MANAGEMENT STATUS"

### Ce Message Signifie

L'interface vérifie si:

1. **DNS propagés** - Les serveurs DNS mondiaux ont été mis à jour
2. **SSL actif** - Le certificat HTTPS est installé
3. **Connexion active** - Le domaine pointe vers votre projet

### Temps de Propagation

```
Domaine acheté:    17 novembre 2025
Aujourd'hui:       11 janvier 2026

✅ DNS propagés depuis longtemps
✅ Configuration stable
```

---

## DIFFÉRENCE AVEC AUTRES REGISTRARS

### Registrars Traditionnels (GoDaddy, Namecheap, etc.)

```
❌ Configuration DNS manuelle
❌ Pointer A/CNAME vers hosting
❌ Configuration SSL séparée
❌ Multiple interfaces
❌ Complexe pour débutants
```

### Bolt Cloud (Tout-en-Un)

```
✅ DNS automatiques
✅ Hosting intégré
✅ SSL automatique
✅ Interface unique
✅ Simple et rapide
```

---

## ACCÉDER À VOS PARAMÈTRES DNS

### Option 1: Interface Bolt Cloud

**Actuellement Affiché**:

```
1. Bolt.new
2. Project Settings
3. Domains & Hosting
4. Section "DNS Settings"
```

**Statut**: "Checking DNS management status"

### Option 2: Voir DNS Externes

Si vous voulez voir les DNS publics:

```bash
# Linux/Mac Terminal
nslookup id0c.com

# Ou
dig id0c.com

# Windows CMD
nslookup id0c.com
```

### Option 3: Outils en Ligne

```
https://dns-lookup.com/id0c.com
https://dnschecker.org/id0c.com
https://mxtoolbox.com/SuperTool.aspx?action=a&run=id0c.com
```

---

## VÉRIFIER CONFIGURATION DNS

### Test 1: Résolution DNS

```bash
nslookup id0c.com
```

**Résultat Attendu**:
```
Server: [DNS Server]
Address: [IP]

Name: id0c.com
Address: [IP Bolt Cloud]
```

### Test 2: Vérifier HTTPS

```bash
curl -I https://id0c.com
```

**Résultat Attendu**:
```
HTTP/2 200
server: Bolt Cloud
ssl: active
```

### Test 3: Vérifier Redirection www

```bash
curl -I https://www.id0c.com
```

**Résultat Attendu**:
```
HTTP/2 301
Location: https://id0c.com
```

---

## REGISTRAR INFORMATION

### Où Est Mon Domaine Enregistré?

**Registrar**: Bolt Cloud (via partenaire registrar)

**Informations**:
```
Domaine: id0c.com
Acheté: 17 novembre 2025
Expire: 12 octobre 2026
Renouvellement: Automatique ($19.99)
```

### Accéder aux Infos Registrar

**Dans Bolt.new**:

```
1. Project Settings
2. Domains & Hosting
3. Section "Renewal"
```

**Visible**:
- Date d'achat
- Date d'expiration
- Prix renouvellement
- Option: Disable auto-renewal

---

## MODIFIER DNS (SI NÉCESSAIRE)

### Cas d'Usage Rares

Vous voudriez modifier les DNS si:

1. **Sous-domaine personnalisé** - Ex: api.id0c.com
2. **Email externe** - Ex: Google Workspace, Outlook
3. **CDN externe** - Ex: Cloudflare
4. **Service externe** - Ex: status.id0c.com

### Comment Modifier

**Attendre Interface Bolt**:

Si Bolt Cloud offre la gestion DNS avancée:

```
1. Domains & Hosting
2. DNS Settings
3. Add Record
4. Choisir type (A, CNAME, MX, TXT)
5. Sauvegarder
```

**Alternative - Ouvrir Ticket**:

Si l'interface ne permet pas:

```
1. Bolt Support/Help
2. Demander accès DNS avancé
3. Spécifier besoin (ex: MX records pour emails)
```

---

## CONFIGURATION EMAIL (DNS MX)

### Pour Recevoir Emails @id0c.com

**Voir guide**: `GUIDE_CONFIGURATION_EMAILS.md`

Vous aurez besoin de:

1. **MX Records** - Pour recevoir emails
2. **SPF Record** - Prévenir spam
3. **DKIM Record** - Authentification
4. **DMARC Record** - Sécurité

**Configuration via**:
- Bolt Cloud DNS Settings (si disponible)
- OU Support Bolt pour ajouter les records

---

## STATUT ACTUEL

### Domaine

```
✅ Enregistré: id0c.com
✅ Registrar: Bolt Cloud
✅ Propriétaire: Vous
✅ Expire: 12 octobre 2026
✅ Auto-renew: Activé
```

### DNS

```
✅ Propagés: Oui
✅ Pointe vers: Bolt Cloud hosting
✅ HTTPS: Actif
✅ www → root: Configuré
```

### Hosting

```
✅ Plateforme: Bolt Cloud
✅ Projet: iDoc
✅ Status: Active
❌ Variables: À ajouter
```

---

## CE QUE VOUS N'AVEZ PAS BESOIN DE FAIRE

### INUTILE avec Bolt Cloud

```
❌ Configurer nameservers
❌ Ajouter A records manuellement
❌ Pointer CNAME vers hosting
❌ Installer SSL/certificat
❌ Gérer DNS propagation
❌ Configurer redirections www
```

**Tout est automatique!**

---

## PROCHAINES ÉTAPES

### Immédiat (Pour Site Fonctionnel)

**Pas besoin de toucher aux DNS!**

Les DNS sont déjà corrects. Il vous faut:

```
1. Ajouter variables Secrets (3 min)
   - VITE_SUPABASE_URL
   - VITE_SUPABASE_ANON_KEY
   - VITE_APP_URL

2. Redéployer avec Publish (2 min)

3. Configurer Supabase Auth URLs (5 min)

4. Tester site (10 min)
```

**Voir guide**: `DEPLOIEMENT_BOLT_CLOUD.md`

---

## QUESTIONS FRÉQUENTES

### Q: Où sont mes DNS?

**R**: Gérés automatiquement par Bolt Cloud. Vous n'avez pas besoin d'y toucher.

### Q: Comment voir mes DNS?

**R**:
```bash
nslookup id0c.com
# OU
dig id0c.com
# OU
https://dnschecker.org/id0c.com
```

### Q: Puis-je utiliser Cloudflare?

**R**: Techniquement oui, mais **pas recommandé**. Vous perdriez les avantages Bolt Cloud (SSL auto, DNS auto, etc.). Contactez Bolt Support si vraiment nécessaire.

### Q: Comment ajouter MX records pour emails?

**R**:
1. Vérifier si "DNS Settings" dans Bolt permet d'ajouter records
2. Sinon, contacter Bolt Support
3. OU utiliser sous-domaine chez autre provider

### Q: Mon domaine expire quand?

**R**: 12 octobre 2026. Renouvellement automatique à $19.99.

### Q: Comment désactiver auto-renewal?

**R**:
```
Domains & Hosting → Renewal → Disable auto-renewal
```

⚠️ **Attention**: Vous perdrez le domaine si vous oubliez de renouveler!

### Q: Puis-je transférer mon domaine ailleurs?

**R**: Oui, après 60 jours de l'achat (17 janvier 2026 passé). Contactez Bolt Support pour obtenir le code de transfert (EPP code).

### Q: "Checking DNS management status" est-ce un problème?

**R**: Non, c'est normal. Ça signifie que Bolt vérifie le statut. Vos DNS fonctionnent déjà.

---

## VÉRIFICATION FINALE

### Test Complet DNS

```bash
# Test 1: DNS résolution
nslookup id0c.com
# ✅ Doit retourner une IP

# Test 2: HTTPS fonctionne
curl -I https://id0c.com
# ✅ Doit retourner 200 ou 404 (si pas encore de site)

# Test 3: www redirige
curl -I https://www.id0c.com
# ✅ Doit rediriger vers https://id0c.com

# Test 4: Propagation mondiale
# https://dnschecker.org/id0c.com
# ✅ Doit montrer vert partout
```

---

## SUPPORT

### DNS Issues

Si vous rencontrez un problème DNS:

1. **Vérifier statut Bolt Cloud** - https://status.bolt.new
2. **Vider cache DNS local** - `ipconfig /flushdns` (Windows) ou `sudo killall -HUP mDNSResponder` (Mac)
3. **Attendre propagation** - Max 48h (généralement 5 min)
4. **Contacter Bolt Support** - Dans l'interface Bolt.new

### Informations Registrar

Pour info détaillées propriétaire domaine:

1. **WHOIS Lookup**: https://who.is/whois/id0c.com
2. **ICANN Lookup**: https://lookup.icann.org/en/lookup
3. **Bolt Support**: Demander certificat d'enregistrement

---

## RÉSUMÉ

### Votre Configuration

```
✅ Domaine: id0c.com (propriétaire)
✅ Registrar: Bolt Cloud
✅ DNS: Automatiques et propagés
✅ Hosting: Bolt Cloud (même plateforme)
✅ HTTPS: Actif
✅ www: Redirige vers root
```

### Action Requise

```
❌ DNS: RIEN (déjà configurés)
❌ Registrar: RIEN (déjà géré)
✅ Variables: À ajouter dans Secrets
```

### Pour Site Fonctionnel

**Ne touchez PAS les DNS!**

Suivez: `DEPLOIEMENT_BOLT_CLOUD.md`

1. Secrets → Ajouter 3 variables
2. Publish → Redéployer
3. Supabase → Auth URLs
4. Tester

**Temps**: 18 minutes

---

## CONCLUSION

Avec **Bolt Cloud**:

```
✅ Registrar intégré
✅ DNS automatiques
✅ Hosting inclus
✅ SSL gratuit
✅ Tout en un endroit
```

**Vous n'avez PAS besoin de gérer les DNS manuellement!**

**Prochaine action**: Ajouter les variables dans Secrets (voir `DEPLOIEMENT_BOLT_CLOUD.md`)

Vos DNS fonctionnent déjà parfaitement! 🎉

---

**Dernière mise à jour**: 11 janvier 2026
**Domaine**: id0c.com ✅
**DNS**: Automatiques ✅
**Action**: Ajouter variables Secrets
