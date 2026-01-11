#!/bin/bash

# ============================================
# Script de Déploiement - Email Functions
# ============================================
#
# Ce script déploie les edge functions pour
# l'envoi d'emails via Resend.
#
# Prérequis:
# 1. Compte Resend créé
# 2. Domaine id0c.com vérifié dans Resend
# 3. API Key Resend obtenue
# 4. Supabase CLI installé et configuré
#
# Usage:
#   ./deploy-email-functions.sh YOUR_RESEND_API_KEY
#
# ============================================

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_header() {
    echo ""
    echo -e "${BLUE}========================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}========================================${NC}"
    echo ""
}

# Check if API key is provided
if [ -z "$1" ]; then
    print_error "API Key Resend manquante!"
    echo ""
    echo "Usage:"
    echo "  ./deploy-email-functions.sh YOUR_RESEND_API_KEY"
    echo ""
    echo "Obtenir votre API Key:"
    echo "  1. Aller sur https://resend.com"
    echo "  2. Dashboard → API Keys"
    echo "  3. Create API Key"
    echo "  4. Copier la clé (commence par re_...)"
    echo ""
    exit 1
fi

RESEND_API_KEY="$1"

# Validate API key format
if [[ ! "$RESEND_API_KEY" =~ ^re_ ]]; then
    print_error "API Key invalide! La clé doit commencer par 're_'"
    exit 1
fi

print_header "🚀 Déploiement Edge Functions Email"

# Check if Supabase CLI is installed
print_info "Vérification Supabase CLI..."
if ! command -v supabase &> /dev/null; then
    print_error "Supabase CLI non installé!"
    echo ""
    echo "Installer Supabase CLI:"
    echo "  npm install -g supabase"
    echo ""
    exit 1
fi
print_success "Supabase CLI trouvé"

# Check if logged in
print_info "Vérification authentification Supabase..."
if ! supabase projects list &> /dev/null; then
    print_error "Non authentifié sur Supabase!"
    echo ""
    echo "Se connecter:"
    echo "  supabase login"
    echo ""
    exit 1
fi
print_success "Authentifié sur Supabase"

# Deploy send-email function
print_header "📧 Déploiement: send-email"
print_info "Déploiement en cours..."
if supabase functions deploy send-email; then
    print_success "send-email déployée avec succès!"
else
    print_error "Échec déploiement send-email"
    exit 1
fi

# Deploy idoc-alert-notify function
print_header "🔔 Déploiement: idoc-alert-notify"
print_info "Déploiement en cours..."
if supabase functions deploy idoc-alert-notify; then
    print_success "idoc-alert-notify déployée avec succès!"
else
    print_error "Échec déploiement idoc-alert-notify"
    exit 1
fi

# Set Resend API key secret
print_header "🔐 Configuration Secret: RESEND_API_KEY"
print_info "Configuration du secret..."
if supabase secrets set RESEND_API_KEY="$RESEND_API_KEY"; then
    print_success "Secret RESEND_API_KEY configuré!"
else
    print_error "Échec configuration secret"
    exit 1
fi

# Verify secrets
print_header "✅ Vérification Configuration"
print_info "Liste des secrets configurés:"
echo ""
supabase secrets list
echo ""

# Test email function (optional)
print_header "🧪 Test (Optionnel)"
echo ""
read -p "Voulez-vous tester l'envoi d'email? (y/n) " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]; then
    read -p "Entrer votre email de test: " TEST_EMAIL

    if [ -n "$TEST_EMAIL" ]; then
        print_info "Envoi email de test à $TEST_EMAIL..."

        # Get Supabase URL and Service Role Key
        PROJECT_REF=$(supabase projects list --output json | jq -r '.[0].id' 2>/dev/null || echo "")

        if [ -z "$PROJECT_REF" ]; then
            print_warning "Impossible de détecter automatiquement le projet"
            echo ""
            read -p "Entrer l'URL Supabase (https://xxx.supabase.co): " SUPABASE_URL
            read -p "Entrer Service Role Key: " SERVICE_ROLE_KEY
        else
            SUPABASE_URL="https://${PROJECT_REF}.supabase.co"
            print_info "Projet détecté: $SUPABASE_URL"
            read -p "Entrer Service Role Key: " SERVICE_ROLE_KEY
        fi

        # Send test email
        RESPONSE=$(curl -s -X POST \
            "${SUPABASE_URL}/functions/v1/send-email" \
            -H "Content-Type: application/json" \
            -H "Authorization: Bearer ${SERVICE_ROLE_KEY}" \
            -d "{
                \"to\": [\"${TEST_EMAIL}\"],
                \"subject\": \"Test iDoc - Email Function\",
                \"html\": \"<h1>🎉 Test Réussi!</h1><p>L'intégration Resend fonctionne parfaitement.</p><p>Vous pouvez maintenant envoyer des emails depuis <strong>id0c.com</strong>!</p>\",
                \"from\": \"iDoc Alerts <alerts@id0c.com>\"
            }")

        if echo "$RESPONSE" | grep -q "\"success\":true"; then
            print_success "Email de test envoyé avec succès!"
            echo ""
            print_info "Vérifiez votre inbox (et spam si nécessaire)"
        else
            print_error "Erreur lors de l'envoi du test"
            echo ""
            echo "Réponse:"
            echo "$RESPONSE"
        fi
    fi
fi

# Final summary
print_header "🎉 Déploiement Terminé!"

echo ""
print_success "Edge functions déployées:"
echo "  ✅ send-email"
echo "  ✅ idoc-alert-notify"
echo ""
print_success "Secrets configurés:"
echo "  ✅ RESEND_API_KEY"
echo ""

print_info "Prochaines étapes:"
echo ""
echo "1. 📧 Configurer notifications dans Admin Dashboard:"
echo "   → Aller dans Admin Dashboard"
echo "   → Onglet 'Notifications'"
echo "   → Activer 'Enable Email Notifications'"
echo "   → Ajouter email destinataire"
echo "   → Tester avec 'Test Notifications'"
echo ""
echo "2. 📊 Monitorer dans Dashboard Resend:"
echo "   → https://resend.com/dashboard"
echo "   → Voir emails envoyés"
echo "   → Analytics & logs"
echo ""
echo "3. 🔍 Voir logs Supabase:"
echo "   → supabase functions logs send-email --tail"
echo "   → supabase functions logs idoc-alert-notify --tail"
echo ""

print_success "Configuration email terminée avec succès! 🚀"
echo ""
