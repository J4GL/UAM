# 📝 Changelog - User Agent Switcher

## Version 1.2 - Correction Complète Navigator.userAgent

### 🔧 Problème résolu
- **navigator.userAgent ne changeait toujours pas** : Le content script seul était insuffisant
- **Différence entre fetch et navigator** : Headers HTTP modifiés mais pas les propriétés JavaScript

### ✅ Solution finale : Script d'injection

#### 1. Architecture hybride complète
- **Content Script** (`content.js`) : Communique avec l'extension
- **Script d'injection** (`inject.js`) : S'exécute dans le contexte principal de la page
- **declarativeNetRequest** : Modifie les headers HTTP
- **Communication** : Messages entre les scripts

#### 2. Script d'injection (`inject.js`)
- S'exécute dans le contexte principal de la page (pas isolé)
- Redéfinit directement `navigator.userAgent` et toutes les propriétés
- Utilise des getters dynamiques pour permettre les changements
- Stocke les valeurs originales pour le reset

#### 3. Nouvelles ressources web accessibles
- `inject.js` ajouté aux `web_accessible_resources`
- Injection dynamique via `chrome.runtime.getURL()`

### 🚀 Améliorations techniques

#### Communication inter-scripts
```
Popup → Background → Content Script → postMessage → Script Injecté
```

#### Propriétés modifiées
- `navigator.userAgent` ✅
- `navigator.platform` ✅
- `navigator.vendor` ✅
- `navigator.appName` ✅
- `navigator.appVersion` ✅

#### Tests de cohérence
- Navigator et Fetch retournent maintenant le même user agent
- Toutes les propriétés sont cohérentes
- Persistance améliorée

### 📋 Fichiers modifiés

#### Nouveau fichier
- `inject.js` - Script d'injection principal

#### Fichiers modifiés
- `manifest.json` - web_accessible_resources ajouté
- `content.js` - Réécriture complète pour injection
- `validate_extension.py` - Validation du script d'injection

#### Nouveaux fichiers de documentation
- `TEST_GUIDE.md` - Guide de test détaillé

### ⚠️ IMPORTANT : Réinstallation requise

Cette version nécessite une **réinstallation complète** :
1. Supprimer l'ancienne version
2. Redémarrer Chrome
3. Installer la nouvelle version
4. Fermer et rouvrir tous les onglets

---

## Version 1.1 - Correction User Agent

### 🔧 Problème résolu
- **User Agent ne changeait pas** : L'approche initiale avec seulement `declarativeNetRequest` était insuffisante

### ✅ Solutions implémentées

#### 1. Content Script ajouté (`content.js`)
- Modifie directement `navigator.userAgent` dans chaque page
- Redéfinit les propriétés du navigateur :
  - `navigator.userAgent`
  - `navigator.platform`
  - `navigator.vendor`
  - `navigator.appName`
  - `navigator.appVersion`

#### 2. Approche hybride
- **Content Script** : Modifie les propriétés JavaScript
- **declarativeNetRequest** : Modifie les headers HTTP
- **Communication** : Service worker communique avec tous les onglets

#### 3. Permissions étendues
Nouvelles permissions ajoutées :
- `scripting` : Pour injecter le content script
- `tabs` : Pour communiquer avec les onglets

#### 4. Tests améliorés
- Page `test.html` enrichie avec plus de vérifications
- Test via `fetch()` pour vérifier les headers HTTP
- Affichage de toutes les propriétés du navigateur
- Console logs détaillés

#### 5. Documentation complète
- `TROUBLESHOOTING.md` : Guide de dépannage détaillé
- `DEMO.md` : Démonstration visuelle
- `install.md` : Instructions d'installation
- README mis à jour

### 🚀 Nouvelles fonctionnalités

#### Interface
- Bouton "Test Fetch" dans la page de test
- Affichage des propriétés étendues (platform, vendor, etc.)
- Messages d'erreur améliorés

#### Technique
- Détection automatique au chargement des pages
- Persistance améliorée des paramètres
- Gestion d'erreurs robuste
- Logs de débogage détaillés

### 📋 Fichiers modifiés

#### Nouveaux fichiers
- `content.js` - Content script principal
- `TROUBLESHOOTING.md` - Guide de dépannage
- `DEMO.md` - Démonstration
- `CHANGELOG.md` - Ce fichier

#### Fichiers modifiés
- `manifest.json` - Permissions et content script
- `background.js` - Communication avec content scripts
- `test.html` - Tests étendus
- `README.md` - Documentation mise à jour
- `validate_extension.py` - Validation du content script

### 🔍 Comment tester

#### 1. Réinstaller l'extension
```
1. Supprimer l'ancienne version
2. Recharger la nouvelle version
3. Fermer et rouvrir tous les onglets
```

#### 2. Test rapide
```
1. Ouvrir test.html
2. Sélectionner Firefox + macOS
3. Cliquer "Appliquer"
4. Cliquer "🔄 Actualiser"
5. Vérifier que l'affichage change
```

#### 3. Test console
```javascript
// Dans la console (F12)
console.log('User Agent:', navigator.userAgent);
console.log('Platform:', navigator.platform);
console.log('Vendor:', navigator.vendor);
```

#### 4. Test HTTP
```
1. Aller sur https://httpbin.org/user-agent
2. Noter l'user agent affiché
3. Appliquer un changement
4. Actualiser la page
5. L'user agent devrait changer
```

### ⚠️ Limitations connues

#### Pages non supportées
- `chrome://` (pages internes Chrome)
- `about:` (pages about)
- Extensions et pages système

#### Détection avancée
Certains sites peuvent détecter le changement via :
- Tests JavaScript avancés
- Analyse comportementale
- Vérifications de cohérence

### 🎯 Prochaines améliorations possibles

#### Interface
- [ ] Presets personnalisés
- [ ] Import/export de configurations
- [ ] Mode aléatoire

#### Technique
- [ ] Spoofing des propriétés WebGL
- [ ] Modification des headers Accept
- [ ] Support des Service Workers

#### Compatibilité
- [ ] Support Firefox (WebExtensions)
- [ ] Tests automatisés
- [ ] CI/CD pipeline

---

## Version 1.0 - Version initiale

### ✅ Fonctionnalités de base
- Interface en tableau (navigateurs × OS)
- Manifest V3
- Sauvegarde des préférences
- Badge d'état
- Icônes personnalisées

### 📁 Fichiers initiaux
- `manifest.json`
- `popup.html` / `popup.js`
- `background.js`
- `icons/`
- Documentation de base

---

**🎉 L'extension devrait maintenant fonctionner correctement !**

Pour toute question, consultez `TROUBLESHOOTING.md` ou testez avec `test.html`.
