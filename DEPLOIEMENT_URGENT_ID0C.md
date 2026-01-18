# 🚨 DÉPLOIEMENT URGENT - id0c.com

## Problème identifié
- Erreur : `DEPLOYMENT_NOT_FOUND`
- Cause : Le projet n'est pas déployé sur Vercel

## Solution en 3 étapes

### Étape 1 : Déployer sur Vercel (5 minutes)

```bash
# Installer Vercel CLI (si pas déjà fait)
npm install -g vercel

# Se connecter à Vercel
vercel login

# Déployer le projet
cd /tmp/cc-agent/59895567/project
vercel
```

Répondez aux questions :
- **Set up and deploy?** → Yes
- **Which scope?** → Votre compte personnel
- **Link to existing project?** → No
- **Project name?** → idoc (ou id0c)
- **Directory?** → ./
- **Override settings?** → No

### Étape 2 : Déployer en production

Une fois le preview déployé, déployez en production :

```bash
vercel --prod
```

Vercel vous donnera une URL de production (ex: `idoc.vercel.app`)

### Étape 3 : Connecter le domaine id0c.com

**Dans le Dashboard Vercel :**

1. Allez sur votre projet
2. **Settings** → **Domains**
3. Cliquez sur **Add Domain**
4. Entrez `id0c.com`
5. Cliquez sur **Add**

**Vercel vous donnera les enregistrements DNS à configurer :**

```
Type: A
Name: @
Value: 76.76.21.21

Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

### Étape 4 : Configurer le DNS

**Chez votre registrar de domaine (Name.com, GoDaddy, etc.) :**

1. Allez dans la gestion DNS de id0c.com
2. Supprimez tous les anciens enregistrements A et CNAME
3. Ajoutez les nouveaux enregistrements fournis par Vercel
4. Sauvegardez

**⏰ Délai de propagation :** 5 minutes à 48 heures (généralement 10-30 minutes)

### Étape 5 : Configurer les variables d'environnement

**Dans Vercel Dashboard → Settings → Environment Variables :**

Ajoutez ces 2 variables pour **Production, Preview, et Development** :

```
VITE_SUPABASE_URL=https://ffujpjaaramwhtmzqhlx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZmdWpwamFhcmFtd2h0bXpxaGx4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI1OTc3MzAsImV4cCI6MjA3ODE3MzczMH0.oiBJ_R4x_ZSRrHLEtSQ9d-gvAaseZJM0XMRS8evDXoo
```

Ensuite, **redéployez** pour appliquer les variables :

```bash
vercel --prod
```

---

## Vérification rapide

Après 10-30 minutes, testez :

1. ✅ https://id0c.com charge correctement
2. ✅ Vous pouvez créer un compte
3. ✅ Vous pouvez générer un document

---

## Si le domaine est toujours sur Netlify

Si id0c.com est encore hébergé sur Netlify, vous devez d'abord :

### Option A : Transférer le DNS vers Vercel

1. Dans Netlify, allez sur le site id0c.com
2. **Domain settings** → **Remove domain**
3. Suivez les étapes ci-dessus pour Vercel

### Option B : Utiliser un autre domaine temporairement

Vous pouvez utiliser l'URL Vercel gratuite :
- `idoc.vercel.app`
- Ou connecter un autre domaine que vous possédez

---

## Commandes rapides

```bash
# Déployer en une commande
vercel --prod

# Vérifier le statut
vercel inspect

# Voir les logs
vercel logs
```

---

## Support

**Si vous rencontrez des problèmes :**

1. Vérifiez les logs Vercel : [vercel.com/dashboard](https://vercel.com/dashboard)
2. Vérifiez le build : `npm run build` doit réussir localement
3. Vérifiez les variables d'environnement dans Vercel

---

**Temps total estimé : 15-20 minutes + délai DNS**

**🎯 Action immédiate : `vercel --prod`**
