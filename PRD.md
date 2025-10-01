# Product Requirements Document: Meta Editor

**Version:** 0.2.0
**Last Updated:** October 1, 2025
**Project Sponsor:** Cadent Technologies Corp.
**License:** GNU General Public License v3.0
**Repository:** github.com/cadentdev/meta-editor

---

## Executive Summary

Meta Editor is a client-side web application that helps content creators prepare Markdown documents with proper YAML frontmatter metadata for web publication. The application runs entirely in the browser with zero server dependencies, emphasizing privacy, accessibility, and a distraction-free writing experience.

**Current Status:** v0.2.0 with core editing features, Zen Mode, AI settings infrastructure, and comprehensive test coverage.

---

## Problem Statement

Content creators publishing to the web face several friction points when preparing Markdown documents:

1. **Metadata Complexity**: Static site generators (Hugo, Jekyll, Gatsby) require precise YAML frontmatter with specific field names, formats, and validation rules
2. **Context Switching**: Writers must toggle between their Markdown editor, YAML documentation, and preview tools
3. **Error-Prone Manual Entry**: Hand-crafted frontmatter leads to syntax errors, incorrect date formats, and inconsistent metadata
4. **Workflow Interruption**: Existing Markdown editors focus on writing, not on the publication preparation workflow
5. **Privacy Concerns**: Cloud-based tools require uploading content to third-party servers

Meta Editor solves these problems by providing a dedicated, privacy-first interface for metadata preparation that complements rather than replaces existing Markdown editors.

---

## Target Audience

### Primary Users
Content creators who prefer Markdown format and need to publish web content with structured metadata:

- **Bloggers**: Personal or professional blog authors publishing to static site generators
- **Technical Writers**: Documentation authors creating content for developer portals or knowledge bases
- **Documentation Authors**: Writers maintaining product documentation, API references, or user guides
- **Journalists**: Writers preparing articles for CMS platforms that accept Markdown with frontmatter

### User Characteristics
- Comfortable with Markdown syntax
- Publish to platforms requiring YAML frontmatter (Hugo, Jekyll, Gatsby, Astro)
- Value privacy and offline capability
- Prefer distraction-free writing environments
- May have accessibility needs requiring scalable interfaces

### Non-Target Users
Meta Editor is **not** designed for:
- Users seeking a full-featured Markdown editor (use Obsidian, Typora, or VS Code instead)
- Teams requiring real-time collaboration
- Users needing rich media embedding or WYSIWYG editing
- Organizations requiring centralized content management systems

---

## Competitive Landscape

Meta Editor does not compete directly with general-purpose Markdown editors like Obsidian, Typora, or VS Code. Instead, it occupies a specific niche in the content preparation workflow.

### Market Position

**Meta Editor's Unique Value:**
- Specialized tool for frontmatter metadata preparation
- Complements existing Markdown editors rather than replacing them
- Zero-friction distribution (visit webpage, start using)
- No authentication, no cloud storage, no server dependencies
- Privacy-first architecture with client-side only processing

### Workflow Integration

**Typical User Journey:**
1. Write content in preferred Markdown editor (Obsidian, VS Code, etc.)
2. Open Meta Editor to add/refine frontmatter metadata
3. Use AI assistance for title optimization, tag generation, summary creation
4. Export complete document with validated frontmatter
5. Publish to static site generator or CMS

**Key Differentiator:** Meta Editor uses Markdown as the data interchange format to ensure compatibility with popular editors and AI interfaces, not as a competitive feature.

---

## Product Vision

### Current State (v0.2.0)

**Core Functionality:**
- ✅ YAML frontmatter editing with real-time preview
- ✅ Field validation (filename, title, date, summary, tags)
- ✅ Markdown import/export with frontmatter parsing
- ✅ Hero image upload and management
- ✅ Template system for headers/footers
- ✅ Zen Mode for distraction-free editing
- ✅ Independent toolbar visibility control
- ✅ Local storage persistence for drafts
- ✅ AI settings infrastructure (Ollama integration)
- ✅ Comprehensive test suite (132+ unit tests, E2E tests)

**AI Integration (Current):**
- ✅ AI Settings modal with endpoint configuration
- ✅ Model discovery and selection from Ollama instances
- ✅ Connection status indicator with visual feedback
- ✅ Settings persistence in localStorage

### Near-Term Roadmap (Next 3-6 Months)

**AI-Powered Content Enhancement:**
- 🔄 Generate optimized titles from content analysis
- 🔄 Create compelling summaries (meta descriptions)
- 🔄 Suggest relevant tags based on content and existing taxonomy
- 🔄 Multi-provider support (local Ollama + future API integrations)

