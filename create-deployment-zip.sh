#!/bin/bash

# Script pour créer les fichiers ZIP de déploiement pour Hostinger
# Usage: ./create-deployment-zip.sh

set -e

PROJECT_ROOT="/Users/mfd/Documents/Project_effinor_2026/effinor-website"
DEPLOY_DIR="$PROJECT_ROOT/deploy"
TIMESTAMP=$(date +%Y%m%d-%H%M%S)

echo "🚀 Création des fichiers ZIP de déploiement..."
echo ""

# Créer le dossier de déploiement
mkdir -p "$DEPLOY_DIR"

# ============================================
# 1. BUILD DU SITE PRINCIPAL
# ============================================
echo "📦 Build du site principal..."
cd "$PROJECT_ROOT"
npm run build -- --webpack

# ============================================
# 2. CRÉER LE ZIP DU SITE PRINCIPAL
# ============================================
echo "📦 Création du ZIP du site principal..."
cd "$PROJECT_ROOT"

# Créer un dossier temporaire pour le site principal
TEMP_MAIN="$DEPLOY_DIR/temp-main"
rm -rf "$TEMP_MAIN"
mkdir -p "$TEMP_MAIN"

# Copier les fichiers nécessaires
echo "  → Copie des fichiers..."
cp -r app "$TEMP_MAIN/"
cp -r components "$TEMP_MAIN/"
cp -r lib "$TEMP_MAIN/"
cp -r public "$TEMP_MAIN/"
cp -r i18n "$TEMP_MAIN/"
cp -r types "$TEMP_MAIN/"
cp -r .next "$TEMP_MAIN/"
cp package.json "$TEMP_MAIN/"
cp package-lock.json "$TEMP_MAIN/"
cp next.config.ts "$TEMP_MAIN/"
cp tsconfig.json "$TEMP_MAIN/"
cp postcss.config.mjs "$TEMP_MAIN/"
cp middleware.ts "$TEMP_MAIN/" 2>/dev/null || true
cp next-env.d.ts "$TEMP_MAIN/" 2>/dev/null || true

# Créer le fichier .env.example pour référence
cat > "$TEMP_MAIN/.env.example" << EOF
# Variables d'environnement pour le site principal
# Copiez ce fichier en .env.local et remplissez les valeurs

NEXT_PUBLIC_SUPABASE_URL=votre_url_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_cle_anon
NODE_ENV=production
EOF

# Copier le script d'installation
cp "$PROJECT_ROOT/deploy/hostinger-setup.sh" "$TEMP_MAIN/" 2>/dev/null || true

# Créer un README pour le déploiement
cat > "$TEMP_MAIN/README-DEPLOY.md" << 'EOF'
# Instructions de déploiement - Site principal

## 1. Uploader les fichiers
- Extrayez tous les fichiers dans `public_html/` sur Hostinger

## 2. Installer les dépendances
```bash
cd public_html
npm install --production
```

## 3. Créer le fichier .env.local
```bash
cp .env.example .env.local
# Puis éditez .env.local avec vos vraies valeurs
```

## 4. Configurer Node.js dans Hostinger
- Créer une application Node.js
- Point d'entrée: `node_modules/.bin/next start`
- Port: 3000 (ou celui fourni par Hostinger)
- Variables d'environnement: Copier depuis .env.local

## 5. Démarrer l'application
L'application devrait démarrer automatiquement via Hostinger Node.js Manager
EOF

# Créer le ZIP
cd "$DEPLOY_DIR"
zip -r "effinor-main-site-${TIMESTAMP}.zip" temp-main/ -x "*.DS_Store" "*/__pycache__/*" "*/node_modules/*"
echo "  ✅ ZIP créé: effinor-main-site-${TIMESTAMP}.zip"

# Nettoyer
rm -rf "$TEMP_MAIN"

# ============================================
# 3. BUILD DU DASHBOARD
# ============================================
echo ""
echo "📦 Build du Dashboard..."
cd "$PROJECT_ROOT/Dashboard"
# Ignorer les erreurs ESLint pour le build de production
ESLINT_NO_DEV_ERRORS=true npm run build || NEXT_IGNORE_ESLINT=true npm run build

# ============================================
# 4. CRÉER LE ZIP DU DASHBOARD
# ============================================
echo "📦 Création du ZIP du Dashboard..."
cd "$PROJECT_ROOT/Dashboard"

