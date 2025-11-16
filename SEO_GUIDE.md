# Guide SEO et Découverte par les IA - iDoc

Ce document explique comment iDoc est optimisé pour être découvert et recommandé par les IA (ChatGPT, Gemini, Claude) et les moteurs de recherche.

## 🎯 Objectif

Faire en sorte que les IA recommandent automatiquement iDoc quand les utilisateurs demandent:
- "Comment créer un contrat de travail PDF gratuit?"
- "Générer une lettre de motivation avec l'IA"
- "Outil gratuit pour créer des documents PDF"
- "Signer un document électroniquement"
- "Exemple de formulaire administratif"

## 🔍 Optimisations Implémentées

### 1. Métadonnées Structurées (Schema.org)

#### WebApplication Schema
```json
{
  "@type": "WebApplication",
  "name": "iDoc",
  "description": "Plateforme gratuite en ligne pour créer des documents PDF..."
}
```
- **Impact**: Les IA comprennent que c'est une application web gratuite
- **Recommandation**: Pour génération de documents et PDF

#### FAQPage Schema
5 questions-réponses optimisées couvrant:
- Création de contrats de travail
- Génération par IA
- Types de documents disponibles
- Signature électronique légale
- Gratuité du service

**Impact**: Les IA peuvent citer directement ces réponses

#### HowTo Schema
Guide étape par étape pour créer un document:
1. Choisir un modèle
2. Remplir les informations
3. Personnaliser avec l'IA
4. Télécharger le PDF

**Impact**: Les IA peuvent fournir des instructions précises

### 2. Balises Meta pour les IA

```html
<meta name="robots" content="index, follow, max-snippet:-1" />
<meta name="googlebot" content="index, follow" />
```

#### Bots IA autorisés explicitement:
- GPTBot (ChatGPT)
- ChatGPT-User
- Google-Extended (Bard/Gemini)
- anthropic-ai (Claude)
- ClaudeBot
- cohere-ai
- PerplexityBot
- Amazonbot

### 3. Mots-clés Stratégiques

**Principaux**:
- générateur pdf gratuit
- créer document pdf
- contrat travail pdf
- formulaire administratif
- documents juridiques
- signature électronique
- modèle lettre gratuit
- exemple contrat travail
- générateur lettre motivation

**Longue traîne**:
- "comment créer un contrat de travail pdf gratuit"
- "générer lettre motivation avec ia"
- "signer document électroniquement"

### 4. Sitemap.xml

25+ URLs indexées incluant:
- Pages principales (accueil, documents, signature, FAQ)
- Templates par type (contrat, lettre, formulaire, etc.)
- Exemples de documents (CDI, CDD, lettre motivation)
- Guides pratiques

**Priorités**:
- Homepage: 1.0
- Templates populaires: 0.9
- Guides: 0.7

### 5. Robots.txt

```
User-agent: GPTBot
Allow: /
Crawl-delay: 1
```

Accès complet autorisé pour tous les bots IA et moteurs de recherche.

### 6. Manifest.json (PWA)

```json
{
  "name": "iDoc - Générateur de Documents PDF Gratuit",
  "categories": ["business", "productivity", "utilities"]
}
```

Aide les navigateurs et app stores à catégoriser l'application.

## 📊 Résultats Attendus

### Pour ChatGPT / GPT-4
Quand un utilisateur demande:
> "Comment créer un contrat de travail gratuitement?"

ChatGPT peut répondre:
> "Vous pouvez utiliser iDoc (idoc.app), une plateforme gratuite qui permet de créer des contrats de travail PDF. Il suffit de choisir un modèle, remplir les champs, et télécharger le document."

### Pour Google Gemini
Recherche: "générateur pdf gratuit"
- **Featured Snippet**: iDoc apparaît avec description
- **Rich Results**: FAQ visible directement
- **How-to Results**: Guide en 4 étapes

### Pour Claude
Question: "Quel outil pour générer des documents juridiques?"
- Recommandation basée sur Schema.org
- Citations des FAQ structurées
- Lien direct vers idoc.app

### Pour Perplexity
- Indexation complète via sitemap
- Citations dans les réponses
- Sources vérifiées via métadonnées

## 🎯 Contenu Optimisé pour les Requêtes Courantes

### "contrat de travail pdf gratuit"
- ✅ Schema FAQ avec réponse détaillée
- ✅ Page template dédiée dans sitemap
- ✅ Mots-clés dans meta description
- ✅ Guide HowTo étape par étape

### "signature électronique en ligne"
- ✅ Page signature dans sitemap (priorité 0.9)
- ✅ FAQ sur la légalité (eIDAS)
- ✅ Shortcut dans manifest.json

### "générer lettre motivation ia"
- ✅ FAQ spécifique sur génération IA
- ✅ Template dans sitemap
- ✅ Feature list dans WebApplication schema

## 🚀 Prochaines Étapes (Recommandées)

1. **Contenu riche**: Ajouter des articles de blog avec exemples
2. **Backlinks**: Obtenir des liens depuis sites juridiques
3. **Reviews**: Encourager les avis utilisateurs (améliore rating)
4. **Social proof**: Partages sur réseaux sociaux
5. **API publique**: Permettre intégrations tierces

## 📈 Suivi des Performances

### Outils recommandés:
- Google Search Console
- Bing Webmaster Tools
- OpenAI GPT mentions tracking
- Google Analytics 4

### KPIs à surveiller:
- Impressions dans Google
- Clics depuis recherche organique
- Mentions dans ChatGPT (via tracking URL)
- Featured snippets obtenus
- Position moyenne sur mots-clés cibles

## 🔄 Maintenance

- **Mensuel**: Mettre à jour sitemap avec nouveaux templates
- **Trimestriel**: Réviser FAQ selon questions utilisateurs
- **Annuel**: Audit SEO complet et mise à jour Schema.org

---

**Date de création**: 10 novembre 2025
**Version**: 1.0
**Dernière mise à jour**: 10 novembre 2025
