document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const filenameInput = document.getElementById('filename');
    const titleInput = document.getElementById('title');
    const dateInput = document.getElementById('date');
    const tagsInput = document.getElementById('tags-input');
    const tagsContainer = document.getElementById('tags-container');
    const summaryInput = document.getElementById('summary');
    const summaryCount = document.getElementById('summary-count');
    const heroImageInput = document.getElementById('hero-image');
    const imagePreviewContainer = document.getElementById('image-preview-container');
    const imagePreview = document.getElementById('image-preview');
    const removeImageBtn = document.getElementById('remove-image');
    const imageAltInput = document.getElementById('image-alt');
    const headerInput = document.getElementById('header');
    const contentInput = document.getElementById('content');
    const footerInput = document.getElementById('footer');
    const previewElement = document.getElementById('preview');
    const copyButton = document.getElementById('copy-button');
    const saveButton = document.getElementById('save-button');
    const clearButton = document.getElementById('clear-button');
    const markdownUpload = document.getElementById('markdown-upload');
    
    // Template buttons
    const saveHeaderTemplateBtn = document.getElementById('save-header-template');
    const loadHeaderTemplateBtn = document.getElementById('load-header-template');
    const saveFooterTemplateBtn = document.getElementById('save-footer-template');
    const loadFooterTemplateBtn = document.getElementById('load-footer-template');

    // Validation messages
    const filenameValidation = document.getElementById('filename-validation');
    const titleValidation = document.getElementById('title-validation');
    const dateValidation = document.getElementById('date-validation');
    const summaryValidation = document.getElementById('summary-validation');

    // State
    let tags = [];
    let heroImageData = null;

    // Initialize with current date and time
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    dateInput.value = `${year}-${month}-${day}T${hours}:${minutes}`;

    // Load saved data from localStorage
    loadFromLocalStorage();
    
    // Check if we have default templates
    checkForDefaultTemplates();

    // Event listeners
    titleInput.addEventListener('input', validateTitle);
    dateInput.addEventListener('input', validateDate);
    summaryInput.addEventListener('input', validateSummary);
    tagsInput.addEventListener('keydown', handleTagInput);
    heroImageInput.addEventListener('change', handleImageUpload);
    removeImageBtn.addEventListener('click', removeImage);
    copyButton.addEventListener('click', copyToClipboard);
    saveButton.addEventListener('click', saveToLocalStorage);
    clearButton.addEventListener('click', clearEditor);
    markdownUpload.addEventListener('change', handleMarkdownUpload);
    
    // Template event listeners
    saveHeaderTemplateBtn.addEventListener('click', saveHeaderTemplate);
    loadHeaderTemplateBtn.addEventListener('click', loadHeaderTemplate);
    saveFooterTemplateBtn.addEventListener('click', saveFooterTemplate);
    loadFooterTemplateBtn.addEventListener('click', loadFooterTemplate);

    // Update preview when any input changes
    const allInputs = [filenameInput, titleInput, dateInput, summaryInput, headerInput, contentInput, footerInput, imageAltInput];
    allInputs.forEach(input => {
        input.addEventListener('input', updatePreview);
    });

    // Initial preview update
    updatePreview();

    // Validation functions
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
        summaryCount.textContent = `${charCount}/250`;

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

    // Tag handling
    function handleTagInput(e) {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            addTag();
        }
    }

    function addTag() {
        const tagText = tagsInput.value.trim();
        if (tagText && !tags.includes(tagText)) {
            tags.push(tagText);
            renderTags();
            tagsInput.value = '';
            updatePreview();
        }
    }

    function removeTag(index) {
        tags.splice(index, 1);
        renderTags();
        updatePreview();
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

    // Image handling
    function handleImageUpload(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(event) {
                heroImageData = {
                    data: event.target.result,
                    name: file.name,
                    type: file.type
                };
                imagePreview.src = event.target.result;
                imagePreviewContainer.classList.remove('hidden');
                updatePreview();
            };
            reader.readAsDataURL(file);
        }
    }

    function removeImage() {
        heroImageData = null;
        imagePreview.src = '';
        imagePreviewContainer.classList.add('hidden');
        heroImageInput.value = '';
        updatePreview();
    }

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

    // Update preview
    function updatePreview() {
        // Generate frontmatter
        const title = titleInput.value.trim();
        const date = dateInput.value ? formatDate(dateInput.value) : '';
        const tagsString = tags.join(', ');
        const summary = summaryInput.value.trim();

        let frontmatter = '---\n';
        if (title) frontmatter += `Title: ${title}\n`;
        if (date) frontmatter += `Date: ${date}\n`;
        if (tagsString) frontmatter += `Tags: ${tagsString}\n`;
        if (summary) frontmatter += `Summary: ${summary}\n`;
        frontmatter += '---\n\n';

        // Generate content with hero image if available
        let content = '';
        
        // Add header if available
        if (headerInput.value.trim()) {
            content += headerInput.value.trim() + '\n\n';
        }
        
        if (heroImageData && imageAltInput.value.trim()) {
            content += `![${imageAltInput.value.trim()}]({static}/images/${heroImageData.name}){: .image-process-crisp}\n\n`;
        }
        
        content += contentInput.value;
        
        // Add footer if available
        if (footerInput.value.trim()) {
            content += '\n\n' + footerInput.value.trim();
        }

        // Combine and display in preview
        const fullContent = frontmatter + content;
        previewElement.textContent = fullContent;
    }

    // Copy to clipboard
    function copyToClipboard() {
        const content = previewElement.textContent;
        navigator.clipboard.writeText(content).then(() => {
            const originalText = copyButton.textContent;
            copyButton.textContent = 'Copied!';
            setTimeout(() => {
                copyButton.textContent = originalText;
            }, 2000);
        }).catch(err => {
            console.error('Failed to copy: ', err);
        });
    }

    // Local storage functions
    function saveToLocalStorage() {
        const data = {
            filename: filenameInput.value,
            title: titleInput.value,
            date: dateInput.value,
            tags: tags,
            summary: summaryInput.value,
            heroImage: heroImageData,
            imageAlt: imageAltInput.value,
            header: headerInput.value,
            content: contentInput.value,
            footer: footerInput.value
        };
        
        localStorage.setItem('metaEditorData', JSON.stringify(data));
        alert('Content saved successfully!');
    }

    function loadFromLocalStorage() {
        const savedData = localStorage.getItem('metaEditorData');
        if (savedData) {
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
            
            imageAltInput.value = data.imageAlt || '';
            headerInput.value = data.header || '';
            contentInput.value = data.content || '';
            footerInput.value = data.footer || '';
            
            // Run validations
            validateTitle();
            validateDate();
            validateSummary();
        }
    }

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
            dateInput.value = `${year}-${month}-${day}T${hours}:${minutes}`;
            
            tags = [];
            tagsContainer.innerHTML = '';
            summaryInput.value = '';
            removeImage();
            imageAltInput.value = '';
            headerInput.value = '';
            contentInput.value = '';
            footerInput.value = '';
            
            // Clear localStorage
            localStorage.removeItem('metaEditorData');
            
            // Update preview
            updatePreview();
            
            // Reset validations
            titleValidation.textContent = '';
            dateValidation.textContent = '';
            summaryValidation.textContent = '';
            summaryCount.textContent = '0/250';
        }
    }
    
    // Handle markdown file upload and parsing
    function handleMarkdownUpload(e) {
        const file = e.target.files[0];
        if (!file) return;
        
        // Set the filename from the uploaded file
        if (file.name) {
            // Remove file extension
            const filename = file.name.replace(/\.[^/.]+$/, '');
            filenameInput.value = filename;
        }
        
        const reader = new FileReader();
        reader.onload = function(event) {
            const content = event.target.result;
            parseMarkdownFile(content);
        };
        reader.readAsText(file);
    }
    
    function parseMarkdownFile(content) {
        // Check if the file has YAML frontmatter (between --- delimiters)
        const frontmatterRegex = /^---\s*[\r\n]+(.*?)[\r\n]+---\s*[\r\n]+/s;
        const match = content.match(frontmatterRegex);
        
        if (match) {
            try {
                // Extract frontmatter and content
                const frontmatterText = match[1];
                let mainContent = content.replace(frontmatterRegex, '');
                
                // Parse YAML frontmatter
                const frontmatter = jsyaml.load(frontmatterText);
                
                // Populate fields
                if (frontmatter.Title) {
                    titleInput.value = frontmatter.Title;
                    validateTitle();
                }
                
                if (frontmatter.Date) {
                    // Convert date format from "YYYY-MM-DD HH:MM" to "YYYY-MM-DDThh:mm"
                    const dateMatch = frontmatter.Date.match(/^(\d{4}-\d{2}-\d{2})\s+(\d{2}:\d{2})/);
                    if (dateMatch) {
                        dateInput.value = `${dateMatch[1]}T${dateMatch[2]}`;
                    } else {
                        // Try to parse as a date object
                        try {
                            const dateObj = new Date(frontmatter.Date);
                            const year = dateObj.getFullYear();
                            const month = String(dateObj.getMonth() + 1).padStart(2, '0');
                            const day = String(dateObj.getDate()).padStart(2, '0');
                            const hours = String(dateObj.getHours()).padStart(2, '0');
                            const minutes = String(dateObj.getMinutes()).padStart(2, '0');
                            dateInput.value = `${year}-${month}-${day}T${hours}:${minutes}`;
                        } catch (e) {
                            console.error('Could not parse date:', e);
                        }
                    }
                    validateDate();
                }
                
                if (frontmatter.Tags) {
                    // Handle tags as string or array
                    let tagsList = [];
                    if (typeof frontmatter.Tags === 'string') {
                        tagsList = frontmatter.Tags.split(',').map(tag => tag.trim());
                    } else if (Array.isArray(frontmatter.Tags)) {
                        tagsList = frontmatter.Tags;
                    }
                    
                    tags = tagsList;
                    renderTags();
                }
                
                if (frontmatter.Summary) {
                    summaryInput.value = frontmatter.Summary;
                    validateSummary();
                }
                
                // Try to extract header and footer from content
                const { extractedHeader, extractedFooter, remainingContent } = extractHeaderAndFooter(mainContent);
                
                // Set content fields
                headerInput.value = extractedHeader;
                contentInput.value = remainingContent.trim();
                footerInput.value = extractedFooter;
                
                // Update preview
                updatePreview();
                
                alert('Markdown file parsed successfully!');
            } catch (e) {
                console.error('Error parsing YAML frontmatter:', e);
                alert('Error parsing YAML frontmatter. Please check the console for details.');
            }
        } else {
            // No frontmatter found, just set the content
            const { extractedHeader, extractedFooter, remainingContent } = extractHeaderAndFooter(content);
            
            headerInput.value = extractedHeader;
            contentInput.value = remainingContent.trim();
            footerInput.value = extractedFooter;
            
            updatePreview();
            alert('No YAML frontmatter found. Content has been added to the editor.');
        }
    }
    
    // Extract header and footer from content
    function extractHeaderAndFooter(content) {
        let extractedHeader = '';
        let extractedFooter = '';
        let remainingContent = content;
        
        // Get default header and footer for comparison
        const defaultHeader = localStorage.getItem('metaEditorHeaderTemplate') || '';
        const defaultFooter = localStorage.getItem('metaEditorFooterTemplate') || '';
        
        // Check if default header exists in the content
        if (defaultHeader && content.includes(defaultHeader)) {
            extractedHeader = defaultHeader;
            remainingContent = remainingContent.replace(defaultHeader, '').trim();
        } else {
            // Try to identify header (first paragraph before any other content)
            const firstParagraphMatch = remainingContent.match(/^([^\n]+(?:\n[^\n]+)?)\n\n/);
            if (firstParagraphMatch && firstParagraphMatch[1].length < 200) { // Limit header size
                extractedHeader = firstParagraphMatch[1];
                remainingContent = remainingContent.replace(firstParagraphMatch[0], '');
            }
        }
        
        // Check if default footer exists in the content
        if (defaultFooter && content.includes(defaultFooter)) {
            extractedFooter = defaultFooter;
            remainingContent = remainingContent.replace(defaultFooter, '').trim();
        } else {
            // Try to identify footer (last few lines, especially if they contain contact info or links)
            const footerMatch = remainingContent.match(/\n\n([^\n]+(?:\n[^\n]+){1,5})$/); // Last few lines
            if (footerMatch && footerMatch[1].includes('Contact') || 
                (footerMatch && footerMatch[1].includes('{filename}')) || 
                (footerMatch && footerMatch[1].includes('{static}'))) {
                extractedFooter = footerMatch[1];
                remainingContent = remainingContent.replace(footerMatch[0], '');
            }
        }
        
        return { extractedHeader, extractedFooter, remainingContent };
    }
        
    // Reset the file input
    markdownUpload.value = '';
}
    
    // Template management functions
    function saveHeaderTemplate() {
        const headerContent = headerInput.value.trim();
        if (headerContent) {
            localStorage.setItem('metaEditorHeaderTemplate', headerContent);
            headerInput.classList.add('using-template');
            alert('Header template saved as default!');
        } else {
            alert('Please enter header content before saving as template.');
        }
    }
    
    function loadHeaderTemplate() {
        const savedTemplate = localStorage.getItem('metaEditorHeaderTemplate');
        if (savedTemplate) {
            headerInput.value = savedTemplate;
            headerInput.classList.add('using-template');
            updatePreview();
        } else {
            alert('No default header template found.');
        }
    }
    
    function saveFooterTemplate() {
        const footerContent = footerInput.value.trim();
        if (footerContent) {
            localStorage.setItem('metaEditorFooterTemplate', footerContent);
            footerInput.classList.add('using-template');
            alert('Footer template saved as default!');
        } else {
            alert('Please enter footer content before saving as template.');
        }
    }
    
    function loadFooterTemplate() {
        const savedTemplate = localStorage.getItem('metaEditorFooterTemplate');
        if (savedTemplate) {
            footerInput.value = savedTemplate;
            footerInput.classList.add('using-template');
            updatePreview();
        } else {
            alert('No default footer template found.');
        }
    }
    
    function checkForDefaultTemplates() {
        // Check if we have default templates and update UI accordingly
        const headerTemplate = localStorage.getItem('metaEditorHeaderTemplate');
        const footerTemplate = localStorage.getItem('metaEditorFooterTemplate');
        
        if (headerTemplate && headerInput.value === headerTemplate) {
            headerInput.classList.add('using-template');
        }
        
        if (footerTemplate && footerInput.value === footerTemplate) {
            footerInput.classList.add('using-template');
        }
        
        // Add input event listeners to remove template highlighting when content changes
        headerInput.addEventListener('input', function() {
            const savedTemplate = localStorage.getItem('metaEditorHeaderTemplate');
            if (savedTemplate !== headerInput.value) {
                headerInput.classList.remove('using-template');
            }
        });
        
        footerInput.addEventListener('input', function() {
            const savedTemplate = localStorage.getItem('metaEditorFooterTemplate');
            if (savedTemplate !== footerInput.value) {
                footerInput.classList.remove('using-template');
            }
        });
    }
    }
});
