/**
 * Unit tests for Settings functionality in Meta Editor
 * Tests: loadAISettings, saveAISettings, validateEndpoint, openSettingsModal, closeSettingsModal
 */

// Mock DOM elements needed for Settings functionality
const mockSettingsDOM = () => {
  document.body.innerHTML = `
    <div id="settings-modal" class="modal" style="display: none;">
      <div class="modal-content">
        <div class="modal-header">
          <h3>Settings</h3>
          <span class="close" id="settings-close">&times;</span>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label for="ollama-endpoint">Ollama Endpoint URL</label>
            <input type="url" id="ollama-endpoint" value="http://localhost:11434">
            <span class="validation-message" id="endpoint-validation"></span>
          </div>
          <div class="form-group">
            <button type="button" id="fetch-models-btn" class="btn btn-secondary">
              <i class="fas fa-sync"></i> Fetch Available Models
            </button>
            <span id="fetch-status" class="status-text"></span>
          </div>
          <div class="form-group" id="model-selection-group" style="display: none;">
            <label for="preferred-model">Preferred Model</label>
            <select id="preferred-model">
              <option value="">Select a model...</option>
            </select>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" id="settings-cancel" class="btn btn-secondary">Cancel</button>
          <button type="button" id="settings-save" class="btn btn-primary">Save Settings</button>
        </div>
      </div>
    </div>
    <div id="status-message">Version 0.2</div>
  `;
};

// Extract Settings functions for testing
const createSettingsFunctions = () => {
  // Mock DOM elements
  const settingsModal = document.getElementById('settings-modal');
  const ollamaEndpointInput = document.getElementById('ollama-endpoint');
  const fetchStatus = document.getElementById('fetch-status');
  const modelSelectionGroup = document.getElementById('model-selection-group');
  const preferredModelSelect = document.getElementById('preferred-model');
  const endpointValidation = document.getElementById('endpoint-validation');
  const statusMessage = document.getElementById('status-message');

  // Settings state
  let aiSettings = {
    ollamaEndpoint: 'http://localhost:11434',
    preferredModel: ''
  };

  function loadAISettings() {
    try {
      const saved = localStorage.getItem('aiSettings');
      if (saved) {
        aiSettings = { ...aiSettings, ...JSON.parse(saved) };
      }
    } catch (error) {
      console.error('Error loading AI settings:', error);
    }
    return aiSettings;
  }

  function saveAISettings() {
    try {
      localStorage.setItem('aiSettings', JSON.stringify(aiSettings));
      return true;
    } catch (error) {
      console.error('Error saving AI settings:', error);
      return false;
    }
  }

  function openSettingsModal() {
    loadAISettings();
    ollamaEndpointInput.value = aiSettings.ollamaEndpoint;
    preferredModelSelect.value = aiSettings.preferredModel;
    
    // Hide model selection initially
    modelSelectionGroup.style.display = 'none';
    fetchStatus.textContent = '';
    endpointValidation.textContent = '';
    
    settingsModal.style.display = 'block';
  }

  function closeSettingsModal() {
    settingsModal.style.display = 'none';
  }

  function validateEndpoint(url) {
    try {
      new URL(url);
      return url.startsWith('http://') || url.startsWith('https://');
    } catch {
      return false;
    }
  }

  function formatBytes(bytes) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  }

  function saveSettings() {
    const endpoint = ollamaEndpointInput.value.trim();
    
    if (!validateEndpoint(endpoint)) {
      endpointValidation.textContent = 'Please enter a valid URL';
      return false;
    }
    
    aiSettings.ollamaEndpoint = endpoint;
    aiSettings.preferredModel = preferredModelSelect.value;
    
    const success = saveAISettings();
    if (success) {
      closeSettingsModal();
      statusMessage.textContent = 'Settings saved successfully';
    }
    return success;
  }

  // Return functions for testing
  return {
    loadAISettings,
    saveAISettings,
    openSettingsModal,
    closeSettingsModal,
    validateEndpoint,
    formatBytes,
    saveSettings,
    get aiSettings() { return aiSettings; },
    set aiSettings(value) { aiSettings = value; }
  };
};

