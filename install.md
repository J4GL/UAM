# 🚀 Installation de l'Extension User Agent Switcher

## Installation rapide

### Étape 1 : Préparer l'extension
Tous les fichiers sont déjà prêts dans ce dossier !

### Étape 2 : Installer dans Chrome

1. **Ouvrir Chrome** et aller à l'adresse : `chrome://extensions/`

2. **Activer le mode développeur** :
   - Cliquez sur le bouton "Mode développeur" en haut à droite
   - Il doit être activé (bleu)

3. **Charger l'extension** :
   - Cliquez sur "Charger l'extension non empaquetée"
   - Sélectionnez **ce dossier entier** (UAM)
   - L'extension apparaîtra dans la liste

4. **Épingler l'extension** (recommandé) :
   - Cliquez sur l'icône puzzle 🧩 dans la barre d'outils Chrome
   - Trouvez "User Agent Switcher" et cliquez sur l'épingle 📌

### Étape 3 : Tester l'extension

1. **Ouvrir le fichier de test** :
   - Double-cliquez sur `test.html` dans ce dossier
   - Ou ouvrez-le dans Chrome

2. **Utiliser l'extension** :
   - Cliquez sur l'icône "UA" dans la barre d'outils
   - Sélectionnez une combinaison navigateur/OS
   - Cliquez sur "Appliquer"
   - Actualisez la page de test

3. **Vérifier le changement** :
   - Le User Agent affiché devrait changer
   - Un badge "ON" apparaît sur l'icône de l'extension

## 🎯 Utilisation

### Interface en tableau
```
Navigateur │ Windows │ macOS │ Linux
───────────┼─────────┼───────┼──────
Chrome     │    ○    │   ○   │  ○
Firefox    │    ○    │   ○   │  ○
Safari     │    -    │   ○   │  -
Edge       │    ○    │   ○   │  ○
```

### Boutons
- **Appliquer** : Active le User Agent sélectionné
- **Reset** : Revient au User Agent par défaut

### Indicateurs
- **Badge "ON"** : Un User Agent personnalisé est actif
- **Pas de badge** : User Agent par défaut

## 🔧 Dépannage

### L'extension n'apparaît pas
- Vérifiez que le mode développeur est activé
- Assurez-vous de sélectionner le bon dossier
- Rechargez la page `chrome://extensions/`

### Le User Agent ne change pas
- Actualisez la page après avoir appliqué le changement
- Vérifiez que l'extension a un badge "ON"
- Testez sur le fichier `test.html` fourni

### Erreurs dans la console
- Ouvrez les outils de développement (F12)
- Vérifiez l'onglet Console pour les erreurs
- Rechargez l'extension si nécessaire

## 📋 Sites de test recommandés

1. **test.html** (fourni) - Test local complet
2. **httpbin.org/user-agent** - Affiche le User Agent brut
3. **whatismybrowser.com** - Détection complète du navigateur
4. **useragentstring.com** - Analyse détaillée

## ⚙️ Fonctionnalités avancées

### Persistance
- Votre sélection est sauvegardée automatiquement
- L'extension se réactive au redémarrage de Chrome

### Permissions
L'extension demande ces permissions :
- `declarativeNetRequest` : Modifier les headers HTTP
- `storage` : Sauvegarder vos préférences
- `activeTab` : Accéder à l'onglet actif
- `<all_urls>` : Fonctionner sur tous les sites

### Sécurité
- Utilise Manifest V3 (dernière version)
- Aucune donnée n'est envoyée à des serveurs externes
- Fonctionne entièrement en local

## 🎉 C'est tout !

Votre extension User Agent Switcher est maintenant prête à l'emploi !

Pour toute question ou problème, consultez le fichier `README.md` pour plus de détails techniques.
