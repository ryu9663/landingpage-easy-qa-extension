# Landing Font QA Extension

Chrome Extension for QA teams to quickly verify font-size and font-weight on landing pages.

## Project Overview

- **Type**: Chrome Extension (Manifest V3)
- **Purpose**: Display font specs as badges over visible text elements
- **Target Users**: Frontend developers, publishers, designers, QA teams

## Tech Stack

- Vanilla JavaScript (ES6+)
- Chrome Extension API (MV3)
- CSS for badge styling

## Project Structure

```
/
├── manifest.json          # Extension manifest (MV3)
├── background.js          # Service worker for toggle handling
├── content.js             # Content script for text detection & badge rendering
├── styles.css             # Badge/overlay styles
├── icons/                 # Extension icons (16, 48, 128px)
├── prd.md                 # Product Requirements Document
├── todolist.md            # Development task checklist
└── .claude/               # Claude Code configuration
    ├── skills/            # Reusable skill definitions
    ├── commands/          # User-invocable commands
    └── agents/            # Specialized agent definitions
```

## Key Technical Decisions

| Item | Decision | Notes |
|------|----------|-------|
| opacity threshold | `0` only | Elements with opacity 0.01+ are shown |
| Max badges | 800 | Performance safeguard |
| same-origin iframe | v0 excluded | Future v1+ feature |
| Shadow DOM | v0 excluded | Future v1+ feature |

## Development Guidelines

### Text Detection Logic
1. Viewport intersection check (`getBoundingClientRect`)
2. Non-empty text validation (trimmed length > 0)
3. Hidden element exclusion:
   - `display: none`
   - `visibility: hidden`
   - `opacity: 0`

### Performance Constraints
- Debounce: 1000ms for scroll/resize/mutation events
- Max badges: 800
- Use `requestAnimationFrame` for rendering
- `pointer-events: none` on overlay

### Badge Rendering
- Display: `{font-size}px / {font-weight}`
- Position: Top-left of text element
- Container: Independent root with high z-index

## Commands

- `/build` - Validate extension files
- `/test` - Run QA checklist tests
- `/load` - Guide for loading extension in Chrome
- `/phase` - Show current development phase status

## Common Tasks

### Loading Extension in Chrome
1. Open `chrome://extensions`
2. Enable "Developer mode"
3. Click "Load unpacked"
4. Select project folder

### Testing Changes
1. Make code changes
2. Go to `chrome://extensions`
3. Click refresh icon on the extension
4. Reload the test page

## Reference

- [Chrome Extension MV3 Docs](https://developer.chrome.com/docs/extensions/mv3/)
- [PRD](./prd.md)
- [Todo List](./todolist.md)
