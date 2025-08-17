/**
 * Unit tests for validation functions in Meta Editor
 * Tests: validateFilename, validateTitle, validateDate, validateSummary, formatDate
 */

// Mock DOM elements that validation functions expect
const mockDOM = () => {
  document.body.innerHTML = `
    <input id="filename" value="" />
    <span id="filename-validation"></span>
    <input id="title" value="" />
    <span id="title-validation"></span>
    <input id="date" value="" />
    <span id="date-validation"></span>
    <textarea id="summary"></textarea>
    <span id="summary-validation"></span>
    <span id="summary-count">0/250</span>
  `;
};

// Extract validation functions from script.js for testing
// We'll need to simulate the script environment
const createValidationFunctions = () => {
  // Mock DOM elements
  const filenameInput = document.getElementById('filename');
  const titleInput = document.getElementById('title');
  const dateInput = document.getElementById('date');
  const summaryInput = document.getElementById('summary');
  const summaryCount = document.getElementById('summary-count');
  const filenameValidation = document.getElementById('filename-validation');
  const titleValidation = document.getElementById('title-validation');
  const dateValidation = document.getElementById('date-validation');
  const summaryValidation = document.getElementById('summary-validation');

  // Validation functions extracted from script.js
  function validateFilename() {
    const filename = filenameInput.value.trim();
    
    if (filename.length === 0) {
      filenameValidation.textContent = 'Filename is required for download';
      return false;
    }
    
    // Check if filename has an extension
    if (filename.includes('.')) {
      // If it has an extension, it must be .md
      if (!filename.endsWith('.md')) {
        filenameValidation.textContent = 'Only .md extension is allowed';
        return false;
      }
      
      // Check if the base filename (without extension) is valid
      const baseFilename = filename.substring(0, filename.lastIndexOf('.'));
      const baseFilenameRegex = /^[a-z0-9-]+$/;
      
      if (!baseFilenameRegex.test(baseFilename)) {
        filenameValidation.textContent = 'Filename must be lowercase with hyphens only';
        return false;
      }
    } else {
      // No extension, just check if the filename is valid
      const filenameRegex = /^[a-z0-9-]+$/;
      
      if (!filenameRegex.test(filename)) {
        filenameValidation.textContent = 'Filename must be lowercase with hyphens only';
        return false;
      }
    }
    
    // If we got here, the filename is valid
    filenameValidation.textContent = '';
    return true;
  }
  
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
    const charCount = summary.length;
    summaryCount.textContent = `\${charCount}/250`;

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

  function formatDate(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    
    return `\${year}-\${month}-\${day} \${hours}:\${minutes}`;
  }

  return {
    validateFilename,
    validateTitle,
    validateDate,
    validateSummary,
    formatDate,
    filenameInput,
    titleInput,
    dateInput,
    summaryInput,
    filenameValidation,
    titleValidation,
    dateValidation,
    summaryValidation,
    summaryCount
  };
};

