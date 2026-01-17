# 🔗 LIENS DIRECTS POUR LA MIGRATION

Cliquez directement sur ces liens pour effectuer chaque étape!

---

## ÉTAPE 1: Retirer le domaine de Netlify

🔗 **https://app.netlify.com/sites/id0c/settings/domain**

Actions:
1. Cliquez "Options" à côté de "id0c.com"
2. Cliquez "Remove domain"
3. Confirmez
4. Faites pareil pour "www.id0c.com"

---

## ÉTAPE 2: Déployer sur Vercel

🔗 **https://vercel.com/new**

Actions:
1. Connectez votre GitHub
2. Sélectionnez votre repository
3. Ajoutez les variables d'environnement (voir section Variables ci-dessous)
4. Cliquez "Deploy"

---

## ÉTAPE 3: Gérer les DNS sur Netlify

🔗 **https://app.netlify.com/account/dns**

Actions:
1. Trouvez "id0c.com" dans la liste
2. Cliquez dessus
3. Modifiez les enregistrements DNS selon les instructions

---

## ÉTAPE 4: Vérifier les DNS

🔗 **https://dnschecker.org/#A/id0c.com**

Vérifiez que l'enregistrement A pointe vers: **76.76.21.21**

🔗 **https://dnschecker.org/#CNAME/www.id0c.com**

Vérifiez que le CNAME pointe vers: **cname.vercel-dns.com**

---

## ÉTAPE 5: Vérifier le site

🔗 **https://id0c.com**

Votre site devrait être en ligne!

🔗 **https://www.id0c.com**

Devrait rediriger vers id0c.com

---

## Variables d'environnement à configurer sur Vercel

Allez dans: **Settings → Environment Variables**

Variables à ajouter:

```
VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY
```

**Cochez tous les environnements:**
- Production
- Preview  
- Development

---

## Support et Documentation

📚 **Guide Vercel Domains:**
https://vercel.com/docs/concepts/projects/domains

📚 **Guide Netlify DNS:**
https://docs.netlify.com/domains-https/custom-domains/

💬 **Support Vercel:**
https://vercel.com/support

---

## Outils de diagnostic

🔧 **Test DNS (dig):**
https://toolbox.googleapps.com/apps/dig/#A/

🔧 **Vérification SSL:**
https://www.ssllabs.com/ssltest/analyze.html?d=id0c.com

🔧 **Test de vitesse:**
https://pagespeed.web.dev/

---

## Récapitulatif des valeurs DNS

Pour Vercel, vous aurez besoin de:

### Domaine principal (id0c.com):
```
Type: A
Name: @ (ou vide)
Value: 76.76.21.21
TTL: 3600
```

### Sous-domaine www (www.id0c.com):
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
TTL: 3600
```

---

## Timeline estimée

- ⏱️ **0-5 min**: Retirer domaine de Netlify
- ⏱️ **5-10 min**: Déployer sur Vercel
- ⏱️ **10-15 min**: Ajouter domaine sur Vercel
- ⏱️ **15-25 min**: Modifier DNS sur Netlify
- ⏱️ **25-40 min**: Propagation DNS + vérification

**TOTAL: ~40 minutes**

---

## Checklist finale

Avant de commencer, assurez-vous d'avoir:

- [ ] Accès à votre compte Netlify
- [ ] Accès à votre compte Vercel (ou GitHub pour se connecter)
- [ ] Les valeurs de vos variables d'environnement (.env)
- [ ] 40 minutes devant vous
- [ ] Une connexion internet stable

---

## Ordre des opérations

1. **Netlify** → Retirer domaine
2. **Vercel** → Déployer projet
3. **Vercel** → Ajouter domaine
4. **Netlify** → Modifier DNS
5. **Attendre** → 5-15 minutes
6. **Tester** → https://id0c.com

Bonne migration! 🚀
