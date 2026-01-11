#!/bin/bash

# Configuration
DOMAIN="id0c.com"
SUPABASE_URL="https://ffujpjaaramwhtmzqhlx.supabase.co"
SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZmdWpwamFhcmFtd2h0bXpxaGx4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzA5MjE1MjYsImV4cCI6MjA0NjQ5NzUyNn0.m3wt4oxwjJbjk2iwVWGXtV0YT1GkCB_h9GgRW78rKqo"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

PASSED=0
FAILED=0
WARNINGS=0

echo "=========================================="
echo "🔍 VALIDATION DNS & EMAIL - iDoc"
echo "=========================================="
echo ""

# Check if required tools are available
check_tools() {
    local missing=0

    if ! command -v curl &> /dev/null; then
        echo -e "${RED}✗ curl non installé${NC}"
        missing=1
    fi

    if ! command -v dig &> /dev/null; then
        echo -e "${YELLOW}⚠ dig non installé (optionnel)${NC}"
    fi

    if ! command -v nslookup &> /dev/null; then
        echo -e "${YELLOW}⚠ nslookup non installé (optionnel)${NC}"
    fi

    if [ $missing -eq 1 ]; then
        echo ""
        echo "Installez les outils manquants:"
        echo "  Ubuntu/Debian: sudo apt-get install curl dnsutils"
        echo "  macOS: brew install curl bind"
        echo ""
        exit 1
    fi
}

