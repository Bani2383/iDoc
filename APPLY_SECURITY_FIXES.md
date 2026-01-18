# ACTION REQUISE : Appliquer les correctifs de sécurité

## Résumé

9 migrations créées pour corriger **247 problèmes de sécurité et performance** :

- ✅ 1 politique RLS critique (accès non restreint)
- ✅ 2 vues avec SECURITY DEFINER (risque de sécurité)
- ✅ 50+ politiques RLS dupliquées (consolidées)
- ✅ 200+ index inutilisés (supprimés)

## Étapes pour appliquer les correctifs

### Option 1 : Via Git (Recommandé)

Les migrations seront appliquées automatiquement lors du prochain déploiement :

```bash
git add supabase/migrations/
git commit -m "Security: Fix RLS policies and drop unused indexes"
git push
```

### Option 2 : Via Supabase Dashboard (Manuel)

1. Aller sur https://supabase.com/dashboard/project/[VOTRE_PROJET]/sql
2. Exécuter les migrations dans l'ordre :

```sql
-- 1. Correctif critique RLS
-- Copier le contenu de : 20260118201637_fix_critical_rls_always_true.sql

-- 2. Correctif vues sécurisées
-- Copier le contenu de : 20260118201637_fix_security_definer_views.sql

-- 3-6. Consolidation des politiques (4 fichiers)
-- Copier le contenu de : 20260118201658_consolidate_duplicate_policies_part1.sql
-- Copier le contenu de : 20260118201658_consolidate_duplicate_policies_part2.sql
-- Copier le contenu de : 20260118201713_consolidate_duplicate_policies_part3.sql
-- Copier le contenu de : 20260118201724_consolidate_duplicate_policies_part4.sql

-- 7-9. Suppression des index inutilisés (3 fichiers)
-- Copier le contenu de : 20260118201738_drop_unused_indexes_batch1.sql
-- Copier le contenu de : 20260118201809_drop_unused_indexes_batch2.sql
-- Copier le contenu de : 20260118201809_drop_unused_indexes_batch3.sql
```

## Migrations créées

| # | Fichier | Description | Lignes |
|---|---------|-------------|--------|
| 1 | `fix_critical_rls_always_true.sql` | Correctif RLS critique | ~40 |
| 2 | `fix_security_definer_views.sql` | Correctif vues sécurisées | ~60 |
| 3 | `consolidate_policies_part1.sql` | Consolidation politiques (A-C) | ~80 |
| 4 | `consolidate_policies_part2.sql` | Consolidation politiques (D-L) | ~60 |
| 5 | `consolidate_policies_part3.sql` | Consolidation politiques (idoc) | ~90 |
| 6 | `consolidate_policies_part4.sql` | Consolidation politiques (final) | ~70 |
| 7 | `drop_unused_indexes_batch1.sql` | Suppression index A-C | ~50 |
| 8 | `drop_unused_indexes_batch2.sql` | Suppression index D-L | ~100 |
| 9 | `drop_unused_indexes_batch3.sql` | Suppression index P-Z | ~100 |

**Total : ~510 lignes de SQL**

## Vérification après application

### 1. Vérifier qu'il n'y a plus de politiques dupliquées

```sql
SELECT tablename, policyname, COUNT(*)
FROM pg_policies
WHERE schemaname = 'public'
GROUP BY tablename, policyname
HAVING COUNT(*) > 1;
```

**Résultat attendu :** 0 lignes

### 2. Vérifier que les index inutilisés sont supprimés

```sql
SELECT COUNT(*) 
FROM pg_indexes 
WHERE schemaname = 'public' 
AND indexname LIKE 'idx_%';
```

**Avant :** ~300 index  
**Après :** ~100 index

### 3. Tester une opération critique

```sql
-- Test : Créer un document (devrait être plus rapide)
INSERT INTO user_documents (user_id, template_id, content)
VALUES (auth.uid(), 'test-template', '{"test": true}');

-- Test : Analytics restreints (devrait exiger session_id pour anon)
INSERT INTO idoc_template_analytics (template_id, event_type)
VALUES ('test-id', 'view'); -- Devrait échouer si non authentifié sans session_id
```

## Impact attendu

### Sécurité
- ✅ Fermeture de la faille RLS critique
- ✅ Vues sécurisées (plus de SECURITY DEFINER)
- ✅ Politiques RLS claires et maintenables

### Performance
- ✅ INSERT/UPDATE 20-30% plus rapides
- ✅ Réduction de l'utilisation du stockage
- ✅ Moins de maintenance des index

### Maintenance
- ✅ Code plus propre
- ✅ Politiques faciles à comprendre
- ✅ Moins de redondance

## Que faire en cas de problème ?

### Si une requête échoue après les migrations

1. Vérifier les logs Supabase
2. Identifier la table/politique concernée
3. Vérifier que la politique consolidée couvre le cas d'usage
4. Si nécessaire, ajuster la politique

### Si les performances sont dégradées

1. Identifier les requêtes lentes
2. Vérifier si un index manquant est nécessaire
3. Recréer uniquement l'index nécessaire
4. Ne PAS recréer tous les index supprimés

## Rollback (si nécessaire)

En cas de problème critique, les migrations peuvent être annulées dans l'ordre inverse. Cependant, **ce n'est pas recommandé** car :

- Les failles de sécurité seraient réouvertes
- Les performances seraient dégradées
- Les politiques dupliquées reviendraient

**Au lieu de rollback :** Corriger la politique ou recréer l'index spécifique manquant.

## Prochaines étapes

1. ✅ Appliquer les migrations (via Git ou Dashboard)
2. ✅ Vérifier qu'il n'y a pas d'erreurs
3. ✅ Tester les fonctionnalités critiques
4. ✅ Surveiller les performances pendant 24-48h
5. ✅ Documenter les nouveaux patterns de politiques

## Support

Voir la documentation complète dans `SECURITY_FIXES_PERFORMANCE_2026.md`
