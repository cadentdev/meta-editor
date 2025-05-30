# Meta Editor

A web-based editor that prepares a post for publication on the web by adding essential meta data. This tool helps content creators format their posts with proper frontmatter and markdown content for web publishing.

## Features

### Content Management
- **Frontmatter Management**: Separate input fields for Title, Date, Tags, and Summary
- **File Name Field**: Track and manage your document filenames
- **Header & Footer Templates**: Save and reuse common header and footer content across multiple posts
- **Advanced Hero Image Support**: Upload or extract featured images with automatic filename and alt text handling
- **Tag Management**: Visual tag interface with easy addition and removal
- **Markdown Content Editor**: Write your post content in markdown format

### File Operations
- **Upload Markdown Files**: Import existing markdown files with YAML frontmatter
- **Auto-Parse Content**: Automatically extracts frontmatter fields, hero images, and recognizes header/footer content
- **Smart Image Extraction**: Identifies and extracts the first image in uploaded content as the hero image
- **Download Markdown**: Export your content as properly formatted markdown files

### User Experience
- **Live Preview**: See your formatted post in real-time
- **Local Storage**: Save your work between browser sessions
- **Copy to Clipboard**: Easily copy the formatted output
- **Field Validation**: Ensures proper formatting of all fields
- **Persistent Templates**: Header and footer templates persist across sessions

## Usage

### Creating New Content
1. Enter a valid filename in the File Name field (lowercase with hyphens)
2. Fill in the frontmatter fields (Title, Date, Tags, Summary)
3. Add header content or load a saved header template
4. Upload a hero image if desired and add alt text
5. Write your main content in the Content field
6. Add footer content or load a saved footer template
7. Preview your formatted post in the right panel
8. Click "Save" to store your work in the browser's local storage

### Working with Templates
1. Create your header or footer content
2. Click "Save Default" next to the field to save as a template
3. Use "Load Default" to apply the template to any document

### Importing Existing Content
1. Click "Upload Markdown File" to import an existing markdown file
2. The system will automatically parse YAML frontmatter
3. The first image in the content will be extracted as the hero image
4. Image filename and alt text are automatically populated in their respective fields
5. If your file contains content matching saved header/footer templates, they'll be extracted

### Exporting Your Work
1. Ensure the File Name field contains a valid filename
2. Click "Download Markdown" to save your content as a .md file
3. Or use "Copy to Clipboard" to copy the formatted output

## Technologies

- Vanilla JavaScript
- HTML5 & CSS3
- Local Storage API
- FileReader API for image handling
- Marked.js for Markdown rendering
- js-yaml for YAML frontmatter parsing
- Blob API for file downloads

## Getting Started

Simply open `index.html` in your web browser to start using the editor. No server setup or installation required.
