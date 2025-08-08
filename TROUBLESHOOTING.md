# 🔧 Dépannage User Agent Switcher

## Problème : L'User Agent ne change pas

### Solution mise à jour

L'extension a été mise à jour pour utiliser une approche hybride plus robuste :

1. **Content Script** : Modifie `navigator.userAgent` directement dans la page
2. **declarativeNetRequest** : Modifie les headers HTTP pour les requêtes réseau

### Étapes de dépannage

#### 1. Recharger l'extension
```
1. Aller à chrome://extensions/
2. Trouver "User Agent Switcher"
3. Cliquer sur le bouton de rechargement 🔄
4. Fermer et rouvrir tous les onglets
```

#### 2. Vérifier les permissions
L'extension nécessite maintenant ces permissions :
- ✅ `declarativeNetRequest` - Modifier les headers HTTP
- ✅ `storage` - Sauvegarder les préférences  
- ✅ `activeTab` - Accéder à l'onglet actif
- ✅ `scripting` - Injecter des scripts
- ✅ `tabs` - Communiquer avec les onglets
- ✅ `<all_urls>` - Fonctionner sur tous les sites

#### 3. Tester étape par étape

**Étape 1 : Ouvrir la console**
```
1. Appuyer sur F12 pour ouvrir les outils de développement
2. Aller dans l'onglet "Console"
3. Vérifier s'il y a des erreurs
```

**Étape 2 : Appliquer un user agent**
```
1. Cliquer sur l'icône de l'extension
2. Sélectionner une combinaison (ex: Firefox + macOS)
3. Cliquer "Appliquer"
4. Vérifier que le badge "ON" apparaît
```

**Étape 3 : Vérifier dans la console**
```javascript
// Taper dans la console :
console.log('User Agent:', navigator.userAgent);
console.log('Platform:', navigator.platform);
console.log('Vendor:', navigator.vendor);
```

**Étape 4 : Actualiser la page**
```
1. Appuyer sur F5 ou Ctrl+R
2. Vérifier à nouveau dans la console
3. Le user agent devrait avoir changé
```

#### 4. Tests de validation

**Test 1 : Page de test locale**
```
1. Ouvrir test.html
2. Appliquer un user agent
3. Cliquer "🔄 Actualiser"
4. Vérifier que l'affichage change
```

**Test 2 : Site externe**
```
1. Aller sur https://httpbin.org/user-agent
2. Noter l'user agent affiché
3. Appliquer un changement via l'extension
4. Actualiser la page
5. L'user agent devrait être différent
```

**Test 3 : Console JavaScript**
```javascript
// Avant changement
console.log('Avant:', navigator.userAgent);

// Après changement (actualiser la page)
console.log('Après:', navigator.userAgent);
```

### Messages d'erreur courants

#### "Cannot access contents of the page"
**Cause** : L'extension n'a pas les permissions sur certaines pages
**Solution** : 
- Vérifier que `<all_urls>` est autorisé
- Certaines pages (chrome://, about:) ne peuvent pas être modifiées

#### "Extension context invalidated"
**Cause** : L'extension a été rechargée
**Solution** :
- Fermer et rouvrir tous les onglets
- Réappliquer l'user agent

#### "Failed to modify headers"
**Cause** : Problème avec declarativeNetRequest
**Solution** :
- Le content script devrait fonctionner même si les headers échouent
- Vérifier la console pour plus de détails

### Vérification manuelle

#### Dans la console du navigateur :
```javascript
// Vérifier l'user agent actuel
navigator.userAgent

// Vérifier d'autres propriétés
navigator.platform
navigator.vendor
navigator.appName
navigator.appVersion

// Tester une requête HTTP
fetch('https://httpbin.org/user-agent')
  .then(r => r.json())
  .then(data => console.log('User-Agent HTTP:', data['user-agent']));
```

#### Dans les outils de développement :
```
1. Onglet "Network" (Réseau)
2. Actualiser la page
3. Cliquer sur une requête
4. Vérifier les headers "User-Agent"
```

### Limitations connues

#### Pages qui ne fonctionnent pas :
- `chrome://` (pages internes de Chrome)
- `about:` (pages about)
- `moz-extension://` (pages d'extensions)
- Certaines pages avec CSP strict

#### Détection avancée :
Certains sites utilisent des méthodes de détection avancées :
- Analyse du comportement JavaScript
- Vérification de propriétés spécifiques au navigateur
- Tests de compatibilité CSS/HTML

### Si rien ne fonctionne

#### Réinstallation complète :
```
1. Supprimer l'extension
2. Redémarrer Chrome
3. Réinstaller l'extension
4. Tester sur une page simple (test.html)
```

#### Vérification des fichiers :
```bash
# Exécuter le script de validation
python3 validate_extension.py
```

#### Contact et support :
- Vérifier la console pour les erreurs détaillées
- Tester sur différents sites web
- Comparer avec d'autres extensions similaires

### Nouveautés de cette version

✅ **Content Script ajouté** : Modifie directement `navigator.userAgent`
✅ **Approche hybride** : Headers HTTP + JavaScript
✅ **Meilleure compatibilité** : Fonctionne sur plus de sites
✅ **Propriétés étendues** : Modifie platform, vendor, appName
✅ **Tests améliorés** : Page de test avec plus de vérifications

L'extension devrait maintenant fonctionner correctement sur la plupart des sites web !
