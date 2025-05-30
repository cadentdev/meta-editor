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
    const imageFilenameInput = document.getElementById('image-filename');
    const imageAltInput = document.getElementById('image-alt');
    const headerInput = document.getElementById('header');
    const contentInput = document.getElementById('content');
    const footerInput = document.getElementById('footer');
    const previewElement = document.getElementById('preview');
    const copyButton = document.getElementById('copy-button');
    const downloadButton = document.getElementById('download-button');
    const saveButton = document.getElementById('save-button');
    const clearButton = document.getElementById('clear-button');
    const markdownUpload = document.getElementById('markdown-upload');
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

    // Event listeners
    filenameInput.addEventListener('input', validateFilename);
    titleInput.addEventListener('input', validateTitle);
    dateInput.addEventListener('input', validateDate);
    summaryInput.addEventListener('input', validateSummary);
    tagsInput.addEventListener('keydown', handleTagInput);
    heroImageInput.addEventListener('change', handleImageUpload);
    removeImageBtn.addEventListener('click', removeImage);
    copyButton.addEventListener('click', copyToClipboard);
    downloadButton.addEventListener('click', downloadMarkdown);
    saveButton.addEventListener('click', saveToLocalStorage);
    clearButton.addEventListener('click', clearEditor);
    markdownUpload.addEventListener('change', handleMarkdownUpload);
    
    // Template button event listeners
    saveHeaderTemplateBtn.addEventListener('click', saveHeaderTemplate);
    loadHeaderTemplateBtn.addEventListener('click', loadHeaderTemplate);
    saveFooterTemplateBtn.addEventListener('click', saveFooterTemplate);
    loadFooterTemplateBtn.addEventListener('click', loadFooterTemplate);

    // Update preview when any input changes
    const allInputs = [filenameInput, titleInput, dateInput, summaryInput, headerInput, contentInput, footerInput, imageFilenameInput, imageAltInput];
    allInputs.forEach(input => {
        input.addEventListener('input', updatePreview);
    });

    // Load default templates if available
    checkForDefaultTemplates();
    
    // Initial preview update
    updatePreview();
    
    // Template functions
    function saveHeaderTemplate() {
        const headerContent = headerInput.value.trim();
        if (headerContent) {
            localStorage.setItem('metaEditorHeaderTemplate', headerContent);
            alert('Header template saved as default!');
        } else {
            if (confirm('Header is empty. Do you want to clear the default header template?')) {
                localStorage.removeItem('metaEditorHeaderTemplate');
                alert('Default header template cleared.');
            }
        }
    }
    
    function loadHeaderTemplate() {
        const savedHeader = localStorage.getItem('metaEditorHeaderTemplate');
        if (savedHeader) {
            headerInput.value = savedHeader;
            updatePreview();
        } else {
            alert('No default header template found.');
        }
    }
    
    function saveFooterTemplate() {
        const footerContent = footerInput.value.trim();
        if (footerContent) {
            localStorage.setItem('metaEditorFooterTemplate', footerContent);
            alert('Footer template saved as default!');
        } else {
            if (confirm('Footer is empty. Do you want to clear the default footer template?')) {
                localStorage.removeItem('metaEditorFooterTemplate');
                alert('Default footer template cleared.');
            }
        }
    }
    
    function loadFooterTemplate() {
        const savedFooter = localStorage.getItem('metaEditorFooterTemplate');
        if (savedFooter) {
            footerInput.value = savedFooter;
            updatePreview();
        } else {
            alert('No default footer template found.');
        }
    }
    
    function checkForDefaultTemplates() {
        // Check if we should auto-load default templates
        const savedHeader = localStorage.getItem('metaEditorHeaderTemplate');
        const savedFooter = localStorage.getItem('metaEditorFooterTemplate');
        
        // Only auto-load if the fields are empty
        if (savedHeader && !headerInput.value.trim()) {
            headerInput.value = savedHeader;
        }
        
        if (savedFooter && !footerInput.value.trim()) {
            footerInput.value = savedFooter;
        }
    }

    // Validation functions
    function validateFilename() {
        const filename = filenameInput.value.trim();
        
        if (filename.length === 0) {
            filenameValidation.textContent = 'Filename is required for download';
            downloadButton.disabled = true;
            return false;
        }
        
        // Check if filename has an extension
        if (filename.includes('.')) {
            // If it has an extension, it must be .md
            if (!filename.endsWith('.md')) {
                filenameValidation.textContent = 'Only .md extension is allowed';
                downloadButton.disabled = true;
                return false;
            }
            
            // Check if the base filename (without extension) is valid
            const baseFilename = filename.substring(0, filename.lastIndexOf('.'));
            const baseFilenameRegex = /^[a-z0-9-]+$/;
            
            if (!baseFilenameRegex.test(baseFilename)) {
                filenameValidation.textContent = 'Filename must be lowercase with hyphens only';
                downloadButton.disabled = true;
                return false;
            }
        } else {
            // No extension, just check if the filename is valid
            const filenameRegex = /^[a-z0-9-]+$/;
            
            if (!filenameRegex.test(filename)) {
                filenameValidation.textContent = 'Filename must be lowercase with hyphens only';
                downloadButton.disabled = true;
                return false;
            }
        }
        
        // If we got here, the filename is valid
        filenameValidation.textContent = '';
        downloadButton.disabled = false;
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
                
                // Update image filename field
                imageFilenameInput.value = file.name;
                
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
        imageFilenameInput.value = '';
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
        
        // Add hero image if available
        if (heroImageData && imageAltInput.value.trim()) {
            // If we have actual image data from upload
            content += `![${imageAltInput.value.trim()}]({static}/images/${heroImageData.name}){: .image-process-crisp}\n\n`;
        } else if (imageFilenameInput.value.trim() && imageAltInput.value.trim()) {
            // If we have extracted image filename and alt text
            content += `![${imageAltInput.value.trim()}]({static}/images/${imageFilenameInput.value.trim()}){: .image-process-crisp}\n\n`;
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
    
    // Download markdown file
    function downloadMarkdown() {
        if (!validateFilename()) {
            alert('Please enter a valid filename');
            return;
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
        const originalText = downloadButton.textContent;
        downloadButton.textContent = 'Downloaded!';
        setTimeout(() => {
            downloadButton.textContent = originalText;
        }, 2000);
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
            imageFilename: imageFilenameInput.value,
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
            
            imageFilenameInput.value = data.imageFilename || '';
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
            imageFilenameInput.value = '';
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
            // Run validation on the filename
            validateFilename();
        }
        
        const reader = new FileReader();
        reader.onload = function(event) {
            const content = event.target.result;
            parseMarkdownFile(content);
        };
        reader.readAsText(file);
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
            
            // Update the image alt text field
            imageAltInput.value = altText;
            
            // Update the image filename field
            imageFilenameInput.value = filename;
            
            // We don't have the actual image data, so we can't show a preview
            // But we can indicate that an image reference was found
            heroImageData = null;
            imagePreviewContainer.classList.add('hidden');
            
            // Remove the image markdown from the content and return the modified content
            return { 
                content: content.replace(fullMatch, '').trim(),
                found: true 
            };
        }
        
        return { content: content, found: false };
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
                
                // Try to extract hero image
                const heroResult = extractHeroImage(mainContent);
                if (heroResult.found) {
                    mainContent = heroResult.content;
                }
                
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
                
                // Try to identify header and footer content
                const savedHeader = localStorage.getItem('metaEditorHeaderTemplate');
                const savedFooter = localStorage.getItem('metaEditorFooterTemplate');
                
                // Check for header match at the beginning of content
                if (savedHeader && mainContent.trim().startsWith(savedHeader.trim())) {
                    headerInput.value = savedHeader;
                    // Remove header from content
                    mainContent = mainContent.trim().substring(savedHeader.trim().length).trim();
                }
                
                // Check for footer match at the end of content
                if (savedFooter && mainContent.trim().endsWith(savedFooter.trim())) {
                    footerInput.value = savedFooter;
                    // Remove footer from content
                    mainContent = mainContent.trim().substring(0, mainContent.trim().length - savedFooter.trim().length).trim();
                }
                
                // Set content
                contentInput.value = mainContent.trim();
                
                // Update preview
                updatePreview();
                
                alert('Markdown file parsed successfully!');
            } catch (e) {
                console.error('Error parsing YAML frontmatter:', e);
                alert('Error parsing YAML frontmatter. Please check the console for details.');
            }
        } else {
            // No frontmatter found, just set the content
            let mainContent = content.trim();
            
            // Try to extract hero image
            const heroResult = extractHeroImage(mainContent);
            if (heroResult.found) {
                mainContent = heroResult.content;
            }
            
            // Try to identify header and footer content
            const savedHeader = localStorage.getItem('metaEditorHeaderTemplate');
            const savedFooter = localStorage.getItem('metaEditorFooterTemplate');
            
            // Check for header match at the beginning of content
            if (savedHeader && mainContent.startsWith(savedHeader.trim())) {
                headerInput.value = savedHeader;
                // Remove header from content
                mainContent = mainContent.substring(savedHeader.trim().length).trim();
            }
            
            // Check for footer match at the end of content
            if (savedFooter && mainContent.endsWith(savedFooter.trim())) {
                footerInput.value = savedFooter;
                // Remove footer from content
                mainContent = mainContent.substring(0, mainContent.length - savedFooter.trim().length).trim();
            }
            
            contentInput.value = mainContent;
            updatePreview();
            alert('No YAML frontmatter found. Content has been added to the editor.');
        }
        
        // Reset the file input
        markdownUpload.value = '';
    }
});
