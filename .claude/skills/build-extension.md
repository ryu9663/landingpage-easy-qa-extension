# Skill: Build Extension

Validate and prepare the Chrome Extension for loading.

## Trigger

When user wants to build, validate, or prepare the extension for testing.

## Steps

1. **Validate manifest.json**
   - Check required fields: `manifest_version`, `name`, `version`
   - Verify permissions are minimal (`activeTab`, `scripting`)
   - Confirm action configuration exists

2. **Check file structure**
   - Verify all referenced files exist:
     - `background.js`
     - `content.js`
     - `styles.css`
     - Icon files (16, 48, 128px)

3. **Validate JavaScript syntax**
   - Parse background.js for syntax errors
   - Parse content.js for syntax errors

4. **Check CSS validity**
   - Verify styles.css exists and is valid

5. **Report results**
   - List any missing files
   - List any validation errors
   - Provide fix suggestions

## Output Format

```
Build Validation Results
========================
[✓] manifest.json valid
[✓] background.js exists and valid
[✓] content.js exists and valid
[✓] styles.css exists
[✓] icons/icon16.png exists
[✓] icons/icon48.png exists
[✓] icons/icon128.png exists

Status: Ready to load
```
