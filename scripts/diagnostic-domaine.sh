#!/bin/bash

# Script de diagnostic pour id0c.com
# Identifie automatiquement où est le domaine et comment le configurer

echo "🔍 DIAGNOSTIC DOMAINE id0c.com"
echo "================================"
echo ""

# Couleurs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

DOMAIN="id0c.com"

echo "📡 1. Test de résolution DNS..."
echo "--------------------------------"
DNS_IP=$(dig +short $DOMAIN A | head -1)
if [ -z "$DNS_IP" ]; then
    echo -e "${RED}❌ Aucune IP trouvée - DNS pas configuré${NC}"
    DNS_STATUS="NOT_CONFIGURED"
else
    echo -e "${GREEN}✓ IP actuelle: $DNS_IP${NC}"

    # Vérifier si c'est Vercel
    if [ "$DNS_IP" == "76.76.21.21" ] || [ "$DNS_IP" == "76.76.21.22" ]; then
        echo -e "${GREEN}✓ Pointe vers Vercel${NC}"
        DNS_STATUS="VERCEL"
    else
        echo -e "${YELLOW}⚠ Pointe vers: $DNS_IP (pas Vercel)${NC}"
        DNS_STATUS="OTHER"
    fi
fi

echo ""
echo "🌐 2. Test www..."
echo "--------------------------------"
WWW_DNS=$(dig +short www.$DOMAIN CNAME | head -1)
if [ -z "$WWW_DNS" ]; then
    echo -e "${RED}❌ www.$DOMAIN pas configuré${NC}"
    WWW_STATUS="NOT_CONFIGURED"
else
    echo -e "${GREEN}✓ www pointe vers: $WWW_DNS${NC}"
    if [[ "$WWW_DNS" == *"vercel"* ]]; then
        echo -e "${GREEN}✓ Configuré pour Vercel${NC}"
        WWW_STATUS="VERCEL"
    else
        echo -e "${YELLOW}⚠ Pointe vers autre chose que Vercel${NC}"
        WWW_STATUS="OTHER"
    fi
fi

echo ""
echo "📋 3. Vérification Nameservers..."
echo "--------------------------------"
NAMESERVERS=$(dig +short $DOMAIN NS)
if [ -z "$NAMESERVERS" ]; then
    echo -e "${RED}❌ Aucun nameserver trouvé${NC}"
    NS_STATUS="NONE"
else
    echo -e "${GREEN}✓ Nameservers:${NC}"
    echo "$NAMESERVERS"

    if echo "$NAMESERVERS" | grep -qi "netlify"; then
        echo -e "${BLUE}→ DNS géré par Netlify${NC}"
        NS_STATUS="NETLIFY"
    elif echo "$NAMESERVERS" | grep -qi "name.com"; then
        echo -e "${BLUE}→ DNS géré par Name.com${NC}"
        NS_STATUS="NAMECOM"
    elif echo "$NAMESERVERS" | grep -qi "vercel"; then
        echo -e "${BLUE}→ DNS géré par Vercel${NC}"
        NS_STATUS="VERCEL"
    else
        echo -e "${YELLOW}→ DNS géré par autre provider${NC}"
        NS_STATUS="OTHER"
    fi
fi

echo ""
echo "🔐 4. Test HTTPS..."
echo "--------------------------------"
HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" --connect-timeout 5 https://$DOMAIN 2>/dev/null)
if [ "$HTTP_STATUS" == "200" ]; then
    echo -e "${GREEN}✓ HTTPS fonctionne (code: $HTTP_STATUS)${NC}"
    HTTPS_STATUS="OK"
elif [ "$HTTP_STATUS" == "000" ]; then
    echo -e "${RED}❌ Site inaccessible (timeout)${NC}"
    HTTPS_STATUS="TIMEOUT"
