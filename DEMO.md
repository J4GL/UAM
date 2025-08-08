# 🎬 Démonstration User Agent Switcher

## Interface de l'extension

```
┌─────────────────────────────────────────┐
│           User Agent Switcher           │
├─────────────────────────────────────────┤
│                                         │
│  ┌─────────────────────────────────────┐ │
│  │ Navigateur │ Windows │ macOS │ Linux│ │
│  ├────────────┼─────────┼───────┼──────┤ │
│  │ Chrome     │    ○    │   ○   │  ○   │ │
│  │ Firefox    │    ○    │   ●   │  ○   │ │ ← Sélectionné
│  │ Safari     │    -    │   ○   │  -   │ │
│  │ Edge       │    ○    │   ○   │  ○   │ │
│  └────────────┴─────────┴───────┴──────┘ │
│                                         │
│     [Appliquer]    [Reset]              │
│                                         │
│  ✅ User agent appliqué: Firefox sur    │
│     macOS                               │
└─────────────────────────────────────────┘
```

## Étapes d'utilisation

### 1. Installation
```bash
# Dans Chrome, aller à chrome://extensions/
# Activer le mode développeur
# Cliquer sur "Charger l'extension non empaquetée"
# Sélectionner le dossier de l'extension
```

### 2. Utilisation
```
1. Cliquer sur l'icône "UA" dans la barre d'outils
2. Sélectionner une combinaison navigateur/OS
3. Cliquer sur "Appliquer"
4. Badge "ON" apparaît sur l'icône
5. Actualiser les pages pour voir l'effet
```

### 3. Test
```
Avant:  Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) 
        AppleWebKit/537.36 (KHTML, like Gecko) 
        Chrome/120.0.0.0 Safari/537.36

Après:  Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:121.0) 
        Gecko/20100101 Firefox/121.0
```

## User Agents disponibles

### 🌐 Chrome
- **Windows**: `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36`
- **macOS**: `Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36`
- **Linux**: `Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36`

### 🦊 Firefox
- **Windows**: `Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0`
- **macOS**: `Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:121.0) Gecko/20100101 Firefox/121.0`
- **Linux**: `Mozilla/5.0 (X11; Linux x86_64; rv:121.0) Gecko/20100101 Firefox/121.0`

### 🧭 Safari
- **macOS**: `Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Safari/605.1.15`
- *Note: Safari uniquement disponible sur macOS*

### 🔷 Edge
- **Windows**: `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Edg/120.0.0.0`
- **macOS**: `Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Edg/120.0.0.0`
- **Linux**: `Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Edg/120.0.0.0`

## Cas d'usage

### 🧪 Tests de compatibilité
```
Tester comment votre site web se comporte sur différents navigateurs
sans avoir à installer chaque navigateur
```

### 🔍 Débogage
```
Reproduire des bugs spécifiques à certains navigateurs
Tester des fonctionnalités spécifiques à un OS
```

### 🎭 Contournement de restrictions
```
Accéder à du contenu limité à certains navigateurs
Contourner des détections de navigateur trop strictes
```

### 📊 Analytics
```
Tester comment les outils d'analytics détectent différents navigateurs
Vérifier les statistiques de votre site
```

## Fonctionnalités techniques

### ✅ Manifest V3
- Compatible avec les dernières spécifications Chrome
- Sécurité renforcée
- Performance optimisée

### 💾 Persistance
- Sauvegarde automatique de la sélection
- Réactivation au redémarrage du navigateur
- Stockage local sécurisé

### 🔒 Sécurité
- Aucune donnée envoyée à l'extérieur
- Permissions minimales requises
- Code source ouvert et auditable

### 🎨 Interface intuitive
- Tableau de sélection clair
- Feedback visuel immédiat
- Design moderne et responsive

## Fichiers de l'extension

```
user-agent-switcher/
├── 📄 manifest.json      # Configuration Manifest V3
├── 🎨 popup.html         # Interface utilisateur
├── ⚙️  popup.js          # Logique de l'interface
├── 🔧 background.js      # Service worker
├── 🖼️  icons/            # Icônes de l'extension
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
├── 🧪 test.html          # Page de test
├── 📚 README.md          # Documentation complète
├── 🚀 install.md         # Guide d'installation
└── ✅ validate_extension.py # Script de validation
```

## Support et maintenance

### 🔄 Mises à jour
L'extension utilise des User Agents récents (Chrome 120, Firefox 121, etc.)
qui peuvent être mis à jour selon les besoins.

### 🐛 Dépannage
- Console de développement pour les erreurs
- Script de validation inclus
- Documentation complète

### 🤝 Contribution
Code source ouvert, modifications et améliorations bienvenues !

---

**🎉 Profitez de votre nouvelle extension User Agent Switcher !**
