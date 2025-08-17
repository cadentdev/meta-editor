/**
 * Unit tests for UI State Management functions in Meta Editor
 * Tests: loadUIState, saveUIState, applyUIState, toggleZenMode, toggleUIElement, 
 *        updateZenModeMenuText, updateToolbarMenuText
 */

// Mock DOM elements that UI functions expect
const mockDOM = () => {
  document.body.innerHTML = `
    <div id="toolbar" class="toolbar"></div>
    <div class="menu-action" data-action="toggle-zen" id="zen-toggle-menu">Show All Meta Data</div>
    <div class="menu-action" data-action="toggle-toolbar" id="toolbar-toggle-menu">Hide Toolbar</div>
    <div id="status-message">Version 0.2</div>
    <div class="input-section">
      <h2>Meta Data</h2>
      <div class="form-group">
        <label>Title</label>
        <input id="title" />
      </div>
      <div class="form-group">
        <label>Date</label>
        <input id="date" />
      </div>
      <div class="form-group">
        <h2>Content</h2>
        <textarea id="content"></textarea>
      </div>
    </div>
  `;
};

// Extract UI state management functions for testing
const createUIStateFunctions = () => {
  // Mock DOM elements
  const toolbar = document.getElementById('toolbar');
  const zenToggleMenu = document.getElementById('zen-toggle-menu');
  const toolbarToggleMenu = document.getElementById('toolbar-toggle-menu');
  const statusMessage = document.getElementById('status-message');
  
  // UI state object
  const uiState = {
    toolbar: true,
    zenMode: true
  };

  function updateZenModeMenuText() {
    const zenToggleMenu = document.getElementById('zen-toggle-menu');
    if (zenToggleMenu) {
      zenToggleMenu.textContent = uiState.zenMode ? 'Show All Meta Data' : 'Hide All (Zen Mode)';
    }
  }
  
  function updateToolbarMenuText() {
    const toolbarToggleMenu = document.getElementById('toolbar-toggle-menu');
    if (toolbarToggleMenu) {
      toolbarToggleMenu.textContent = uiState.toolbar ? 'Hide Toolbar' : 'Show Toolbar';
    }
  }

  function loadUIState() {
    const savedState = localStorage.getItem('metaEditorUIState');
    if (savedState) {
      try {
        const parsedState = JSON.parse(savedState);
        // Load toolbar state if available
        if (parsedState.hasOwnProperty('toolbar')) {
          uiState.toolbar = parsedState.toolbar;
        }
        // Always start in Zen Mode regardless of saved state
        uiState.zenMode = true;
      } catch (e) {
        console.error('Error loading UI state:', e);
      }
    }
  }
  
  function saveUIState() {
    localStorage.setItem('metaEditorUIState', JSON.stringify(uiState));
  }
  
  function applyUIState() {
    // Apply toolbar visibility
    if (uiState.toolbar) {
      toolbar.classList.remove('hidden');
    } else {
      toolbar.classList.add('hidden');
    }
    
    // Apply zen mode state
    if (uiState.zenMode) {
      // Hide all form groups except content
      const formGroups = document.querySelectorAll('.form-group');
      formGroups.forEach(group => {
        const contentTextarea = group.querySelector('#content');
        if (!contentTextarea) {
          group.style.display = 'none';
        }
      });
      
      // Hide the frontmatter header
      const frontmatterHeader = document.querySelector('.input-section h2');
      if (frontmatterHeader) {
        frontmatterHeader.style.display = 'none';
      }
      
      statusMessage.textContent = 'Zen Mode - Focus on writing';
    } else {
      // Show all form groups
      const formGroups = document.querySelectorAll('.form-group');
      formGroups.forEach(group => {
        group.style.display = '';
      });
      
      // Show the frontmatter header
      const frontmatterHeader = document.querySelector('.input-section h2');
      if (frontmatterHeader) {
        frontmatterHeader.style.display = '';
      }
      
      if (statusMessage.textContent === 'Zen Mode - Focus on writing') {
        statusMessage.textContent = 'Version 0.2';
      }
    }
  }
  
  function toggleUIElement(elementName) {
    if (uiState.hasOwnProperty(elementName)) {
      uiState[elementName] = !uiState[elementName];
      applyUIState();
      saveUIState();
      if (elementName === 'toolbar') {
        updateToolbarMenuText();
      }
    }
  }
  
  function toggleZenMode() {
    // Toggle between zen mode and show all
    uiState.zenMode = !uiState.zenMode;
    applyUIState();
    saveUIState();
    updateZenModeMenuText();
  }
  
  function enableZenMode() {
    // Enable zen mode - hide all form fields except content and preview
    uiState.zenMode = true;
    uiState.toolbar = false;
    applyUIState();
    saveUIState();
    updateZenModeMenuText();
  }
  
  function showAllUIElements() {
    // Show all UI elements and exit zen mode
    uiState.zenMode = false;
    uiState.toolbar = true;
    applyUIState();
    saveUIState();
    updateZenModeMenuText();
  }

  return {
    uiState,
    updateZenModeMenuText,
    updateToolbarMenuText,
    loadUIState,
    saveUIState,
    applyUIState,
    toggleUIElement,
    toggleZenMode,
    enableZenMode,
    showAllUIElements,
    toolbar,
    zenToggleMenu,
    toolbarToggleMenu,
    statusMessage
  };
};

