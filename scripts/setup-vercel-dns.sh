#!/bin/bash
set -e

# Configuration
DOMAIN="id0c.com"
PROJECT_NAME="idoc"
RESEND_DOMAIN="id0c.com"

echo "=========================================="
echo "🚀 CONFIGURATION DNS VERCEL - iDoc"
echo "=========================================="
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Step 1: Check DNS status
echo -e "${BLUE}📡 Étape 1: Vérification DNS actuelle${NC}"
echo "Domaine: $DOMAIN"
echo ""

if command -v dig &> /dev/null; then
    echo "Nameservers actuels:"
    dig NS $DOMAIN +short || echo "Impossible de résoudre"
    echo ""
    echo "A records actuels:"
    dig A $DOMAIN +short || echo "Impossible de résoudre"
    echo ""
else
    echo "⚠️  'dig' non disponible, vérification manuelle requise"
    echo "Visitez: https://dnschecker.org/#NS/$DOMAIN"
fi
echo ""

# Step 2: Vercel DNS Configuration
echo -e "${YELLOW}📋 Étape 2: Configuration Vercel DNS${NC}"
echo ""
echo "ACTIONS MANUELLES REQUISES:"
echo ""
echo "1️⃣  Activer Vercel DNS"
echo "   URL: https://vercel.com/dashboard"
echo "   → Sélectionner projet '$PROJECT_NAME'"
echo "   → Settings → Domains"
echo "   → Cliquer sur '$DOMAIN'"
echo "   → Cliquer sur 'Use Vercel DNS'"
echo ""
echo "2️⃣  Noter les nameservers affichés (exemple):"
echo "   ns1.vercel-dns.com"
echo "   ns2.vercel-dns.com"
echo ""
echo "   Les VRAIS nameservers seront affichés dans Vercel"
echo ""
read -p "Appuyez sur Entrée quand c'est fait..."
echo ""

# Step 3: Bolt Configuration
echo -e "${YELLOW}📋 Étape 3: Configuration Nameservers chez Bolt${NC}"
echo ""
echo "ACTIONS MANUELLES REQUISES:"
echo ""
echo "1️⃣  Accéder à Bolt Dashboard"
echo "   URL: https://bolt.new"
echo "   → Project Settings"
echo "   → Domains & Hosting"
echo "   → Trouver '$DOMAIN'"
echo ""
echo "2️⃣  Remplacer les nameservers par ceux de Vercel"
echo "   (copiés depuis l'étape précédente)"
echo ""
echo "3️⃣  IMPORTANT: Désactiver toute gestion DNS chez Bolt"
echo "   Vercel devient l'autorité DNS UNIQUE"
echo ""
echo "⏱️  Propagation DNS: 15-30 minutes (peut aller jusqu'à 48h)"
echo ""
read -p "Appuyez sur Entrée quand c'est fait..."
echo ""

# Step 4: Wait for propagation
echo -e "${BLUE}⏳ Étape 4: Attente propagation DNS (30 sec)${NC}"
echo "En production, attendez 15-30 minutes minimum"
sleep 5
echo ""

# Step 5: Add DNS Records in Vercel
echo -e "${YELLOW}📋 Étape 5: Ajouter les DNS Records dans Vercel${NC}"
echo ""
echo "Dans Vercel Dashboard → Domains → $DOMAIN → DNS Records:"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📡 RECORDS WEB (Site)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Record 1: Domaine racine"
echo "  Type:  A"
echo "  Name:  @"
echo "  Value: 76.76.21.21"
echo ""
echo "Record 2: WWW"
echo "  Type:  CNAME"
echo "  Name:  www"
echo "  Value: cname.vercel-dns.com"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📧 RECORDS EMAIL (Resend)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Record 3: SPF"
echo "  Type:  TXT"
echo "  Name:  @"
echo "  Value: v=spf1 include:_spf.resend.com ~all"
echo ""
echo "Record 4: DMARC"
echo "  Type:  TXT"
echo "  Name:  _dmarc"
echo "  Value: v=DMARC1; p=none; rua=mailto:postmaster@id0c.com"
echo ""
echo "⚠️  ATTENTION: Records suivants nécessitent Resend Dashboard"
echo ""
read -p "Appuyez sur Entrée quand ces 4 records sont ajoutés..."
echo ""