# Créer un dossier temporaire pour le Dashboard
TEMP_DASHBOARD="$DEPLOY_DIR/temp-dashboard"
rm -rf "$TEMP_DASHBOARD"
mkdir -p "$TEMP_DASHBOARD"

# Copier les fichiers nécessaires
echo "  → Copie des fichiers..."
cp -r app "$TEMP_DASHBOARD/"
cp -r components "$TEMP_DASHBOARD/"
cp -r lib "$TEMP_DASHBOARD/"
cp -r public "$TEMP_DASHBOARD/" 2>/dev/null || mkdir -p "$TEMP_DASHBOARD/public"
cp -r .next "$TEMP_DASHBOARD/"
cp package.json "$TEMP_DASHBOARD/"
cp package-lock.json "$TEMP_DASHBOARD/"
cp next.config.mjs "$TEMP_DASHBOARD/"
cp tsconfig.json "$TEMP_DASHBOARD/"
cp postcss.config.mjs "$TEMP_DASHBOARD/" 2>/dev/null || true
cp middleware.ts "$TEMP_DASHBOARD/" 2>/dev/null || true
cp next-env.d.ts "$TEMP_DASHBOARD/" 2>/dev/null || true
cp components.json "$TEMP_DASHBOARD/" 2>/dev/null || true

# Créer le fichier .env.example pour référence
cat > "$TEMP_DASHBOARD/.env.example" << EOF
# Variables d'environnement pour le Dashboard
# Copiez ce fichier en .env.local et remplissez les valeurs

NEXT_PUBLIC_SUPABASE_URL=votre_url_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_cle_anon
NODE_ENV=production
PORT=3001
EOF

# Copier le script d'installation
cp "$PROJECT_ROOT/deploy/hostinger-setup.sh" "$TEMP_DASHBOARD/" 2>/dev/null || true

# Créer un README pour le déploiement
cat > "$TEMP_DASHBOARD/README-DEPLOY.md" << 'EOF'
# Instructions de déploiement - Dashboard

## 1. Créer le sous-domaine dans Hostinger
- Allez dans Domaines > Sous-domaines
- Créez: admin.effinor.com (ou votre sous-domaine)
- Hostinger créera: admin.effinor.com/public_html/

## 2. Uploader les fichiers
- Extrayez tous les fichiers dans `admin.effinor.com/public_html/` sur Hostinger

## 3. Installer les dépendances
```bash
cd admin.effinor.com/public_html
npm install --production
```

## 4. Créer le fichier .env.local
```bash
cp .env.example .env.local
# Puis éditez .env.local avec vos vraies valeurs
```

## 5. Configurer Node.js dans Hostinger
- Créer une NOUVELLE application Node.js (différente du site principal)
- Point d'entrée: `node_modules/.bin/next start`
- Port: 3001 (différent du site principal qui utilise 3000)
- Variables d'environnement: Copier depuis .env.local

## 6. Démarrer l'application
L'application devrait démarrer automatiquement via Hostinger Node.js Manager

## 7. Configurer SSL
- Activez SSL/HTTPS pour admin.effinor.com via Let's Encrypt dans Hostinger
EOF

# Créer le ZIP
cd "$DEPLOY_DIR"
zip -r "effinor-dashboard-${TIMESTAMP}.zip" temp-dashboard/ -x "*.DS_Store" "*/__pycache__/*" "*/node_modules/*"
echo "  ✅ ZIP créé: effinor-dashboard-${TIMESTAMP}.zip"

# Nettoyer
rm -rf "$TEMP_DASHBOARD"

# ============================================
# RÉSUMÉ
# ============================================
echo ""
echo "✅ Déploiement prêt !"
echo ""
echo "📦 Fichiers créés dans: $DEPLOY_DIR"
echo "   - effinor-main-site-${TIMESTAMP}.zip (Site principal → public_html/)"
echo "   - effinor-dashboard-${TIMESTAMP}.zip (Dashboard → admin.effinor.com/public_html/)"
echo ""
echo "📋 Prochaines étapes:"
echo "   1. Uploader effinor-main-site-${TIMESTAMP}.zip dans public_html/ et extraire"
echo "   2. Uploader effinor-dashboard-${TIMESTAMP}.zip dans admin.effinor.com/public_html/ et extraire"
echo "   3. Installer les dépendances sur le serveur (npm install --production)"
echo "   4. Créer les fichiers .env.local avec vos variables"
echo "   5. Configurer les applications Node.js dans Hostinger"
echo ""

