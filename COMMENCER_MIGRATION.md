# 🎯 COMMENCER LA MIGRATION - GUIDE ULTRA-RAPIDE

Votre domaine **id0c.com** va être migré de Netlify vers Vercel.

---

## 📋 Ce dont vous avez besoin

1. Vos variables d'environnement (fichier .env):
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`

2. Accès à:
   - Netlify (pour retirer le domaine et modifier DNS)
   - Vercel (pour déployer)
   - GitHub (recommandé pour déploiement automatique)

3. Temps: **40 minutes**

---

## 🚀 ÉTAPES PRINCIPALES

### 1. Retirer le domaine de Netlify (5 min)

Allez sur: **https://app.netlify.com/sites/id0c/settings/domain**

- Options → Remove domain (pour id0c.com et www.id0c.com)
- Attendez 5 minutes

### 2. Déployer sur Vercel (5 min)

Allez sur: **https://vercel.com/new**

- Importez votre projet GitHub
- Ajoutez les variables d'environnement
- Deploy

### 3. Ajouter le domaine (5 min)

Sur Vercel: **Settings → Domains**

- Add: id0c.com
- Add: www.id0c.com
- Notez les valeurs DNS

### 4. Modifier les DNS (10 min)

Allez sur: **https://app.netlify.com/account/dns**

Modifiez les enregistrements:

**id0c.com:**
- Supprimer: NETLIFY → id0c.netlify.app
- Créer: A → 76.76.21.21

**www.id0c.com:**
- Supprimer: NETLIFY → id0c.netlify.app
- Créer: CNAME → cname.vercel-dns.com

### 5. Vérifier (15 min)

Attendez 5-15 minutes puis testez:
- https://id0c.com
- https://www.id0c.com

---

## 📝 Valeurs DNS à utiliser

```
id0c.com
Type: A
Value: 76.76.21.21

www.id0c.com
Type: CNAME
Value: cname.vercel-dns.com
```

---

## ✅ Vérification finale

- [ ] https://id0c.com fonctionne
- [ ] HTTPS actif (cadenas vert)
- [ ] Application fonctionne
- [ ] Supabase connecté

---

## 🆘 En cas de problème

1. Attendez 30 minutes (propagation DNS)
2. Videz le cache DNS: `ipconfig /flushdns` (Windows) ou `sudo dscacheutil -flushcache` (Mac)
3. Testez en navigation privée
4. Vérifiez DNS: https://dnschecker.org/#A/id0c.com

---

## 📚 Guides détaillés disponibles

- `MIGRATION_NETLIFY_VERS_VERCEL.md` - Guide complet étape par étape
- `MIGRATION_CHECKLIST.md` - Checklist à cocher
- `LIENS_MIGRATION.md` - Tous les liens directs

---

## ⚡ PRÊT À COMMENCER?

**Première étape:** 

Allez sur https://app.netlify.com/sites/id0c/settings/domain et retirez le domaine!

Puis revenez ici pour la suite.

Bonne migration! 🎉
