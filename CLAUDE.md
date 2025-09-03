# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Meta Editor is a client-side web application that helps content creators add YAML frontmatter metadata to Markdown documents. The application runs entirely in the browser with no server dependencies and emphasizes privacy, accessibility, and a distraction-free writing experience.

## Development Commands

### Testing
```bash
npm install              # Install Jest and testing dependencies
npm test                # Run all tests once
npm run test:watch      # Run tests in watch mode for development
npm run test:coverage   # Generate detailed test coverage report
```

### Running the Application
Simply open `dist/index.html` in a web browser - no build process or server required.

## Architecture Overview

### Core Structure
- **Client-side only**: All processing happens in the browser using vanilla JavaScript
- **No build process**: Application runs directly from HTML/CSS/JS files
- **Local storage persistence**: User data and preferences saved in browser
- **Modular design**: Separate concerns for UI state, validation, data transformation, and storage

### Key Files
- `dist/index.html` - Main application entry point with complete UI structure
- `dist/script.js` - All application logic (~900 lines of vanilla JavaScript)
- `dist/styles.css` - Main application styling with rem-based responsive design
- `dist/menu-styles.css` - Menu bar and toolbar specific styles
- `tests/` - Comprehensive Jest test suite with 91+ unit tests

### Application States
- **Zen Mode** (default): Shows only Content editor and Preview for focused writing
- **Full Mode**: Exposes all metadata fields (title, date, tags, summary, hero image, etc.)
- **Toolbar**: Independent toggle for quick-access icon toolbar
- **UI State Persistence**: Toolbar visibility persists, Zen Mode always defaults to on

## Core Components

### UI State Management (`script.js:10-76`)
- `uiState` object tracks toolbar and zenMode visibility
- `loadUIState()` and `applyUIState()` handle persistence and application
- Dynamic menu text updates based on current state

### Validation System (`script.js` + `tests/validation.test.js`)
- Real-time validation for filename, title, date, and summary fields
- Filename validation enforces lowercase-with-hyphens format
- Summary character count with 160 character recommended limit
- Comprehensive test coverage for all validation edge cases

### Data Transformation
- YAML frontmatter generation and parsing (using js-yaml library)
- Markdown preview generation (using marked.js library)
- Hero image extraction from uploaded markdown files
- Template system for headers and footers

### Local Storage Operations
- Persistent data storage for work-in-progress documents
- Template storage for reusable headers and footers
- UI preference persistence (toolbar state)
- Comprehensive error handling and fallbacks

## Development Patterns

### Code Style
- Vanilla JavaScript with ES6+ features
- DOM-first approach with direct element manipulation
- Event-driven architecture with centralized event listeners
- Functional approach with pure functions where possible

### Testing Architecture
- **Jest + jsdom** for unit testing with DOM simulation
- **Comprehensive mocking** of browser APIs (FileReader, localStorage, clipboard)
- **91+ unit tests** covering validation, UI state, data transformation, storage, and menu actions
- **Test isolation** with setup.js providing consistent mocks and cleanup

### UI Patterns
- **Desktop GUI-style menu bar** with dropdown behavior
- **Independent UI controls** - toolbar and field visibility work separately
- **Responsive design** using rem units and viewport-based sizing
- **Dynamic content sizing** - editor fields scale to use 86% of viewport height

## Key Dependencies

### Runtime (CDN-loaded)
- **marked.js** - Markdown to HTML conversion for preview
- **js-yaml** - YAML frontmatter parsing and generation
- **Font Awesome 6.4.0** - Icons for toolbar and UI elements

### Development
- **Jest 29.7.0** - Testing framework
- **jest-environment-jsdom** - DOM simulation for tests
- **@testing-library/jest-dom** - Enhanced DOM testing matchers

## Common Development Tasks

### Adding New Fields
1. Add HTML form elements to `dist/index.html`
2. Add validation function following existing patterns
3. Update `generatePreview()` to include field in frontmatter
4. Add localStorage save/load logic
5. Write unit tests for validation and data transformation

### Modifying UI State
1. Update `uiState` object structure if needed
2. Modify `applyUIState()` function for new visibility logic
3. Update menu text functions if adding toggles
4. Test state persistence with localStorage

### External Library Integration
Libraries are loaded via CDN in the HTML. For new libraries:
1. Add CDN link to `dist/index.html`
2. Add mock to `tests/setup.js` for testing
3. Update any global references in code

## Testing Guidelines

### Test File Organization
- `validation.test.js` - Input validation functions
- `ui-state.test.js` - UI visibility and state management
- `data-transformation.test.js` - Preview generation and data processing
- `localStorage.test.js` - Persistence operations
- `menu-actions.test.js` - User interaction workflows

### Mock Strategy
- All browser APIs are comprehensively mocked in `tests/setup.js`
- External libraries (marked, js-yaml) have simple mocks
- FileReader mock simulates both text and image file handling
- localStorage mock provides full API simulation

The test suite maintains high coverage while testing real functionality through realistic DOM simulation and comprehensive edge case coverage.