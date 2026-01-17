# 🚀 MIGRATION DE NETLIFY VERS VERCEL

## Durée totale: 30-40 minutes

---

## ÉTAPE 1: Retirer le domaine de Netlify (5 min)

### Action manuelle sur Netlify:

1. Allez sur: **https://app.netlify.com/sites/id0c/settings/domain**

2. Dans "Production domains", trouvez **id0c.com**

3. Cliquez sur **"Options"** → **"Remove domain"**

4. Confirmez la suppression

5. Faites la même chose pour **www.id0c.com** si présent

6. **ATTENDEZ 5 MINUTES** (temps de propagation DNS)

---

## ÉTAPE 2: Préparer votre projet pour Vercel (2 min)

Vérifier que `vercel.json` existe et est correct:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

✅ Déjà présent dans votre projet!

---

## ÉTAPE 3: Déployer sur Vercel (5 min)

### Option A: Via l'interface Vercel (Recommandé)

1. Allez sur **https://vercel.com**

2. Cliquez sur **"Add New..."** → **"Project"**

3. **Si votre code est sur GitHub:**
   - Connectez votre compte GitHub
   - Sélectionnez votre repository
   - Cliquez "Import"

4. **Configuration automatique:**
   - Framework: Vite (détecté automatiquement)
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

5. **Variables d'environnement:**
   Ajoutez ces variables:
   ```
   VITE_SUPABASE_URL = votre_url_supabase
   VITE_SUPABASE_ANON_KEY = votre_clé_anon
   ```

6. Cliquez **"Deploy"**

7. Attendez 2-3 minutes → Votre site sera sur **[nom-projet].vercel.app**

### Option B: Via CLI Vercel

```bash
# Installer Vercel CLI
npm install -g vercel

# Login
vercel login

# Déployer (dans le dossier du projet)
vercel

# Suivez les prompts:
# - Set up and deploy? Yes
# - Which scope? Votre compte
# - Link to existing project? No
# - Project name? id0c
# - Directory? ./
# - Override settings? No

# Déployer en production
vercel --prod
```

---

## ÉTAPE 4: Ajouter le domaine sur Vercel (5 min)

1. Sur Vercel, allez dans votre projet **id0c**

2. **Settings** → **Domains**

3. Cliquez **"Add"**

4. Entrez: **id0c.com**

5. Cliquez **"Add"**

6. Vercel va vous demander de configurer les DNS

7. **NOTEZ LES VALEURS** que Vercel vous donne:

   Pour **id0c.com**:
   ```
   Type: A
   Value: 76.76.21.21
   ```

   Pour **www.id0c.com**:
   ```
   Type: CNAME
   Value: cname.vercel-dns.com
   ```

8. Répétez pour ajouter **www.id0c.com**

---

## ÉTAPE 5: Modifier les DNS sur Netlify (10 min)

Puisque **Netlify gère vos DNS**, vous devez modifier les enregistrements:

### A. Trouver la zone DNS sur Netlify

1. Allez sur: **https://app.netlify.com/teams/[votre-team]/dns**

2. Trouvez et cliquez sur **id0c.com**

### B. Modifier les enregistrements

#### Pour id0c.com (apex domain):

1. Trouvez l'enregistrement actuel:
   ```
   Type: NETLIFY
   Name: id0c.com
   Value: id0c.netlify.app
   ```

2. **Supprimez** cet enregistrement (poubelle)

3. **Créez un nouveau** enregistrement:
   ```
   Type: A
   Name: @ (ou laissez vide pour apex)
   Value: 76.76.21.21
   TTL: 3600
   ```

4. Cliquez **"Save"**

#### Pour www.id0c.com:

1. Trouvez l'enregistrement actuel:
   ```
   Type: NETLIFY
   Name: www
   Value: id0c.netlify.app
   ```

2. **Supprimez** cet enregistrement

3. **Créez un nouveau** enregistrement:
   ```
   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   TTL: 3600
   ```

4. Cliquez **"Save"**

---

## ÉTAPE 6: Vérifier la propagation DNS (5-15 min)

### Test immédiat:

```bash
# Vérifier l'enregistrement A
dig id0c.com A

# Devrait montrer:
# id0c.com.  3600  IN  A  76.76.21.21

# Vérifier le CNAME
dig www.id0c.com CNAME

# Devrait montrer:
# www.id0c.com.  3600  IN  CNAME  cname.vercel-dns.com.
```

### Vérification dans le navigateur:

1. Attendez **5-10 minutes**

2. Allez sur: **https://id0c.com**

3. Vous devriez voir votre site Vercel

