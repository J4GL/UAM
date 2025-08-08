// User agent strings pour différents navigateurs et OS
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

// Éléments DOM
const applyBtn = document.getElementById('applyBtn');
const resetBtn = document.getElementById('resetBtn');
const statusDiv = document.getElementById('status');

// Charger la sélection sauvegardée
document.addEventListener('DOMContentLoaded', async () => {
  try {
    const result = await chrome.storage.sync.get(['selectedUserAgent']);
    if (result.selectedUserAgent) {
      const radio = document.querySelector(`input[value="${result.selectedUserAgent}"]`);
      if (radio) {
        radio.checked = true;
      }
      showStatus('User agent actuel: ' + getDisplayName(result.selectedUserAgent), 'info');
    }
  } catch (error) {
    console.error('Erreur lors du chargement:', error);
  }
});

// Appliquer le user agent sélectionné
applyBtn.addEventListener('click', async () => {
  const selectedRadio = document.querySelector('input[name="useragent"]:checked');
  
  if (!selectedRadio) {
    showStatus('Veuillez sélectionner un navigateur et un OS', 'error');
    return;
  }
  
  const selectedValue = selectedRadio.value;
  const userAgent = userAgents[selectedValue];
  
  try {
    // Sauvegarder la sélection
    await chrome.storage.sync.set({ selectedUserAgent: selectedValue });
    
    // Envoyer un message au service worker pour appliquer le user agent
    await chrome.runtime.sendMessage({
      action: 'setUserAgent',
      userAgent: userAgent,
      key: selectedValue
    });
    
    showStatus(`User agent appliqué: ${getDisplayName(selectedValue)}`, 'success');
  } catch (error) {
    console.error('Erreur lors de l\'application:', error);
    showStatus('Erreur lors de l\'application du user agent', 'error');
  }
});

// Reset du user agent
resetBtn.addEventListener('click', async () => {
  try {
    // Supprimer la sélection sauvegardée
    await chrome.storage.sync.remove(['selectedUserAgent']);
    
    // Envoyer un message au service worker pour reset
    await chrome.runtime.sendMessage({
      action: 'resetUserAgent'
    });
    
    // Décocher tous les radios
    const radios = document.querySelectorAll('input[name="useragent"]');
    radios.forEach(radio => radio.checked = false);
    
    showStatus('User agent réinitialisé', 'success');
  } catch (error) {
    console.error('Erreur lors du reset:', error);
    showStatus('Erreur lors de la réinitialisation', 'error');
  }
});

// Afficher un message de statut
function showStatus(message, type = 'info') {
  statusDiv.textContent = message;
  statusDiv.className = `status ${type}`;
  statusDiv.style.display = 'block';

  // Masquer le message après 3 secondes
  setTimeout(() => {
    statusDiv.style.display = 'none';
  }, 3000);
}

// Obtenir le nom d'affichage pour une clé
function getDisplayName(key) {
  const [browser, os] = key.split('-');
  const browserNames = {
    chrome: 'Chrome',
    firefox: 'Firefox',
    safari: 'Safari',
    edge: 'Edge'
  };
  const osNames = {
    windows: 'Windows',
    macos: 'macOS',
    linux: 'Linux'
  };
  
  return `${browserNames[browser]} sur ${osNames[os]}`;
}
