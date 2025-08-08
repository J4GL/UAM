// Script injecté dans le contexte principal de la page
(function() {
    'use strict';
    
    // Stocker les valeurs originales
    const originalUserAgent = navigator.userAgent;
    const originalPlatform = navigator.platform;
    const originalVendor = navigator.vendor;
    const originalAppName = navigator.appName;
    const originalAppVersion = navigator.appVersion;
    
    // Variable pour stocker l'user agent personnalisé
    let customUserAgent = null;
    let customPlatform = null;
    let customVendor = null;
    let customAppName = null;
    let customAppVersion = null;
    
    // Fonction pour appliquer l'user agent
    function applyUserAgent(userAgent) {
        if (!userAgent) return;
        
        customUserAgent = userAgent;
        customAppVersion = userAgent.substring(userAgent.indexOf('/') + 1);
        
        // Détecter le navigateur et l'OS
        const isChrome = userAgent.includes('Chrome') && !userAgent.includes('Edg');
        const isFirefox = userAgent.includes('Firefox');
        const isSafari = userAgent.includes('Safari') && !userAgent.includes('Chrome');
        const isEdge = userAgent.includes('Edg');
        
        const isWindows = userAgent.includes('Windows');
        const isMac = userAgent.includes('Macintosh') || userAgent.includes('Mac OS');
        const isLinux = userAgent.includes('Linux');
        
        // Définir les propriétés
        if (isWindows) customPlatform = 'Win32';
        else if (isMac) customPlatform = 'MacIntel';
        else if (isLinux) customPlatform = 'Linux x86_64';
        else customPlatform = originalPlatform;
        
        if (isChrome || isEdge) customVendor = 'Google Inc.';
        else if (isSafari) customVendor = 'Apple Computer, Inc.';
        else customVendor = '';
        
        customAppName = 'Netscape';
        
        console.log('User agent injecté appliqué:', userAgent);
    }
    
    // Fonction pour reset
    function resetUserAgent() {
        customUserAgent = null;
        customPlatform = null;
        customVendor = null;
        customAppName = null;
        customAppVersion = null;
        console.log('User agent injecté réinitialisé');
    }
    
    // Redéfinir les propriétés du navigator
    try {
        Object.defineProperty(navigator, 'userAgent', {
            get: function() {
                return customUserAgent || originalUserAgent;
            },
            configurable: true,
            enumerable: true
        });
        
        Object.defineProperty(navigator, 'platform', {
            get: function() {
                return customPlatform || originalPlatform;
            },
            configurable: true,
            enumerable: true
        });
        
        Object.defineProperty(navigator, 'vendor', {
            get: function() {
                return customVendor !== null ? customVendor : originalVendor;
            },
            configurable: true,
            enumerable: true
        });
        
        Object.defineProperty(navigator, 'appName', {
            get: function() {
                return customAppName || originalAppName;
            },
            configurable: true,
            enumerable: true
        });
        
        Object.defineProperty(navigator, 'appVersion', {
            get: function() {
                return customAppVersion || originalAppVersion;
            },
            configurable: true,
            enumerable: true
        });
        
        console.log('Propriétés navigator redéfinies avec succès');
        
    } catch (error) {
        console.error('Erreur lors de la redéfinition des propriétés navigator:', error);
    }
    
    // Écouter les messages du content script
    window.addEventListener('message', function(event) {
        if (event.source !== window) return;
        
        if (event.data.type === 'USER_AGENT_CHANGE') {
            if (event.data.userAgent) {
                applyUserAgent(event.data.userAgent);
            } else {
                resetUserAgent();
            }
        }
    });
    
    // Vérifier s'il y a un user agent sauvegardé
    // Cette partie sera gérée par le content script
    
    console.log('Script d\'injection User Agent chargé');
    
})();
