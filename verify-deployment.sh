#!/bin/bash

# Script de Vérification Déploiement iDoc
# Usage: ./verify-deployment.sh [domain]
# Example: ./verify-deployment.sh id0c.com

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Domain (default or from argument)
DOMAIN="${1:-id0c.com}"
BASE_URL="https://${DOMAIN}"

echo -e "${BLUE}================================${NC}"
echo -e "${BLUE}  Vérification Déploiement iDoc${NC}"
echo -e "${BLUE}================================${NC}"
echo ""
echo -e "Domaine: ${GREEN}${DOMAIN}${NC}"
echo ""

# Test counter
TESTS_PASSED=0
TESTS_FAILED=0
TESTS_WARNING=0

# Function to check HTTP status
check_url() {
  local url=$1
  local expected_status=${2:-200}
  local description=$3

  echo -n "Testing: ${description}... "

  status_code=$(curl -s -o /dev/null -w "%{http_code}" -L "${url}" --max-time 10)

  if [ "$status_code" -eq "$expected_status" ]; then
    echo -e "${GREEN}✓ OK${NC} (${status_code})"
    ((TESTS_PASSED++))
    return 0
  else
    echo -e "${RED}✗ FAIL${NC} (got ${status_code}, expected ${expected_status})"
    ((TESTS_FAILED++))
    return 1
  fi
}

# Function to check content presence
check_content() {
  local url=$1
  local search_string=$2
  local description=$3

  echo -n "Testing: ${description}... "

  content=$(curl -s -L "${url}" --max-time 10)

  if echo "$content" | grep -q "$search_string"; then
    echo -e "${GREEN}✓ OK${NC}"
    ((TESTS_PASSED++))
    return 0
  else
    echo -e "${RED}✗ FAIL${NC} (content not found)"
    ((TESTS_FAILED++))
    return 1
  fi
}

# Function to check header
check_header() {
  local url=$1
  local header_name=$2
  local description=$3

  echo -n "Testing: ${description}... "

  header_value=$(curl -s -I -L "${url}" --max-time 10 | grep -i "^${header_name}:" | cut -d' ' -f2- | tr -d '\r')

  if [ -n "$header_value" ]; then
    echo -e "${GREEN}✓ OK${NC} (${header_value})"
    ((TESTS_PASSED++))
    return 0
  else
    echo -e "${YELLOW}⚠ WARNING${NC} (header not found)"
    ((TESTS_WARNING++))
    return 1
  fi
}

