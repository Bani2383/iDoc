# ✅ CHECKLIST MIGRATION VERCEL

## Préparation (MAINTENANT)

- [x] Fichier vercel.json existe
- [x] Configuration build correcte
- [ ] Variables d'environnement notées (.env)

---

## ÉTAPE 1: Retirer de Netlify (5 min)

**À faire sur:** https://app.netlify.com/sites/id0c/settings/domain

1. [ ] Options → Remove domain pour "id0c.com"
2. [ ] Options → Remove domain pour "www.id0c.com"  
3. [ ] Attendre 5 minutes

---

## ÉTAPE 2: Déployer sur Vercel (5 min)

**À faire sur:** https://vercel.com

1. [ ] Add New → Project
2. [ ] Connecter GitHub / Importer le projet
3. [ ] Ajouter variables d'environnement
4. [ ] Cliquer "Deploy"
5. [ ] Noter l'URL: ____________.vercel.app

---

## ÉTAPE 3: Ajouter domaine (5 min)

**Sur Vercel:** Settings → Domains

1. [ ] Add → "id0c.com"
2. [ ] Add → "www.id0c.com"
3. [ ] Noter les valeurs DNS que Vercel donne:
   - A record: 76.76.21.21
   - CNAME: cname.vercel-dns.com

---

## ÉTAPE 4: Modifier DNS Netlify (10 min)

**À faire sur:** https://app.netlify.com/teams/[votre-team]/dns

### Pour id0c.com:
1. [ ] Supprimer: Type NETLIFY → id0c.netlify.app
2. [ ] Créer: Type A → Name: @ → Value: 76.76.21.21

### Pour www.id0c.com:
1. [ ] Supprimer: Type NETLIFY → id0c.netlify.app
2. [ ] Créer: Type CNAME → Name: www → Value: cname.vercel-dns.com

---

## ÉTAPE 5: Vérifier (15 min)

1. [ ] Attendre 5-10 minutes
2. [ ] Tester: https://id0c.com
3. [ ] Tester: https://www.id0c.com
4. [ ] Vérifier HTTPS (cadenas vert)
5. [ ] Tester connexion Supabase

---

## Variables d'environnement à ajouter sur Vercel:

```
VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY
```

Récupérez-les depuis votre fichier .env local!

---

## Commandes de test:

```bash
# Vérifier DNS
dig id0c.com A +short
# Devrait afficher: 76.76.21.21

dig www.id0c.com CNAME +short
# Devrait afficher: cname.vercel-dns.com
```

---

## Si problème:

1. Attendez 15-30 minutes (propagation DNS)
2. Videz le cache DNS de votre navigateur
3. Testez en navigation privée
4. Vérifiez les DNS sur Netlify

---

## Temps total: 35-45 minutes

Tout est prêt pour la migration!
