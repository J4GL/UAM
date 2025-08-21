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
const customUaInput = document.getElementById('customUaInput');
const customUaSelect = document.getElementById('customUaSelect');
const saveCustomUaBtn = document.getElementById('saveCustomUaBtn');
const deleteCustomUaBtn = document.getElementById('deleteCustomUaBtn');
const radios = document.querySelectorAll('input[name="useragent"]');

// Charger les sélections et les UAs personnalisés
document.addEventListener('DOMContentLoaded', async () => {
  loadCustomUserAgents();
  try {
    const result = await chrome.storage.sync.get(['selectedUserAgent', 'selectedCustomUserAgent']);
    if (result.selectedUserAgent) {
      const radio = document.querySelector(`input[value="${result.selectedUserAgent}"]`);
      if (radio) {
        radio.checked = true;
      }
      showStatus('User agent actuel: ' + getDisplayName(result.selectedUserAgent), 'info');
    } else if (result.selectedCustomUserAgent) {
      customUaSelect.value = result.selectedCustomUserAgent;
      showStatus('User agent actuel: ' + result.selectedCustomUserAgent, 'info');
    }
  } catch (error) {
    console.error('Erreur lors du chargement:', error);
  }
});

// Appliquer le user agent sélectionné
applyBtn.addEventListener('click', async () => {
  const selectedRadio = document.querySelector('input[name="useragent"]:checked');
  const selectedCustomUa = customUaSelect.value;
  
  let userAgent, selectedValue, displayName;

  if (selectedCustomUa) {
    userAgent = selectedCustomUa;
    selectedValue = selectedCustomUa;
    displayName = selectedCustomUa.substring(0, 50) + '...'; // Truncate for display
    await chrome.storage.sync.set({ selectedCustomUserAgent: selectedValue, selectedUserAgent: '' });
  } else if (selectedRadio) {
    selectedValue = selectedRadio.value;
    userAgent = userAgents[selectedValue];
    displayName = getDisplayName(selectedValue);
    await chrome.storage.sync.set({ selectedUserAgent: selectedValue, selectedCustomUserAgent: '' });
  } else {
    showStatus('Veuillez sélectionner un user agent', 'error');
    return;
  }
  
  try {
    await chrome.runtime.sendMessage({
      action: 'setUserAgent',
      userAgent: userAgent,
      key: selectedValue
    });
    showStatus(`User agent appliqué: ${displayName}`, 'success');
  } catch (error) {
    console.error('Erreur lors de l\'application:', error);
    showStatus('Erreur lors de l\'application du user agent', 'error');
  }
});

// Reset du user agent
resetBtn.addEventListener('click', async () => {
  try {
    await chrome.storage.sync.remove(['selectedUserAgent', 'selectedCustomUserAgent']);
    await chrome.runtime.sendMessage({ action: 'resetUserAgent' });
    
    radios.forEach(radio => radio.checked = false);
    customUaSelect.value = '';
    
    showStatus('User agent réinitialisé', 'success');
  } catch (error) {
    console.error('Erreur lors du reset:', error);
    showStatus('Erreur lors de la réinitialisation', 'error');
  }
});

// Sauvegarder un UA personnalisé
saveCustomUaBtn.addEventListener('click', async () => {
  const uaString = customUaInput.value.trim();
  if (uaString) {
    try {
      const result = await chrome.storage.sync.get({customUserAgents: []});
      const customUAs = result.customUserAgents;
      if (!customUAs.includes(uaString)) {
        customUAs.push(uaString);
        await chrome.storage.sync.set({ customUserAgents: customUAs });
        loadCustomUserAgents();
        customUaInput.value = '';
        showStatus('User agent personnalisé sauvegardé', 'success');
      } else {
        showStatus('Ce user agent existe déjà', 'info');
      }
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      showStatus('Erreur lors de la sauvegarde', 'error');
    }
  }
});

// Supprimer un UA personnalisé
deleteCustomUaBtn.addEventListener('click', async () => {
  const selectedUa = customUaSelect.value;
  if (selectedUa) {
    try {
      const result = await chrome.storage.sync.get({customUserAgents: []});
      let customUAs = result.customUserAgents;
      customUAs = customUAs.filter(ua => ua !== selectedUa);
      await chrome.storage.sync.set({ customUserAgents: customUAs });
      loadCustomUserAgents();
      showStatus('User agent personnalisé supprimé', 'success');
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      showStatus('Erreur lors de la suppression', 'error');
    }
  }
});

// Charger les UAs personnalisés dans le select
async function loadCustomUserAgents() {
  try {
    const result = await chrome.storage.sync.get({customUserAgents: []});
    const customUAs = result.customUserAgents;
    customUaSelect.innerHTML = '<option value="">Sélectionner un User Agent personnalisé</option>';
    customUAs.forEach(ua => {
      const option = document.createElement('option');
      option.value = ua;
      option.textContent = ua.substring(0, 50) + '...'; // Truncate for display
      customUaSelect.appendChild(option);
    });
  } catch (error) {
    console.error('Erreur lors du chargement des UAs personnalisés:', error);
  }
}

// Assurer la sélection mutuellement exclusive
radios.forEach(radio => {
  radio.addEventListener('change', () => {
    if (radio.checked) {
      customUaSelect.value = '';
    }
  });
});

customUaSelect.addEventListener('change', () => {
  if (customUaSelect.value) {
    radios.forEach(radio => radio.checked = false);
  }
});

// Afficher un message de statut
function showStatus(message, type = 'info') {
  statusDiv.textContent = message;
  statusDiv.className = `status ${type}`;
  statusDiv.style.display = 'block';
  setTimeout(() => {
    statusDiv.style.display = 'none';
  }, 3000);
}

// Obtenir le nom d'affichage pour une clé
function getDisplayName(key) {
  if (!key) return '';
  const parts = key.split('-');
  if (parts.length < 2) return key;
  const [browser, os] = parts;
  const browserNames = { chrome: 'Chrome', firefox: 'Firefox', safari: 'Safari', edge: 'Edge' };
  const osNames = { windows: 'Windows', macos: 'macOS', linux: 'Linux' };
  return `${browserNames[browser] || browser} sur ${osNames[os] || os}`;
}