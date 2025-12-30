# Activation de Supabase Realtime

Pour que les notifications en temps réel fonctionnent dans le Dashboard, vous devez activer Realtime pour les tables `leads` et `orders` dans Supabase.

## Étapes d'activation

### 1. Activer Realtime pour la table `leads`

Exécutez le script SQL suivant dans le SQL Editor de Supabase :

```sql
-- Fichier: supabase/enable-realtime-leads.sql
```

Ce script ajoute la table `leads` à la publication `supabase_realtime`.

### 2. Activer Realtime pour la table `orders`

Exécutez le script SQL suivant dans le SQL Editor de Supabase :

```sql
-- Fichier: supabase/enable-realtime-orders.sql
```

Ce script ajoute la table `orders` à la publication `supabase_realtime`.

### 3. Vérifier l'activation

Pour vérifier que Realtime est bien activé, exécutez cette requête :

```sql
SELECT 
  schemaname,
  tablename,
  pubname
FROM pg_publication_tables
WHERE pubname = 'supabase_realtime'
  AND tablename IN ('leads', 'orders');
```

Vous devriez voir les deux tables listées.

## Activation via l'interface Supabase

Alternativement, vous pouvez activer Realtime via l'interface Supabase :

1. Allez dans **Database** > **Replication**
2. Trouvez les tables `leads` et `orders`
3. Activez la réplication pour chacune d'elles

## Dépannage

Si vous voyez des erreurs "Erreur d'abonnement aux leads" ou "Erreur d'abonnement aux commandes" :

1. Vérifiez que Realtime est activé dans votre projet Supabase (Settings > API)
2. Vérifiez que les tables sont bien dans la publication `supabase_realtime`
3. Vérifiez les logs de la console du navigateur pour plus de détails

## Notes importantes

- Realtime nécessite un abonnement Supabase payant ou un projet avec Realtime activé
- Les notifications fonctionnent uniquement si Realtime est activé
- Les erreurs d'abonnement n'empêchent pas le Dashboard de fonctionner, mais les notifications en temps réel ne seront pas disponibles



