/**
 * Script pour vérifier la configuration du webhook
 * 
 * Usage:
 *   cd Dashboard
 *   npx tsx check-webhook-env.ts
 */

console.log('🔍 Vérification de la configuration du webhook\n');

// Vérifier les variables d'environnement
const webhookUrl = 
  process.env.NEXT_PUBLIC_MAKE_WEBHOOK_URL ||
  process.env.MAKE_WEBHOOK_URL;

console.log('Variables d\'environnement:');
console.log('  NEXT_PUBLIC_MAKE_WEBHOOK_URL:', process.env.NEXT_PUBLIC_MAKE_WEBHOOK_URL || '❌ NON DÉFINI');
console.log('  MAKE_WEBHOOK_URL:', process.env.MAKE_WEBHOOK_URL || '❌ NON DÉFINI');
console.log('');

if (webhookUrl) {
  console.log('✅ URL du webhook trouvée:', webhookUrl);
  console.log('');
  
  // Tester la connexion
  console.log('🧪 Test de connexion au webhook...');
  fetch(webhookUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      event: 'test',
      timestamp: new Date().toISOString(),
      data: { test: true },
    }),
  })
    .then(response => {
      console.log('✅ Connexion réussie !');
      console.log('   Status:', response.status, response.statusText);
      return response.text();
    })
    .then(text => {
      console.log('   Réponse:', text.substring(0, 200));
    })
    .catch(error => {
      console.error('❌ Erreur de connexion:', error.message);
    });
} else {
  console.error('❌ Aucune URL de webhook configurée !');
  console.error('');
  console.error('Pour corriger:');
  console.error('1. Créez un fichier .env.local dans le dossier Dashboard');
  console.error('2. Ajoutez la ligne suivante:');
  console.error('   NEXT_PUBLIC_MAKE_WEBHOOK_URL=https://hook.eu2.make.com/7xra7iqm2bvjk5cgdyq4qn7rt7ad88dj');
  console.error('3. Redémarrez le serveur de développement');
}

