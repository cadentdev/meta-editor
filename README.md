# Meta Editor

A web-based editor that prepares a post for publication on the web by adding essential metadata. This tool helps content creators who prefer Markdown to format their posts with proper frontmatter and metadata for web publishing.

## Local and Private

Although the code is hosted on a web server, once your browser downloads the HTML, CSS, and JavaScript files, the application runs locally in your browser. This means:

- You can use it offline 
- You can keep your data private
- No server setup or installation is required
- None of your data is sent to or stored on a server
- When you save your work, it is stored in your browser's local storage or on your device

You can always run the latest release at https://cadentdev.github.io/meta-editor/.

## Installation

To install the Meta Editor code, you can download or clone this repository to your local machine. Then simply open the `index.html` file in your web browser. That's it -- no need to run a web server

## Using Meta Editor

Start by writing your new post in your favorite text editor or word processor, formatted using Markdown. Copy the new document and paste it into the Content field. Then fill in the other metadata fields. 

As you add the data, the Meta Editor will format the complete Markdown document with correctly formatted YAML frontmatter at the top. When you're done editing, just copy the Markdown document or download it to your device.

If you save the document to your device, you can also re-open it back in the Meta Editor to continue editing.

You can even add a hero image to your post in Meta Editor by uploading the image and adding an alt text description. The Meta Editor will generate the correct Markdown code for your hero image at the top of the document.

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
- **Mac-Style Menu Bar**: Organized access to all application features
- **Icon Toolbar**: Quick access to common actions with visual icons
- **View Menu**: Toggle UI elements and enable Zen Mode for distraction-free editing
- **Live Preview**: See your formatted post in real-time
- **Local Storage**: Save your work between browser sessions
- **Copy to Clipboard**: Easily copy the formatted output
- **Field Validation**: Ensures proper formatting of all fields
- **Persistent Templates**: Header and footer templates persist across sessions
- **Status Bar**: Shows contextual information and application version

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

## Project Structure

- `dist/` - Contains all the application files:
  - `index.html` - The main HTML file
  - `styles.css` - Main stylesheet
  - `menu-styles.css` - Styles for menu bar and toolbar
  - `script.js` - Application JavaScript

## Testing Strategy

The Meta Editor uses a three-tiered testing approach:

### Unit Tests (Jest)
- Test individual functions like `clearEditor()`, `saveToLocalStorage()`, `validateFilename()`
- Mock dependencies and localStorage
- Focus on logic and data transformation

### Integration Tests (Jest + DOM Testing Library)
- Test interactions between components
- Verify menu actions trigger correct functions
- Test UI state management functions

### E2E Tests (Playwright/Puppeteer)
- Test complete user workflows
- Verify persistence across page reloads
- Test file uploads/downloads

## Getting Started

Simply open `dist/index.html` in your web browser to start using the editor. No server setup or installation required.

## Field Details

### File Name
The File Name field accepts lowercase names with hyphens as separators. This ensures your markdown files follow best practices for web publishing. The field is used for:
- Tracking which document you're working on
- Validating proper filename format
- Determining the filename when downloading

### Hero Image
The hero image system supports two workflows:
1. **Direct Upload**: Select an image file to upload and preview
2. **Markdown Extraction**: When uploading a markdown file, the first image is automatically extracted

The Image File Name field shows the current image filename and is used when generating the markdown code in the preview.

### Templates
Header and footer templates are stored separately from your documents, allowing you to:
- Maintain consistent branding across multiple posts
- Quickly apply standard introductions or contact information
- Update all future documents by changing the template once
