# Refonte de l'authentification - Plan

## État actuel

L'authentification a été **temporairement désactivée** pour permettre un accès libre au dashboard. Toutes les routes sont maintenant accessibles sans authentification.

## Problèmes identifiés

1. **Complexité excessive** : Trop de couches (middleware, server actions, client components)
2. **Gestion des cookies** : Problèmes de synchronisation entre client et serveur
3. **Redirections** : Problèmes de redirection après connexion
4. **Création automatique d'utilisateurs** : Logique complexe et peu fiable

## Nouvelle architecture proposée

### Principe : Simplicité et clarté

1. **Authentification côté client uniquement** (pour commencer)
   - Utiliser uniquement `@supabase/supabase-js` côté client
   - Pas de Server Actions complexes
   - Pas de middleware d'authentification (pour l'instant)

2. **Protection des routes côté client**
   - Utiliser des composants de protection (`ProtectedRoute`, `RequireAuth`)
   - Vérifier la session dans les composants React
   - Rediriger vers `/login` si non authentifié

3. **Gestion des utilisateurs**
   - Créer les utilisateurs manuellement dans Supabase Auth
   - Créer les entrées dans `utilisateurs` manuellement ou via script SQL
   - Pas de création automatique (trop complexe)

4. **Flux de connexion simple**
   ```
   LoginForm (client) 
   → supabase.auth.signInWithPassword()
   → Vérifier la session
   → Rediriger vers /admin/dashboard
   ```

5. **Protection des pages**
   ```
   Page Component
   → useEffect pour vérifier la session
   → Si pas de session → redirect('/login')
   → Si session → afficher le contenu
   ```

## Étapes de réimplémentation

### Phase 1 : Authentification de base (client uniquement)
- [ ] Créer un hook `useAuth()` pour gérer la session
- [ ] Simplifier `LoginForm` pour utiliser uniquement le client Supabase
- [ ] Créer un composant `ProtectedRoute` simple
- [ ] Tester la connexion et la redirection

### Phase 2 : Protection des routes
- [ ] Créer un HOC ou un composant wrapper pour protéger les pages
- [ ] Ajouter la vérification de session dans les pages admin
- [ ] Gérer les redirections après connexion

### Phase 3 : Gestion des utilisateurs
- [ ] Créer un script SQL simple pour créer un utilisateur admin
- [ ] Documenter le processus de création d'utilisateurs
- [ ] Ajouter une interface admin pour gérer les utilisateurs (optionnel)

### Phase 4 : Améliorations (optionnel)
- [ ] Ajouter le middleware d'authentification (si nécessaire)
- [ ] Ajouter la gestion des rôles et permissions
- [ ] Ajouter la réinitialisation de mot de passe
- [ ] Ajouter la vérification d'email

## Fichiers à modifier/créer

### À créer
- `Dashboard/hooks/useAuth.ts` - Hook pour gérer l'authentification
- `Dashboard/components/auth/ProtectedRoute.tsx` - Composant de protection
- `Dashboard/lib/auth/simple-auth.ts` - Fonctions d'authentification simplifiées

### À simplifier
- `Dashboard/components/auth/LoginForm.tsx` - Simplifier le formulaire
- `Dashboard/lib/auth/auth.ts` - Simplifier ou supprimer
- `Dashboard/lib/auth/auth-client.ts` - Simplifier ou supprimer
- `Dashboard/middleware.ts` - Réactiver avec une logique simple

### À supprimer (optionnel)
- `Dashboard/app/actions/auth.ts` - Remplacer par des appels client directs

## Notes importantes

- **Pas de Server Actions complexes** : Utiliser uniquement le client Supabase
- **Pas de création automatique d'utilisateurs** : Créer manuellement
- **Simplicité avant tout** : Moins de code = moins de bugs
- **Tester à chaque étape** : Ne pas tout implémenter d'un coup

