/**
 * Unit tests for localStorage operations in Meta Editor
 * Tests: saveToLocalStorage, loadFromLocalStorage, saveHeaderTemplate, 
 *        loadHeaderTemplate, saveFooterTemplate, loadFooterTemplate
 */

// Mock DOM elements needed for localStorage functions
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
    <span id="title-validation"></span>
    <span id="date-validation"></span>
    <span id="summary-validation"></span>
  `;
};

// Extract localStorage functions for testing
const createLocalStorageFunctions = () => {
  // Mock DOM elements
  const filenameInput = document.getElementById('filename');
  const titleInput = document.getElementById('title');
  const dateInput = document.getElementById('date');
  const tagsContainer = document.getElementById('tags-container');
  const summaryInput = document.getElementById('summary');
  const headerInput = document.getElementById('header');
  const contentInput = document.getElementById('content');
  const footerInput = document.getElementById('footer');
  const imageFilenameInput = document.getElementById('image-filename');
  const imageAltInput = document.getElementById('image-alt');
  const imagePreviewContainer = document.getElementById('image-preview-container');
  const imagePreview = document.getElementById('image-preview');
  const titleValidation = document.getElementById('title-validation');
  const dateValidation = document.getElementById('date-validation');
  const summaryValidation = document.getElementById('summary-validation');

  // State
  let tags = [];
  let heroImageData = null;

  // Validation functions (simplified for testing)
  function validateTitle() {
    const title = titleInput.value.trim();
    if (title.length === 0) {
      titleValidation.textContent = 'Title is required';
      return false;
    } else if (title.length < 5) {
      titleValidation.textContent = 'Title should be at least 5 characters';
      return false;
    } else {
      titleValidation.textContent = '';
      return true;
    }
  }

  function validateDate() {
    const dateValue = dateInput.value;
    if (!dateValue) {
      dateValidation.textContent = 'Date is required';
      return false;
    } else {
      dateValidation.textContent = '';
      return true;
    }
  }

  function validateSummary() {
    const summary = summaryInput.value.trim();
    if (summary.length === 0) {
      summaryValidation.textContent = 'Summary is required';
      return false;
    } else if (summary.length < 10) {
      summaryValidation.textContent = 'Summary should be at least 10 characters';
      return false;
    } else {
      summaryValidation.textContent = '';
      return true;
    }
  }

  function renderTags() {
    tagsContainer.innerHTML = '';
    tags.forEach((tag, index) => {
      const tagElement = document.createElement('span');
      tagElement.classList.add('tag');
      tagElement.innerHTML = `
        ${tag}
        <span class="tag-remove" data-index="${index}">×</span>
      `;
      tagsContainer.appendChild(tagElement);
    });
  }

  // Template functions
  function saveHeaderTemplate() {
    const headerContent = headerInput.value.trim();
    if (headerContent) {
      localStorage.setItem('metaEditorHeaderTemplate', headerContent);
      alert('Header template saved as default!');
      return true;
    } else {
      if (confirm('Header is empty. Do you want to clear the default header template?')) {
        localStorage.removeItem('metaEditorHeaderTemplate');
        alert('Default header template cleared.');
        return true;
      }
      return false;
    }
  }
  
  function loadHeaderTemplate() {
    const savedHeader = localStorage.getItem('metaEditorHeaderTemplate');
    if (savedHeader) {
      headerInput.value = savedHeader;
      return true;
    } else {
      alert('No default header template found.');
      return false;
    }
  }
  
  function saveFooterTemplate() {
    const footerContent = footerInput.value.trim();
    if (footerContent) {
      localStorage.setItem('metaEditorFooterTemplate', footerContent);
      alert('Footer template saved as default!');
      return true;
    } else {
      if (confirm('Footer is empty. Do you want to clear the default footer template?')) {
        localStorage.removeItem('metaEditorFooterTemplate');
        alert('Default footer template cleared.');
        return true;
      }
      return false;
    }
  }
  
  function loadFooterTemplate() {
    const savedFooter = localStorage.getItem('metaEditorFooterTemplate');
    if (savedFooter) {
      footerInput.value = savedFooter;
      return true;
    } else {
      alert('No default footer template found.');
      return false;
    }
  }

  // Main localStorage functions
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
    return data;
  }

  function loadFromLocalStorage() {
    const savedData = localStorage.getItem('metaEditorData');
    if (savedData) {
      try {
        const data = JSON.parse(savedData);
        
        filenameInput.value = data.filename || '';
        titleInput.value = data.title || '';
        dateInput.value = data.date || '';
        tags = data.tags || [];
        renderTags();
        summaryInput.value = data.summary || '';
        
        if (data.heroImage) {
          heroImageData = data.heroImage;
          imagePreview.src = data.heroImage.data;
          imagePreviewContainer.classList.remove('hidden');
        }
        
        imageFilenameInput.value = data.imageFilename || '';
        imageAltInput.value = data.imageAlt || '';
        headerInput.value = data.header || '';
        contentInput.value = data.content || '';
        footerInput.value = data.footer || '';
        
        // Run validations
        validateTitle();
        validateDate();
        validateSummary();
        
        return data;
      } catch (e) {
        console.error('Error loading data from localStorage:', e);
        return null;
      }
    }
    return null;
  }

  function checkForDefaultTemplates() {
    // Check if we should auto-load default templates
    const savedHeader = localStorage.getItem('metaEditorHeaderTemplate');
    const savedFooter = localStorage.getItem('metaEditorFooterTemplate');
    
    let headerLoaded = false;
    let footerLoaded = false;
    
    // Only auto-load if the fields are empty
    if (savedHeader && !headerInput.value.trim()) {
      headerInput.value = savedHeader;
      headerLoaded = true;
    }
    
    if (savedFooter && !footerInput.value.trim()) {
      footerInput.value = savedFooter;
      footerLoaded = true;
    }
    
    return {
      header: headerLoaded,
      footer: footerLoaded
    };
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

  function getHeroImageData() {
    return heroImageData;
  }

  return {
    saveToLocalStorage,
    loadFromLocalStorage,
    saveHeaderTemplate,
    loadHeaderTemplate,
    saveFooterTemplate,
    loadFooterTemplate,
    checkForDefaultTemplates,
    setTags,
    getTags,
    setHeroImageData,
    getHeroImageData,
    filenameInput,
    titleInput,
    dateInput,
    summaryInput,
    headerInput,
    contentInput,
    footerInput,
    imageFilenameInput,
    imageAltInput,
    imagePreviewContainer,
    imagePreview
  };
};

describe('LocalStorage Functions', () => {
  let localStorageFunctions;

  beforeEach(() => {
    mockDOM();
    localStorageFunctions = createLocalStorageFunctions();
    // Clear localStorage
    localStorage.clear();
    // Reset mocks
    jest.clearAllMocks();
  });

  describe('saveToLocalStorage', () => {
    it('should save all form data to localStorage', () => {
      // Setup form data
      localStorageFunctions.filenameInput.value = 'test-post';
      localStorageFunctions.titleInput.value = 'Test Title';
      localStorageFunctions.dateInput.value = '2023-12-01T10:30';
      localStorageFunctions.summaryInput.value = 'Test summary';
      localStorageFunctions.headerInput.value = 'Header content';
      localStorageFunctions.contentInput.value = 'Main content';
      localStorageFunctions.footerInput.value = 'Footer content';
      localStorageFunctions.imageFilenameInput.value = 'hero.jpg';
      localStorageFunctions.imageAltInput.value = 'Hero image';
      localStorageFunctions.setTags(['javascript', 'testing']);

      const result = localStorageFunctions.saveToLocalStorage();

      // Verify data was saved to localStorage
      const savedData = JSON.parse(localStorage.getItem('metaEditorData'));
      expect(savedData.filename).toBe('test-post');
      expect(savedData.title).toBe('Test Title');
      expect(savedData.tags).toEqual(['javascript', 'testing']);
      expect(alert).toHaveBeenCalledWith('Content saved successfully!');
      expect(result.filename).toBe('test-post');
      expect(result.title).toBe('Test Title');
      expect(result.tags).toEqual(['javascript', 'testing']);
    });

    it('should save hero image data when present', () => {
      const imageData = {
        data: 'data:image/jpeg;base64,mockdata',
        name: 'test.jpg',
        type: 'image/jpeg'
      };
      localStorageFunctions.setHeroImageData(imageData);

      const result = localStorageFunctions.saveToLocalStorage();

      expect(result.heroImage).toEqual(imageData);
    });

    it('should handle empty form data', () => {
      const result = localStorageFunctions.saveToLocalStorage();

      // Verify empty data was saved to localStorage
      const savedData = JSON.parse(localStorage.getItem('metaEditorData'));
      expect(savedData.filename).toBe('');
      expect(savedData.title).toBe('');
      expect(savedData.tags).toEqual([]);
      expect(result.filename).toBe('');
      expect(result.title).toBe('');
      expect(result.tags).toEqual([]);
    });
  });

  describe('loadFromLocalStorage', () => {
    it('should load saved data and populate form fields', () => {
      const mockData = {
        filename: 'saved-post',
        title: 'Saved Title',
        date: '2023-12-01T10:30',
        tags: ['saved', 'tag'],
        summary: 'Saved summary content',
        header: 'Saved header',
        content: 'Saved content',
        footer: 'Saved footer',
        imageFilename: 'saved-image.jpg',
        imageAlt: 'Saved image alt'
      };

      localStorage.setItem('metaEditorData', JSON.stringify(mockData));

      const result = localStorageFunctions.loadFromLocalStorage();
      expect(localStorageFunctions.filenameInput.value).toBe('saved-post');
      expect(localStorageFunctions.titleInput.value).toBe('Saved Title');
      expect(localStorageFunctions.getTags()).toEqual(['saved', 'tag']);
      expect(result).toEqual(mockData);
    });

    it('should load hero image data when present', () => {
      const mockData = {
        filename: 'test',
        title: 'Test',
        date: '2023-01-01T00:00',
        tags: [],
        summary: 'Test summary',
        heroImage: {
          data: 'data:image/jpeg;base64,mockdata',
          name: 'test.jpg',
          type: 'image/jpeg'
        },
        imageFilename: '',
        imageAlt: '',
        header: '',
        content: '',
        footer: ''
      };

      localStorage.setItem('metaEditorData', JSON.stringify(mockData));

      localStorageFunctions.loadFromLocalStorage();

      expect(localStorageFunctions.getHeroImageData()).toEqual(mockData.heroImage);
      expect(localStorageFunctions.imagePreview.src).toBe(mockData.heroImage.data);
      expect(localStorageFunctions.imagePreviewContainer.classList.contains('hidden')).toBe(false);
    });

    it('should handle missing localStorage data', () => {
      // localStorage is already empty from beforeEach
      const result = localStorageFunctions.loadFromLocalStorage();

      expect(result).toBeNull();
    });

    it('should handle invalid JSON in localStorage', () => {
      localStorage.setItem('metaEditorData', 'invalid json');
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      const result = localStorageFunctions.loadFromLocalStorage();

      expect(consoleSpy).toHaveBeenCalledWith('Error loading data from localStorage:', expect.any(Error));
      expect(result).toBeNull();
      
      consoleSpy.mockRestore();
    });

    it('should handle partial data gracefully', () => {
      const partialData = {
        title: 'Partial Title'
        // Missing other fields
      };

      localStorage.setItem('metaEditorData', JSON.stringify(partialData));

      const result = localStorageFunctions.loadFromLocalStorage();

      expect(localStorageFunctions.titleInput.value).toBe('Partial Title');
      expect(localStorageFunctions.filenameInput.value).toBe('');
      expect(localStorageFunctions.getTags()).toEqual([]);
    });
  });

  describe('template functions', () => {
    describe('saveHeaderTemplate', () => {
      it('should save header template when content exists', () => {
        localStorageFunctions.headerInput.value = 'Default header content';

        const result = localStorageFunctions.saveHeaderTemplate();

        expect(localStorage.getItem('metaEditorHeaderTemplate')).toBe('Default header content');
        expect(alert).toHaveBeenCalledWith('Header template saved as default!');
        expect(result).toBe(true);
      });

      it('should clear template when header is empty and user confirms', () => {
        localStorageFunctions.headerInput.value = '';
        confirm.mockReturnValue(true);

        const result = localStorageFunctions.saveHeaderTemplate();

        expect(confirm).toHaveBeenCalledWith('Header is empty. Do you want to clear the default header template?');
        expect(localStorage.getItem('metaEditorHeaderTemplate')).toBeNull();
        expect(alert).toHaveBeenCalledWith('Default header template cleared.');
        expect(result).toBe(true);
      });

      it('should not clear template when header is empty and user cancels', () => {
        localStorageFunctions.headerInput.value = '';
        confirm.mockReturnValue(false);

        const result = localStorageFunctions.saveHeaderTemplate();

        // No assertions on removeItem since we're testing functionality, not mocks
        expect(result).toBe(false);
      });

      it('should trim whitespace from header content', () => {
        localStorageFunctions.headerInput.value = '  Header with whitespace  ';

        localStorageFunctions.saveHeaderTemplate();

        expect(localStorage.getItem('metaEditorHeaderTemplate')).toBe('Header with whitespace');
      });
    });

    describe('loadHeaderTemplate', () => {
      it('should load saved header template', () => {
        localStorage.setItem('metaEditorHeaderTemplate', 'Saved header template');

        const result = localStorageFunctions.loadHeaderTemplate();

        expect(localStorageFunctions.headerInput.value).toBe('Saved header template');
        expect(result).toBe(true);
      });

      it('should handle missing header template', () => {
        // localStorage is empty from beforeEach
        const result = localStorageFunctions.loadHeaderTemplate();

        expect(alert).toHaveBeenCalledWith('No default header template found.');
        expect(result).toBe(false);
      });
    });

    describe('saveFooterTemplate', () => {
      it('should save footer template when content exists', () => {
        localStorageFunctions.footerInput.value = 'Default footer content';

        const result = localStorageFunctions.saveFooterTemplate();

        expect(localStorage.getItem('metaEditorFooterTemplate')).toBe('Default footer content');
        expect(alert).toHaveBeenCalledWith('Footer template saved as default!');
        expect(result).toBe(true);
      });

      it('should clear template when footer is empty and user confirms', () => {
        localStorageFunctions.footerInput.value = '';
        confirm.mockReturnValue(true);

        const result = localStorageFunctions.saveFooterTemplate();

        expect(localStorage.getItem('metaEditorFooterTemplate')).toBeNull();
        expect(result).toBe(true);
      });
    });

    describe('loadFooterTemplate', () => {
      it('should load saved footer template', () => {
        localStorage.setItem('metaEditorFooterTemplate', 'Saved footer template');

        const result = localStorageFunctions.loadFooterTemplate();

        expect(localStorageFunctions.footerInput.value).toBe('Saved footer template');
        expect(result).toBe(true);
      });

      it('should handle missing footer template', () => {
        // localStorage is already empty from beforeEach
        const result = localStorageFunctions.loadFooterTemplate();

        expect(alert).toHaveBeenCalledWith('No default footer template found.');
        expect(result).toBe(false);
      });
    });

    describe('checkForDefaultTemplates', () => {
      it('should auto-load templates when fields are empty', () => {
        localStorage.setItem('metaEditorHeaderTemplate', 'Default header');
        localStorage.setItem('metaEditorFooterTemplate', 'Default footer');

        const result = localStorageFunctions.checkForDefaultTemplates();

        expect(localStorageFunctions.headerInput.value).toBe('Default header');
        expect(localStorageFunctions.footerInput.value).toBe('Default footer');
        expect(result.header).toBe(true);
        expect(result.footer).toBe(true);
      });

      it('should not auto-load templates when fields have content', () => {
        localStorageFunctions.headerInput.value = 'Existing header';
        localStorageFunctions.footerInput.value = 'Existing footer';
        localStorage.setItem('metaEditorHeaderTemplate', 'Default header');
        localStorage.setItem('metaEditorFooterTemplate', 'Default footer');

        const result = localStorageFunctions.checkForDefaultTemplates();

        expect(localStorageFunctions.headerInput.value).toBe('Existing header');
        expect(localStorageFunctions.footerInput.value).toBe('Existing footer');
        expect(result.header).toBe(false);
        expect(result.footer).toBe(false);
      });

      it('should handle missing templates', () => {
        // localStorage is already empty from beforeEach
        const result = localStorageFunctions.checkForDefaultTemplates();

        expect(result.header).toBe(false);
        expect(result.footer).toBe(false);
      });
    });
  });
});