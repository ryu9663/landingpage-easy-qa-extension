# Command: /load

Display instructions for loading the extension in Chrome.

## Description

Shows step-by-step guide for loading the unpacked extension in Chrome for development testing.

## Usage

```
/load
```

## Output

```
Loading Extension in Chrome
===========================

1. Open Chrome and navigate to:
   chrome://extensions

2. Enable Developer Mode:
   Toggle the switch in the top-right corner

3. Load the extension:
   Click "Load unpacked" button

4. Select folder:
   /Users/ryujunyeol/Desktop/side/landingpage-easy-qa-extension

5. Verify:
   - Extension appears in the list
   - No error messages shown
   - Icon visible in toolbar (pin if needed)

Reloading After Changes
-----------------------
1. Make your code changes
2. Go to chrome://extensions
3. Find "Landing Font QA"
4. Click the refresh icon (↻)
5. Reload your test page

Debugging
---------
- Right-click extension icon → "Inspect popup" (if popup exists)
- Click "Service Worker" link to debug background.js
- Right-click page → "Inspect" → Console for content.js logs

Common Issues
-------------
- "Manifest file missing": Check manifest.json exists
- "Could not load icon": Verify icon paths in manifest
- Script not running: Check content_scripts matches in manifest
```
