#!/bin/bash

# Manifest validation script

echo "🔍 Validating Colorful PWA Extension Manifest..."
echo ""

# Check if manifest.json exists
if [ ! -f "extension/manifest.json" ]; then
    echo "❌ manifest.json not found!"
    exit 1
fi

# Check if all required files exist
REQUIRED_FILES=(
    "extension/manifest.json"
    "extension/popup.html"
    "extension/popup.js"
    "extension/popup.css"
    "extension/contentScript.js"
    "extension/background.js"
    "extension/offscreen.html"
    "extension/offscreen.js"
)

echo "📋 Checking required files:"
for file in "${REQUIRED_FILES[@]}"; do
    if [ -f "$file" ]; then
        echo "  ✅ $file"
    else
        echo "  ❌ $file - MISSING!"
    fi
done

echo ""
echo "🎨 Checking icon files:"
ICON_FILES=(
    "extension/icons/icon16.png"
    "extension/icons/icon48.png"
    "extension/icons/icon128.png"
    "extension/icons/icon16_dark.png"
    "extension/icons/icon48_dark.png"
    "extension/icons/icon128_dark.png"
)

for file in "${ICON_FILES[@]}"; do
    if [ -f "$file" ]; then
        SIZE=$(stat -f%z "$file" 2>/dev/null || stat -c%s "$file" 2>/dev/null)
        echo "  ✅ $file (${SIZE} bytes)"
    else
        echo "  ⚠️  $file - NOT FOUND (optional)"
    fi
done

echo ""
echo "✨ All checks completed!"
echo ""
echo "Next: Load the extension at chrome://extensions/ with 'Load unpacked'"