# Test DNS Nameservers
test_nameservers() {
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${BLUE}1. NAMESERVERS${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

    if command -v dig &> /dev/null; then
        NS=$(dig NS $DOMAIN +short | grep -i vercel)
        if [ -n "$NS" ]; then
            echo -e "${GREEN}✓ Nameservers Vercel détectés${NC}"
            echo "$NS"
            PASSED=$((PASSED + 1))
        else
            echo -e "${RED}✗ Nameservers Vercel NON détectés${NC}"
            dig NS $DOMAIN +short
            echo ""
            echo "Attendu: ns1.vercel-dns.com et ns2.vercel-dns.com"
            FAILED=$((FAILED + 1))
        fi
    else
        echo -e "${YELLOW}⚠ dig non disponible, vérification manuelle${NC}"
        echo "Vérifiez: https://dnschecker.org/#NS/$DOMAIN"
        WARNINGS=$((WARNINGS + 1))
    fi
    echo ""
}

# Test A Record
test_a_record() {
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${BLUE}2. A RECORD (Web)${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

    if command -v dig &> /dev/null; then
        A_RECORD=$(dig A $DOMAIN +short | head -n1)
        if [ -n "$A_RECORD" ]; then
            echo -e "${GREEN}✓ A Record trouvé: $A_RECORD${NC}"
            PASSED=$((PASSED + 1))
        else
            echo -e "${RED}✗ Aucun A Record trouvé${NC}"
            FAILED=$((FAILED + 1))
        fi
    else
        echo -e "${YELLOW}⚠ dig non disponible${NC}"
        WARNINGS=$((WARNINGS + 1))
    fi
    echo ""
}

# Test HTTPS
test_https() {
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${BLUE}3. HTTPS / SSL${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

    HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" https://$DOMAIN --max-time 10)

    if [ "$HTTP_CODE" = "200" ] || [ "$HTTP_CODE" = "301" ] || [ "$HTTP_CODE" = "302" ]; then
        echo -e "${GREEN}✓ HTTPS actif (HTTP $HTTP_CODE)${NC}"
        PASSED=$((PASSED + 1))
    else
        echo -e "${RED}✗ HTTPS problématique (HTTP $HTTP_CODE)${NC}"
        FAILED=$((FAILED + 1))
    fi
    echo ""
}

# Test SPF Record
test_spf() {
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${BLUE}4. SPF RECORD${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

    if command -v dig &> /dev/null; then
        SPF=$(dig TXT $DOMAIN +short | grep -i "spf1.*resend")
        if [ -n "$SPF" ]; then
            echo -e "${GREEN}✓ SPF Record Resend trouvé${NC}"
            echo "$SPF"
            PASSED=$((PASSED + 1))
        else
            echo -e "${RED}✗ SPF Record Resend NON trouvé${NC}"
            dig TXT $DOMAIN +short
            FAILED=$((FAILED + 1))
        fi
    else
        echo -e "${YELLOW}⚠ dig non disponible${NC}"
        WARNINGS=$((WARNINGS + 1))
    fi
    echo ""
}

# Test DKIM Record
test_dkim() {
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${BLUE}5. DKIM RECORD${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

    if command -v dig &> /dev/null; then
        DKIM=$(dig CNAME resend._domainkey.$DOMAIN +short)
        if [ -n "$DKIM" ]; then
            echo -e "${GREEN}✓ DKIM CNAME trouvé${NC}"
            echo "$DKIM"
            PASSED=$((PASSED + 1))
        else
            echo -e "${YELLOW}⚠ DKIM CNAME non trouvé${NC}"
            echo "Vérifiez dans Resend Dashboard"
            WARNINGS=$((WARNINGS + 1))
        fi
    else
        echo -e "${YELLOW}⚠ dig non disponible${NC}"
        WARNINGS=$((WARNINGS + 1))
    fi
    echo ""
}

# Test DMARC Record
test_dmarc() {
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${BLUE}6. DMARC RECORD${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

    if command -v dig &> /dev/null; then
        DMARC=$(dig TXT _dmarc.$DOMAIN +short | grep -i "DMARC1")
        if [ -n "$DMARC" ]; then
            echo -e "${GREEN}✓ DMARC Record trouvé${NC}"
            echo "$DMARC"
            PASSED=$((PASSED + 1))
        else
            echo -e "${YELLOW}⚠ DMARC Record non trouvé${NC}"
            WARNINGS=$((WARNINGS + 1))
        fi
    else
        echo -e "${YELLOW}⚠ dig non disponible${NC}"
        WARNINGS=$((WARNINGS + 1))
    fi
    echo ""
}

# Test Resend Verification
test_resend_verification() {
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${BLUE}7. RESEND VERIFICATION${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

    if command -v dig &> /dev/null; then
        RESEND_VERIFY=$(dig TXT _resend.$DOMAIN +short)
        if [ -n "$RESEND_VERIFY" ]; then
            echo -e "${GREEN}✓ Record _resend trouvé${NC}"
            echo "$RESEND_VERIFY"
            PASSED=$((PASSED + 1))
        else
            echo -e "${YELLOW}⚠ Record _resend non trouvé${NC}"
            WARNINGS=$((WARNINGS + 1))
        fi
    else
        echo -e "${YELLOW}⚠ dig non disponible${NC}"
        WARNINGS=$((WARNINGS + 1))
    fi
    echo ""
}

# Test Edge Function
test_edge_function() {
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${BLUE}8. EDGE FUNCTION (send-email)${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

    RESPONSE=$(curl -s -X POST \
        "$SUPABASE_URL/functions/v1/send-email" \
        -H "Authorization: Bearer $SUPABASE_ANON_KEY" \
        -H "Content-Type: application/json" \
        -d '{
            "to": ["test@example.com"],
            "subject": "DNS Validation Test",
            "html": "<p>Test validation</p>"
        }' \
        --max-time 15)

    if echo "$RESPONSE" | grep -q "success"; then
        echo -e "${GREEN}✓ Edge Function répond${NC}"
        echo "Réponse: $RESPONSE"
        PASSED=$((PASSED + 1))
    else
        echo -e "${RED}✗ Edge Function erreur${NC}"
        echo "Réponse: $RESPONSE"
        FAILED=$((FAILED + 1))
    fi
    echo ""
}

# Summary
print_summary() {
    echo ""
    echo "=========================================="
    echo -e "${BLUE}📊 RÉSUMÉ${NC}"
    echo "=========================================="
    echo ""
    echo -e "${GREEN}Tests réussis:     $PASSED${NC}"
    echo -e "${RED}Tests échoués:     $FAILED${NC}"
    echo -e "${YELLOW}Avertissements:    $WARNINGS${NC}"
    echo ""

    TOTAL=$((PASSED + FAILED))
    if [ $TOTAL -gt 0 ]; then
        PERCENTAGE=$((PASSED * 100 / TOTAL))
        echo "Score: $PERCENTAGE%"
        echo ""
    fi

    if [ $FAILED -eq 0 ]; then
        echo -e "${GREEN}✅ Configuration DNS/Email VALIDÉE${NC}"
        echo ""
        echo "Prochaines étapes:"
        echo "1. Envoyer email de test réel"
        echo "2. Vérifier score mail-tester.com"
        echo "3. Monitorer deliverability"
    else
        echo -e "${RED}❌ Configuration INCOMPLÈTE${NC}"
        echo ""
        echo "Actions requises:"
        echo "1. Corriger les erreurs ci-dessus"
        echo "2. Attendre propagation DNS (15-30 min)"
        echo "3. Re-lancer ce script"
    fi
    echo ""

    if [ $WARNINGS -gt 0 ]; then
        echo -e "${YELLOW}⚠️  Vérifications manuelles requises${NC}"
        echo "Consultez les dashboards:"
        echo "- Vercel: https://vercel.com/dashboard"
        echo "- Resend: https://resend.com/domains"
        echo ""
    fi
}

# Run all tests
check_tools
test_nameservers
test_a_record
test_https
test_spf
test_dkim
test_dmarc
test_resend_verification
test_edge_function
print_summary

# Exit code
if [ $FAILED -eq 0 ]; then
    exit 0
else
    exit 1
fi
