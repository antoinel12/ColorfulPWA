# Colorful PWA Extension - Plain HTML + JavaScript Version

This is a simplified version of the Colorful PWA extension converted from React + TypeScript + Webpack to plain HTML + JavaScript.

## Installation

1. Open Chrome and go to `chrome://extensions/`
2. Enable "Developer mode" (top right)
3. Click "Load unpacked"
4. Select this `extension` folder

## File Structure

- `manifest.json` - Extension configuration
- `popup.html` - Popup UI
- `popup.js` - Popup logic (vanilla JavaScript)
- `popup.css` - Popup styles
- `contentScript.js` - Script injected into web pages
- `background.js` - Service worker
- `offscreen.html` - Offscreen document for media queries
- `offscreen.js` - Offscreen script
- `icons/` - Extension icons (needs to be added)

## Features

- Choose title bar color per website
- Enable/disable per website
- Light/dark mode support
- No build process required
- No npm dependencies

## Notes

You will need to add the icon files to the `icons/` folder:
- icon16.png
- icon48.png
- icon128.png
- icon16_dark.png (optional)
- icon48_dark.png (optional)
- icon128_dark.png (optional)