describe('Validation Functions', () => {
  let validationFunctions;

  beforeEach(() => {
    mockDOM();
    validationFunctions = createValidationFunctions();
  });

  describe('validateFilename', () => {
    it('should return false for empty filename', () => {
      validationFunctions.filenameInput.value = '';
      const result = validationFunctions.validateFilename();
      expect(result).toBe(false);
      expect(validationFunctions.filenameValidation.textContent).toBe('Filename is required for download');
    });

    it('should return true for valid filename without extension', () => {
      validationFunctions.filenameInput.value = 'my-blog-post';
      const result = validationFunctions.validateFilename();
      expect(result).toBe(true);
      expect(validationFunctions.filenameValidation.textContent).toBe('');
    });

    it('should return true for valid filename with .md extension', () => {
      validationFunctions.filenameInput.value = 'my-blog-post.md';
      const result = validationFunctions.validateFilename();
      expect(result).toBe(true);
      expect(validationFunctions.filenameValidation.textContent).toBe('');
    });

    it('should return false for filename with invalid extension', () => {
      validationFunctions.filenameInput.value = 'my-blog-post.txt';
      const result = validationFunctions.validateFilename();
      expect(result).toBe(false);
      expect(validationFunctions.filenameValidation.textContent).toBe('Only .md extension is allowed');
    });

    it('should return false for filename with uppercase letters', () => {
      validationFunctions.filenameInput.value = 'My-Blog-Post';
      const result = validationFunctions.validateFilename();
      expect(result).toBe(false);
      expect(validationFunctions.filenameValidation.textContent).toBe('Filename must be lowercase with hyphens only');
    });

    it('should return false for filename with spaces', () => {
      validationFunctions.filenameInput.value = 'my blog post';
      const result = validationFunctions.validateFilename();
      expect(result).toBe(false);
      expect(validationFunctions.filenameValidation.textContent).toBe('Filename must be lowercase with hyphens only');
    });

    it('should return false for filename with special characters', () => {
      validationFunctions.filenameInput.value = 'my_blog@post';
      const result = validationFunctions.validateFilename();
      expect(result).toBe(false);
      expect(validationFunctions.filenameValidation.textContent).toBe('Filename must be lowercase with hyphens only');
    });

    it('should return true for filename with numbers and hyphens', () => {
      validationFunctions.filenameInput.value = 'blog-post-2023-01';
      const result = validationFunctions.validateFilename();
      expect(result).toBe(true);
      expect(validationFunctions.filenameValidation.textContent).toBe('');
    });
  });

  describe('validateTitle', () => {
    it('should return false for empty title', () => {
      validationFunctions.titleInput.value = '';
      const result = validationFunctions.validateTitle();
      expect(result).toBe(false);
      expect(validationFunctions.titleValidation.textContent).toBe('Title is required');
    });

    it('should return false for title shorter than 5 characters', () => {
      validationFunctions.titleInput.value = 'Hi';
      const result = validationFunctions.validateTitle();
      expect(result).toBe(false);
      expect(validationFunctions.titleValidation.textContent).toBe('Title should be at least 5 characters');
    });

    it('should return true for valid title', () => {
      validationFunctions.titleInput.value = 'My Blog Post Title';
      const result = validationFunctions.validateTitle();
      expect(result).toBe(true);
      expect(validationFunctions.titleValidation.textContent).toBe('');
    });

    it('should trim whitespace and validate', () => {
      validationFunctions.titleInput.value = '  Valid Title  ';
      const result = validationFunctions.validateTitle();
      expect(result).toBe(true);
      expect(validationFunctions.titleValidation.textContent).toBe('');
    });

    it('should return false for title with only spaces', () => {
      validationFunctions.titleInput.value = '     ';
      const result = validationFunctions.validateTitle();
      expect(result).toBe(false);
      expect(validationFunctions.titleValidation.textContent).toBe('Title is required');
    });
  });

  describe('validateDate', () => {
    it('should return false for empty date', () => {
      validationFunctions.dateInput.value = '';
      const result = validationFunctions.validateDate();
      expect(result).toBe(false);
      expect(validationFunctions.dateValidation.textContent).toBe('Date is required');
    });

    it('should return true for valid date', () => {
      validationFunctions.dateInput.value = '2023-12-01T10:30';
      const result = validationFunctions.validateDate();
      expect(result).toBe(true);
      expect(validationFunctions.dateValidation.textContent).toBe('');
    });
  });

  describe('validateSummary', () => {
    it('should return false for empty summary', () => {
      validationFunctions.summaryInput.value = '';
      const result = validationFunctions.validateSummary();
      expect(result).toBe(false);
      expect(validationFunctions.summaryValidation.textContent).toBe('Summary is required');
      expect(validationFunctions.summaryCount.textContent).toBe('0/250');
    });

    it('should return false for summary shorter than 10 characters', () => {
      validationFunctions.summaryInput.value = 'Short';
      const result = validationFunctions.validateSummary();
      expect(result).toBe(false);
      expect(validationFunctions.summaryValidation.textContent).toBe('Summary should be at least 10 characters');
      expect(validationFunctions.summaryCount.textContent).toBe('5/250');
    });

    it('should return true for valid summary', () => {
      validationFunctions.summaryInput.value = 'This is a valid summary that meets the minimum length requirement.';
      const result = validationFunctions.validateSummary();
      expect(result).toBe(true);
      expect(validationFunctions.summaryValidation.textContent).toBe('');
      expect(validationFunctions.summaryCount.textContent).toBe('66/250');
    });

    it('should handle maximum length summary', () => {
      const longSummary = 'a'.repeat(250);
      validationFunctions.summaryInput.value = longSummary;
      const result = validationFunctions.validateSummary();
      expect(result).toBe(true);
      expect(validationFunctions.summaryCount.textContent).toBe('250/250');
    });

    it('should trim whitespace and validate', () => {
      validationFunctions.summaryInput.value = '  This is a valid summary with whitespace  ';
      const result = validationFunctions.validateSummary();
      expect(result).toBe(true);
      expect(validationFunctions.summaryValidation.textContent).toBe('');
    });
  });

  describe('formatDate', () => {
    it('should format datetime-local input correctly', () => {
      const result = validationFunctions.formatDate('2023-12-01T10:30');
      expect(result).toBe('2023-12-01 10:30');
    });

    it('should format ISO date correctly', () => {
      const result = validationFunctions.formatDate('2023-12-01T10:30:00.000Z');
      // Note: This will depend on timezone, but format should be consistent
      expect(result).toMatch(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/);
    });

    it('should handle Date object input', () => {
      const date = new Date('2023-12-01T10:30:00');
      const result = validationFunctions.formatDate(date.toISOString());
      expect(result).toMatch(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/);
    });

    it('should pad single digits correctly', () => {
      const result = validationFunctions.formatDate('2023-01-05T08:05');
      expect(result).toBe('2023-01-05 08:05');
    });
  });
});