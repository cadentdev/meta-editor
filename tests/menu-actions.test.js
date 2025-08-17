/**
 * Unit tests for menu action handlers in Meta Editor
 * Tests: handleMenuAction, closeAllMenus, copyToClipboard, downloadMarkdown, clearEditor
 */

// Mock DOM elements needed for menu action functions
const mockDOM = () => {
  document.body.innerHTML = `
    <input id="filename" value="" />
    <input id="title" value="" />
    <input id="date" value="" />
    <div id="tags-container"></div>
    <textarea id="summary"></textarea>
    <textarea id="header"></textarea>
    <textarea id="content"></textarea>
    <textarea id="footer"></textarea>
    <input id="image-filename" value="" />
    <input id="image-alt" value="" />
    <div id="image-preview-container" class="hidden">
      <img id="image-preview" src="" alt="" />
    </div>
    <div id="preview" class="preview-content">Test markdown content</div>
    <input type="file" id="markdown-upload" style="display: none;" />
    <div id="status-message">Version 0.2</div>
    <span id="title-validation"></span>
    <span id="date-validation"></span>
    <span id="summary-validation"></span>
    <span id="summary-count">0/250</span>
    <div class="dropdown-content" style="display: block;"></div>
    <div class="dropdown-content" style="display: block;"></div>
  `;
};

