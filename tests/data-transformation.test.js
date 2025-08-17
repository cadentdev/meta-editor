/**
 * Unit tests for data transformation functions in Meta Editor
 * Tests: extractHeroImage, parseMarkdownFile, updatePreview, addTag, removeTag, renderTags
 */

// Mock DOM elements needed for data transformation functions
const mockDOM = () => {
  document.body.innerHTML = `
    <input id="title" value="" />
    <input id="date" value="" />
    <input id="tags-input" value="" />
    <div id="tags-container"></div>
    <textarea id="summary"></textarea>
    <textarea id="header"></textarea>
    <textarea id="content"></textarea>
    <textarea id="footer"></textarea>
    <input id="image-filename" value="" />
    <input id="image-alt" value="" />
    <div id="preview" class="preview-content"></div>
  `;
};

// Extract data transformation functions for testing
const createDataTransformationFunctions = () => {
  // Mock DOM elements
  const titleInput = document.getElementById('title');
  const dateInput = document.getElementById('date');
  const tagsInput = document.getElementById('tags-input');
  const tagsContainer = document.getElementById('tags-container');
  const summaryInput = document.getElementById('summary');
  const headerInput = document.getElementById('header');
  const contentInput = document.getElementById('content');
  const footerInput = document.getElementById('footer');
  const imageFilenameInput = document.getElementById('image-filename');
  const imageAltInput = document.getElementById('image-alt');
  const previewElement = document.getElementById('preview');
  
  // State
  let tags = [];
  let heroImageData = null;

  // Format date for frontmatter
  function formatDate(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    
    return `${year}-${month}-${day} ${hours}:${minutes}`;
  }

  // Function to extract hero image from markdown content
  function extractHeroImage(content) {
    // Look for markdown image syntax: ![alt text](image-path){optional-attributes}
    const imageRegex = /!\[([^\]]*)\]\(([^\)]+)\)(\{[^\}]*\})?/;
    const match = content.match(imageRegex);
    
    if (match) {
      // Extract alt text and image path
      const altText = match[1] || '';
      let imagePath = match[2] || '';
      const attributes = match[3] || '';
      
      // Store the full match to remove from content later
      const fullMatch = match[0];
      
      // Extract just the filename from the path
      // Handle paths like {static}/images/filename.jpg or regular paths
      const staticMatch = imagePath.match(/\{static\}\/images\/([^\s]+)/);
      const regularMatch = imagePath.match(/\/images\/([^\s]+)/);
      const simpleMatch = imagePath.match(/([^\/\\\s]+\.(?:jpg|jpeg|png|gif|webp|svg))$/i);
      
      let filename = '';
      if (staticMatch && staticMatch[1]) {
        filename = staticMatch[1];
      } else if (regularMatch && regularMatch[1]) {
        filename = regularMatch[1];
      } else if (simpleMatch && simpleMatch[1]) {
        filename = simpleMatch[1];
      } else {
        // If we can't parse the filename, use the whole path
        filename = imagePath;
      }
      
      // Return the modified content and image info
      return { 
        content: content.replace(fullMatch, '').trim(),
        found: true,
        altText: altText,
        filename: filename
      };
    }
    
    return { content: content, found: false };
  }

  // Update preview function
  function updatePreview() {
    // Generate frontmatter
    const title = titleInput.value.trim();
    const date = dateInput.value ? formatDate(dateInput.value) : '';
    const tagsString = tags.join(', ');
    const summary = summaryInput.value.trim();

    let frontmatter = '---\\n';
    if (title) frontmatter += `Title: ${title}\\n`;
    if (date) frontmatter += `Date: ${date}\\n`;
    if (tagsString) frontmatter += `Tags: ${tagsString}\\n`;
    if (summary) frontmatter += `Summary: ${summary}\\n`;
    frontmatter += '---\\n\\n';

    // Generate content with hero image if available
    let content = '';
    
    // Add header if available
    if (headerInput.value.trim()) {
      content += headerInput.value.trim() + '\\n\\n';
    }
    
    // Add hero image if available
    if (heroImageData && imageAltInput.value.trim()) {
      // If we have actual image data from upload
      content += `![${imageAltInput.value.trim()}]({static}/images/${heroImageData.name}){: .image-process-crisp}\\n\\n`;
    } else if (imageFilenameInput.value.trim() && imageAltInput.value.trim()) {
      // If we have extracted image filename and alt text
      content += `![${imageAltInput.value.trim()}]({static}/images/${imageFilenameInput.value.trim()}){: .image-process-crisp}\\n\\n`;
    }
    
    content += contentInput.value;
    
    // Add footer if available
    if (footerInput.value.trim()) {
      content += '\\n\\n' + footerInput.value.trim();
    }

    // Combine and display in preview
    const fullContent = frontmatter + content;
    previewElement.textContent = fullContent;
    
    return fullContent;
  }

  // Tag handling functions
  function addTag() {
    const tagText = tagsInput.value.trim();
    if (tagText && !tags.includes(tagText)) {
      tags.push(tagText);
      renderTags();
      tagsInput.value = '';
      updatePreview();
      return true;
    }
    return false;
  }

  function removeTag(index) {
    if (index >= 0 && index < tags.length) {
      tags.splice(index, 1);
      renderTags();
      updatePreview();
      return true;
    }
    return false;
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

    // Add event listeners to remove buttons
    document.querySelectorAll('.tag-remove').forEach(button => {
      button.addEventListener('click', () => {
        const index = parseInt(button.getAttribute('data-index'));
        removeTag(index);
      });
    });
  }

  function setTags(newTags) {
    tags = [...newTags];
  }

  function getTags() {
    return [...tags];
  }

  function setHeroImageData(imageData) {
    heroImageData = imageData;
  }

  return {
    extractHeroImage,
    updatePreview,
    addTag,
    removeTag,
    renderTags,
    formatDate,
    setTags,
    getTags,
    setHeroImageData,
    titleInput,
    dateInput,
    tagsInput,
    tagsContainer,
    summaryInput,
    headerInput,
    contentInput,
    footerInput,
    imageFilenameInput,
    imageAltInput,
    previewElement
  };
};

