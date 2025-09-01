# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is UAM (User Agent Matrix), a Chrome extension built with Manifest V3 that allows users to switch between different user agents through a simple browser/OS matrix interface. The extension modifies both HTTP headers and JavaScript navigator properties to provide comprehensive user agent spoofing.

## Architecture

### Core Components

1. **Service Worker** (`background.js`) - Manages declarativeNetRequest rules for HTTP header modification and coordinates extension state
2. **Popup Interface** (`popup.js`, `popup.html`) - Matrix-based UI for selecting user agents and managing custom user agents  
3. **Content Script** (`content.js`) - Bridge between service worker and injected script, handles cross-context messaging
4. **Injection Script** (`inject.js`) - Runs in page context to modify navigator properties (userAgent, platform, vendor, etc.)

### Data Flow

```
Popup Selection → Background Service Worker → Content Script → Injected Script
                           ↓
                  HTTP Headers Modified (declarativeNetRequest)
```

### User Agent Handling

The extension uses a dual approach:
- **HTTP Headers**: Modified via `chrome.declarativeNetRequest` API for server requests
- **JavaScript Properties**: Modified via property redefinition in the page context for client-side detection

Predefined user agents include Chrome, Firefox, Safari, and Edge across Windows, macOS, and Linux platforms. Users can also create, save, and manage custom user agents.

## Development Commands

### Validation
```bash
python3 validate_extension.py
```
Validates extension structure, manifest.json, required files, and basic functionality.

### Testing
- Use `test.html` for local testing of user agent changes
- Test on external sites like `https://httpbin.org/user-agent` for HTTP header validation
- Follow comprehensive testing procedures in `TEST_GUIDE.md`

### Installation for Development
1. Open Chrome and navigate to `chrome://extensions/`
2. Enable Developer Mode
3. Click "Load unpacked" and select the project directory
4. For updates, use the reload button in the extensions page

## Important Notes

### Extension Permissions
- `declarativeNetRequest`: Required for HTTP header modification
- `storage`: For persisting user selections and custom user agents
- `activeTab`, `scripting`, `tabs`: For content script injection and messaging
- `<all_urls>`: Broad permissions needed for universal user agent modification

### Limitations
- Chrome system pages (`chrome://`, `about://`) are not supported due to browser restrictions
- Some sites with advanced detection may still identify the original browser
- Content Security Policy (CSP) strict pages may block script injection

### Code Patterns
- All user agent strings are stored in both `popup.js` and `background.js` (consider centralizing if modified)
- Storage uses `chrome.storage.sync` for cross-device synchronization
- Error handling gracefully handles tab messaging failures (common for restricted pages)
- Badge display shows "ON" when custom user agent is active

### Files Structure
- `manifest.json`: Extension configuration (Manifest V3)
- `popup.html`: Matrix-style interface with inline CSS
- Core scripts: `background.js`, `popup.js`, `content.js`, `inject.js`
- `icons/`: Extension icons (16px, 48px, 128px)
- Documentation: `README.md`, `TEST_GUIDE.md`, `TROUBLESHOOTING.md`, `install.md`
- Utilities: `validate_extension.py`, `generate_icons.py`