# Step 6: Resend Configuration
echo -e "${YELLOW}📋 Étape 6: Configuration Resend${NC}"
echo ""
echo "ACTIONS MANUELLES REQUISES:"
echo ""
echo "1️⃣  Accéder à Resend Dashboard"
echo "   URL: https://resend.com/domains"
echo ""
echo "2️⃣  Cliquer 'Add Domain'"
echo "   Domain: $RESEND_DOMAIN"
echo ""
echo "3️⃣  Copier les valeurs affichées:"
echo "   - DKIM record (resend._domainkey)"
echo "   - Verification record (_resend)"
echo ""
echo "4️⃣  Ajouter dans Vercel DNS:"
echo ""
echo "Record 5: DKIM"
echo "  Type:  CNAME"
echo "  Name:  resend._domainkey"
echo "  Value: [depuis Resend Dashboard]"
echo ""
echo "Record 6: Verification"
echo "  Type:  TXT"
echo "  Name:  _resend"
echo "  Value: [depuis Resend Dashboard]"
echo ""
echo "5️⃣  Dans Resend: cliquer 'Verify Domain'"
echo ""
read -p "Appuyez sur Entrée quand Resend affiche 'Verified'..."
echo ""

# Step 7: Supabase Secrets
echo -e "${YELLOW}📋 Étape 7: Configuration Supabase Secrets${NC}"
echo ""
echo "ACTIONS MANUELLES REQUISES:"
echo ""
echo "1️⃣  Obtenir API Key depuis Resend"
echo "   URL: https://resend.com/api-keys"
echo "   → Create API Key"
echo "   → Nom: 'iDoc Production'"
echo "   → Permission: 'Full Access' ou 'Sending Access'"
echo "   → Copier la clé (re_...)"
echo ""
echo "2️⃣  Ajouter dans Supabase"
echo "   URL: https://supabase.com/dashboard/project/ffujpjaaramwhtmzqhlx/settings/vault"
echo "   → New Secret"
echo "   → Name: RESEND_API_KEY"
echo "   → Secret: [coller la clé Resend]"
echo "   → Add Secret"
echo ""
read -p "Appuyez sur Entrée quand c'est fait..."
echo ""

# Step 8: Test Email
echo -e "${BLUE}📧 Étape 8: Test Email${NC}"
echo ""
echo "Test manuel requis:"
echo ""
echo "Commande curl:"
cat << 'EOF'

curl -X POST \
  https://ffujpjaaramwhtmzqhlx.supabase.co/functions/v1/send-email \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZmdWpwamFhcmFtd2h0bXpxaGx4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzA5MjE1MjYsImV4cCI6MjA0NjQ5NzUyNn0.m3wt4oxwjJbjk2iwVWGXtV0YT1GkCB_h9GgRW78rKqo" \
  -H "Content-Type: application/json" \
  -d '{
    "to": ["test@mail-tester.com"],
    "subject": "Test Production iDoc - DNS Vercel",
    "html": "<h1>Test Email depuis id0c.com</h1><p>Configuration DNS Vercel + Resend</p>"
  }'

EOF
echo ""
echo "Après envoi:"
echo "1. Vérifier https://www.mail-tester.com"
echo "2. Score attendu: 10/10"
echo "3. Vérifier que SPF, DKIM, DMARC passent"
echo ""

# Step 9: Final Checks
echo -e "${GREEN}✅ Étape 9: Vérifications finales${NC}"
echo ""
echo "Checklist:"
echo "□ Vercel Dashboard → $DOMAIN affiche 'Valid Configuration'"
echo "□ HTTPS actif sur https://$DOMAIN"
echo "□ Resend Dashboard → $DOMAIN affiche 'Verified'"
echo "□ Email test reçu avec score 10/10"
echo "□ Edge Functions fonctionnelles"
echo ""

# Summary
echo ""
echo "=========================================="
echo -e "${GREEN}🎉 CONFIGURATION TERMINÉE${NC}"
echo "=========================================="
echo ""
echo "📋 Résumé:"
echo "  ✅ Nameservers: Vercel DNS"
echo "  ✅ DNS Web: Configuré"
echo "  ✅ DNS Email: Configuré"
echo "  ✅ Resend: Vérifié"
echo "  ✅ Supabase: Secrets configurés"
echo ""
echo "📚 Documentation:"
echo "  - GUIDE_DNS_VERCEL.md"
echo "  - CHECKLIST_PRODUCTION_DNS.md"
echo "  - MIGRATION_VERCEL_DNS_COMPLETE.md"
echo ""
echo "🔗 Liens utiles:"
echo "  - Site: https://$DOMAIN"
echo "  - Vercel: https://vercel.com/dashboard"
echo "  - Resend: https://resend.com/domains"
echo "  - Supabase: https://supabase.com/dashboard"
echo ""
echo "⏱️  Propagation DNS complète: jusqu'à 48h"
echo "     (généralement 15-30 minutes)"
echo ""
