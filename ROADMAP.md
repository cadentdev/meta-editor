# Meta Editor Development Plan & Session Improvements

## Project Overview

Meta Editor is a web-based Markdown editor focused on preparing blog posts with proper YAML frontmatter and metadata. The application emphasizes privacy (client-side only), accessibility, and a distraction-free writing experience.

## Upcoming Development Priorities

### Basic AI Generation

- [ ] Save, load and edit basic AI settings (Ollama endpoint, preferred model)
- [ ] Use Ollama API
- [ ] Generate Summary
- [ ] Generate Multiple Title
- [ ] Generate File Name
- [ ] Generate Tags
- [ ] Generate Alt Text
- [ ] Generate Tags

### BYOK AI Generation

- [ ] Help menu
- [ ] Use Claude API key (add to settings)

### Collaboration & Sync**

- [ ] Optional cloud sync (maintaining privacy focus)
- [ ] Export to popular blogging platforms
- [ ] Team collaboration features
- [ ] Version history

### Mobile & Accessibility

- [ ] Progressive Web App (PWA) support
- [ ] Touch-optimized interface
- [ ] Enhanced accessibility features
- [ ] Offline-first improvements

### Phase 5: Wishlist

- [ ] Markdown syntax highlighting in Content field
- [ ] Live word/character count
- [ ] Auto-save functionality
- [ ] Writing time tracking
- [ ] Multiple document tabs
- [ ] Export to additional formats (HTML, PDF)
- [ ] Custom CSS themes
- [ ] Plugin architecture for extensions

## Technical Debt & Maintenance

- [ ] Comprehensive unit test suite implementation
- [ ] E2E testing with Playwright
- [ ] Performance optimization analysis
- [ ] Cross-browser compatibility testing
- [ ] Security audit for client-side storage