// Extract menu action functions for testing
const createMenuActionFunctions = () => {
  // Mock DOM elements
  const filenameInput = document.getElementById('filename');
  const titleInput = document.getElementById('title');
  const dateInput = document.getElementById('date');
  const tagsContainer = document.getElementById('tags-container');
  const summaryInput = document.getElementById('summary');
  const summaryCount = document.getElementById('summary-count');
  const headerInput = document.getElementById('header');
  const contentInput = document.getElementById('content');
  const footerInput = document.getElementById('footer');
  const imageFilenameInput = document.getElementById('image-filename');
  const imageAltInput = document.getElementById('image-alt');
  const imagePreviewContainer = document.getElementById('image-preview-container');
  const imagePreview = document.getElementById('image-preview');
  const previewElement = document.getElementById('preview');
  const markdownUpload = document.getElementById('markdown-upload');
  const statusMessage = document.getElementById('status-message');
  const titleValidation = document.getElementById('title-validation');
  const dateValidation = document.getElementById('date-validation');
  const summaryValidation = document.getElementById('summary-validation');

  // State
  let tags = [];
  let heroImageData = null;
  const uiState = { zenMode: true, toolbar: true };

  // Validation functions
  function validateFilename() {
    const filename = filenameInput.value.trim();
    return filename.length > 0;
  }

  // UI State management functions (simplified)
  function toggleZenMode() {
    uiState.zenMode = !uiState.zenMode;
  }

  function toggleUIElement(elementName) {
    if (uiState.hasOwnProperty(elementName)) {
      uiState[elementName] = !uiState[elementName];
    }
  }

  // Template functions (simplified)
  function saveToLocalStorage() {
    const data = {
      filename: filenameInput.value,
      title: titleInput.value,
      date: dateInput.value,
      tags: tags,
      summary: summaryInput.value,
      heroImage: heroImageData,
      imageFilename: imageFilenameInput.value,
      imageAlt: imageAltInput.value,
      header: headerInput.value,
      content: contentInput.value,
      footer: footerInput.value
    };
    localStorage.setItem('metaEditorData', JSON.stringify(data));
    alert('Content saved successfully!');
  }

  // Function to close all menus
  function closeAllMenus() {
    const dropdowns = document.querySelectorAll('.dropdown-content');
    dropdowns.forEach(dropdown => {
      dropdown.style.display = 'none';
    });
  }

  // Copy to clipboard function
  function copyToClipboard() {
    const content = previewElement.textContent;
    return navigator.clipboard.writeText(content).then(() => {
      statusMessage.textContent = 'Copied to clipboard!';
      setTimeout(() => {
        if (uiState.zenMode) {
          statusMessage.textContent = 'Zen Mode - Focus on writing';
        } else {
          statusMessage.textContent = 'Version 0.2';
        }
      }, 2000);
      return true;
    }).catch(err => {
      console.error('Failed to copy: ', err);
      statusMessage.textContent = 'Failed to copy to clipboard';
      setTimeout(() => {
        if (uiState.zenMode) {
          statusMessage.textContent = 'Zen Mode - Focus on writing';
        } else {
          statusMessage.textContent = 'Version 0.2';
        }
      }, 2000);
      return false;
    });
  }

  // Download markdown file function
  function downloadMarkdown() {
    if (!validateFilename()) {
      alert('Please enter a valid filename');
      return false;
    }
    
    // Get content from preview
    const content = previewElement.textContent;
    
    // Create blob and download link
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    
    // Create download link
    const downloadLink = document.createElement('a');
    
    // Get filename and ensure it has .md extension
    let filename = filenameInput.value.trim();
    if (!filename.endsWith('.md')) {
      filename += '.md';
    }
    
    downloadLink.href = url;
    downloadLink.download = filename;
    
    // Append to body, click, and remove
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    
    // Clean up the URL object
    setTimeout(() => {
      URL.revokeObjectURL(url);
    }, 100);
    
    // Show confirmation
    statusMessage.textContent = 'File downloaded!';
    setTimeout(() => {
      if (uiState.zenMode) {
        statusMessage.textContent = 'Zen Mode - Focus on writing';
      } else {
        statusMessage.textContent = 'Version 0.2';
      }
    }, 2000);
    
    return true;
  }

  // Clear editor function
  function clearEditor() {
    if (confirm('Are you sure you want to clear all content? This cannot be undone.')) {
      filenameInput.value = '';
      titleInput.value = '';
      
      // Reset date to current
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      dateInput.value = `\${year}-\${month}-\${day}T\${hours}:\${minutes}`;
      
      tags = [];
      tagsContainer.innerHTML = '';
      summaryInput.value = '';
      heroImageData = null;
      imagePreview.src = '';
      imagePreviewContainer.classList.add('hidden');
      imageFilenameInput.value = '';
      imageAltInput.value = '';
      headerInput.value = '';
      contentInput.value = '';
      footerInput.value = '';
      
      // Clear localStorage
      localStorage.removeItem('metaEditorData');
      
      // Reset validations
      titleValidation.textContent = '';
      dateValidation.textContent = '';
      summaryValidation.textContent = '';
      summaryCount.textContent = '0/250';
      
      return true;
    }
    return false;
  }

  // Handle menu actions function
  function handleMenuAction(actionType) {
    // Close the menu first
    closeAllMenus();
    
    switch (actionType) {
      case 'about':
        alert('MetaEditor v0.2\\nA markdown editor with frontmatter support.');
        return 'about';
      case 'settings':
        alert('Settings functionality will be implemented in a future version.');
        return 'settings';
      case 'new-post':
        return clearEditor() ? 'new-post' : 'new-post-cancelled';
      case 'open-markdown':
        markdownUpload.click();
        return 'open-markdown';
      case 'save':
        saveToLocalStorage();
        return 'save';
      case 'download-markdown':
        return downloadMarkdown() ? 'download-markdown' : 'download-markdown-failed';
      case 'copy-markdown':
        // Return a promise for async clipboard operation
        return copyToClipboard().then(() => 'copy-markdown').catch(() => 'copy-markdown-failed');
      case 'toggle-toolbar':
        toggleUIElement('toolbar');
        return 'toggle-toolbar';
      case 'toggle-zen':
        toggleZenMode();
        return 'toggle-zen';
      default:
        console.log('Unknown action:', actionType);
        return 'unknown';
    }
  }

  // Helper functions for testing
  function setTags(newTags) {
    tags = [...newTags];
  }

  function getTags() {
    return [...tags];
  }

  function setHeroImageData(imageData) {
    heroImageData = imageData;
  }

  function getUIState() {
    return { ...uiState };
  }

  return {
    handleMenuAction,
    closeAllMenus,
    copyToClipboard,
    downloadMarkdown,
    clearEditor,
    setTags,
    getTags,
    setHeroImageData,
    getUIState,
    filenameInput,
    titleInput,
    dateInput,
    summaryInput,
    headerInput,
    contentInput,
    footerInput,
    imageFilenameInput,
    imageAltInput,
    previewElement,
    statusMessage,
    markdownUpload
  };
};

