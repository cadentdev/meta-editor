# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Meta Editor is a client-side web application that helps content creators add YAML frontmatter metadata to Markdown documents. The application runs entirely in the browser with no server dependencies and emphasizes privacy, accessibility, and a distraction-free writing experience.

## Development Guidelines

- Upon starting a new chat session, review the README.md and ROADMAP.md files to understand the project context.
- Update the ROADMAP.md file with the current state of the project, including completed tasks and any new tasks that have been added.
- Before starting your implementation of significant features (new functionality, refactoring, architecture changes, new libraries), describe your plan and ask for approval before proceeding. For minor changes (typos, styling tweaks, error fixes), proceed without confirmation.
- If you aren't sure how to implement a feature, ask for help.
- If you need more information to craft an effective implementation plan, ask for it.
- Use the Playwright tool to validate code changes when you reach a logical review point and think the feature is working.
- When testing is completed, reload the site in desktop mode so the user can also test the implementation before calling the review agent.
- After implementing features, run the appropriate test commands (npm test, npm run test:e2e) to verify functionality.
- For visual changes, consider running visual regression tests (npm run test:visual) to ensure design consistency.
- If implementation doesn't match expected behavior, revert changes and reassess the approach.
- Once a new feature or change has been implemented, update the ROADMAP.md and README.md files to reflect the current state of the project, and prompt me to commit the changes.

## Agent System

This project uses specialized agents for different development phases. Each agent has specific capabilities and constraints defined in their dossier files.

### Available Agents

- `agents/planning.md` - Feature analysis and implementation planning
- `agents/implementation.md` - Code changes and feature development  
- `agents/testing.md` - Test execution and validation
- `agents/review.md` - Code quality assessment
- `agents/documentation.md` - Documentation updates and maintenance

### Usage

Reference agents by their "dossier" file when requesting specific expertise:

- "Use `agents/planning.md` to break down the video gallery feature"
- "Have `agents/testing.md` run the full test suite and validate with Playwright"
- "Call `agents/review.md` to assess the slider changes before testing"

### Agent Workflow

**Typical Feature Development:**

1. `agents/planning.md` → Research and create implementation plan
2. `agents/implementation.md` → Execute approved plan  
3. `agents/testing.md` → Validate functionality and run test suites
4. `agents/review.md` → Assess code quality and adherence to conventions
5. `agents/documentation.md` → Update project documentation

**Styling/Visual Changes Workflow:**

1. `agents/planning.md` → Research and create implementation plan
2. `agents/implementation.md` → Execute approved plan  
3. `agents/testing.md` → Validate functionality and run test suites
4. Update code as necessary based on testing feedback
5. Restart local server and open browser for user review

**Bug Fix Workflow:**

1. `agents/implementation.md` → Apply fixes
2. `agents/testing.md` → Verify resolution

**Documentation Updates:**

1. `agents/documentation.md` → Maintain current documentation state

## Development Commands

### Unit Testing (Jest)
```bash
npm install              # Install Jest and testing dependencies
npm test                # Run all unit tests once
npm run test:watch      # Run tests in watch mode for development
npm run test:coverage   # Generate detailed test coverage report
```

### End-to-End Testing (Playwright)
```bash
npm run test:e2e        # Run E2E tests in all configured browsers
npm run test:e2e:ui     # Run E2E tests with Playwright UI mode
npm run test:e2e:headed # Run E2E tests in headed mode (visible browser)
npm run test:e2e:debug  # Run E2E tests in debug mode
```

### Development Server
```bash
npm run serve           # Start local server on http://localhost:3000
```

### Playwright MCP Server
```bash
npm run mcp:start       # Start Playwright MCP server for AI-driven browser automation
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
- `dist/index.html` - Main application entry point with complete UI structure including Settings modal
- `dist/script.js` - All application logic (~1100 lines of vanilla JavaScript) with AI settings functionality
- `dist/styles.css` - Main application styling with rem-based responsive design and modal components
- `dist/menu-styles.css` - Menu bar and toolbar specific styles
- `tests/` - Comprehensive Jest test suite with 132+ unit tests including Settings functionality
- `tests/settings.test.js` - Complete test coverage for AI settings, validation, and modal interactions
- `e2e-tests/` - Playwright E2E tests for cross-browser functionality validation
- `playwright.config.js` - Playwright configuration for E2E testing
- `mcp-server.json` - MCP (Model Context Protocol) server configuration

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
- AI settings persistence (Ollama endpoint and preferred model)
- Comprehensive error handling and fallbacks

### AI Integration Features
- **Settings Modal**: Professional modal dialog for AI configuration
- **Ollama Integration**: Connect to local or remote Ollama instances
- **Model Discovery**: Automatic fetching and listing of available AI models
- **Model Metadata**: Display model names with file sizes for informed selection
- **Endpoint Validation**: Real-time URL validation with user feedback
- **Settings Persistence**: AI configuration saved to localStorage with error handling

## Development Patterns

### Code Style
- Vanilla JavaScript with ES6+ features
- DOM-first approach with direct element manipulation
- Event-driven architecture with centralized event listeners
- Functional approach with pure functions where possible

### Testing Architecture
- **Jest + jsdom** for unit testing with DOM simulation
- **Playwright** for E2E testing across Chromium, Firefox, WebKit, and mobile browsers
- **Comprehensive mocking** of browser APIs (FileReader, localStorage, clipboard)
- **91+ unit tests** covering validation, UI state, data transformation, storage, and menu actions
- **E2E test coverage** for complete user workflows and cross-browser compatibility
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
- **Jest 29.7.0** - Unit testing framework
- **jest-environment-jsdom** - DOM simulation for tests
- **@testing-library/jest-dom** - Enhanced DOM testing matchers
- **Playwright 1.55.0** - E2E testing and browser automation
- **@playwright/test** - Playwright testing framework
- **http-server** - Local development server

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

### Adding E2E Tests
1. Create test files in `e2e-tests/` directory
2. Use `page.locator()` with specific selectors for UI elements
3. Use `page.locator('.menu-item').filter({ hasText: 'MenuName' })` for menu interactions
4. Test across multiple browsers using configured projects
5. Use `npm run test:e2e:ui` for interactive test development

### Using Playwright MCP Server
The MCP server enables AI-driven browser automation:
1. Start server with `npm run mcp:start`
2. Configure Claude Desktop/VS Code/Cursor with `mcp-server.json`
3. Available capabilities include web navigation, form filling, and data extraction
4. Server runs on localhost with configurable browser options

## Testing Guidelines

### Test File Organization

#### Unit Tests (`tests/`)
- `validation.test.js` - Input validation functions
- `ui-state.test.js` - UI visibility and state management
- `data-transformation.test.js` - Preview generation and data processing
- `localStorage.test.js` - Persistence operations
- `menu-actions.test.js` - User interaction workflows
- `settings.test.js` - AI settings functionality, modal interactions, and endpoint validation
- `setup.js` - Jest configuration and mocks

#### E2E Tests (`e2e-tests/`)
- `basic-functionality.spec.js` - Core application workflows
- Test configuration in `playwright.config.js` with multi-browser support

### Mock Strategy
- All browser APIs are comprehensively mocked in `tests/setup.js`
- External libraries (marked, js-yaml) have simple mocks
- FileReader mock simulates both text and image file handling
- localStorage mock provides full API simulation

The test suite maintains high coverage while testing real functionality through realistic DOM simulation and comprehensive edge case coverage.