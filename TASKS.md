# Active Development Tasks

**Current Focus:** AI Generation Features
**Last Updated:** October 1, 2025

This document tracks active development work, immediate priorities, and backlog items. For strategic product direction, see [PRD.md](PRD.md). For completed features, see [RELEASE-NOTES.md](RELEASE-NOTES.md).

---

## In Progress 🚧

### AI Generation Dialog
- [x] Add a "Results" read only field in the lower right under the "Preview" field and display the output of the AI interactions in that field -- basically a "log viewer" for the AI interactions.
- [ ] Create modal dialog component for AI generation responses
- [ ] Add "Generate" button to toolbar for quick access
- [ ] Design UI for multiple AI-generated options (titles, summaries, etc.)
- [ ] Add user selection and refinement controls

---

## Up Next 📋

### AI-Powered Metadata Generation

**Priority 1: Title Generation**
- [ ] Generate multiple title options from content analysis
- [ ] Allow user to select or refine generated titles
- [ ] Save generation preferences to localStorage

**Priority 2: Summary Generation**
- [ ] Generate meta descriptions from content
- [ ] Optimize for 160-character limit
- [ ] Provide multiple tone options (professional, casual, technical)

**Priority 3: Filename Suggestions**
- [ ] Generate SEO-friendly filename suggestions
- [ ] Enforce lowercase-with-hyphens format
- [ ] Show multiple alternatives

**Priority 4: Tag Generation**
- [ ] Analyze content for relevant tags
- [ ] Suggest tags based on existing tag history
- [ ] Allow bulk acceptance or individual selection

**Priority 5: Alt Text for Images**
- [ ] Generate descriptive alt text for hero images
- [ ] Support accessibility best practices
- [ ] Allow user editing before acceptance

### BYOK (Bring Your Own Key) Support
- [ ] Add API key field to Settings modal
- [ ] Support Claude API (Anthropic)
- [ ] Support OpenAI API
- [ ] Implement secure localStorage encryption for keys
- [ ] Add provider selection dropdown (Ollama local, Claude, OpenAI)
- [ ] Usage tracking and rate limit warnings

---

## Backlog 📚

### Help & UI Improvements
- [ ] Create Help modal dialog with keyboard shortcuts
- [ ] Add Help menu item
- [ ] Add Help icon to toolbar
- [ ] Add Settings icon to toolbar (currently AI status indicator opens settings)
- [ ] Update About dialog - convert from browser alert to JS modal
- [ ] Add links to documentation in About dialog
- [ ] Create program icon and favicon

### User Experience Enhancements
- [ ] Keyboard shortcuts for common actions (Ctrl+S save, Ctrl+N new, etc.)
- [ ] Drag-and-drop file import for Markdown files
- [ ] Tag autocomplete from history
- [ ] Dark mode support
- [ ] Live word/character count in Content field
- [ ] Auto-save functionality with configurable interval
- [ ] Writing time tracking

### Mobile & PWA
- [ ] Progressive Web App (PWA) manifest
- [ ] Service worker for offline-first architecture
- [ ] Install to home screen/desktop support
- [ ] Touch-optimized interface for mobile devices
- [ ] Responsive design improvements for small screens

### Advanced Features (Wishlist)
- [ ] Markdown syntax highlighting in Content field
- [ ] Multiple document tabs
- [ ] Synchronized scrolling between Content and Preview
- [ ] Export to additional formats (HTML, PDF)
- [ ] Custom CSS themes
- [ ] Plugin architecture for extensions
- [ ] Export to WordPress REST API
- [ ] Optional cloud sync (maintaining privacy focus)
- [ ] Version history for documents

---

## Technical Debt & Quality 🔧

### Testing (Pre-Production)
- [ ] Full cross-browser E2E testing (Chromium, Firefox, WebKit)
- [ ] Responsive design testing across viewports
- [ ] Visual regression testing setup
- [ ] Performance benchmarking and optimization
- [ ] Accessibility audit (WCAG 2.1 AA compliance)

### Code Quality
- [ ] Security audit for localStorage usage
- [ ] Dependency vulnerability scanning
- [ ] CSP (Content Security Policy) header implementation
- [ ] SRI (Subresource Integrity) for CDN dependencies
- [ ] Code documentation improvements

---

## Blocked 🚫

[No current blockers]

---

## Recently Completed ✅

### Results Logging Field (v0.2.2)
- [x] Results panel for AI interaction logging
- [x] Message type support (info, success, error, ai-response)
- [x] Copy and clear functionality with user feedback
- [x] Zen Mode visibility control
- [x] Session persistence via localStorage
- [x] Comprehensive test coverage (32 unit tests, E2E tests)

### AI Status Indicator (v0.2.1)
- [x] Visual status monitoring with robot icon
- [x] Four status states: Inactive, Active, Error, Checking
- [x] Click to configure - opens Settings modal
- [x] Smart connection validation with timeout handling
- [x] Status persistence across sessions

### AI Settings Infrastructure (v0.2.0)
- [x] Settings Modal Dialog with professional UI
- [x] Ollama endpoint configuration with validation
- [x] Model discovery from Ollama API
- [x] Model selection dropdown with file sizes
- [x] Settings persistence to localStorage
- [x] Comprehensive error handling and user feedback
- [x] Complete unit test coverage (14 tests)

### Agent System Implementation
- [x] Review and update agent system for project compatibility
- [x] Add project-specific instructions to agent dossiers
- [x] Update agent descriptions with examples
- [x] Resolve CORS issues with Ollama API

---

## Notes

- **Testing Philosophy:** Use Chromium desktop (headed mode) for early feature development. Run full cross-browser testing pre-production.
- **AI Generation Strategy:** Start with Ollama (local, privacy-first), then add BYOK for cloud APIs
- **UI Priorities:** Focus on desktop experience first, mobile optimization comes later
- **Documentation:** Update README.md and RELEASE-NOTES.md when features ship
