# Release Notes

## Release v0.2: UI Enhancements & Test Suite Implemented

### 🎯 **Core Interface Improvements**

#### **Zen Mode Implementation**

- **Default Launch State**: Application now starts in Zen Mode by default
- **Distraction-Free Focus**: Only Content field and Preview panel visible on startup
- **Toggle Functionality**: Independent View menu control for showing/hiding all metadata fields
- **Status Integration**: Zen Mode status displayed in status bar

#### **Independent UI Controls**

- **Separated Toolbar Toggle**: Toolbar visibility independent from Zen Mode
- **Dynamic Menu Text**: Menu items show current state (Show/Hide All, Show/Hide Toolbar)
- **Persistent State**: UI preferences saved to localStorage (except Zen Mode always defaults to active)
- **Smart State Management**: Toolbar state persists while Zen Mode always resets to active

#### **Layout & UX Enhancements**

- **Content Field Repositioning**: Moved to bottom with H2 heading for better workflow
- **Field Order Optimization**: Meta Data → Content → Preview flow
- **Enhanced Spacing**: Added consistent 1.5625rem padding above all H2 headings
- **Menu Behavior Fix**: Dropdowns now close after selecting items (proper desktop behavior)
- **Streamlined Interface**: Removed duplicate preview buttons, consolidated to menu/toolbar only

### 🔧 **Technical Improvements**

#### **Modern CSS Units Conversion**

- **Typography**: All font-size values converted to rem (0.75rem, 0.875rem, 1rem)
- **Spacing**: Padding/margins converted to rem for accessibility scaling
- **Responsive Containers**: max-width: min(75rem, 95vw) for optimal responsiveness
- **Border Radius**: Converted to rem units (0.1875rem, 0.25rem, 0.5rem)
- **Media Queries**: Updated to rem-based breakpoints (48rem vs 768px)

#### **Dynamic Viewport Sizing**

- **Content Field**: height: calc(86vh - 15rem) for optimal space usage
- **Preview Field**: Matches Content field height for consistency
- **Responsive Design**: Automatically adapts to different screen sizes
- **Minimum Heights**: Maintains 18.75rem minimum for usability

#### **JavaScript Architecture**

- **Independent State Management**: Zen Mode and toolbar toggles work separately
- **Menu Text Updates**: Dynamic text based on current interface state
- **Status Bar Integration**: User feedback for copy/download actions
- **Code Cleanup**: Removed unused button references and event listeners

### 📁 Development Infrastructure

#### Git Integration

- **Updated .gitignore**: Added .DS_Store and macOS system files
- **Version Control**: Clean commits excluding system artifacts

#### Documentation Updates

- **Feature Documentation**: Updated README with all new capabilities
- **Usage Instructions**: Added Zen Mode workflow and interface controls
- **Version Bump**: Updated to v0.2 across all files

## Current Feature Set (v0.2)

### Content Management

- ✅ Meta Data fields (Title, Date, Tags, Summary)
- ✅ File name validation and management
- ✅ Header/Footer templates with persistence
- ✅ Hero image upload with auto-extraction
- ✅ Advanced tag management interface
- ✅ Dynamic content field sizing

### User Interface

- ✅ Mac-style menu bar with proper dropdown behavior
- ✅ Independent toolbar with visual icons
- ✅ Zen Mode for distraction-free writing
- ✅ Dynamic viewport-based sizing
- ✅ Consistent rem-based spacing
- ✅ Responsive design with modern CSS

### File Operations

- ✅ Markdown import with frontmatter parsing
- ✅ Smart image extraction from content
- ✅ Download with proper file naming
- ✅ Copy to clipboard with status feedback
- ✅ Local storage for drafts and preferences