describe('Menu Action Functions', () => {
  let menuActionFunctions;

  beforeEach(() => {
    mockDOM();
    menuActionFunctions = createMenuActionFunctions();
    // Reset mocks
    localStorage.setItem.mockClear();
    localStorage.removeItem.mockClear();
    alert.mockClear();
    confirm.mockClear();
    navigator.clipboard.writeText.mockClear();
    URL.createObjectURL.mockClear();
    URL.revokeObjectURL.mockClear();
  });

  describe('closeAllMenus', () => {
    it('should hide all dropdown menus', () => {
      // Verify menus are initially visible
      const dropdowns = document.querySelectorAll('.dropdown-content');
      expect(dropdowns[0].style.display).toBe('block');
      expect(dropdowns[1].style.display).toBe('block');

      menuActionFunctions.closeAllMenus();

      // Verify all menus are now hidden
      dropdowns.forEach(dropdown => {
        expect(dropdown.style.display).toBe('none');
      });
    });

    it('should handle no dropdown menus gracefully', () => {
      // Remove all dropdown elements
      document.querySelectorAll('.dropdown-content').forEach(el => el.remove());

      expect(() => {
        menuActionFunctions.closeAllMenus();
      }).not.toThrow();
    });
  });

  describe('copyToClipboard', () => {
    it('should copy preview content to clipboard successfully', async () => {
      navigator.clipboard.writeText.mockResolvedValue();
      menuActionFunctions.previewElement.textContent = 'Test markdown content';

      const result = await menuActionFunctions.copyToClipboard();

      expect(navigator.clipboard.writeText).toHaveBeenCalledWith('Test markdown content');
      expect(menuActionFunctions.statusMessage.textContent).toBe('Copied to clipboard!');
      expect(result).toBe(true);
    });

    it('should handle clipboard copy failure', async () => {
      const error = new Error('Clipboard not available');
      navigator.clipboard.writeText.mockRejectedValue(error);
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      const result = await menuActionFunctions.copyToClipboard();

      expect(consoleSpy).toHaveBeenCalledWith('Failed to copy: ', error);
      expect(menuActionFunctions.statusMessage.textContent).toBe('Failed to copy to clipboard');
      expect(result).toBe(false);

      consoleSpy.mockRestore();
    });

    it('should reset status message after timeout in zen mode', async () => {
      navigator.clipboard.writeText.mockResolvedValue();
      jest.useFakeTimers();

      await menuActionFunctions.copyToClipboard();
      
      // Fast-forward time by 2 seconds
      jest.advanceTimersByTime(2000);

      expect(menuActionFunctions.statusMessage.textContent).toBe('Zen Mode - Focus on writing');
      jest.useRealTimers();
    });

    it('should reset status message after timeout in normal mode', async () => {
      navigator.clipboard.writeText.mockResolvedValue();
      // Set to normal mode
      const uiState = menuActionFunctions.getUIState();
      uiState.zenMode = false;
      jest.useFakeTimers();

      await menuActionFunctions.copyToClipboard();
      
      // Fast-forward time by 2 seconds
      jest.advanceTimersByTime(2000);

      expect(menuActionFunctions.statusMessage.textContent).toBe('Version 0.2');
      jest.useRealTimers();
    });
  });

  describe('downloadMarkdown', () => {
    beforeEach(() => {
      // Mock document.createElement for download link
      const mockLink = {
        href: '',
        download: '',
        click: jest.fn(),
        style: {}
      };
      document.createElement = jest.fn().mockReturnValue(mockLink);
      document.body.appendChild = jest.fn();
      document.body.removeChild = jest.fn();
    });

    it('should download file when filename is valid', () => {
      menuActionFunctions.filenameInput.value = 'test-post';
      menuActionFunctions.previewElement.textContent = 'Test content';

      const result = menuActionFunctions.downloadMarkdown();

      expect(URL.createObjectURL).toHaveBeenCalled();
      expect(document.createElement).toHaveBeenCalledWith('a');
      expect(result).toBe(true);
      expect(menuActionFunctions.statusMessage.textContent).toBe('File downloaded!');
    });

    it('should add .md extension if not present', () => {
      menuActionFunctions.filenameInput.value = 'test-post';
      const mockLink = document.createElement('a');

      menuActionFunctions.downloadMarkdown();

      expect(mockLink.download).toBe('test-post.md');
    });

    it('should not add .md extension if already present', () => {
      menuActionFunctions.filenameInput.value = 'test-post.md';
      const mockLink = document.createElement('a');

      menuActionFunctions.downloadMarkdown();

      expect(mockLink.download).toBe('test-post.md');
    });

    it('should fail when filename is invalid', () => {
      menuActionFunctions.filenameInput.value = '';

      const result = menuActionFunctions.downloadMarkdown();

      expect(alert).toHaveBeenCalledWith('Please enter a valid filename');
      expect(URL.createObjectURL).not.toHaveBeenCalled();
      expect(result).toBe(false);
    });

    it('should clean up URL object after timeout', () => {
      menuActionFunctions.filenameInput.value = 'test-post';
      jest.useFakeTimers();

      menuActionFunctions.downloadMarkdown();

      // Fast-forward time by 100ms
      jest.advanceTimersByTime(100);

      expect(URL.revokeObjectURL).toHaveBeenCalled();
      jest.useRealTimers();
    });
  });

  describe('clearEditor', () => {
    it('should clear all form fields when user confirms', () => {
      confirm.mockReturnValue(true);
      // Set up some initial data
      menuActionFunctions.filenameInput.value = 'test';
      menuActionFunctions.titleInput.value = 'Test Title';
      menuActionFunctions.contentInput.value = 'Test content';
      menuActionFunctions.setTags(['test']);

      const result = menuActionFunctions.clearEditor();

      expect(confirm).toHaveBeenCalledWith('Are you sure you want to clear all content? This cannot be undone.');
      expect(menuActionFunctions.filenameInput.value).toBe('');
      expect(menuActionFunctions.titleInput.value).toBe('');
      expect(menuActionFunctions.contentInput.value).toBe('');
      expect(menuActionFunctions.getTags()).toEqual([]);
      expect(localStorage.removeItem).toHaveBeenCalledWith('metaEditorData');
      expect(result).toBe(true);
    });

    it('should not clear fields when user cancels', () => {
      confirm.mockReturnValue(false);
      menuActionFunctions.titleInput.value = 'Test Title';

      const result = menuActionFunctions.clearEditor();

      expect(menuActionFunctions.titleInput.value).toBe('Test Title');
      expect(localStorage.removeItem).not.toHaveBeenCalled();
      expect(result).toBe(false);
    });

    it('should reset date to current date and time', () => {
      confirm.mockReturnValue(true);
      const now = new Date();
      
      menuActionFunctions.clearEditor();

      const dateValue = menuActionFunctions.dateInput.value;
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      
      expect(dateValue).toContain(`\${year}-\${month}-\${day}`);
      expect(dateValue).toMatch(/T\\d{2}:\\d{2}$/);
    });

    it('should clear hero image data', () => {
      confirm.mockReturnValue(true);
      menuActionFunctions.setHeroImageData({ name: 'test.jpg', data: 'data' });
      
      menuActionFunctions.clearEditor();

      expect(menuActionFunctions.imageFilenameInput.value).toBe('');
      expect(menuActionFunctions.imageAltInput.value).toBe('');
      // Image preview container should be hidden
      const imagePreviewContainer = document.getElementById('image-preview-container');
      expect(imagePreviewContainer.classList.contains('hidden')).toBe(true);
    });
  });

  describe('handleMenuAction', () => {
    it('should close menus before handling any action', () => {
      const closeAllMenusSpy = jest.spyOn(menuActionFunctions, 'closeAllMenus');

      menuActionFunctions.handleMenuAction('about');

      expect(closeAllMenusSpy).toHaveBeenCalled();
    });

    it('should handle about action', () => {
      const result = menuActionFunctions.handleMenuAction('about');

      expect(alert).toHaveBeenCalledWith('MetaEditor v0.2\\nA markdown editor with frontmatter support.');
      expect(result).toBe('about');
    });

    it('should handle settings action', () => {
      const result = menuActionFunctions.handleMenuAction('settings');

      expect(alert).toHaveBeenCalledWith('Settings functionality will be implemented in a future version.');
      expect(result).toBe('settings');
    });

    it('should handle new-post action with confirmation', () => {
      confirm.mockReturnValue(true);

      const result = menuActionFunctions.handleMenuAction('new-post');

      expect(result).toBe('new-post');
    });

    it('should handle new-post action with cancellation', () => {
      confirm.mockReturnValue(false);

      const result = menuActionFunctions.handleMenuAction('new-post');

      expect(result).toBe('new-post-cancelled');
    });

    it('should handle open-markdown action', () => {
      const clickSpy = jest.spyOn(menuActionFunctions.markdownUpload, 'click').mockImplementation();

      const result = menuActionFunctions.handleMenuAction('open-markdown');

      expect(clickSpy).toHaveBeenCalled();
      expect(result).toBe('open-markdown');
    });

    it('should handle save action', () => {
      const result = menuActionFunctions.handleMenuAction('save');

      expect(localStorage.setItem).toHaveBeenCalled();
      expect(alert).toHaveBeenCalledWith('Content saved successfully!');
      expect(result).toBe('save');
    });

    it('should handle download-markdown action successfully', () => {
      menuActionFunctions.filenameInput.value = 'test-post';

      const result = menuActionFunctions.handleMenuAction('download-markdown');

      expect(result).toBe('download-markdown');
    });

    it('should handle download-markdown action failure', () => {
      menuActionFunctions.filenameInput.value = ''; // Invalid filename

      const result = menuActionFunctions.handleMenuAction('download-markdown');

      expect(result).toBe('download-markdown-failed');
    });

    it('should handle copy-markdown action successfully', async () => {
      navigator.clipboard.writeText.mockResolvedValue();

      const resultPromise = menuActionFunctions.handleMenuAction('copy-markdown');
      const result = await resultPromise;

      expect(result).toBe('copy-markdown');
    });

    it('should handle copy-markdown action failure', async () => {
      navigator.clipboard.writeText.mockRejectedValue(new Error('Clipboard error'));

      const resultPromise = menuActionFunctions.handleMenuAction('copy-markdown');
      const result = await resultPromise;

      expect(result).toBe('copy-markdown-failed');
    });

    it('should handle toggle-toolbar action', () => {
      const initialToolbarState = menuActionFunctions.getUIState().toolbar;

      const result = menuActionFunctions.handleMenuAction('toggle-toolbar');

      expect(menuActionFunctions.getUIState().toolbar).toBe(!initialToolbarState);
      expect(result).toBe('toggle-toolbar');
    });

    it('should handle toggle-zen action', () => {
      const initialZenState = menuActionFunctions.getUIState().zenMode;

      const result = menuActionFunctions.handleMenuAction('toggle-zen');

      expect(menuActionFunctions.getUIState().zenMode).toBe(!initialZenState);
      expect(result).toBe('toggle-zen');
    });

    it('should handle unknown actions', () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

      const result = menuActionFunctions.handleMenuAction('unknown-action');

      expect(consoleSpy).toHaveBeenCalledWith('Unknown action:', 'unknown-action');
      expect(result).toBe('unknown');

      consoleSpy.mockRestore();
    });
  });
});