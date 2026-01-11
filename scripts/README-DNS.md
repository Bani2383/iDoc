# 📋 Scripts DNS - iDoc

Scripts pour la migration DNS vers Vercel et la configuration des emails avec Resend.

---

## 🚀 SCRIPTS DISPONIBLES

### 1. setup-vercel-dns.sh
**Description**: Guide interactif complet pour la migration DNS

**Usage**:
```bash
./scripts/setup-vercel-dns.sh
```

**Fonctionnalités**:
- Guide pas à pas avec instructions claires
- Vérification DNS automatique (si dig disponible)
- Instructions pour Vercel, Bolt, Resend, Supabase
- Timeline détaillée
- Codes couleur pour lisibilité

**Durée**: ~36 minutes (dont 20 min d'attente DNS)

**Étapes couvertes**:
1. Vérification DNS actuelle
2. Activation Vercel DNS
3. Configuration nameservers Bolt
4. Ajout records DNS web
5. Configuration Resend
6. Ajout records DNS email
7. Configuration secrets Supabase
8. Tests et validation

---

### 2. validate-dns-setup.sh
**Description**: Validation automatique de la configuration DNS et email

**Usage**:
```bash
./scripts/validate-dns-setup.sh
```

**Tests effectués**:
- ✓ Nameservers Vercel
- ✓ A Record (web)
- ✓ HTTPS/SSL
- ✓ SPF Record
- ✓ DKIM Record
- ✓ DMARC Record
- ✓ Resend Verification
- ✓ Edge Function send-email

**Sortie**:
```
✅ Tests réussis: X
❌ Tests échoués: Y
⚠️  Avertissements: Z
Score: X%
```

**Code de sortie**:
- `0` = Tous les tests passent
- `1` = Au moins un test échoue

**Utilisation dans CI/CD**:
```bash
if ./scripts/validate-dns-setup.sh; then
    echo "DNS configuration valide"
else
    echo "Erreur configuration DNS"
    exit 1
fi
```

---

## 🔧 PRÉ-REQUIS

### Outils requis
- `bash` (version 4.0+)
- `curl` (pour tests HTTP et API)

### Outils optionnels (recommandés)
- `dig` (pour tests DNS détaillés)
- `nslookup` (alternative à dig)

### Installation des outils

**Ubuntu/Debian**:
```bash
sudo apt-get update
sudo apt-get install -y curl dnsutils
```

**macOS**:
```bash
brew install curl bind
```

**Windows (WSL)**:
```bash
sudo apt-get update
sudo apt-get install -y curl dnsutils
```

---

## 📖 EXEMPLES D'UTILISATION

### Scénario 1: Première migration

```bash
# Lancer le guide interactif
./scripts/setup-vercel-dns.sh

# Suivre les instructions affichées
# Attendre propagation DNS (15-30 min)

# Valider la configuration
./scripts/validate-dns-setup.sh
```

### Scénario 2: Vérification quotidienne

```bash
# Cron job pour monitoring quotidien
0 9 * * * /chemin/vers/validate-dns-setup.sh >> /var/log/dns-check.log 2>&1
```

### Scénario 3: Débogage

```bash
# Vérification manuelle DNS
dig NS id0c.com +short
dig A id0c.com +short
dig TXT id0c.com +short

# Validation complète avec logs
./scripts/validate-dns-setup.sh | tee dns-validation.log

# Test Edge Function isolé
curl -X POST \
  https://ffujpjaaramwhtmzqhlx.supabase.co/functions/v1/send-email \
  -H "Authorization: Bearer [ANON_KEY]" \
  -H "Content-Type: application/json" \
  -d '{"to":["test@example.com"],"subject":"Test","html":"<p>Test</p>"}'
```

### Scénario 4: CI/CD Integration

```yaml
# .github/workflows/dns-validation.yml
name: DNS Configuration Check

on:
  schedule:
    - cron: '0 */6 * * *'  # Toutes les 6 heures
  workflow_dispatch:

jobs:
  validate-dns:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Install dependencies
        run: |
          sudo apt-get update
          sudo apt-get install -y dnsutils curl

      - name: Validate DNS
        run: |
          chmod +x scripts/validate-dns-setup.sh
          ./scripts/validate-dns-setup.sh

      - name: Notify on failure
        if: failure()
        uses: actions/github-script@v6
        with:
          script: |
            github.rest.issues.create({
              owner: context.repo.owner,
              repo: context.repo.repo,
              title: 'DNS Configuration Failed',
              body: 'DNS validation failed. Please check the workflow logs.'
            })
```

---

## 🐛 DÉPANNAGE

### Erreur: "dig: command not found"

**Problème**: dig n'est pas installé

**Solution**:
```bash
# Ubuntu/Debian
sudo apt-get install dnsutils

# macOS
brew install bind
```

**Alternative**: Le script fonctionne sans dig mais avec moins de validations

---

### Erreur: "curl: command not found"

**Problème**: curl n'est pas installé (critique)

**Solution**:
```bash
# Ubuntu/Debian
sudo apt-get install curl

# macOS
brew install curl
```

---

### Erreur: "Nameservers Vercel NON détectés"

**Problème**: DNS pas encore propagés OU mal configurés

**Solutions**:
1. Vérifier configuration chez Bolt (nameservers corrects ?)
2. Attendre 15-30 minutes supplémentaires
3. Vérifier propagation globale: https://dnschecker.org/#NS/id0c.com
4. Vérifier qu'aucun cache DNS local n'interfère:
   ```bash
   sudo systemd-resolve --flush-caches  # Linux
   sudo dscacheutil -flushcache         # macOS
   ```

---

### Erreur: "Resend verification non trouvée"

**Problème**: Record _resend pas ajouté OU pas propagé

**Solutions**:
1. Vérifier dans Vercel DNS que le record _resend est présent
2. Tester manuellement: `dig TXT _resend.id0c.com +short`
3. Attendre 5-10 minutes pour propagation
4. Re-cliquer "Verify Domain" dans Resend Dashboard

---

### Erreur: "Edge Function erreur"

**Problème**: RESEND_API_KEY manquant OU domaine non verified

**Solutions**:
1. Vérifier secret dans Supabase Vault:
   ```
   https://supabase.com/dashboard/project/ffujpjaaramwhtmzqhlx/settings/vault
   ```
2. Vérifier domaine "Verified" dans Resend Dashboard
3. Vérifier logs Edge Function dans Supabase
4. Tester avec curl verbose:
   ```bash
   curl -v -X POST [URL] [...]
   ```

---

## 📊 INTERPRÉTATION DES RÉSULTATS

### Score 100% (10/10 tests)
```
✅ Configuration PARFAITE
→ Production ready
→ Aucune action requise
```

### Score 80-99% (8-9/10 tests)
```
⚠️  Configuration FONCTIONNELLE avec avertissements
→ Vérifier les warnings
→ Généralement OK pour production
→ Corriger les warnings si possible
```

### Score < 80% (< 8/10 tests)
```
❌ Configuration INCOMPLÈTE
→ Ne PAS passer en production
→ Corriger les erreurs
→ Re-tester après corrections
```

---

## 🔍 DÉTAIL DES TESTS

### Test 1: Nameservers
```bash
dig NS id0c.com +short
```
**Attendu**: `ns1.vercel-dns.com` et `ns2.vercel-dns.com`
**Critique**: OUI

### Test 2: A Record
```bash
dig A id0c.com +short
```
**Attendu**: IP valide (76.76.21.21 ou autre IP Vercel)
**Critique**: OUI

### Test 3: HTTPS
```bash
curl -I https://id0c.com
```
**Attendu**: HTTP 200, 301, ou 302
**Critique**: OUI

### Test 4: SPF
```bash
dig TXT id0c.com +short | grep spf
```
**Attendu**: `v=spf1 include:_spf.resend.com ~all`
**Critique**: OUI (pour emails)

### Test 5: DKIM
```bash
dig CNAME resend._domainkey.id0c.com +short
```
**Attendu**: CNAME vers domaine Resend
**Critique**: OUI (pour emails)

### Test 6: DMARC
```bash
dig TXT _dmarc.id0c.com +short
```
**Attendu**: `v=DMARC1; p=none; ...`
**Critique**: MOYEN (recommandé)

### Test 7: Resend Verification
```bash
dig TXT _resend.id0c.com +short
```
**Attendu**: Token de vérification Resend
**Critique**: OUI (pour emails)

### Test 8: Edge Function
```bash
curl -X POST [Edge Function URL]
```
**Attendu**: `{"success":true}` ou similaire
**Critique**: OUI (pour emails)

---

## 📈 MONITORING CONTINU

### Checks recommandés

**Quotidien**:
- Nameservers (détection changements non autorisés)
- HTTPS (détection expiration SSL)
- Edge Functions (détection downtime)

**Hebdomadaire**:
- DNS records complets
- Email deliverability (test mail-tester.com)
- Propagation DNS globale

**Mensuel**:
- Audit complet de sécurité
- Review politique DMARC
- Analyse logs email Resend

### Script de monitoring

```bash
#!/bin/bash
# monitor-dns.sh

while true; do
    ./scripts/validate-dns-setup.sh

    if [ $? -ne 0 ]; then
        # Envoyer alerte (email, Slack, etc.)
        curl -X POST https://hooks.slack.com/services/YOUR/WEBHOOK/URL \
             -d '{"text":"DNS Configuration Failed!"}'
    fi

    sleep 3600  # 1 heure
done
```

---

## 🔗 RESSOURCES

### Documentation
- [MIGRATION_DNS_COMPLETE.md](../MIGRATION_DNS_COMPLETE.md) - Vue d'ensemble complète
- [ACTIONS_MANUELLES_3_CLICS.md](../ACTIONS_MANUELLES_3_CLICS.md) - Guide simplifié
- [DNS_RECORDS_REFERENCE.md](../DNS_RECORDS_REFERENCE.md) - Référence DNS complète

### Dashboards
- Vercel: https://vercel.com/dashboard
- Resend: https://resend.com/domains
- Supabase: https://supabase.com/dashboard

### Outils externes
- DNS Checker: https://dnschecker.org
- MX Toolbox: https://mxtoolbox.com
- Mail Tester: https://www.mail-tester.com

---

## 📝 NOTES

- Les scripts sont **idempotents** (peuvent être lancés plusieurs fois sans problème)
- Les scripts sont **non-destructifs** (ne modifient rien, seulement lecture/test)
- Les scripts fonctionnent sur **Linux, macOS, et WSL**
- Les scripts supportent **CI/CD** (exit codes appropriés)

---

**Version**: 1.0
**Date**: 2026-01-11
**Maintainer**: DevOps Team iDoc