else
    echo -e "${YELLOW}⚠ Réponse HTTP: $HTTP_STATUS${NC}"
    HTTPS_STATUS="ERROR_$HTTP_STATUS"
fi

echo ""
echo "================================================"
echo "📊 RÉSUMÉ DU DIAGNOSTIC"
echo "================================================"
echo ""

# Diagnostic global
if [ "$DNS_STATUS" == "VERCEL" ] && [ "$WWW_STATUS" == "VERCEL" ] && [ "$HTTPS_STATUS" == "OK" ]; then
    echo -e "${GREEN}✅ TOUT FONCTIONNE PARFAITEMENT !${NC}"
    echo ""
    echo "Votre domaine id0c.com est correctement configuré."
    echo "Site accessible sur: https://id0c.com"
    exit 0
fi

echo -e "${YELLOW}⚠ CONFIGURATION INCOMPLÈTE${NC}"
echo ""

# Recommandations basées sur le diagnostic
echo "🎯 ACTIONS RECOMMANDÉES :"
echo "------------------------"

if [ "$NS_STATUS" == "NETLIFY" ]; then
    echo ""
    echo -e "${BLUE}→ Votre DNS est géré par Netlify${NC}"
    echo ""
    echo "SOLUTION :"
    echo "1. Aller sur https://app.netlify.com"
    echo "2. Domains → id0c.com → DNS settings"
    echo "3. Ajouter/modifier les records suivants :"
    echo ""
    echo "   Type: A"
    echo "   Name: @"
    echo "   Value: 76.76.21.21"
    echo ""
    echo "   Type: CNAME"
    echo "   Name: www"
    echo "   Value: cname.vercel-dns.com"
    echo ""

elif [ "$NS_STATUS" == "NAMECOM" ]; then
    echo ""
    echo -e "${BLUE}→ Votre DNS est géré par Name.com${NC}"
    echo ""
    echo "SOLUTION :"
    echo "1. Aller sur https://www.name.com/account/domain/details/$DOMAIN#dns"
    echo "2. Ajouter/modifier les records suivants :"
    echo ""
    echo "   Type: A"
    echo "   Host: @"
    echo "   Answer: 76.76.21.21"
    echo ""
    echo "   Type: CNAME"
    echo "   Host: www"
    echo "   Answer: cname.vercel-dns.com"
    echo ""

elif [ "$DNS_STATUS" == "NOT_CONFIGURED" ]; then
    echo ""
    echo -e "${RED}→ Aucun DNS configuré${NC}"
    echo ""
    echo "SOLUTION :"
    echo "1. Vérifier que vous possédez bien id0c.com"
    echo "2. Identifier où le domaine est enregistré :"
    echo "   - Netlify : https://app.netlify.com"
    echo "   - Name.com : https://www.name.com"
    echo "   - Autre : vérifier vos emails d'achat"
    echo "3. Configurer les DNS selon le provider"
    echo ""
fi

if [ "$HTTPS_STATUS" == "TIMEOUT" ]; then
    echo ""
    echo -e "${YELLOW}→ Le site ne répond pas${NC}"
    echo ""
    echo "Vérifications :"
    echo "1. Le projet est-il déployé sur Vercel ?"
    echo "   → Aller sur https://vercel.com/dashboard"
    echo "2. Le domaine est-il ajouté dans Vercel ?"
    echo "   → Project → Settings → Domains → Add: id0c.com"
    echo "3. DNS propagation en cours ?"
    echo "   → Attendre 5-30 minutes après config DNS"
    echo ""
fi

echo ""
echo "================================================"
echo "📚 GUIDES DISPONIBLES"
echo "================================================"
echo ""
echo "Guide complet : CONNEXION_DOMAINE_SOLUTION_RAPIDE.md"
echo "Situation Netlify : SITUATION_DOMAINE_NETLIFY.md"
echo ""
echo "💡 Pour plus d'aide, copiez ce diagnostic et contactez le support"
echo ""

exit 1
