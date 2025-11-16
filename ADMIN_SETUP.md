# Configuration Admin pour iDoc

## Création du compte administrateur

Pour créer un compte administrateur, suivez ces étapes:

### 1. Créer l'utilisateur via l'interface Supabase

1. Connectez-vous à votre tableau de bord Supabase: https://supabase.com/dashboard
2. Allez dans **Authentication** > **Users**
3. Cliquez sur **Add user** > **Create new user**
4. Remplissez:
   - Email: `admin@idoc.com` (ou votre email)
   - Password: Créez un mot de passe sécurisé
   - Metadata (optionnel): `{"full_name": "Admin iDoc"}`
5. Cliquez sur **Create user**

### 2. Attribuer le rôle admin

Une fois l'utilisateur créé, vous devez lui attribuer le rôle admin:

1. Dans Supabase, allez dans **SQL Editor**
2. Exécutez la requête suivante (remplacez `admin@idoc.com` par l'email que vous avez utilisé):

```sql
-- Mettre à jour le profil pour définir le rôle admin
UPDATE user_profiles
SET role = 'admin'
WHERE email = 'admin@idoc.com';
```

### 3. Connexion

Vous pouvez maintenant vous connecter à l'application avec:
- Email: `admin@idoc.com`
- Password: Le mot de passe que vous avez créé

Le système détectera automatiquement que vous êtes admin et vous redirigera vers le tableau de bord administrateur.

## Fonctionnalités Admin

Le tableau de bord admin permet de:
- Voir les statistiques globales (utilisateurs, documents, revenus)
- Consulter tous les documents générés par les clients
- Voir l'historique des paiements
- Gérer les utilisateurs

## Fonctionnalités Client

Les clients ont accès à:
- Leurs documents générés
- Le téléchargement des PDF après paiement
- Protection anti-copie et anti-screenshot des documents
- Génération de nouveaux documents avec l'IA

## Sécurité des documents

Les documents payés sont protégés contre:
- ✅ Captures d'écran (via détection des raccourcis clavier)
- ✅ Clic droit / menu contextuel
- ✅ Copier-coller du contenu
- ✅ Sélection de texte
- ✅ Drag and drop

Seul le téléchargement PDF officiel est possible via le bouton dédié.
