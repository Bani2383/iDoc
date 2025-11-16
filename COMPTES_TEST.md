# Comptes de Test

## Instructions pour créer les comptes

Pour créer les comptes de test, suivez ces étapes:

### 1. Compte Client

1. Ouvrez l'application dans votre navigateur
2. Cliquez sur "S'inscrire" ou "Sign Up"
3. Remplissez le formulaire:
   - **Email**: clientest@test.com
   - **Mot de passe**: idoctest
   - **Nom complet**: Client Test
4. Cliquez sur "S'inscrire"
5. Le compte sera créé avec le rôle "client" par défaut

### 2. Compte Admin

1. Ouvrez l'application dans votre navigateur
2. Cliquez sur "S'inscrire" ou "Sign Up"
3. Remplissez le formulaire:
   - **Email**: admintest@test.com
   - **Mot de passe**: idocadmintest
   - **Nom complet**: Admin Test
4. Cliquez sur "S'inscrire"
5. **Ensuite, vous devez manuellement changer le rôle en 'admin' dans la base de données**

### Changer le rôle en Admin

Pour changer le rôle du compte admintest en admin, exécutez cette requête SQL dans Supabase:

```sql
UPDATE user_profiles
SET role = 'admin'
WHERE email = 'admintest@test.com';
```

## Résumé des Comptes

| Type | Email | Mot de passe | Rôle |
|------|-------|--------------|------|
| Client | clientest@test.com | idoctest | client |
| Admin | admintest@test.com | idocadmintest | admin |

---

**Note**: Le compte admin nécessite une modification manuelle du rôle dans la base de données après la création initiale pour des raisons de sécurité.
