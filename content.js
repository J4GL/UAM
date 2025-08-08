// Content script pour modifier l'user agent
(function() {
    'use strict';

    // Injecter le script dans le contexte principal de la page
    function injectScript() {
        const script = document.createElement('script');
        script.src = chrome.runtime.getURL('inject.js');
        script.onload = function() {
            this.remove();
        };
        (document.head || document.documentElement).appendChild(script);
    }

    // Fonction pour appliquer l'user agent via le script injecté
    function applyUserAgent(userAgent) {
        if (!userAgent) return;

        try {
            // Envoyer un message au script injecté
            window.postMessage({
                type: 'USER_AGENT_CHANGE',
                userAgent: userAgent
            }, '*');

            console.log('User agent envoyé au script injecté:', userAgent);

        } catch (error) {
            console.error('Erreur lors de l\'envoi du user agent:', error);
        }
    }

    // Fonction pour reset l'user agent
    function resetUserAgent() {
        try {
            window.postMessage({
                type: 'USER_AGENT_CHANGE',
                userAgent: null
            }, '*');

            console.log('Reset envoyé au script injecté');

        } catch (error) {
            console.error('Erreur lors du reset:', error);
        }
    }
    
    // Écouter les messages du background script
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        if (message.action === 'setUserAgent') {
            applyUserAgent(message.userAgent);
            sendResponse({ success: true });
        } else if (message.action === 'resetUserAgent') {
            resetUserAgent();
            sendResponse({ success: true });
        }
    });
    
    // Injecter le script au chargement
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', injectScript);
    } else {
        injectScript();
    }

    // Vérifier s'il y a un user agent sauvegardé au chargement
    chrome.storage.sync.get(['selectedUserAgent']).then(result => {
        if (result.selectedUserAgent) {
            // Récupérer l'user agent correspondant
            const userAgents = {
                'chrome-windows': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'chrome-macos': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'chrome-linux': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'firefox-windows': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0',
                'firefox-macos': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:121.0) Gecko/20100101 Firefox/121.0',
                'firefox-linux': 'Mozilla/5.0 (X11; Linux x86_64; rv:121.0) Gecko/20100101 Firefox/121.0',
                'safari-macos': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Safari/605.1.15',
                'edge-windows': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Edg/120.0.0.0',
                'edge-macos': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Edg/120.0.0.0',
                'edge-linux': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Edg/120.0.0.0'
            };

            const userAgent = userAgents[result.selectedUserAgent];
            if (userAgent) {
                // Attendre un peu que le script soit injecté
                setTimeout(() => {
                    applyUserAgent(userAgent);
                }, 100);
            }
        }
    }).catch(error => {
        console.error('Erreur lors de la récupération de l\'user agent:', error);
    });

})();
