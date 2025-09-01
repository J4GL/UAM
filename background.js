// Service Worker pour gérer les règles de modification des headers
let currentRuleId = 1;

// Écouter les messages du popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'setUserAgent') {
    (async () => {
      try {
        await setUserAgent(message.userAgent);
        await notifyContentScripts(message.userAgent);
        sendResponse({ success: true });
      } catch (error) {
        console.error('Erreur lors de l\'application du user agent:', error);
        sendResponse({ success: false, error: error.message });
      }
    })();
    return true; // Indicate async response
  } else if (message.action === 'resetUserAgent') {
    (async () => {
      try {
        await resetUserAgent();
        await notifyContentScriptsReset();
        sendResponse({ success: true });
      } catch (error) {
        console.error('Erreur lors du reset:', error);
        sendResponse({ success: false, error: error.message });
      }
    })();
    return true; // Indicate async response
  }
});

// Appliquer un user agent personnalisé
async function setUserAgent(userAgent) {
  try {
    // Supprimer les règles existantes
    await removeExistingRules();
    
    // Créer une nouvelle règle pour modifier le header User-Agent
    const rule = {
      id: currentRuleId++,
      priority: 1,
      action: {
        type: 'modifyHeaders',
        requestHeaders: [
          {
            header: 'User-Agent',
            operation: 'set',
            value: userAgent
          }
        ]
      },
      condition: {
        urlFilter: '*',
        resourceTypes: ['main_frame', 'sub_frame', 'xmlhttprequest', 'script', 'stylesheet', 'image', 'font', 'object', 'other']
      }
    };
    
    // Ajouter la nouvelle règle
    await chrome.declarativeNetRequest.updateDynamicRules({
      addRules: [rule]
    });
    
    console.log('User agent appliqué:', userAgent);
    console.log('Règle declarativeNetRequest créée avec ID:', rule.id);
    
    // Mettre à jour l'icône pour indiquer que l'extension est active
    await chrome.action.setBadgeText({ text: 'ON' });
    await chrome.action.setBadgeBackgroundColor({ color: '#4285f4' });
    
  } catch (error) {
    console.error('Erreur lors de l\'application du user agent:', error);
    throw error;
  }
}

// Réinitialiser le user agent
async function resetUserAgent() {
  try {
    await removeExistingRules();
    
    console.log('User agent réinitialisé');
    
    // Supprimer le badge
    await chrome.action.setBadgeText({ text: '' });
    
  } catch (error) {
    console.error('Erreur lors de la réinitialisation:', error);
    throw error;
  }
}

// Supprimer toutes les règles existantes
async function removeExistingRules() {
  try {
    const existingRules = await chrome.declarativeNetRequest.getDynamicRules();
    const ruleIds = existingRules.map(rule => rule.id);
    
    if (ruleIds.length > 0) {
      await chrome.declarativeNetRequest.updateDynamicRules({
        removeRuleIds: ruleIds
      });
    }
  } catch (error) {
    console.error('Erreur lors de la suppression des règles:', error);
  }
}

// Fonction d'initialisation réutilisable
async function initializeExtension() {
  try {
    console.log('Initialisation de l\'extension User Agent Switcher...');
    // Vérifier s'il y a un user agent sauvegardé
    const result = await chrome.storage.sync.get(['selectedUserAgent', 'selectedCustomUserAgent']);
    console.log('Données de storage récupérées:', result);
    
    if (result.selectedCustomUserAgent) {
      // Réappliquer le user agent personnalisé sauvegardé
      await setUserAgent(result.selectedCustomUserAgent);
      await notifyContentScripts(result.selectedCustomUserAgent);
    } else if (result.selectedUserAgent) {
      // Réappliquer le user agent prédéfini sauvegardé
      const userAgents = {
        'chrome-windows': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
        'chrome-macos': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
        'chrome-linux': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
        'safari-macos': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.6 Safari/605.1.15',
        'edge-windows': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36 Edg/128.0.0.0',
        'edge-macos': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36 Edg/128.0.0.0',
        'edge-linux': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36 Edg/128.0.0.0'
      };
      
      const userAgent = userAgents[result.selectedUserAgent];
      if (userAgent) {
        await setUserAgent(userAgent);
        await notifyContentScripts(userAgent);
      }
    }
  } catch (error) {
    console.error('Erreur lors de l\'initialisation:', error);
  }
}

// Initialisation lors du démarrage de Chrome
chrome.runtime.onStartup.addListener(initializeExtension);

// Initialisation lors de l'installation ou du redémarrage du service worker
chrome.runtime.onInstalled.addListener(initializeExtension);

// Initialisation immédiate au chargement du service worker (important pour Manifest V3)
initializeExtension();

// Notifier tous les content scripts du changement d'user agent
async function notifyContentScripts(userAgent) {
  try {
    const tabs = await chrome.tabs.query({});
    for (const tab of tabs) {
      try {
        await chrome.tabs.sendMessage(tab.id, {
          action: 'setUserAgent',
          userAgent: userAgent
        });
      } catch (error) {
        // Ignorer les erreurs pour les onglets qui ne peuvent pas recevoir de messages
        console.log(`Impossible d'envoyer le message à l'onglet ${tab.id}:`, error.message);
      }
    }
  } catch (error) {
    console.error('Erreur lors de la notification des content scripts:', error);
  }
}

// Notifier tous les content scripts du reset
async function notifyContentScriptsReset() {
  try {
    const tabs = await chrome.tabs.query({});
    for (const tab of tabs) {
      try {
        await chrome.tabs.sendMessage(tab.id, {
          action: 'resetUserAgent'
        });
      } catch (error) {
        // Ignorer les erreurs pour les onglets qui ne peuvent pas recevoir de messages
        console.log(`Impossible d'envoyer le message à l'onglet ${tab.id}:`, error.message);
      }
    }
  } catch (error) {
    console.error('Erreur lors de la notification des content scripts:', error);
  }
}

