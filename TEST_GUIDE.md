# 🧪 Guide de Test - User Agent Switcher v1.2

## Nouvelle Architecture

### 📋 Composants
1. **Content Script** (`content.js`) - Communique avec l'extension
2. **Script d'Injection** (`inject.js`) - S'exécute dans le contexte principal de la page
3. **declarativeNetRequest** - Modifie les headers HTTP

### 🔄 Flux de fonctionnement
```
Popup → Background → Content Script → Script Injecté → navigator.userAgent
                  ↓
              Headers HTTP modifiés
```

## Tests à effectuer

### 1. 🔄 Réinstallation complète

**Important** : Cette version nécessite une réinstallation complète !

```
1. Aller à chrome://extensions/
2. Supprimer l'ancienne version de l'extension
3. Redémarrer Chrome complètement
4. Installer la nouvelle version
5. Fermer et rouvrir tous les onglets
```

### 2. 🧪 Test de base

#### Étape 1 : Ouvrir la page de test
```
1. Ouvrir test.html
2. Noter l'user agent affiché (doit être votre navigateur réel)
3. Ouvrir la console (F12)
```

#### Étape 2 : Appliquer un changement
```
1. Cliquer sur l'icône de l'extension
2. Sélectionner "Firefox + Linux" par exemple
3. Cliquer "Appliquer"
4. Vérifier que le badge "ON" apparaît
```

#### Étape 3 : Vérifier le changement
```
1. Actualiser la page test.html (F5)
2. L'user agent affiché devrait maintenant être Firefox Linux
3. Dans la console, vérifier :
   console.log(navigator.userAgent)
   console.log(navigator.platform)
   console.log(navigator.vendor)
```

### 3. 🌐 Test des headers HTTP

#### Test avec fetch
```
1. Sur test.html, cliquer "🌐 Test Fetch"
2. Vérifier dans la console que les deux user agents sont identiques :
   ✅ Navigator: Mozilla/5.0 (X11; Linux x86_64; rv:121.0) Gecko/20100101 Firefox/121.0
   ✅ Fetch: Mozilla/5.0 (X11; Linux x86_64; rv:121.0) Gecko/20100101 Firefox/121.0
```

#### Test avec site externe
```
1. Aller sur https://httpbin.org/user-agent
2. L'user agent affiché devrait correspondre à votre sélection
3. Changer la sélection dans l'extension
4. Actualiser la page
5. L'user agent devrait changer
```

### 4. 🔍 Tests de console

#### Vérification des propriétés
```javascript
// Dans la console (F12), taper :
console.log('User Agent:', navigator.userAgent);
console.log('Platform:', navigator.platform);
console.log('Vendor:', navigator.vendor);
console.log('App Name:', navigator.appName);
console.log('App Version:', navigator.appVersion);
```

#### Test de cohérence
```javascript
// Vérifier que fetch et navigator donnent le même résultat
fetch('https://httpbin.org/user-agent')
  .then(r => r.json())
  .then(data => {
    console.log('Navigator UA:', navigator.userAgent);
    console.log('Fetch UA:', data['user-agent']);
    console.log('Identiques:', navigator.userAgent === data['user-agent']);
  });
```

### 5. 🔄 Test de persistance

#### Test de sauvegarde
```
1. Sélectionner un user agent (ex: Edge + Windows)
2. Cliquer "Appliquer"
3. Fermer Chrome complètement
4. Rouvrir Chrome
5. Ouvrir test.html
6. L'user agent devrait être automatiquement appliqué
```

#### Test de reset
```
1. Avec un user agent personnalisé actif
2. Cliquer "Reset" dans l'extension
3. Actualiser la page
4. L'user agent devrait revenir à l'original
5. Le badge "ON" devrait disparaître
```

### 6. 🐛 Dépannage

#### Messages de console attendus
```
✅ "Script d'injection User Agent chargé"
✅ "User agent injecté appliqué: [user agent]"
✅ "User agent envoyé au script injecté: [user agent]"
```

#### Messages d'erreur à surveiller
```
❌ "Cannot access contents of the page"
❌ "Extension context invalidated"
❌ "Failed to inject script"
```

#### Si ça ne fonctionne pas
```
1. Vérifier que les deux scripts sont chargés :
   - content.js (visible dans l'onglet Sources des DevTools)
   - inject.js (injecté dynamiquement)

2. Vérifier les permissions dans chrome://extensions/
   - Toutes les permissions doivent être accordées

3. Tester sur une page simple (test.html) avant les sites externes

4. Redémarrer Chrome complètement si nécessaire
```

### 7. 📊 Résultats attendus

#### Avant application
```
User Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36 OPR/120.0.0.0
Platform: MacIntel
Vendor: Google Inc.
```

#### Après application (Firefox Linux)
```
User Agent: Mozilla/5.0 (X11; Linux x86_64; rv:121.0) Gecko/20100101 Firefox/121.0
Platform: Linux x86_64
Vendor: (vide)
```

#### Cohérence Navigator/Fetch
```
✅ Navigator et Fetch doivent retourner le même user agent
✅ Les propriétés platform, vendor doivent être cohérentes
✅ Le badge "ON" doit être visible quand actif
```

### 8. 🎯 Sites de test recommandés

#### Tests de base
- `test.html` (fourni) - Test complet local
- `https://httpbin.org/user-agent` - User agent brut
- `https://www.whatismybrowser.com/` - Détection complète

#### Tests avancés
- `https://www.useragentstring.com/` - Analyse détaillée
- `https://developers.whatismybrowser.com/useragents/parse/` - Parser
- Sites avec détection stricte (pour tester les limites)

### 9. ⚠️ Limitations connues

#### Pages non supportées
- `chrome://` et `about://` (pages système)
- Certaines pages avec CSP très strict
- Extensions et pages internes

#### Détection avancée
Certains sites peuvent encore détecter le changement via :
- Tests JavaScript très avancés
- Analyse comportementale
- Vérifications de cohérence poussées

---

## 🎉 Si tout fonctionne

Vous devriez voir :
- ✅ User agent modifié dans `navigator.userAgent`
- ✅ Headers HTTP modifiés (visible avec fetch)
- ✅ Propriétés cohérentes (platform, vendor, etc.)
- ✅ Persistance entre les sessions
- ✅ Badge "ON" quand actif

**Cette version devrait résoudre le problème de modification de l'user agent !**