**User Experience Improvements:**
- 🔄 Keyboard shortcuts for common actions
- 🔄 Drag-and-drop file import
- 🔄 Tag management with autocomplete from history
- 🔄 Dark mode support
- 🔄 Accessibility enhancements (ARIA labels, screen reader optimization)

**Quality & Performance:**
- 🔄 Visual regression testing
- 🔄 Cross-browser compatibility validation
- 🔄 Performance benchmarking and optimization

### Future Vision (6-12+ Months)

**Progressive Web App:**
- 📋 Offline-first architecture with service workers
- 📋 Install to home screen/desktop
- 📋 Background sync for AI features when online
- 📋 App-like experience on mobile devices

**Advanced AI Features:**
- 📋 BYOK (Bring Your Own Key) for Claude API, OpenAI, or other providers
- 📋 Content improvement suggestions
- 📋 SEO optimization recommendations
- 📋 Multi-language support for international audiences
- 📋 Custom AI prompt templates

**Platform Enhancements:**
- 📋 Export to multiple static site generator formats
- 📋 Custom field definitions for different CMS platforms
- 📋 Batch processing for multiple documents
- 📋 Integration with popular writing tools via browser extensions

---

## Technical Requirements

### Architecture Principles

**Client-Side Only Processing:**
- All logic executes in the browser using vanilla JavaScript
- No build process or compilation required
- No server-side components or APIs (except optional AI integrations)
- Zero telemetry or analytics tracking

**Privacy-First Design:**
- No user data leaves the browser (except explicit AI API calls)
- Local storage only for drafts and preferences
- No authentication or user accounts
- No third-party tracking or cookies

**Accessibility & Standards:**
- Rem-based responsive design for font scaling
- Semantic HTML with proper ARIA attributes
- Keyboard navigation support
- WCAG 2.1 AA compliance (target)

### Technology Stack

**Runtime (CDN-loaded):**
- **marked.js** - Markdown to HTML conversion
- **js-yaml** - YAML parsing and generation
- **Font Awesome 6.4.0** - UI iconography

**Development:**
- **Jest 29.7.0** - Unit testing framework (132+ tests)
- **Playwright 1.55.0** - E2E testing across browsers
- **http-server** - Local development server
- **Vanilla JavaScript ES6+** - No frameworks or build tools

### Browser Support

**Required Compatibility:**
- Current versions of modern browsers only:
  - Google Chrome / Chromium (latest)
  - Mozilla Firefox (latest)
  - Apple Safari (latest)
  - Microsoft Edge (latest, Chromium-based)

**Progressive Enhancement:**
- Core functionality works without JavaScript disabled warning
- Graceful degradation for older browsers (show compatibility message)

### Performance Targets

- **Initial Load:** < 2 seconds on 3G connection
- **Time to Interactive:** < 1 second
- **File Operations:** Instant for files < 1MB
- **AI Response Time:** < 5 seconds for generation (network dependent)

---

## Functional Requirements

### 1. Metadata Editing

**FR-1.1: Frontmatter Fields**
- Title field with real-time validation
- Date field with ISO 8601 format validation
- Tags field with tag management interface
- Summary field with 160-character recommendation
- Hero image upload with preview
- Custom header/footer template support

**FR-1.2: Filename Validation**
- Enforce lowercase-with-hyphens format
- Real-time validation feedback
- Automatic suggestion generation from title

**FR-1.3: Content Editor**
- Large textarea for Markdown content
- Dynamic viewport-based sizing (86vh - 15rem)
- Minimum height: 18.75rem

**FR-1.4: Real-Time Preview**
- Live Markdown rendering with marked.js
- YAML frontmatter display
- Synchronized scrolling (future)

### 2. File Operations

**FR-2.1: Import**
- Upload Markdown files with frontmatter parsing
- Extract hero image from existing content
- Preserve existing metadata and content

**FR-2.2: Export**
- Download complete Markdown with frontmatter
- Automatic filename generation from title
- Proper .md file extension

**FR-2.3: Copy to Clipboard**
- One-click copy of complete document
- Status bar confirmation feedback
- Fallback for unsupported browsers

### 3. User Interface

**FR-3.1: Zen Mode**
- Default launch state: Zen Mode active
- Hide all metadata fields, show only Content + Preview
- Toggle via View menu
- Status bar indicator
- Always resets to active on page load

**FR-3.2: Toolbar**
- Independent visibility toggle (persists across sessions)
- Icon-based quick actions (New, Upload, Download, Copy, Preview)
- Show/Hide via View menu

**FR-3.3: Menu Bar**
- Mac-style dropdown menus (File, Edit, View)
- Dynamic menu text reflecting current state
- Proper close-on-select behavior

**FR-3.4: Responsive Design**
- Rem-based typography and spacing
- Viewport-aware container sizing: min(75rem, 95vw)
- Single-column layout for mobile
- Touch-friendly controls

