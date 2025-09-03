# Meta Editor

A web-based editor that prepares a post for publication on the web by adding essential metadata as YAML frontmatter to Markdown documents. 

This tool helps content creators who prefer Markdown to format their posts with proper frontmatter and metadata for web publishing.

## Design Philosophy

1. **Privacy First**: All processing happens client-side
2. **Distraction-Free**: Zen Mode as default promotes focused writing
3. **Accessibility**: rem-based units and semantic HTML
4. **Modern Standards**: Clean CSS, semantic markup, progressive enhancement
5. **User Control**: Independent UI toggles and persistent preferences

## Local and Private

Although the code is hosted on a web server, once your browser downloads the HTML, CSS, and JavaScript files, the application runs locally in your browser. This means:

- You can use it offline
- You can keep your data private
- No server setup or installation is required
- None of your data is sent to or stored on a server
- When you save your work, it is stored in your browser's local storage or on your device

You can always run the latest release at [https://cadentdev.github.io/meta-editor/](https://cadentdev.github.io/meta-editor/).

## Installation

### For Content Creators

To use the Meta Editor, you can download or clone this repository to your local machine. Then simply open the `dist/index.html` file in your web browser. That's it -- no need to run a web server or install dependencies.

### For Developers

If you want to contribute to the project or run the test suite:

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd meta-editor
   ```

2. **Install development dependencies**

   ```bash
   npm install
   ```

   This installs Jest and testing libraries for running the comprehensive unit test suite.

3. **Run tests** (optional)

   ```bash
   npm test              # Run all tests
   npm run test:watch    # Run tests in watch mode
   npm run test:coverage # Generate coverage report
   ```

The application itself has no runtime dependencies and runs entirely in the browser.

## Using Meta Editor

Start by writing your new post in your favorite text editor or word processor, formatted using Markdown. Copy the new document and paste it into the Content field. Then fill in the other metadata fields.

As you add the data, the Meta Editor will format the complete Markdown document with correctly formatted YAML frontmatter at the top. When you're done editing, just copy the Markdown document or download it to your device.

If you save the document to your device, you can also re-open it back in the Meta Editor to continue editing.

You can even add a hero image to your post in Meta Editor by uploading the image and adding an alt text description. The Meta Editor will generate the correct Markdown code for your hero image at the top of the document.

## Features

### Content Management

- **Meta Data Management**: Separate input fields for Title, Date, Tags, and Summary to generate YAML "Frontmatter"
- **File Name Field**: Track and manage your document filenames with validation
- **Header & Footer Templates**: Save and reuse common header and footer content across multiple posts
- **Advanced Hero Image Support**: Upload or extract featured images with automatic filename and alt text handling
- **Tag Management**: Visual tag interface with easy addition and removal
- **Markdown Content Editor**: Write your post content in markdown format with dynamic viewport-based sizing

### File Operations

- **Upload Markdown Files**: Import existing markdown files with YAML frontmatter
- **Auto-Parse Content**: Automatically extracts frontmatter fields, hero images, and recognizes header/footer content
- **Smart Image Extraction**: Identifies and extracts the first image in uploaded content as the hero image
- **Download Markdown**: Export your content as properly formatted markdown files
- **Copy to Clipboard**: Copy formatted markdown with user feedback in status bar

### User Experience & Interface

- **Desktop GUI Style Menu Bar**: Organized access to all application features with proper dropdown behavior
- **Icon Toolbar**: Quick access to common actions with visual icons (independent toggle)
- **Zen Mode (Default)**: Launches in distraction-free mode showing only Content and Preview
- **Independent UI Controls**: Separate toggles for toolbar visibility and field visibility
- **Dynamic Menu Text**: Menu items show current state (Show/Hide All, Show/Hide Toolbar)
- **Live Preview**: See your formatted post in real-time with dynamic sizing and improved spacing
- **Local Storage**: Save your work and UI preferences between browser sessions
- **Field Validation**: Ensures proper formatting of all fields with real-time feedback
- **Persistent Templates**: Header and footer templates persist across sessions
- **Status Bar**: Shows contextual information, user feedback, and Zen Mode status
- **Improved Layout**: Content field positioned at bottom with H2 heading for better workflow

## Usage

### Getting Started (Zen Mode Default)

The Meta Editor launches in Zen Mode for distraction-free writing:

1. Write your main content in the Content field (dynamically sized to use 86% of screen height)
2. Preview your formatted post in the right panel (automatically matches Content field height)
3. Use View > "Show All" to access meta data fields when ready
4. Use View > "Hide Toolbar" to toggle toolbar visibility independently
5. Fields automatically resize when you change browser window size for optimal writing space

### Creating New Content (Full Interface)

1. Use View > "Show All" to access all fields
2. Enter a valid filename in the File Name field (lowercase with hyphens)
3. Fill in the meta data fields (Title, Date, Tags, Summary)
4. Add header content or load a saved header template
5. Upload a hero image if desired and add alt text
6. Add footer content or load a saved footer template
7. Write your main content in the Content field (positioned at bottom)
8. Preview your formatted post in the right panel
9. Use File > "Save" or toolbar to store your work locally

### Working with Templates

1. Create your header or footer content
2. Click "Save Default" next to the field to save as a template
3. Use "Load Default" to apply the template to any document

### Importing Existing Content

1. Click "Upload Markdown File" to import an existing markdown file.
2. The system will automatically parse YAML frontmatter that matches the supported fields (Title, Date, Tags, Summary)
3. The first image in the content will be extracted as the hero image
4. Image filename and alt text are automatically populated in their respective fields
5. If your file contains content matching saved header/footer templates, they'll be extracted

### Interface Controls

1. **Zen Mode**: Toggle between focused writing (Content + Preview only) and full interface
2. **Toolbar**: Independently show/hide the icon toolbar for menu actions
3. **Menu System**: Access all features through Mac-style menu bar with proper dropdown behavior
4. **Status Feedback**: Get confirmation messages for copy/download actions in status bar

### Exporting Your Work

1. Ensure the File Name field contains a valid filename
2. Use File > "Download Markdown Post..." or toolbar icon to save as .md file
3. Use Edit > "Copy Markdown Post" or toolbar icon to copy formatted output
4. Status bar provides feedback for successful operations

## Technologies

- Vanilla JavaScript (no frameworks!)
- HTML5 & CSS3
- Local Storage API
- FileReader API for image handling
- Marked.js for Markdown rendering
- js-yaml for YAML frontmatter parsing
- Blob API for file downloads

## Testing & Quality Assurance

Meta Editor includes a Jest-based test suite ensuring code quality and reliability:

### Test Coverage

- **91 unit tests** covering all major functionality
- **Validation functions** - Input validation and formatting
- **UI state management** - Zen mode, toolbar toggles, persistence
- **Data transformation** - Preview generation, tag management, image extraction
- **LocalStorage operations** - Data persistence and template management
- **Menu actions** - All user interactions and workflows

### Running Tests

```bash
npm install        # Install Jest and testing dependencies
npm test          # Run all tests
npm run test:watch # Development mode with auto-rerun
npm run test:coverage # Generate detailed coverage report
```

### Quality Features

- **Error scenario testing** - Validates error handling and edge cases
- **Mock-based isolation** - Tests functions independently with controlled inputs
- **Realistic DOM simulation** - Tests UI interactions with complete DOM structures
- **API mocking** - Tests browser APIs (clipboard, file operations) safely

See `README-TESTING.md` for detailed testing documentation.

## Project Structure

- `dist/` - Contains all the application files:
  - `index.html` - The main HTML file
  - `styles.css` - Main stylesheet
  - `menu-styles.css` - Styles for menu bar and toolbar
  - `script.js` - Application JavaScript

## Getting Started

Simply open `dist/index.html` in your web browser to start using the editor. No server setup or installation required.

## Recent Improvements (v0.2)

### Interface Enhancements

- **Zen Mode Default**: Application now launches in distraction-free writing mode
- **Independent UI Controls**: Separate toggles for toolbar and field visibility
- **Improved Layout**: Content field moved to bottom with H2 heading for better workflow
- **Enhanced Spacing**: Added consistent 1.5625rem padding above all H2 headings for visual hierarchy
- **Dynamic Viewport Sizing**: Content and Preview fields use 86% of available screen height

### User Experience

- **Dynamic Menu Text**: Menu items now show current state (Show/Hide All, Show/Hide Toolbar)
- **Proper Menu Behavior**: Dropdowns close after selecting items, as expected
- **Status Bar Feedback**: Copy and download actions provide confirmation in status bar
- **Streamlined Interface**: Removed duplicate buttons, consolidated functionality in menu/toolbar
- **Immersive Writing**: Fields automatically scale to maximize available screen space
- **Responsive Design**: Interface adapts perfectly to different screen sizes and browser windows

### Technical Improvements

- **Modern CSS Units**: Converted from px to rem/vw for better accessibility and scaling
- **Viewport-Based Sizing**: Dynamic height calculation using calc(86vh - 15rem)
- **Independent State Management**: Toolbar and Zen Mode toggles work independently
- **Persistent UI Preferences**: Interface state saves between sessions (except Zen Mode always defaults on)
- **Responsive Typography**: All font sizes and spacing scale with user preferences
- **Git Integration**: Added .DS_Store and system files to .gitignore
- **Code Organization**: Improved JavaScript structure and removed unused button references

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
