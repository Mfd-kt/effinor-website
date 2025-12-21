# Guide de débogage du Webhook Make.com

## Problème : Le webhook ne reçoit rien

### Étape 1 : Vérifier la configuration

1. **Vérifier que la variable d'environnement est définie**

   Créez ou vérifiez le fichier `.env.local` dans le dossier `Dashboard` :
   
   ```env
   NEXT_PUBLIC_MAKE_WEBHOOK_URL=https://hook.eu2.make.com/7xra7iqm2bvjk5cgdyq4qn7rt7ad88dj
   ```

2. **Vérifier avec le script de diagnostic**

   ```bash
   cd Dashboard
   npx tsx check-webhook-env.ts
   ```

   Ce script vous dira si la variable est bien configurée.

3. **Redémarrer le serveur**

   Après avoir modifié `.env.local`, vous DEVEZ redémarrer le serveur Next.js :
   
   ```bash
   # Arrêtez le serveur (Ctrl+C)
   # Puis relancez-le
   npm run dev
   ```

### Étape 2 : Tester directement le webhook

1. **Test avec curl (le plus simple)**

   ```bash
   curl -X POST "https://hook.eu2.make.com/7xra7iqm2bvjk5cgdyq4qn7rt7ad88dj" \
     -H "Content-Type: application/json" \
     -d '{
       "event": "test",
       "timestamp": "2024-12-20T20:00:00.000Z",
       "data": {"test": true}
     }' -v
   ```

   Si vous voyez une réponse 200 OK, Make.com fonctionne.

2. **Test avec le script Node.js**

   ```bash
   cd Dashboard
   npx tsx test-webhook-direct.ts
   ```

   Ce script teste directement le webhook et affiche tous les détails.

### Étape 3 : Vérifier les logs du serveur

Quand vous créez une commande ou un lead, regardez les logs du serveur Next.js. Vous devriez voir :

```
📤 ===== ENVOI WEBHOOK new_order =====
🔗 URL: https://hook.eu2.make.com/...
📦 Payload: {...}
📥 Réponse Make.com: ...
```

**Si vous ne voyez PAS ces logs :**
- Le webhook n'est pas appelé
- Vérifiez que vous créez bien la commande/lead depuis le Dashboard
- Vérifiez que le code est bien exécuté (pas d'erreur avant)

**Si vous voyez une erreur :**
- Notez le message d'erreur exact
- Vérifiez que l'URL est correcte
- Vérifiez votre connexion internet

### Étape 4 : Vérifier Make.com

1. **Connectez-vous à Make.com**
2. **Allez dans votre scénario**
3. **Vérifiez les "Executions" ou "Runs"**
4. **Regardez si des webhooks ont été reçus**

   Si aucun webhook n'apparaît :
   - Le webhook n'est pas envoyé depuis votre application
   - Vérifiez les étapes précédentes

   Si des webhooks apparaissent mais sont en erreur :
   - Vérifiez la structure du payload
   - Vérifiez la configuration du scénario Make.com

### Étape 5 : Problèmes courants

#### Problème : "NEXT_PUBLIC_MAKE_WEBHOOK_URL n'est pas configuré"

**Solution :**
1. Créez `.env.local` dans le dossier `Dashboard`
2. Ajoutez la variable
3. Redémarrez le serveur

#### Problème : Le webhook est envoyé mais Make.com ne le reçoit pas

**Solutions possibles :**
1. Vérifiez que le scénario Make.com est **actif** (pas en pause)
2. Vérifiez que l'URL du webhook dans Make.com correspond exactement
3. Vérifiez les logs Make.com pour voir les erreurs

#### Problème : Timeout ou erreur réseau

**Solutions :**
1. Vérifiez votre connexion internet
2. Vérifiez que l'URL du webhook est accessible depuis votre serveur
3. Testez avec curl pour voir si c'est un problème réseau

#### Problème : Le webhook est envoyé mais les données sont vides

**Solution :**
- Vérifiez les logs pour voir le payload complet
- Le payload devrait contenir toutes les données (voir `WEBHOOK_SETUP.md`)

### Étape 6 : Test complet

Pour tester tout le flux :

1. **Créez une commande de test depuis le Dashboard**
   - Allez sur `/admin/commandes/new`
   - Remplissez le formulaire
   - Cliquez sur "Enregistrer"
   - Regardez les logs du serveur

2. **Vérifiez Make.com**
   - Le webhook devrait apparaître dans les exécutions
   - Vérifiez que les données sont bien reçues

3. **Vérifiez Slack** (si configuré)
   - La notification devrait apparaître dans le canal Slack

### Commandes utiles

```bash
# Vérifier la configuration
cd Dashboard
npx tsx check-webhook-env.ts

# Tester directement le webhook
npx tsx test-webhook-direct.ts

# Tester avec curl
curl -X POST "https://hook.eu2.make.com/7xra7iqm2bvjk5cgdyq4qn7rt7ad88dj" \
  -H "Content-Type: application/json" \
  -d '{"event":"test","timestamp":"2024-12-20T20:00:00Z","data":{"test":true}}' -v
```

### Support

Si le problème persiste :
1. Copiez les logs complets du serveur
2. Copiez la réponse de Make.com
3. Vérifiez la configuration de votre scénario Make.com

