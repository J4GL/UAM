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
            applyUserAgentWithRetry(message.userAgent);
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

    // Variables pour la gestion de l'initialisation
    let isInjectScriptReady = false;
    let pendingUserAgent = null;
    
    // Écouter les messages du inject script
    window.addEventListener('message', function(event) {
        if (event.source !== window) return;
        
        if (event.data.type === 'INJECT_SCRIPT_READY') {
            console.log('Inject script is ready');
            isInjectScriptReady = true;
            
            // Appliquer le user agent en attente s'il y en a un
            if (pendingUserAgent) {
                console.log('Applying pending user agent:', pendingUserAgent);
                applyUserAgent(pendingUserAgent);
                pendingUserAgent = null;
            }
        }
    });
    
    // Fonction améliorée pour appliquer le user agent avec retry
    function applyUserAgentWithRetry(userAgent, maxRetries = 5, delay = 200) {
        if (!userAgent) return;
        
        if (isInjectScriptReady) {
            applyUserAgent(userAgent);
        } else {
            pendingUserAgent = userAgent;
            console.log('Inject script not ready, storing user agent for later application:', userAgent);
            
            // Retry mechanism
            let retryCount = 0;
            const retryInterval = setInterval(() => {
                if (isInjectScriptReady && pendingUserAgent) {
                    clearInterval(retryInterval);
                    console.log('Retrying user agent application:', pendingUserAgent);
                    applyUserAgent(pendingUserAgent);
                    pendingUserAgent = null;
                } else if (retryCount >= maxRetries) {
                    clearInterval(retryInterval);
                    console.warn('Failed to apply user agent after', maxRetries, 'retries');
                    // Force apply anyway
                    if (pendingUserAgent) {
                        applyUserAgent(pendingUserAgent);
                        pendingUserAgent = null;
                    }
                }
                retryCount++;
            }, delay);
        }
    }

    // Vérifier s'il y a un user agent sauvegardé au chargement
    chrome.storage.sync.get(['selectedUserAgent', 'selectedCustomUserAgent']).then(result => {
        let userAgent = null;
        
        if (result.selectedCustomUserAgent) {
            // Utiliser le user agent personnalisé
            userAgent = result.selectedCustomUserAgent;
        } else if (result.selectedUserAgent) {
            // Récupérer l'user agent prédéfini correspondant
            const userAgents = {
                'chrome-windows': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
                'chrome-macos': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
                'chrome-linux': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
                'safari-macos': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.6 Safari/605.1.15',
                'edge-windows': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36 Edg/128.0.0.0',
                'edge-macos': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36 Edg/128.0.0.0',
                'edge-linux': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36 Edg/128.0.0.0'
            };

            userAgent = userAgents[result.selectedUserAgent];
        }
        
        if (userAgent) {
            console.log('Found stored user agent, applying:', userAgent);
            applyUserAgentWithRetry(userAgent);
        }
    }).catch(error => {
        console.error('Erreur lors de la récupération de l\'user agent:', error);
    });

})();
