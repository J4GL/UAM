// User agent strings pour différents navigateurs et OS
const userAgents = {
  'chrome-windows': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
  'chrome-macos': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
  'chrome-linux': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
  
  'safari-macos': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.6 Safari/605.1.15',
  
  'edge-windows': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36 Edg/128.0.0.0',
  'edge-macos': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36 Edg/128.0.0.0',
  'edge-linux': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36 Edg/128.0.0.0'
};

// Éléments DOM
const statusDiv = document.getElementById('status');
const customUaInput = document.getElementById('customUaInput');
const customUaSelect = document.getElementById('customUaSelect');
const saveCustomUaBtn = document.getElementById('saveCustomUaBtn');
const editCustomUaBtn = document.getElementById('editCustomUaBtn');
const closeManagementBtn = document.getElementById('closeManagementBtn');
const customUaManagement = document.getElementById('customUaManagement');
const customUaList = document.getElementById('customUaList');
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

// Appliquer le user agent immédiatement
async function applyUserAgent() {
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
    return; // No selection, don't apply anything
  }
  
  try {
    const response = await chrome.runtime.sendMessage({
      action: 'setUserAgent',
      userAgent: userAgent,
      key: selectedValue
    });
    
    if (response && response.success) {
      showStatus(`User agent appliqué: ${displayName}`, 'success');
      // Close management panel if open
      customUaManagement.style.display = 'none';
    } else {
      throw new Error(response?.error || 'Réponse inattendue du service worker');
    }
  } catch (error) {
    console.error('Erreur lors de l\'application:', error);
    showStatus('Erreur lors de l\'application du user agent', 'error');
  }
}

// Reset du user agent (function for double-click reset)
async function resetUserAgent() {
  try {
    await chrome.storage.sync.remove(['selectedUserAgent', 'selectedCustomUserAgent']);
    const response = await chrome.runtime.sendMessage({ action: 'resetUserAgent' });
    
    if (response && response.success) {
      radios.forEach(radio => radio.checked = false);
      customUaSelect.value = '';
      showStatus('User agent réinitialisé', 'success');
    } else {
      throw new Error(response?.error || 'Réponse inattendue du service worker');
    }
  } catch (error) {
    console.error('Erreur lors du reset:', error);
    showStatus('Erreur lors de la réinitialisation', 'error');
  }
}

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
        loadCustomUserAgentsList();
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

// Show/hide custom UA management
editCustomUaBtn.addEventListener('click', () => {
  customUaManagement.style.display = customUaManagement.style.display === 'none' ? 'block' : 'none';
  if (customUaManagement.style.display === 'block') {
    loadCustomUserAgentsList();
  }
});

closeManagementBtn.addEventListener('click', () => {
  customUaManagement.style.display = 'none';
  customUaInput.value = '';
});

// Supprimer un UA personnalisé
async function deleteCustomUA(uaToDelete) {
  try {
    const result = await chrome.storage.sync.get({customUserAgents: []});
    let customUAs = result.customUserAgents;
    customUAs = customUAs.filter(ua => ua !== uaToDelete);
    await chrome.storage.sync.set({ customUserAgents: customUAs });
    
    // Check if the deleted UA was currently active and reset if so
    const currentSettings = await chrome.storage.sync.get(['selectedCustomUserAgent']);
    if (currentSettings.selectedCustomUserAgent === uaToDelete) {
      await resetUserAgent();
    }
    
    loadCustomUserAgents();
    loadCustomUserAgentsList();
    showStatus('User agent personnalisé supprimé', 'success');
  } catch (error) {
    console.error('Erreur lors de la suppression:', error);
    showStatus('Erreur lors de la suppression', 'error');
  }
}

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

// Charger les UAs personnalisés dans la liste de gestion
async function loadCustomUserAgentsList() {
  try {
    const result = await chrome.storage.sync.get({customUserAgents: []});
    const customUAs = result.customUserAgents;
    customUaList.innerHTML = '';
    
    if (customUAs.length === 0) {
      customUaList.innerHTML = '<div class="custom-ua-item"><span class="custom-ua-text">Aucun User Agent personnalisé</span></div>';
      return;
    }
    
    customUAs.forEach(ua => {
      const item = document.createElement('div');
      item.className = 'custom-ua-item';
      
      const textSpan = document.createElement('span');
      textSpan.className = 'custom-ua-text';
      textSpan.textContent = ua;
      
      const deleteBtn = document.createElement('button');
      deleteBtn.className = 'btn btn-small btn-secondary';
      deleteBtn.textContent = 'Supprimer';
      deleteBtn.addEventListener('click', () => deleteCustomUA(ua));
      
      item.appendChild(textSpan);
      item.appendChild(deleteBtn);
      customUaList.appendChild(item);
    });
  } catch (error) {
    console.error('Erreur lors du chargement des UAs personnalisés:', error);
  }
}

// Assurer la sélection mutuellement exclusive et appliquer immédiatement
radios.forEach(radio => {
  radio.addEventListener('change', async () => {
    if (radio.checked) {
      customUaSelect.value = '';
      await applyUserAgent();
    }
  });
});

customUaSelect.addEventListener('change', async () => {
  if (customUaSelect.value) {
    radios.forEach(radio => radio.checked = false);
    await applyUserAgent();
  }
});

// Double-click sur le titre pour reset
document.querySelector('.header h2').addEventListener('dblclick', resetUserAgent);

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
  const browserNames = { chrome: 'Chrome', safari: 'Safari', edge: 'Edge' };
  const osNames = { windows: 'Windows', macos: 'macOS', linux: 'Linux' };
  return `${browserNames[browser] || browser} sur ${osNames[os] || os}`;
}