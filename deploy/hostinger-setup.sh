#!/bin/bash

# Script d'installation pour Hostinger
# À exécuter dans le dossier public_html après avoir extrait les fichiers

set -e

echo "🚀 Configuration du site Effinor sur Hostinger"
echo ""

# Vérifier que nous sommes dans le bon dossier
if [ ! -f "package.json" ]; then
    echo "❌ Erreur: package.json introuvable. Assurez-vous d'être dans le dossier public_html"
    exit 1
fi

# 1. Installer les dépendances
echo "📦 Installation des dépendances Node.js..."
npm install --production

# 2. Vérifier si .env.local existe
if [ ! -f ".env.local" ]; then
    echo ""
    echo "⚠️  Le fichier .env.local n'existe pas encore."
    echo "📝 Création du fichier .env.local à partir de .env.example..."
    
    if [ -f ".env.example" ]; then
        cp .env.example .env.local
        echo "✅ Fichier .env.local créé. VEUILLEZ LE MODIFIER avec vos vraies valeurs Supabase !"
        echo ""
        echo "Éditez .env.local et remplissez :"
        echo "  - NEXT_PUBLIC_SUPABASE_URL"
        echo "  - NEXT_PUBLIC_SUPABASE_ANON_KEY"
    else
        echo "❌ .env.example introuvable. Créez manuellement .env.local avec :"
        echo ""
        echo "NEXT_PUBLIC_SUPABASE_URL=https://votre-projet.supabase.co"
        echo "NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_cle_anon"
        echo "NODE_ENV=production"
        echo "PORT=3000"
    fi
else
    echo "✅ Fichier .env.local trouvé"
fi

# 3. Vérifier le build
if [ ! -d ".next" ]; then
    echo ""
    echo "⚠️  Le dossier .next n'existe pas. Build nécessaire..."
    echo "📦 Build de l'application..."
    npm run build
else
    echo "✅ Dossier .next trouvé (build déjà effectué)"
fi

# 4. Créer un script de démarrage
echo ""
echo "📝 Création du script de démarrage..."
cat > start.sh << 'EOF'
#!/bin/bash
cd "$(dirname "$0")"
export NODE_ENV=production
export PORT=${PORT:-3000}
node_modules/.bin/next start -p $PORT
EOF

chmod +x start.sh

# 5. Créer un fichier .htaccess pour le reverse proxy (si Apache)
echo ""
echo "📝 Création du fichier .htaccess pour le reverse proxy..."
cat > .htaccess << 'EOF'
# Reverse proxy pour Next.js sur Hostinger
# Remplacez PORT par le port de votre application Node.js

<IfModule mod_rewrite.c>
  RewriteEngine On
  
  # Proxy vers l'application Node.js
  # Remplacez 3000 par le port de votre application Node.js dans Hostinger
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule ^(.*)$ http://localhost:3000/$1 [P,L]
</IfModule>
EOF

echo ""
echo "✅ Configuration terminée !"
echo ""
echo "📋 Prochaines étapes :"
echo ""
echo "1. Éditez .env.local avec vos vraies valeurs Supabase"
echo "2. Dans Hostinger, créez une application Node.js :"
echo "   - Point d'entrée: node_modules/.bin/next start"
echo "   - Port: 3000 (ou celui fourni par Hostinger)"
echo "   - Dossier racine: public_html"
echo "   - Variables d'environnement: Copiez depuis .env.local"
echo ""
echo "3. Modifiez .htaccess et remplacez 3000 par le port de votre application Node.js"
echo ""
echo "4. Démarrez l'application depuis le gestionnaire Node.js de Hostinger"
echo ""
echo "5. Vérifiez que votre domaine pointe vers l'application"
echo ""

