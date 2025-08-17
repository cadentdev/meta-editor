# Testing Documentation for Meta Editor

## Overview

This document describes the comprehensive unit testing setup for Meta Editor v0.2. The tests validate the existing functionality without requiring any code changes.

## Testing Strategy

The Meta Editor uses a three-tiered testing approach:

### Unit Tests (Jest) - Current

- Test individual functions like `clearEditor()`, `saveToLocalStorage()`, `validateFilename()`
- Mock dependencies and localStorage
- Focus on logic and data transformation

### Integration Tests (Jest + DOM Testing Library) - Future

- Test interactions between components
- Verify menu actions trigger correct functions
- Test UI state management functions

### E2E Tests (Playwright/Puppeteer) - Future

- Test complete user workflows
- Verify persistence across page reloads
- Test file uploads/downloads

## Test Structure

### Test Files

- `tests/setup.js` - Jest configuration and mocks
- `tests/validation.test.js` - Input validation functions
- `tests/ui-state.test.js` - UI state management
- `tests/data-transformation.test.js` - Data processing and preview generation
- `tests/localStorage.test.js` - Local storage operations
- `tests/menu-actions.test.js` - Menu action handlers

### Coverage Areas

#### 1. Validation Functions (`validation.test.js`)

- **validateFilename()** - Filename format validation
- **validateTitle()** - Title length and content validation  
- **validateDate()** - Date presence validation
- **validateSummary()** - Summary length and content validation
- **formatDate()** - Date formatting for frontmatter

**Key Test Cases:**

- Empty field validation
- Minimum length requirements
- Format validation (filename regex, date formats)
- Character count limits
- Whitespace trimming

#### 2. UI State Management (`ui-state.test.js`)

- **updateZenModeMenuText()** - Dynamic menu text updates
- **updateToolbarMenuText()** - Toolbar visibility text
- **loadUIState()** / **saveUIState()** - Persistence
- **applyUIState()** - DOM manipulation for state changes
- **toggleZenMode()** / **toggleUIElement()** - State toggles

**Key Test Cases:**

- Menu text reflects current state
- localStorage persistence and loading
- DOM element visibility changes
- Independent toolbar/zen mode controls
- Error handling for corrupted localStorage

#### 3. Data Transformation (`data-transformation.test.js`)

- **extractHeroImage()** - Markdown image parsing
- **updatePreview()** - Frontmatter and content generation
- **addTag()** / **removeTag()** / **renderTags()** - Tag management
- **formatDate()** - Date formatting

**Key Test Cases:**

- Hero image extraction from various markdown formats
- Frontmatter generation with all field combinations
- Tag addition/removal and duplicate prevention
- Preview content structure and formatting
- Empty field handling

#### 4. LocalStorage Operations (`localStorage.test.js`)

- **saveToLocalStorage()** / **loadFromLocalStorage()** - Data persistence
- **saveHeaderTemplate()** / **loadHeaderTemplate()** - Template management
- **saveFooterTemplate()** / **loadFooterTemplate()** - Template management
- **checkForDefaultTemplates()** - Auto-loading templates

**Key Test Cases:**

- Complete form data save/load cycle
- Hero image data persistence
- Template save/load with confirmation dialogs
- Error handling for corrupted JSON
- Partial data loading
- Auto-template loading when fields are empty

#### 5. Menu Actions (`menu-actions.test.js`)

- **handleMenuAction()** - Central action dispatcher
- **closeAllMenus()** - Menu visibility management
- **copyToClipboard()** - Clipboard operations
- **downloadMarkdown()** - File download functionality
- **clearEditor()** - Form reset functionality

**Key Test Cases:**

- All menu action types (about, save, download, etc.)
- Menu closing before action execution
- Clipboard API success/failure scenarios
- Download link creation and cleanup
- Form clearing with user confirmation
- File validation before download
- Status message updates and timeouts

## Mocking Strategy

### Browser APIs

- **localStorage** - Complete mock with getItem/setItem/removeItem
- **navigator.clipboard** - Mock with success/failure scenarios
- **URL.createObjectURL/revokeObjectURL** - Mock for download functionality
- **FileReader** - Mock for file upload simulation
- **alert/confirm** - Mock for user interaction testing

### External Libraries

- **marked** - Markdown parsing library mock
- **js-yaml** - YAML frontmatter parsing mock

### DOM APIs

- Complete DOM element creation and manipulation
- Event listener attachment and triggering
- CSS class and style property changes

## Test Execution

### Prerequisites

```bash
npm install
```

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage report
npm run test:coverage
```

### Coverage Goals

- **Functions**: 95%+ coverage of all testable functions
- **Lines**: 90%+ line coverage
- **Branches**: 85%+ branch coverage for conditional logic

## Error Scenarios Tested

### Validation Errors

- Empty required fields
- Invalid filename formats
- Content length violations
- Invalid date formats

### Storage Errors

- Corrupted localStorage JSON
- Missing localStorage data
- Storage quota exceeded scenarios

### UI Errors

- Missing DOM elements
- Invalid state transitions
- Menu interaction failures

### API Errors

- Clipboard API failures
- File download errors
- Template loading failures

## Key Testing Principles

### 1. Isolation

Each test function is extracted and tested independently with controlled inputs and mocked dependencies.

### 2. Realistic DOM

Tests create realistic DOM structures that mirror the actual application HTML.

### 3. State Management

UI state is properly initialized and managed across test scenarios.

### 4. Error Coverage

Both success and failure paths are tested for robust error handling validation.

### 5. Async Handling

Clipboard operations and other async functions are properly tested with Promise resolution/rejection.

## Test Reliability Features

### Setup/Teardown

- **beforeEach()** - Resets DOM and mocks for each test
- **mockClear()** - Clears mock call history
- Mock restoration for console methods

### Mock Isolation

- No shared state between tests
- Fresh DOM creation for each test
- Independent localStorage mock state

### Deterministic Results

- Fixed date/time mocking for consistent results
- Controlled random data generation
- Predictable file naming and content

## Integration with Development

### Continuous Testing

- Tests can be run during development with `--watch` mode
- Coverage reports help identify untested code paths
- Jest configuration supports ES modules and modern JavaScript

### Code Quality

- Tests validate existing functionality without requiring changes
- Comprehensive error scenario coverage
- Realistic user interaction simulation

## Future Enhancements

### Additional Test Types

- Integration tests for component interactions
- E2E tests for complete user workflows  
- Performance tests for large content handling

### Enhanced Mocking

- More sophisticated FileReader simulation
- Network request mocking for future features
- Advanced DOM event simulation

This testing setup provides comprehensive validation of the Meta Editor's core functionality while maintaining the principle of testing existing code without modifications.
