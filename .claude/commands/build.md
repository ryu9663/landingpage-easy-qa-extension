# Command: /build

Validate extension files and report readiness.

## Description

Checks all extension files for validity and reports any issues that would prevent loading in Chrome.

## Usage

```
/build
```

## What it does

1. Validates `manifest.json` structure and required fields
2. Checks all referenced files exist
3. Validates JavaScript syntax in background.js and content.js
4. Verifies icon files are present
5. Reports build status

## Example Output

```
Build Validation
================

Checking manifest.json...
  ✓ manifest_version: 3
  ✓ name: "Landing Font QA"
  ✓ version: "1.0.0"
  ✓ permissions: ["activeTab", "scripting"]
  ✓ action configured

Checking files...
  ✓ background.js
  ✓ content.js
  ✓ styles.css
  ✓ icons/icon16.png
  ✓ icons/icon48.png
  ✓ icons/icon128.png

Status: ✅ Ready to load in Chrome
```

## On Failure

If validation fails, the command will list specific issues and suggest fixes.