### 4. AI Integration

**FR-4.1: AI Settings (Current)**
- Settings modal accessible from toolbar
- Ollama endpoint configuration
- Model discovery and selection
- Connection status indicator (inactive, active, error, checking)
- Settings persistence in localStorage

**FR-4.2: AI Generation Features (Planned)**
- Generate optimized titles from content
- Create meta descriptions/summaries
- Suggest relevant tags
- Retry and refinement controls
- Token usage awareness

**FR-4.3: Multi-Provider Support (Future)**
- BYOK for Claude API, OpenAI, Anthropic
- Provider selection in settings
- API key management with local encryption
- Usage tracking and limits

### 5. Data Persistence

**FR-5.1: Local Storage**
- Auto-save drafts to localStorage
- Persist UI preferences (toolbar visibility)
- Store AI settings (endpoint, model selection)
- Template storage (headers, footers)
- Tag history for autocomplete (future)

**FR-5.2: Data Portability**
- Export all settings as JSON (future)
- Import settings from JSON (future)
- Clear all data option

---

## Non-Functional Requirements

### NFR-1: Security & Privacy

- **NFR-1.1:** No user data transmitted to servers (except explicit AI API calls)
- **NFR-1.2:** No cookies or tracking pixels
- **NFR-1.3:** Content Security Policy headers for XSS protection
- **NFR-1.4:** Subresource Integrity (SRI) for CDN dependencies
- **NFR-1.5:** API keys encrypted in localStorage (future BYOK feature)

### NFR-2: Reliability

- **NFR-2.1:** Graceful degradation when localStorage unavailable
- **NFR-2.2:** Error boundaries for third-party library failures
- **NFR-2.3:** Auto-recovery from AI API timeouts
- **NFR-2.4:** Data validation before export operations

### NFR-3: Maintainability

- **NFR-3.1:** 90%+ unit test coverage (currently 132+ tests)
- **NFR-3.2:** E2E test coverage for critical user workflows
- **NFR-3.3:** No build process required for development
- **NFR-3.4:** Vanilla JavaScript with ES6+ features (no framework lock-in)
- **NFR-3.5:** Comprehensive inline documentation

### NFR-4: Accessibility

- **NFR-4.1:** WCAG 2.1 AA compliance
- **NFR-4.2:** Keyboard navigation for all features
- **NFR-4.3:** Screen reader compatibility
- **NFR-4.4:** High contrast mode support
- **NFR-4.5:** Rem-based scaling for font size preferences

### NFR-5: Usability

- **NFR-5.1:** Zero learning curve for Markdown-familiar users
- **NFR-5.2:** Inline validation with helpful error messages
- **NFR-5.3:** Status bar feedback for all operations
- **NFR-5.4:** Consistent UI patterns (Mac desktop metaphor)

---

## Success Criteria

### Primary Success Metric

**Shipping a usable product:** Deliver a stable, feature-complete application that external users can adopt for real-world content preparation workflows.

### Validation Criteria

1. **Functional Completeness:**
   - All core features (FR-1 through FR-3) working without bugs
   - AI settings infrastructure operational (FR-4.1)
   - Comprehensive test coverage (90%+ unit, critical E2E paths)

2. **User Adoption Indicators:**
   - Positive feedback from early adopters
   - GitHub stars and community interest
   - Minimal bug reports (< 5 critical bugs in first month)
   - Feature requests indicating real-world usage

3. **Technical Quality:**
   - Cross-browser compatibility (Chrome, Firefox, Safari)
   - Performance targets met (< 2s load, < 1s interactive)
   - Zero security vulnerabilities in dependencies
   - Clean accessibility audit (no critical WCAG violations)

4. **Community Health:**
   - Accurate and valuable bug reports from users
   - Community contributions (code, documentation, translations)
   - Active issue discussions and feature requests
   - Low friction for new contributors

---

## Distribution & Sustainability

### Distribution Strategy

**Primary Distribution Channel:**
- Web-based access at hosted URL (Cadent Technologies Corp. hosting)
- Zero-friction onboarding: visit page, start using immediately
- No installation, no signup, no configuration required

**Secondary Channels:**
- GitHub repository for code review and contributions
- Self-hosting instructions for privacy-conscious users
- Progressive Web App installation (future)

### Sustainability Model

**Short-Term (Current):**
- Sponsored by Cadent Technologies Corp.
- Provides hosting infrastructure and development resources
- Sufficient for initial development and launch

**Long-Term (Future):**
- Open-source GPL v3.0 license ensures community ownership
- Encourage community contributions via GitHub
- Potential for GitHub Sponsors or Open Collective (optional)
- Enterprise support offerings (custom deployments, training)

### Community Contribution Goals