# Function to check DNS
check_dns() {
  local domain=$1
  local record_type=$2
  local description=$3

  echo -n "Testing DNS: ${description}... "

  result=$(dig +short "${domain}" "${record_type}" | head -n 1)

  if [ -n "$result" ]; then
    echo -e "${GREEN}✓ OK${NC} (${result})"
    ((TESTS_PASSED++))
    return 0
  else
    echo -e "${YELLOW}⚠ WARNING${NC} (no record found)"
    ((TESTS_WARNING++))
    return 1
  fi
}

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}1. Tests de Connectivité${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# Basic connectivity tests
check_url "${BASE_URL}/" 200 "Homepage accessible"
check_url "${BASE_URL}/templates" 200 "Templates page"
check_url "${BASE_URL}/pricing" 200 "Pricing page"
check_url "${BASE_URL}/blog" 200 "Blog page"
check_url "${BASE_URL}/faq" 200 "FAQ page"

echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}2. Tests SEO${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# SEO tests
check_url "${BASE_URL}/sitemap.xml" 200 "Sitemap accessible"
check_url "${BASE_URL}/robots.txt" 200 "Robots.txt accessible"

# Check sitemap content
echo -n "Testing: Sitemap contains URLs... "
sitemap_count=$(curl -s "${BASE_URL}/sitemap.xml" | grep -c "<loc>")
if [ "$sitemap_count" -gt 100 ]; then
  echo -e "${GREEN}✓ OK${NC} (${sitemap_count} URLs)"
  ((TESTS_PASSED++))
else
  echo -e "${YELLOW}⚠ WARNING${NC} (only ${sitemap_count} URLs)"
  ((TESTS_WARNING++))
fi

# Check meta tags
check_content "${BASE_URL}/" "<title>" "Meta title present"
check_content "${BASE_URL}/" "og:title" "Open Graph tags present"
check_content "${BASE_URL}/" "twitter:card" "Twitter Card tags present"

echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}3. Tests de Sécurité${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# Security headers
check_header "${BASE_URL}/" "X-Content-Type-Options" "X-Content-Type-Options header"
check_header "${BASE_URL}/" "X-Frame-Options" "X-Frame-Options header"
check_header "${BASE_URL}/" "X-XSS-Protection" "X-XSS-Protection header"
check_header "${BASE_URL}/" "Referrer-Policy" "Referrer-Policy header"

# HTTPS check
echo -n "Testing: HTTPS enabled... "
if curl -s -I "${BASE_URL}/" | grep -q "HTTP/2 200"; then
  echo -e "${GREEN}✓ OK${NC} (HTTP/2 with HTTPS)"
  ((TESTS_PASSED++))
else
  echo -e "${RED}✗ FAIL${NC}"
  ((TESTS_FAILED++))
fi

echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}4. Tests de Performance${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# Check cache headers
check_header "${BASE_URL}/" "Cache-Control" "Cache-Control header"

# Check content encoding (gzip/brotli)
echo -n "Testing: Content compression... "
encoding=$(curl -s -I -H "Accept-Encoding: br,gzip,deflate" "${BASE_URL}/" | grep -i "content-encoding:" | cut -d' ' -f2- | tr -d '\r')
if [ -n "$encoding" ]; then
  echo -e "${GREEN}✓ OK${NC} (${encoding})"
  ((TESTS_PASSED++))
else
  echo -e "${YELLOW}⚠ WARNING${NC} (no compression)"
  ((TESTS_WARNING++))
fi

# Response time check
echo -n "Testing: Response time... "
response_time=$(curl -s -o /dev/null -w "%{time_total}" "${BASE_URL}/" --max-time 10)
response_time_ms=$(echo "$response_time * 1000" | bc | cut -d'.' -f1)

if [ "$response_time_ms" -lt 1000 ]; then
  echo -e "${GREEN}✓ EXCELLENT${NC} (${response_time_ms}ms)"
  ((TESTS_PASSED++))
elif [ "$response_time_ms" -lt 2000 ]; then
  echo -e "${GREEN}✓ GOOD${NC} (${response_time_ms}ms)"
  ((TESTS_PASSED++))
elif [ "$response_time_ms" -lt 3000 ]; then
  echo -e "${YELLOW}⚠ OK${NC} (${response_time_ms}ms)"
  ((TESTS_WARNING++))
else
  echo -e "${RED}✗ SLOW${NC} (${response_time_ms}ms)"
  ((TESTS_FAILED++))
fi

echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}5. Tests DNS (Email)${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# DNS checks for email
if command -v dig &> /dev/null; then
  check_dns "${DOMAIN}" "TXT" "SPF record"
  check_dns "resend._domainkey.${DOMAIN}" "CNAME" "DKIM record"
  check_dns "_resend.${DOMAIN}" "TXT" "Resend verification"
else
  echo -e "${YELLOW}⚠ Skipping DNS tests (dig not installed)${NC}"
  echo "  Install with: sudo apt-get install dnsutils (Ubuntu/Debian)"
  echo "  Or: brew install bind (macOS)"
fi

echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}6. Tests de Contenu${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# Content checks
check_content "${BASE_URL}/" "iDoc" "Brand name present"
check_content "${BASE_URL}/" "document" "Keywords present"

# Check if JavaScript loads properly
echo -n "Testing: JavaScript loading... "
if check_content "${BASE_URL}/" "<script" ""; then
  echo -e "${GREEN}✓ OK${NC}"
  ((TESTS_PASSED++))
else
  echo -e "${RED}✗ FAIL${NC}"
  ((TESTS_FAILED++))
fi

# Check assets
check_url "${BASE_URL}/Logo.PNG" 200 "Logo image accessible"

echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}7. Tests API/Backend${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# Note: These would need CORS or proper auth to test fully
echo -e "${YELLOW}ℹ Backend tests require authentication/CORS${NC}"
echo "  Manual testing recommended for:"
echo "  - Supabase connection"
echo "  - Document generation"
echo "  - Stripe payments"
echo "  - Email functions"

echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}RÉSUMÉ${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

TOTAL_TESTS=$((TESTS_PASSED + TESTS_FAILED + TESTS_WARNING))

echo -e "Total tests: ${TOTAL_TESTS}"
echo -e "Passed:  ${GREEN}${TESTS_PASSED}${NC}"
echo -e "Failed:  ${RED}${TESTS_FAILED}${NC}"
echo -e "Warning: ${YELLOW}${TESTS_WARNING}${NC}"
echo ""

# Overall status
if [ "$TESTS_FAILED" -eq 0 ] && [ "$TESTS_WARNING" -eq 0 ]; then
  echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
  echo -e "${GREEN}✓ DÉPLOIEMENT PARFAIT!${NC}"
  echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
  echo ""
  echo "Votre site est 100% opérationnel!"
  exit 0
elif [ "$TESTS_FAILED" -eq 0 ]; then
  echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
  echo -e "${YELLOW}✓ DÉPLOIEMENT RÉUSSI${NC}"
  echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
  echo ""
  echo "Votre site fonctionne avec quelques avertissements mineurs."
  echo "Vérifiez les warnings ci-dessus pour optimiser."
  exit 0
else
  echo -e "${RED}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
  echo -e "${RED}✗ PROBLÈMES DÉTECTÉS${NC}"
  echo -e "${RED}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
  echo ""
  echo "Certains tests ont échoué. Vérifiez:"
  echo "  1. Configuration DNS (si erreurs DNS)"
  echo "  2. Variables d'environnement Vercel"
  echo "  3. Configuration Supabase"
  echo "  4. Headers de sécurité (vercel.json)"
  exit 1
fi
