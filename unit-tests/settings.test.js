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
            <label for="ollama-server">Server Address</label>
            <input type="text" id="ollama-server" value="localhost">
            <span class="validation-message" id="server-validation"></span>
          </div>
          <div class="form-group">
            <label for="ollama-port">Port Number</label>
            <input type="number" id="ollama-port" value="11434" min="1" max="65535">
            <span class="validation-message" id="port-validation"></span>
          </div>
          <div class="form-group">
            <label class="checkbox-label">
              <input type="checkbox" id="ollama-secure">
              <span class="checkbox-text">Use HTTPS (secure connection)</span>
            </label>
          </div>
          <div class="form-group">
            <label for="generated-endpoint">Generated Endpoint URL</label>
            <input type="text" id="generated-endpoint" value="http://localhost:11434" readonly>
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
  const ollamaServerInput = document.getElementById('ollama-server');
  const ollamaPortInput = document.getElementById('ollama-port');
  const ollamaSecureCheckbox = document.getElementById('ollama-secure');
  const generatedEndpointInput = document.getElementById('generated-endpoint');
  const fetchStatus = document.getElementById('fetch-status');
  const modelSelectionGroup = document.getElementById('model-selection-group');
  const preferredModelSelect = document.getElementById('preferred-model');
  const serverValidation = document.getElementById('server-validation');
  const portValidation = document.getElementById('port-validation');
  const statusMessage = document.getElementById('status-message');

  // Settings state
  let aiSettings = {
    ollamaEndpoint: 'http://localhost:11434', // Backward compatibility
    ollamaServer: 'localhost',
    ollamaPort: 11434,
    ollamaSecure: false,
    preferredModel: ''
  };

  function migrateOldEndpoint(endpoint) {
    try {
      const url = new URL(endpoint);
      return {
        ollamaServer: url.hostname,
        ollamaPort: parseInt(url.port || (url.protocol === 'https:' ? '443' : '80'), 10),
        ollamaSecure: url.protocol === 'https:'
      };
    } catch {
      // If parsing fails, return defaults
      return {
        ollamaServer: 'localhost',
        ollamaPort: 11434,
        ollamaSecure: false
      };
    }
  }

  function loadAISettings() {
    try {
      const saved = localStorage.getItem('aiSettings');
      if (saved) {
        const savedSettings = JSON.parse(saved);

        // Backward compatibility: migrate old endpoint format
        if (savedSettings.ollamaEndpoint && !savedSettings.ollamaServer) {
          const migrated = migrateOldEndpoint(savedSettings.ollamaEndpoint);
          savedSettings.ollamaServer = migrated.ollamaServer;
          savedSettings.ollamaPort = migrated.ollamaPort;
          savedSettings.ollamaSecure = migrated.ollamaSecure;
        }

        aiSettings = { ...aiSettings, ...savedSettings };

        // Update ollamaEndpoint for backward compatibility
        aiSettings.ollamaEndpoint = generateEndpointURL(
          aiSettings.ollamaServer,
          aiSettings.ollamaPort,
          aiSettings.ollamaSecure
        ) || aiSettings.ollamaEndpoint;
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

    // Populate the new separate fields
    ollamaServerInput.value = aiSettings.ollamaServer;
    ollamaPortInput.value = aiSettings.ollamaPort;
    ollamaSecureCheckbox.checked = aiSettings.ollamaSecure;
    preferredModelSelect.value = aiSettings.preferredModel;

    // Update the generated endpoint display
    updateEndpointDisplay();

    // Hide model selection initially
    modelSelectionGroup.style.display = 'none';
    fetchStatus.textContent = '';
    serverValidation.textContent = '';
    portValidation.textContent = '';

    settingsModal.style.display = 'block';
  }

  function closeSettingsModal() {
    settingsModal.style.display = 'none';
  }

  function validateServer(server) {
    if (!server || typeof server !== 'string') return false;
    server = server.trim();

    // Check for empty string
    if (server.length === 0) return false;

    // Check for invalid characters (no spaces, basic validation)
    if (/\s/.test(server)) return false;

    // Allow localhost, IP addresses, and domain names
    // This is a basic validation - more complex regex could be used
    const serverPattern = /^([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+$|^localhost$|^(\d{1,3}\.){3}\d{1,3}$/;
    return serverPattern.test(server);
  }

  function validatePort(port) {
    if (port == null) return false;
    const trimmedPort = String(port).trim();
    const portNum = parseInt(trimmedPort, 10);
    return !isNaN(portNum) && portNum >= 1 && portNum <= 65535;
  }

  function generateEndpointURL(server, port, secure) {
    if (!validateServer(server) || !validatePort(port)) {
      return '';
    }

    const protocol = secure ? 'https' : 'http';
    return `${protocol}://${server}:${port}`;
  }

  function updateEndpointDisplay() {
    const server = ollamaServerInput.value.trim();
    const port = ollamaPortInput.value.trim();
    const secure = ollamaSecureCheckbox.checked;

    const generatedURL = generateEndpointURL(server, port, secure);
    generatedEndpointInput.value = generatedURL || 'Invalid configuration';

    // Clear validation messages if inputs are valid
    if (validateServer(server)) {
      serverValidation.textContent = '';
    }
    if (validatePort(port)) {
      portValidation.textContent = '';
    }
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
    const server = ollamaServerInput.value.trim();
    const port = ollamaPortInput.value.trim();
    const secure = ollamaSecureCheckbox.checked;

    // Validate individual components
    if (!validateServer(server)) {
      serverValidation.textContent = 'Please enter a valid server address';
      return false;
    }

    if (!validatePort(port)) {
      portValidation.textContent = 'Please enter a valid port number (1-65535)';
      return false;
    }

    // Generate endpoint URL for backward compatibility
    const endpoint = generateEndpointURL(server, port, secure);
    if (!endpoint) {
      fetchStatus.textContent = 'Invalid server configuration';
      fetchStatus.className = 'status-text error';
      return false;
    }

    // Update settings with both new and legacy format
    aiSettings.ollamaServer = server;
    aiSettings.ollamaPort = parseInt(port, 10);
    aiSettings.ollamaSecure = secure;
    aiSettings.ollamaEndpoint = endpoint; // Backward compatibility
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
    validateServer,
    validatePort,
    generateEndpointURL,
    updateEndpointDisplay,
    migrateOldEndpoint,
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
      const serverInput = document.getElementById('ollama-server');
      const portInput = document.getElementById('ollama-port');
      const secureCheckbox = document.getElementById('ollama-secure');
      const generatedEndpoint = document.getElementById('generated-endpoint');
      const modelSelect = document.getElementById('preferred-model');
      const modelGroup = document.getElementById('model-selection-group');

      settingsFunctions.openSettingsModal();

      expect(modal.style.display).toBe('block');
      expect(serverInput.value).toBe('localhost');
      expect(portInput.value).toBe('11434');
      expect(secureCheckbox.checked).toBe(false);
      expect(generatedEndpoint.value).toBe('http://localhost:11434');
      expect(modelSelect.value).toBe('');
      expect(modelGroup.style.display).toBe('none');
    });

    test('clears previous validation messages', () => {
      const fetchStatus = document.getElementById('fetch-status');
      const serverValidation = document.getElementById('server-validation');
      const portValidation = document.getElementById('port-validation');

      // Set some initial content
      fetchStatus.textContent = 'Previous message';
      serverValidation.textContent = 'Previous error';
      portValidation.textContent = 'Previous error';

      settingsFunctions.openSettingsModal();

      expect(fetchStatus.textContent).toBe('');
      expect(serverValidation.textContent).toBe('');
      expect(portValidation.textContent).toBe('');
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
      const serverInput = document.getElementById('ollama-server');
      const portInput = document.getElementById('ollama-port');
      const secureCheckbox = document.getElementById('ollama-secure');
      const modelSelect = document.getElementById('preferred-model');
      const statusMessage = document.getElementById('status-message');

      // Add the model option first
      const option = document.createElement('option');
      option.value = 'llama2';
      option.textContent = 'llama2';
      modelSelect.appendChild(option);

      serverInput.value = 'custom.server.com';
      portInput.value = '8080';
      secureCheckbox.checked = true;
      modelSelect.value = 'llama2';

      const success = settingsFunctions.saveSettings();

      expect(success).toBe(true);
      expect(settingsFunctions.aiSettings.ollamaServer).toBe('custom.server.com');
      expect(settingsFunctions.aiSettings.ollamaPort).toBe(8080);
      expect(settingsFunctions.aiSettings.ollamaSecure).toBe(true);
      expect(settingsFunctions.aiSettings.ollamaEndpoint).toBe('https://custom.server.com:8080');
      expect(settingsFunctions.aiSettings.preferredModel).toBe('llama2');
      expect(statusMessage.textContent).toBe('Settings saved successfully');
    });

    test('rejects invalid server address', () => {
      const serverInput = document.getElementById('ollama-server');
      const serverValidation = document.getElementById('server-validation');

      serverInput.value = 'invalid server address';

      const success = settingsFunctions.saveSettings();

      expect(success).toBe(false);
      expect(serverValidation.textContent).toBe('Please enter a valid server address');
    });

    test('rejects invalid port number', () => {
      const portInput = document.getElementById('ollama-port');
      const portValidation = document.getElementById('port-validation');

      portInput.value = '70000';

      const success = settingsFunctions.saveSettings();

      expect(success).toBe(false);
      expect(portValidation.textContent).toBe('Please enter a valid port number (1-65535)');
    });

    test('trims whitespace from endpoint input', () => {
      const serverInput = document.getElementById('ollama-server');
      const portInput = document.getElementById('ollama-port');

      // Test trimming with text input (which allows whitespace)
      serverInput.value = '  localhost  ';
      portInput.value = '11434'; // number inputs don't preserve whitespace, so test with the function directly

      // Test that the validation functions handle whitespace correctly
      expect(settingsFunctions.validateServer('  localhost  ')).toBe(true);
      expect(settingsFunctions.validatePort('  11434  ')).toBe(true);

      const success = settingsFunctions.saveSettings();

      expect(success).toBe(true);
      expect(settingsFunctions.aiSettings.ollamaServer).toBe('localhost');
      expect(settingsFunctions.aiSettings.ollamaPort).toBe(11434);
    });
  });

  describe('validateServer', () => {
    test('validates localhost', () => {
      expect(settingsFunctions.validateServer('localhost')).toBe(true);
    });

    test('validates IP addresses', () => {
      expect(settingsFunctions.validateServer('192.168.1.100')).toBe(true);
      expect(settingsFunctions.validateServer('10.0.0.1')).toBe(true);
    });

    test('validates domain names', () => {
      expect(settingsFunctions.validateServer('example.com')).toBe(true);
      expect(settingsFunctions.validateServer('sub.example.com')).toBe(true);
    });

    test('rejects invalid servers', () => {
      expect(settingsFunctions.validateServer('')).toBe(false);
      expect(settingsFunctions.validateServer(' ')).toBe(false);
      expect(settingsFunctions.validateServer('server with spaces')).toBe(false);
      expect(settingsFunctions.validateServer(null)).toBe(false);
      expect(settingsFunctions.validateServer(undefined)).toBe(false);
    });
  });

  describe('validatePort', () => {
    test('validates valid port numbers', () => {
      expect(settingsFunctions.validatePort('80')).toBe(true);
      expect(settingsFunctions.validatePort('443')).toBe(true);
      expect(settingsFunctions.validatePort('11434')).toBe(true);
      expect(settingsFunctions.validatePort('65535')).toBe(true);
      expect(settingsFunctions.validatePort(80)).toBe(true);
    });

    test('rejects invalid port numbers', () => {
      expect(settingsFunctions.validatePort('0')).toBe(false);
      expect(settingsFunctions.validatePort('65536')).toBe(false);
      expect(settingsFunctions.validatePort('-1')).toBe(false);
      expect(settingsFunctions.validatePort('abc')).toBe(false);
      expect(settingsFunctions.validatePort('')).toBe(false);
      expect(settingsFunctions.validatePort(null)).toBe(false);
    });
  });

  describe('generateEndpointURL', () => {
    test('generates HTTP URLs correctly', () => {
      expect(settingsFunctions.generateEndpointURL('localhost', 11434, false)).toBe('http://localhost:11434');
      expect(settingsFunctions.generateEndpointURL('192.168.1.100', 8080, false)).toBe('http://192.168.1.100:8080');
    });

    test('generates HTTPS URLs correctly', () => {
      expect(settingsFunctions.generateEndpointURL('localhost', 11434, true)).toBe('https://localhost:11434');
      expect(settingsFunctions.generateEndpointURL('example.com', 443, true)).toBe('https://example.com:443');
    });

    test('returns empty string for invalid inputs', () => {
      expect(settingsFunctions.generateEndpointURL('invalid server', 11434, false)).toBe('');
      expect(settingsFunctions.generateEndpointURL('localhost', 70000, false)).toBe('');
      expect(settingsFunctions.generateEndpointURL('', 11434, false)).toBe('');
    });
  });

  describe('migrateOldEndpoint', () => {
    test('migrates HTTP endpoints correctly', () => {
      const result = settingsFunctions.migrateOldEndpoint('http://localhost:11434');
      expect(result.ollamaServer).toBe('localhost');
      expect(result.ollamaPort).toBe(11434);
      expect(result.ollamaSecure).toBe(false);
    });

    test('migrates HTTPS endpoints correctly', () => {
      const result = settingsFunctions.migrateOldEndpoint('https://example.com:8443');
      expect(result.ollamaServer).toBe('example.com');
      expect(result.ollamaPort).toBe(8443);
      expect(result.ollamaSecure).toBe(true);
    });

    test('handles URLs without explicit ports', () => {
      const result = settingsFunctions.migrateOldEndpoint('http://example.com');
      expect(result.ollamaServer).toBe('example.com');
      expect(result.ollamaPort).toBe(80);
      expect(result.ollamaSecure).toBe(false);

      const httpsResult = settingsFunctions.migrateOldEndpoint('https://example.com');
      expect(httpsResult.ollamaServer).toBe('example.com');
      expect(httpsResult.ollamaPort).toBe(443);
      expect(httpsResult.ollamaSecure).toBe(true);
    });

    test('returns defaults for invalid URLs', () => {
      const result = settingsFunctions.migrateOldEndpoint('invalid-url');
      expect(result.ollamaServer).toBe('localhost');
      expect(result.ollamaPort).toBe(11434);
      expect(result.ollamaSecure).toBe(false);
    });
  });

  describe('Backward Compatibility', () => {
    test('migrates old settings format on load', () => {
      // Save old format settings
      const oldSettings = {
        ollamaEndpoint: 'https://custom.server.com:8443',
        preferredModel: 'llama2'
      };
      localStorage.setItem('aiSettings', JSON.stringify(oldSettings));

      // Create new settings functions (this should trigger migration)
      const newFunctions = createSettingsFunctions();
      const settings = newFunctions.loadAISettings();

      expect(settings.ollamaServer).toBe('custom.server.com');
      expect(settings.ollamaPort).toBe(8443);
      expect(settings.ollamaSecure).toBe(true);
      expect(settings.ollamaEndpoint).toBe('https://custom.server.com:8443');
      expect(settings.preferredModel).toBe('llama2');
    });

    test('preserves new format settings', () => {
      // Save new format settings
      const newSettings = {
        ollamaServer: 'localhost',
        ollamaPort: 9999,
        ollamaSecure: true,
        preferredModel: 'codellama'
      };
      localStorage.setItem('aiSettings', JSON.stringify(newSettings));

      const functions = createSettingsFunctions();
      const settings = functions.loadAISettings();

      expect(settings.ollamaServer).toBe('localhost');
      expect(settings.ollamaPort).toBe(9999);
      expect(settings.ollamaSecure).toBe(true);
      expect(settings.ollamaEndpoint).toBe('https://localhost:9999');
      expect(settings.preferredModel).toBe('codellama');
    });
  });
});