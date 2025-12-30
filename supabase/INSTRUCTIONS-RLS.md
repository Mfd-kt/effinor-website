# Instructions pour corriger l'erreur RLS

## Problème
L'erreur "infinite recursion detected in policy for relation 'utilisateurs'" se produit car les politiques RLS vérifient le rôle en interrogeant la table `utilisateurs`, ce qui déclenche la même politique, créant une boucle infinie.

## Solution 1 : Désactiver temporairement RLS (Développement uniquement)

**⚠️ ATTENTION : Ne pas utiliser en production !**

1. Ouvrez le SQL Editor dans votre projet Supabase
2. Exécutez le contenu du fichier `supabase/disable-rls-temporarily.sql`
3. Cela désactivera RLS sur la table `utilisateurs` et permettra l'accès libre

## Solution 2 : Corriger RLS avec des fonctions (Recommandé)

1. Ouvrez le SQL Editor dans votre projet Supabase
2. Exécutez le contenu du fichier `supabase/fix-utilisateurs-rls-recursion.sql`
3. Ce script :
   - Crée des fonctions SQL (`is_admin_user`, `is_super_admin_user`) qui évitent la récursion
   - Remplace les politiques RLS problématiques
   - Maintient la sécurité tout en évitant la récursion

## Solution 3 : Désactiver RLS complètement (Si vous n'avez pas besoin de sécurité)

Si vous n'avez pas besoin de RLS pour l'instant :

```sql
ALTER TABLE public.utilisateurs DISABLE ROW LEVEL SECURITY;
```

## Vérification

Après avoir exécuté l'une des solutions, rechargez la page `/admin/utilisateurs` dans votre navigateur. L'erreur devrait disparaître.

## Note importante

- **Solution 1** : Pour le développement uniquement, accès libre
- **Solution 2** : Pour la production, maintient la sécurité
- **Solution 3** : Désactive complètement la sécurité RLS

