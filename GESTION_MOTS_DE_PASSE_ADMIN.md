# Gestion des Mots de Passe - Admin

## Pourquoi vous ne voyez pas les mots de passe

**C'est normal et sécurisé** - Les mots de passe des utilisateurs sont cryptés dans la base de données et **ne peuvent jamais être affichés**, même par les administrateurs.

### Pourquoi cette sécurité ?

1. **Protection des utilisateurs** - Si quelqu'un accède à votre compte admin, il ne peut pas voir les mots de passe
2. **Standards de sécurité** - C'est une pratique obligatoire pour toutes les applications professionnelles
3. **Conformité RGPD** - Les données sensibles doivent être cryptées
4. **Réutilisation de mots de passe** - Les utilisateurs réutilisent souvent les mêmes mots de passe

## Comment aider un utilisateur qui a oublié son mot de passe

### Option 1 : Réinitialisation par l'admin (Recommandé)

1. Allez dans **Admin Dashboard** → **Gestion des utilisateurs**
2. Trouvez l'utilisateur concerné
3. Cliquez sur l'icône **clé** (🔑) à côté de son nom
4. Confirmez l'envoi de l'email
5. L'utilisateur recevra un email sécurisé pour créer un nouveau mot de passe

### Option 2 : L'utilisateur le fait lui-même

1. L'utilisateur clique sur **"Mot de passe oublié"** sur la page de connexion
2. Il entre son email
3. Il reçoit un email de réinitialisation
4. Il crée un nouveau mot de passe

## Fonctionnalités Admin disponibles

Dans **Gestion des utilisateurs**, vous pouvez :

✅ **Voir les informations** : Email, nom, rôle, date d'inscription
✅ **Réinitialiser le mot de passe** : Envoyer un email de réinitialisation sécurisé
✅ **Modifier les informations** : Nom, adresse, téléphone, email de facturation
✅ **Changer le rôle** : Passer de client à admin (ou inversement)
✅ **Supprimer un compte** : Supprimer définitivement un utilisateur

❌ **Voir le mot de passe** : Impossible (et c'est tant mieux !)
❌ **Définir un nouveau mot de passe** : L'utilisateur doit le faire lui-même via l'email

## Configuration Supabase requise

Pour que l'envoi d'emails fonctionne, assurez-vous que :

1. **SMTP est configuré** dans Supabase Dashboard → Authentication → Email Templates
2. **L'URL de redirection** est autorisée : `https://id0c.com`
3. **Les templates d'emails** sont activés

### Vérification rapide

```bash
# Dans Supabase Dashboard
1. Authentication → Settings → Email Auth
2. Vérifier que "Enable email confirmations" est activé
3. Vérifier que "Secure email change" est activé
```

## Interface améliorée

L'interface admin affiche maintenant :

### Bannière d'information
Un bandeau bleu explique la sécurité des mots de passe en haut de la page.

### Bouton de réinitialisation
Un bouton vert avec une icône de clé (🔑) permet de réinitialiser le mot de passe d'un utilisateur.

### Actions disponibles
- 🔑 **Réinitialiser** : Envoie un email de réinitialisation
- ✏️ **Modifier** : Éditer les informations de l'utilisateur
- 🗑️ **Supprimer** : Supprimer définitivement l'utilisateur

## Questions fréquentes

### L'utilisateur ne reçoit pas l'email de réinitialisation ?

1. Vérifier les **spams/courrier indésirable**
2. Vérifier que l'email est correct dans la base de données
3. Vérifier la configuration SMTP dans Supabase
4. Réessayer après quelques minutes

### Puis-je définir moi-même un nouveau mot de passe pour un utilisateur ?

Non, pour des raisons de sécurité. L'utilisateur doit toujours créer son propre mot de passe via le lien sécurisé envoyé par email.

### Un utilisateur peut-il avoir le même mot de passe qu'un autre ?

Oui, techniquement, mais Supabase crypte chaque mot de passe avec un "salt" unique, donc même si deux utilisateurs ont le même mot de passe, les valeurs cryptées sont différentes.

## Support technique

Si vous rencontrez des problèmes :

1. Vérifiez les logs Supabase : Dashboard → Authentication → Logs
2. Vérifiez la configuration email : Dashboard → Project Settings → Auth
3. Testez avec votre propre email d'abord

---

**Résumé** : C'est normal de ne pas voir les mots de passe. Utilisez le bouton de réinitialisation pour aider vos utilisateurs.