describe('UI State Management Functions', () => {
  let uiStateFunctions;

  beforeEach(() => {
    mockDOM();
    uiStateFunctions = createUIStateFunctions();
    // Reset localStorage mock
    localStorage.getItem.mockReturnValue(null);
    localStorage.setItem.mockClear();
  });

  describe('updateZenModeMenuText', () => {
    it('should update menu text to "Show All Meta Data" when in zen mode', () => {
      uiStateFunctions.uiState.zenMode = true;
      uiStateFunctions.updateZenModeMenuText();
      expect(uiStateFunctions.zenToggleMenu.textContent).toBe('Show All Meta Data');
    });

    it('should update menu text to "Hide All (Zen Mode)" when not in zen mode', () => {
      uiStateFunctions.uiState.zenMode = false;
      uiStateFunctions.updateZenModeMenuText();
      expect(uiStateFunctions.zenToggleMenu.textContent).toBe('Hide All (Zen Mode)');
    });
  });

  describe('updateToolbarMenuText', () => {
    it('should update menu text to "Hide Toolbar" when toolbar is visible', () => {
      uiStateFunctions.uiState.toolbar = true;
      uiStateFunctions.updateToolbarMenuText();
      expect(uiStateFunctions.toolbarToggleMenu.textContent).toBe('Hide Toolbar');
    });

    it('should update menu text to "Show Toolbar" when toolbar is hidden', () => {
      uiStateFunctions.uiState.toolbar = false;
      uiStateFunctions.updateToolbarMenuText();
      expect(uiStateFunctions.toolbarToggleMenu.textContent).toBe('Show Toolbar');
    });
  });

  describe('loadUIState', () => {
    it('should load UI state from localStorage', () => {
      const mockState = { toolbar: false, zenMode: false };
      localStorage.getItem.mockReturnValue(JSON.stringify(mockState));
      
      uiStateFunctions.loadUIState();
      
      expect(localStorage.getItem).toHaveBeenCalledWith('metaEditorUIState');
      expect(uiStateFunctions.uiState.toolbar).toBe(false);
      expect(uiStateFunctions.uiState.zenMode).toBe(true); // Always true regardless of saved state
    });

    it('should handle missing localStorage data', () => {
      localStorage.getItem.mockReturnValue(null);
      
      uiStateFunctions.loadUIState();
      
      expect(localStorage.getItem).toHaveBeenCalledWith('metaEditorUIState');
      // Should maintain default values
      expect(uiStateFunctions.uiState.toolbar).toBe(true);
      expect(uiStateFunctions.uiState.zenMode).toBe(true);
    });

    it('should handle invalid JSON in localStorage', () => {
      localStorage.getItem.mockReturnValue('invalid json');
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      
      uiStateFunctions.loadUIState();
      
      expect(consoleSpy).toHaveBeenCalledWith('Error loading UI state:', expect.any(Error));
      // Should maintain default values
      expect(uiStateFunctions.uiState.toolbar).toBe(true);
      expect(uiStateFunctions.uiState.zenMode).toBe(true);
      
      consoleSpy.mockRestore();
    });
  });

  describe('saveUIState', () => {
    it('should save UI state to localStorage', () => {
      uiStateFunctions.uiState.toolbar = false;
      uiStateFunctions.uiState.zenMode = false;
      
      uiStateFunctions.saveUIState();
      
      expect(localStorage.setItem).toHaveBeenCalledWith(
        'metaEditorUIState',
        JSON.stringify({ toolbar: false, zenMode: false })
      );
    });
  });

  describe('applyUIState', () => {
    it('should show toolbar when toolbar state is true', () => {
      uiStateFunctions.uiState.toolbar = true;
      
      uiStateFunctions.applyUIState();
      
      expect(uiStateFunctions.toolbar.classList.contains('hidden')).toBe(false);
    });

    it('should hide toolbar when toolbar state is false', () => {
      uiStateFunctions.uiState.toolbar = false;
      
      uiStateFunctions.applyUIState();
      
      expect(uiStateFunctions.toolbar.classList.contains('hidden')).toBe(true);
    });

    it('should apply zen mode styling when zenMode is true', () => {
      uiStateFunctions.uiState.zenMode = true;
      
      uiStateFunctions.applyUIState();
      
      // Check that non-content form groups are hidden
      const formGroups = document.querySelectorAll('.form-group');
      const nonContentGroups = Array.from(formGroups).filter(group => 
        !group.querySelector('#content')
      );
      
      nonContentGroups.forEach(group => {
        expect(group.style.display).toBe('none');
      });
      
      // Check that frontmatter header is hidden
      const frontmatterHeader = document.querySelector('.input-section h2');
      expect(frontmatterHeader.style.display).toBe('none');
      
      // Check status message
      expect(uiStateFunctions.statusMessage.textContent).toBe('Zen Mode - Focus on writing');
    });

    it('should show all elements when zenMode is false', () => {
      uiStateFunctions.uiState.zenMode = false;
      // Set initial zen mode message
      uiStateFunctions.statusMessage.textContent = 'Zen Mode - Focus on writing';
      
      uiStateFunctions.applyUIState();
      
      // Check that all form groups are visible
      const formGroups = document.querySelectorAll('.form-group');
      formGroups.forEach(group => {
        expect(group.style.display).toBe('');
      });
      
      // Check that frontmatter header is visible
      const frontmatterHeader = document.querySelector('.input-section h2');
      expect(frontmatterHeader.style.display).toBe('');
      
      // Check status message is reset
      expect(uiStateFunctions.statusMessage.textContent).toBe('Version 0.2');
    });
  });

  describe('toggleUIElement', () => {
    it('should toggle toolbar state and update UI', () => {
      const initialToolbarState = uiStateFunctions.uiState.toolbar;
      
      uiStateFunctions.toggleUIElement('toolbar');
      
      expect(uiStateFunctions.uiState.toolbar).toBe(!initialToolbarState);
      expect(localStorage.setItem).toHaveBeenCalled();
    });

    it('should not affect state for non-existent elements', () => {
      const initialState = { ...uiStateFunctions.uiState };
      
      uiStateFunctions.toggleUIElement('nonexistent');
      
      expect(uiStateFunctions.uiState).toEqual(initialState);
    });
  });

  describe('toggleZenMode', () => {
    it('should toggle zen mode state', () => {
      const initialZenMode = uiStateFunctions.uiState.zenMode;
      
      uiStateFunctions.toggleZenMode();
      
      expect(uiStateFunctions.uiState.zenMode).toBe(!initialZenMode);
      expect(localStorage.setItem).toHaveBeenCalled();
    });
  });

  describe('enableZenMode', () => {
    it('should enable zen mode and hide toolbar', () => {
      uiStateFunctions.uiState.zenMode = false;
      uiStateFunctions.uiState.toolbar = true;
      
      uiStateFunctions.enableZenMode();
      
      expect(uiStateFunctions.uiState.zenMode).toBe(true);
      expect(uiStateFunctions.uiState.toolbar).toBe(false);
      expect(localStorage.setItem).toHaveBeenCalled();
    });
  });

  describe('showAllUIElements', () => {
    it('should disable zen mode and show toolbar', () => {
      uiStateFunctions.uiState.zenMode = true;
      uiStateFunctions.uiState.toolbar = false;
      
      uiStateFunctions.showAllUIElements();
      
      expect(uiStateFunctions.uiState.zenMode).toBe(false);
      expect(uiStateFunctions.uiState.toolbar).toBe(true);
      expect(localStorage.setItem).toHaveBeenCalled();
    });
  });
});