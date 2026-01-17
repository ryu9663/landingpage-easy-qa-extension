# Command: /test

Run QA checklist verification.

## Description

Interactive test checklist based on the QA requirements in todolist.md.

## Usage

```
/test
/test toggle      # Test only toggle functionality
/test detection   # Test only text detection
/test performance # Test only performance
```

## Test Categories

### toggle
- ON/OFF via icon click
- Tab-specific state
- Page refresh behavior

### detection
- Visible text detection
- Hidden element exclusion (display, visibility, opacity)
- Viewport boundary handling

### display
- Font-size display accuracy
- Font-weight display accuracy
- Badge positioning
- Pointer-events passthrough

### refresh
- Scroll event handling
- Resize event handling
- Debounce timing (1000ms)

### performance
- Max badge limit (800)
- No browser freeze
- Smooth scrolling

### cleanup
- Complete overlay removal
- Event listener cleanup
- No residual DOM/styles

## Example Output

```
Running QA Tests: All Categories
================================

[Toggle]
  ✓ Icon click toggles ON
  ✓ Second click toggles OFF
  ✓ Refresh resets state
  ✓ Tab-specific state

[Detection]
  ✓ Visible text detected
  ✓ display:none excluded
  ✓ visibility:hidden excluded
  ✓ opacity:0 excluded

...

Summary: 23/23 tests passed
```