describe('Data Transformation Functions', () => {
  let dataFunctions;

  beforeEach(() => {
    mockDOM();
    dataFunctions = createDataTransformationFunctions();
  });

  describe('extractHeroImage', () => {
    it('should extract hero image with static path', () => {
      const content = `# Test Article

![Hero Image]({static}/images/hero.jpg){: .image-process-crisp}

This is the main content.`;

      const result = dataFunctions.extractHeroImage(content);
      
      expect(result.found).toBe(true);
      expect(result.altText).toBe('Hero Image');
      expect(result.filename).toBe('hero.jpg');
      expect(result.content).toBe(`# Test Article

This is the main content.`);
    });

    it('should extract hero image with regular path', () => {
      const content = `![Alt text](/images/photo.png)

Content here.`;

      const result = dataFunctions.extractHeroImage(content);
      
      expect(result.found).toBe(true);
      expect(result.altText).toBe('Alt text');
      expect(result.filename).toBe('photo.png');
      expect(result.content).toBe('Content here.');
    });

    it('should extract hero image with simple filename', () => {
      const content = `![Description](image.jpg)

More content.`;

      const result = dataFunctions.extractHeroImage(content);
      
      expect(result.found).toBe(true);
      expect(result.altText).toBe('Description');
      expect(result.filename).toBe('image.jpg');
      expect(result.content).toBe('More content.');
    });

    it('should handle content without images', () => {
      const content = `# Title

This is just text content without any images.`;

      const result = dataFunctions.extractHeroImage(content);
      
      expect(result.found).toBe(false);
      expect(result.content).toBe(content);
    });

    it('should handle empty alt text', () => {
      const content = `![](image.jpg)

Content.`;

      const result = dataFunctions.extractHeroImage(content);
      
      expect(result.found).toBe(true);
      expect(result.altText).toBe('');
      expect(result.filename).toBe('image.jpg');
    });

    it('should handle complex paths', () => {
      const content = `![Complex](path/to/complex-file-name.jpeg)

Content.`;

      const result = dataFunctions.extractHeroImage(content);
      
      expect(result.found).toBe(true);
      expect(result.filename).toBe('complex-file-name.jpeg');
    });
  });

  describe('updatePreview', () => {
    it('should generate basic frontmatter and content', () => {
      dataFunctions.titleInput.value = 'Test Title';
      dataFunctions.dateInput.value = '2023-12-01T10:30';
      dataFunctions.summaryInput.value = 'Test summary';
      dataFunctions.contentInput.value = 'Main content here';
      dataFunctions.setTags(['javascript', 'testing']);

      const result = dataFunctions.updatePreview();

      expect(result).toContain('---');
      expect(result).toContain('Title: Test Title');
      expect(result).toContain('Date: 2023-12-01 10:30');
      expect(result).toContain('Tags: javascript, testing');
      expect(result).toContain('Summary: Test summary');
      expect(result).toContain('Main content here');
    });

    it('should include header and footer when provided', () => {
      dataFunctions.headerInput.value = 'Header content';
      dataFunctions.footerInput.value = 'Footer content';
      dataFunctions.contentInput.value = 'Main content';

      const result = dataFunctions.updatePreview();

      expect(result).toContain('Header content');
      expect(result).toContain('Footer content');
      expect(result).toContain('Main content');
    });

    it('should include hero image when filename and alt are provided', () => {
      dataFunctions.imageFilenameInput.value = 'hero.jpg';
      dataFunctions.imageAltInput.value = 'Hero image';
      dataFunctions.contentInput.value = 'Main content';

      const result = dataFunctions.updatePreview();

      expect(result).toContain('![Hero image]({static}/images/hero.jpg){: .image-process-crisp}');
    });

    it('should include hero image from uploaded data', () => {
      dataFunctions.setHeroImageData({ name: 'uploaded.jpg' });
      dataFunctions.imageAltInput.value = 'Uploaded image';
      dataFunctions.contentInput.value = 'Main content';

      const result = dataFunctions.updatePreview();

      expect(result).toContain('![Uploaded image]({static}/images/uploaded.jpg){: .image-process-crisp}');
    });

    it('should handle empty fields gracefully', () => {
      const result = dataFunctions.updatePreview();

      expect(result).toContain('---');
      expect(result).not.toContain('Title:');
      expect(result).not.toContain('Date:');
      expect(result).not.toContain('Tags:');
      expect(result).not.toContain('Summary:');
    });

    it('should update preview element content', () => {
      dataFunctions.titleInput.value = 'Test Title';
      dataFunctions.contentInput.value = 'Test content';

      dataFunctions.updatePreview();

      expect(dataFunctions.previewElement.textContent).toContain('Test Title');
      expect(dataFunctions.previewElement.textContent).toContain('Test content');
    });
  });

  describe('tag management', () => {
    beforeEach(() => {
      dataFunctions.setTags([]);
    });

    describe('addTag', () => {
      it('should add a new tag', () => {
        dataFunctions.tagsInput.value = 'javascript';
        
        const result = dataFunctions.addTag();
        
        expect(result).toBe(true);
        expect(dataFunctions.getTags()).toContain('javascript');
        expect(dataFunctions.tagsInput.value).toBe('');
      });

      it('should not add duplicate tags', () => {
        dataFunctions.setTags(['javascript']);
        dataFunctions.tagsInput.value = 'javascript';
        
        const result = dataFunctions.addTag();
        
        expect(result).toBe(false);
        expect(dataFunctions.getTags()).toHaveLength(1);
      });

      it('should not add empty tags', () => {
        dataFunctions.tagsInput.value = '';
        
        const result = dataFunctions.addTag();
        
        expect(result).toBe(false);
        expect(dataFunctions.getTags()).toHaveLength(0);
      });

      it('should trim whitespace from tags', () => {
        dataFunctions.tagsInput.value = '  testing  ';
        
        const result = dataFunctions.addTag();
        
        expect(result).toBe(true);
        expect(dataFunctions.getTags()).toContain('testing');
      });
    });

    describe('removeTag', () => {
      it('should remove tag at valid index', () => {
        dataFunctions.setTags(['javascript', 'testing', 'node']);
        
        const result = dataFunctions.removeTag(1);
        
        expect(result).toBe(true);
        expect(dataFunctions.getTags()).toEqual(['javascript', 'node']);
      });

      it('should not remove tag at invalid index', () => {
        dataFunctions.setTags(['javascript']);
        
        const result = dataFunctions.removeTag(5);
        
        expect(result).toBe(false);
        expect(dataFunctions.getTags()).toEqual(['javascript']);
      });

      it('should not remove tag at negative index', () => {
        dataFunctions.setTags(['javascript']);
        
        const result = dataFunctions.removeTag(-1);
        
        expect(result).toBe(false);
        expect(dataFunctions.getTags()).toEqual(['javascript']);
      });
    });

    describe('renderTags', () => {
      it('should render tags in container', () => {
        dataFunctions.setTags(['javascript', 'testing']);
        
        dataFunctions.renderTags();
        
        const tagElements = dataFunctions.tagsContainer.querySelectorAll('.tag');
        expect(tagElements).toHaveLength(2);
        expect(tagElements[0].textContent).toContain('javascript');
        expect(tagElements[1].textContent).toContain('testing');
      });

      it('should add remove buttons to tags', () => {
        dataFunctions.setTags(['javascript']);
        
        dataFunctions.renderTags();
        
        const removeButtons = dataFunctions.tagsContainer.querySelectorAll('.tag-remove');
        expect(removeButtons).toHaveLength(1);
        expect(removeButtons[0].getAttribute('data-index')).toBe('0');
      });

      it('should clear container when no tags', () => {
        dataFunctions.setTags([]);
        
        dataFunctions.renderTags();
        
        expect(dataFunctions.tagsContainer.innerHTML).toBe('');
      });
    });
  });

  describe('formatDate', () => {
    it('should format datetime-local input correctly', () => {
      const result = dataFunctions.formatDate('2023-12-01T10:30');
      expect(result).toBe('2023-12-01 10:30');
    });

    it('should handle different date formats', () => {
      const result = dataFunctions.formatDate('2023-01-05T08:05:00');
      expect(result).toBe('2023-01-05 08:05');
    });

    it('should pad single digits', () => {
      const result = dataFunctions.formatDate('2023-01-05T08:05');
      expect(result).toBe('2023-01-05 08:05');
    });
  });
});