describe('Settings Functionality', () => {
  let settingsFunctions;

  beforeEach(() => {
    // Reset DOM and localStorage before each test
    mockSettingsDOM();
    localStorage.clear();
    settingsFunctions = createSettingsFunctions();
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe('loadAISettings', () => {
    test('loads default settings when localStorage is empty', () => {
      const settings = settingsFunctions.loadAISettings();
      expect(settings.ollamaEndpoint).toBe('http://localhost:11434');
      expect(settings.preferredModel).toBe('');
    });

    test('loads saved settings from localStorage', () => {
      const savedSettings = {
        ollamaEndpoint: 'http://custom:8080',
        preferredModel: 'llama2'
      };
      localStorage.setItem('aiSettings', JSON.stringify(savedSettings));

      const settings = settingsFunctions.loadAISettings();
      expect(settings.ollamaEndpoint).toBe('http://custom:8080');
      expect(settings.preferredModel).toBe('llama2');
    });

    test('handles invalid JSON in localStorage gracefully', () => {
      localStorage.setItem('aiSettings', 'invalid-json');
      
      const settings = settingsFunctions.loadAISettings();
      expect(settings.ollamaEndpoint).toBe('http://localhost:11434');
      expect(settings.preferredModel).toBe('');
    });
  });

  describe('saveAISettings', () => {
    test('saves settings to localStorage successfully', () => {
      settingsFunctions.aiSettings = {
        ollamaEndpoint: 'http://test:9090',
        preferredModel: 'mistral'
      };

      const success = settingsFunctions.saveAISettings();
      expect(success).toBe(true);

      const saved = JSON.parse(localStorage.getItem('aiSettings'));
      expect(saved.ollamaEndpoint).toBe('http://test:9090');
      expect(saved.preferredModel).toBe('mistral');
    });

    test('handles localStorage errors gracefully', () => {
      // Mock localStorage to throw error
      const originalSetItem = Storage.prototype.setItem;
      Storage.prototype.setItem = jest.fn(() => {
        throw new Error('Storage quota exceeded');
      });

      const success = settingsFunctions.saveAISettings();
      expect(success).toBe(false);

      // Restore original setItem
      Storage.prototype.setItem = originalSetItem;
    });
  });

  describe('validateEndpoint', () => {
    test('validates correct HTTP URLs', () => {
      expect(settingsFunctions.validateEndpoint('http://localhost:11434')).toBe(true);
      expect(settingsFunctions.validateEndpoint('http://192.168.1.100:8080')).toBe(true);
    });

    test('validates correct HTTPS URLs', () => {
      expect(settingsFunctions.validateEndpoint('https://api.example.com')).toBe(true);
      expect(settingsFunctions.validateEndpoint('https://localhost:11434')).toBe(true);
    });

    test('rejects invalid URLs', () => {
      expect(settingsFunctions.validateEndpoint('invalid-url')).toBe(false);
      expect(settingsFunctions.validateEndpoint('ftp://example.com')).toBe(false);
      expect(settingsFunctions.validateEndpoint('')).toBe(false);
      expect(settingsFunctions.validateEndpoint('just-text')).toBe(false);
    });

    test('rejects non-HTTP(S) protocols', () => {
      expect(settingsFunctions.validateEndpoint('file:///path/to/file')).toBe(false);
      expect(settingsFunctions.validateEndpoint('ws://localhost:8080')).toBe(false);
    });
  });

  describe('formatBytes', () => {
    test('formats bytes correctly', () => {
      expect(settingsFunctions.formatBytes(0)).toBe('0 B');
      expect(settingsFunctions.formatBytes(1024)).toBe('1 KB');
      expect(settingsFunctions.formatBytes(1048576)).toBe('1 MB');
      expect(settingsFunctions.formatBytes(1073741824)).toBe('1 GB');
    });

    test('formats partial units correctly', () => {
      expect(settingsFunctions.formatBytes(1536)).toBe('1.5 KB');
      expect(settingsFunctions.formatBytes(2621440)).toBe('2.5 MB');
    });
  });

  describe('openSettingsModal', () => {
    test('opens modal and loads current settings', () => {
      const modal = document.getElementById('settings-modal');
      const endpointInput = document.getElementById('ollama-endpoint');
      const modelSelect = document.getElementById('preferred-model');
      const modelGroup = document.getElementById('model-selection-group');

      settingsFunctions.openSettingsModal();

      expect(modal.style.display).toBe('block');
      expect(endpointInput.value).toBe('http://localhost:11434');
      expect(modelSelect.value).toBe('');
      expect(modelGroup.style.display).toBe('none');
    });

    test('clears previous validation messages', () => {
      const fetchStatus = document.getElementById('fetch-status');
      const endpointValidation = document.getElementById('endpoint-validation');
      
      // Set some initial content
      fetchStatus.textContent = 'Previous message';
      endpointValidation.textContent = 'Previous error';

      settingsFunctions.openSettingsModal();

      expect(fetchStatus.textContent).toBe('');
      expect(endpointValidation.textContent).toBe('');
    });
  });

  describe('closeSettingsModal', () => {
    test('hides the settings modal', () => {
      const modal = document.getElementById('settings-modal');
      modal.style.display = 'block';

      settingsFunctions.closeSettingsModal();

      expect(modal.style.display).toBe('none');
    });
  });

  describe('saveSettings', () => {
    test('saves valid settings successfully', () => {
      const endpointInput = document.getElementById('ollama-endpoint');
      const modelSelect = document.getElementById('preferred-model');
      const statusMessage = document.getElementById('status-message');

      // Add the model option first
      const option = document.createElement('option');
      option.value = 'llama2';
      option.textContent = 'llama2';
      modelSelect.appendChild(option);

      endpointInput.value = 'http://custom:8080';
      modelSelect.value = 'llama2';

      const success = settingsFunctions.saveSettings();

      expect(success).toBe(true);
      expect(settingsFunctions.aiSettings.ollamaEndpoint).toBe('http://custom:8080');
      expect(settingsFunctions.aiSettings.preferredModel).toBe('llama2');
      expect(statusMessage.textContent).toBe('Settings saved successfully');
    });

    test('rejects invalid endpoint URL', () => {
      const endpointInput = document.getElementById('ollama-endpoint');
      const endpointValidation = document.getElementById('endpoint-validation');

      endpointInput.value = 'invalid-url';

      const success = settingsFunctions.saveSettings();

      expect(success).toBe(false);
      expect(endpointValidation.textContent).toBe('Please enter a valid URL');
    });

    test('trims whitespace from endpoint input', () => {
      const endpointInput = document.getElementById('ollama-endpoint');
      
      endpointInput.value = '  http://localhost:11434  ';

      const success = settingsFunctions.saveSettings();

      expect(success).toBe(true);
      expect(settingsFunctions.aiSettings.ollamaEndpoint).toBe('http://localhost:11434');
    });
  });
});