1. **Bug Reports:** Accurate, reproducible issue reports from real-world usage
2. **Feature Requests:** Community-driven roadmap prioritization
3. **Code Contributions:** Pull requests for bug fixes and new features
4. **Documentation:** Improve user guides, examples, and tutorials
5. **Translations:** Localization for international audiences (future)

---

## Development Workflow

### Testing Philosophy

**Progressive Testing Strategy:**

**Early Development (Current):**
- Focus on Chromium desktop for rapid iteration
- Use headed mode for visual feedback
- Playwright UI mode for interactive debugging

**Pre-Production (Before Release):**
- Full cross-browser testing (Chromium, Firefox, WebKit)
- Responsive design validation across viewports
- Visual regression testing
- Performance benchmarking

### Agent-Based Development

The project uses specialized AI agents for development phases:

- **Planning Agent** (`agents/planning.md`) - Feature analysis and implementation planning
- **Implementation Agent** (`agents/implementation.md`) - Code changes and development
- **Testing Agent** (`agents/testing.md`) - Test execution and validation
- **Review Agent** (`agents/review.md`) - Code quality assessment
- **Documentation Agent** (`agents/documentation.md`) - Documentation maintenance

**Typical Workflow:**
1. Planning → Research and create implementation plan
2. Implementation → Execute approved plan
3. Testing → Validate with Chromium desktop (headed mode)
4. Review → Assess code quality
5. Documentation → Update project docs
6. Later: Full cross-browser and responsive testing

---

## Risk Analysis

### Technical Risks

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Browser API deprecation | Low | Medium | Monitor MDN updates, feature detection |
| CDN dependency unavailable | Low | High | Implement fallback to local copies |
| localStorage quota exceeded | Medium | Medium | Implement quota monitoring, cleanup UI |
| AI API rate limiting | Medium | Low | Implement retry logic, user feedback |
| Cross-browser compatibility | Medium | Medium | Comprehensive E2E testing before release |

### Product Risks

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Low user adoption | Medium | Medium | Focus on specific use case, gather feedback early |
| Feature creep | High | Medium | Strict adherence to PRD, defer non-core features |
| Competitors emerge | Low | Low | Open-source advantage, specialized niche |
| Maintenance burden | Medium | High | Comprehensive tests, simple architecture, community |

### Operational Risks

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Hosting costs increase | Low | Low | Static site hosting is inexpensive |
| Security vulnerabilities | Medium | High | Regular dependency audits, CSP headers |
| GDPR/privacy concerns | Low | Low | No data collection, privacy-first architecture |
| Sponsorship withdrawal | Low | Medium | Open-source ensures continuity, self-hosting option |

---

## Open Questions & Future Considerations

### Technical Decisions

1. **PWA Implementation Timeline:** When should we prioritize offline-first architecture?
2. **AI Provider Priorities:** Which BYOK providers should we support first (Claude, OpenAI, others)?
3. **Mobile Experience:** Should we optimize for mobile editing or focus on desktop?
4. **Export Formats:** Which static site generators should we prioritize for custom export formats?

### User Experience

1. **Onboarding:** Do we need a tutorial or is the interface self-explanatory?
2. **Keyboard Shortcuts:** What actions are most frequently used and need shortcuts?
3. **Tag Management:** Should we build a tag taxonomy system or keep it simple?
4. **Collaboration:** Is there demand for sharing/collaboration features despite privacy focus?

### Community & Growth

1. **Documentation Strategy:** What level of documentation do contributors need?
2. **Contribution Guidelines:** How do we balance quality with welcoming new contributors?
3. **Localization Priority:** Which languages should we support first?
4. **Marketing Strategy:** How do we reach target users without a marketing budget?

---

## Appendix

### Glossary

- **Frontmatter:** YAML metadata block at the beginning of Markdown files
- **Static Site Generator (SSG):** Tools like Hugo, Jekyll, Gatsby that convert Markdown to HTML
- **Zen Mode:** Distraction-free editing mode showing only content and preview
- **BYOK:** Bring Your Own Key (API key management for AI services)
- **PWA:** Progressive Web App (web app that behaves like a native app)

### Related Documentation

- `README.md` - User-facing documentation and feature overview
- `ROADMAP.md` - Detailed development roadmap with task tracking
- `CLAUDE.md` - Development guidelines for AI-assisted coding
- `README-TESTING.md` - Testing philosophy and procedures
- `RELEASE-NOTES.md` - Version history and changelog

### Contact & Support

- **Repository:** github.com/cadentdev/meta-editor
- **Issues:** github.com/cadentdev/meta-editor/issues
- **Sponsor:** Cadent Technologies Corp.
- **License:** GNU General Public License v3.0

---

**Document History:**
- v1.0 - October 1, 2025 - Initial PRD creation based on v0.2.0 codebase
