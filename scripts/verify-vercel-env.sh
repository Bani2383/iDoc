#!/bin/bash

# Script de vérification de la configuration Vercel
# Usage: ./scripts/verify-vercel-env.sh

echo "🔍 Vérification de la configuration Supabase pour Vercel"
echo "=========================================================="
echo ""

# Couleurs
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Variables attendues
EXPECTED_URL="https://jgadstuimnblhykfaxsv.supabase.co"
EXPECTED_KEY_PREFIX="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9"

echo "📋 Variables requises dans Vercel:"
echo ""
echo "1️⃣  Variable Name: VITE_SUPABASE_URL"
echo "   Value: $EXPECTED_URL"
echo "   Environments: Production, Preview, Development"
echo ""
echo "2️⃣  Variable Name: VITE_SUPABASE_ANON_KEY"
echo "   Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3M..."
echo "   Environments: Production, Preview, Development"
echo ""

# Vérifier le fichier .env local
echo "🔍 Vérification du fichier .env local:"
echo ""

if [ -f .env ]; then
    if grep -q "VITE_SUPABASE_URL=$EXPECTED_URL" .env; then
        echo -e "${GREEN}✅ VITE_SUPABASE_URL correct dans .env${NC}"
    else
        echo -e "${RED}❌ VITE_SUPABASE_URL incorrect ou manquant dans .env${NC}"
    fi

    if grep -q "VITE_SUPABASE_ANON_KEY=$EXPECTED_KEY_PREFIX" .env; then
        echo -e "${GREEN}✅ VITE_SUPABASE_ANON_KEY présent dans .env${NC}"
    else
        echo -e "${RED}❌ VITE_SUPABASE_ANON_KEY incorrect ou manquant dans .env${NC}"
    fi
else
    echo -e "${RED}❌ Fichier .env introuvable${NC}"
fi

echo ""
echo "📝 Étapes pour configurer Vercel:"
echo ""
echo "1. Ouvrez https://vercel.com/dashboard"
echo "2. Cliquez sur votre projet 'id0c'"
echo "3. Allez dans Settings → Environment Variables"
echo "4. Ajoutez les 2 variables ci-dessus"
echo "5. Redéployez depuis Deployments"
echo ""
echo "📖 Guide complet: VERCEL_3_ETAPES.md"
echo "🌐 Interface graphique: vercel-config.html (ouvrez dans un navigateur)"
echo ""
