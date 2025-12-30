# Instructions pour vérifier et déplacer les fichiers via SSH

## Problème détecté

Vous êtes connecté via SSH, mais :
- `npm` n'est pas disponible dans le terminal SSH (normal sur Hostinger)
- Il y a un sous-dossier `public_html` dans `public_html`
- Les fichiers du site Next.js doivent être vérifiés

## Commandes à exécuter dans le terminal SSH

### 1. Vérifier la structure actuelle

```bash
# Vous êtes déjà dans public_html
pwd
# Devrait afficher : /home/u993092624/domains/groupe-effinor.fr/public_html

# Vérifier ce qu'il y a dans le sous-dossier public_html
ls -la public_html/

# Vérifier si les fichiers Next.js sont là
ls -la public_html/ | grep -E "(package.json|next.config|app|components)"
```

### 2. Si les fichiers sont dans le sous-dossier public_html

```bash
# Déplacer tous les fichiers du sous-dossier vers le parent
cd public_html
mv * ../
mv .* ../ 2>/dev/null || true
cd ..
rmdir public_html
```

### 3. Vérifier que package.json est présent

```bash
ls -la package.json
cat package.json | head -10
```

## Solution : Utiliser l'interface Node.js de Hostinger

Sur Hostinger, `npm` n'est pas disponible via SSH. Vous devez utiliser l'interface Node.js :

1. **Allez dans Hostinger → Node.js Applications**
2. **Créez une nouvelle application** :
   - **Name** : `effinor-main-site`
   - **Node.js Version** : `18.x` ou `20.x`
   - **Application Root** : `public_html` (ou le chemin complet si nécessaire)
   - **Application Startup File** : `node_modules/.bin/next start`
   - **Port** : `3000` (ou celui fourni)
   - **Auto-install dependencies** : ✅ Cochez cette option

3. **Hostinger installera automatiquement les dépendances** lors de la création de l'application

4. **Variables d'environnement** : Ajoutez-les dans l'interface Node.js :
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://votre-projet.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_cle_anon
   NODE_ENV=production
   PORT=3000
   ```

## Alternative : Installer Node.js manuellement via SSH (si possible)

Si vous avez les permissions, vous pouvez essayer :

```bash
# Vérifier si node est disponible
which node
which npm

# Si non disponible, vérifier les chemins possibles
ls -la ~/node*
ls -la /usr/local/bin/node*
ls -la /opt/node*
```

Mais généralement, sur Hostinger, il faut utiliser l'interface Node.js.