4. Vérifiez: **https://www.id0c.com**

### Si ça ne marche pas encore:

- La propagation DNS peut prendre jusqu'à **24-48h** (rare)
- En général, c'est effectif en **15 minutes**
- Essayez en navigation privée (pour éviter le cache)
- Essayez sur votre téléphone (réseau différent)

---

## ÉTAPE 7: Configurer HTTPS sur Vercel (Automatique)

Vercel génère automatiquement les certificats SSL avec Let's Encrypt.

1. Sur Vercel → **Settings** → **Domains**

2. Vérifiez que vos domaines ont une coche verte ✅

3. Si statut "Pending", attendez 5-10 minutes

4. HTTPS sera activé automatiquement

---

## ÉTAPE 8: Configurer les variables d'environnement

### Sur Vercel:

1. **Settings** → **Environment Variables**

2. Ajoutez toutes vos variables:

```
VITE_SUPABASE_URL = https://votre-projet.supabase.co
VITE_SUPABASE_ANON_KEY = votre_clé_publique
```

3. Pour chaque variable:
   - Name: le nom de la variable
   - Value: la valeur
   - Environment: Production, Preview, Development (cochez tous)
   - Cliquez "Save"

4. **Redéployez** pour que les variables prennent effet:
   - Allez dans **Deployments**
   - Trouvez le dernier déploiement
   - Cliquez "..." → **"Redeploy"**

---

## ÉTAPE 9: Vérification finale

### Checklist:

- [ ] https://id0c.com fonctionne
- [ ] https://www.id0c.com fonctionne et redirige vers id0c.com
- [ ] HTTPS actif (cadenas vert dans le navigateur)
- [ ] L'application fonctionne correctement
- [ ] Supabase connecté (testez login/signup)
- [ ] Toutes les fonctionnalités marchent

### Nettoyer Netlify:

Une fois que tout fonctionne sur Vercel:

1. Vous pouvez **désactiver** le site Netlify
2. Ou le **supprimer** complètement
3. Allez sur: https://app.netlify.com/sites/id0c/settings
4. Scroll en bas → "Danger Zone" → "Delete site"

---

## Commandes Utiles

### Test DNS:

```bash
# Test A record
dig id0c.com A +short
# Devrait montrer: 76.76.21.21

# Test CNAME
dig www.id0c.com CNAME +short
# Devrait montrer: cname.vercel-dns.com.

# Test complet
nslookup id0c.com
```

### Vider le cache DNS local:

```bash
# macOS
sudo dscacheutil -flushcache; sudo killall -HUP mDNSResponder

# Windows (en admin)
ipconfig /flushdns

# Linux
sudo systemd-resolve --flush-caches
```

---

## Problèmes Courants

### 1. "DNS not configured" sur Vercel

**Solution:**
- Vérifiez que vous avez bien modifié les DNS sur Netlify
- Attendez 5-10 minutes
- Cliquez "Refresh" sur Vercel

### 2. "Site can't be reached"

**Solution:**
- Les DNS ne sont pas encore propagés
- Attendez 15-30 minutes
- Videz le cache DNS de votre ordinateur

### 3. Certificat SSL invalide

**Solution:**
- Vercel génère le certificat automatiquement
- Attendez 5-10 minutes après la configuration DNS
- Si toujours invalide après 1h, contactez le support Vercel

### 4. Variables d'environnement ne marchent pas

**Solution:**
- Vérifiez qu'elles sont bien préfixées par `VITE_`
- Redéployez après les avoir ajoutées
- Vercel → Deployments → Redeploy

---

## Support

Si vous rencontrez des problèmes:

1. **Documentation Vercel:**
   https://vercel.com/docs/concepts/projects/domains

2. **Support Vercel:**
   https://vercel.com/support

3. **Support Netlify DNS:**
   https://docs.netlify.com/domains-https/custom-domains/

---

## Temps Estimé Total

- Retirer domaine de Netlify: **5 min**
- Déployer sur Vercel: **5 min**
- Ajouter domaine sur Vercel: **5 min**
- Modifier DNS sur Netlify: **10 min**
- Propagation DNS: **5-15 min**
- Configuration finale: **5 min**

**TOTAL: 35-45 minutes**

---

## Prochaines Étapes

Une fois la migration terminée, je vous recommande:

1. ✅ Tester toutes les fonctionnalités
2. ✅ Vérifier les analytics
3. ✅ Configurer les redirections si nécessaire
4. ✅ Supprimer le site Netlify (optionnel)

Votre site sera plus rapide et bénéficiera de l'infrastructure Vercel!
