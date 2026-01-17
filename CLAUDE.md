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
- `/verify` - Run feedback loop verification

## Feedback Loop Process

모든 기능 구현 후 자동으로 검증 프로세스가 실행됩니다.

### Workflow

```
┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐
│  코드    │────▶│  빌드    │────▶│  피드백  │────▶│  다음    │
│  작성    │     │  검증    │     │  루프    │     │  태스크  │
└──────────┘     └──────────┘     └────┬─────┘     └──────────┘
                                       │ FAIL
                                       ▼
                                 ┌──────────┐
                                 │  수정    │──► (재검증)
                                 └──────────┘
```

### Verification Steps

1. **Pre-Check**: 변경 파일 분석, 영향 범위 식별
2. **Build Check**: 문법/구조 오류 확인
3. **Requirement Check**: PRD 요구사항 충족 확인
4. **Regression Test**: 기존 기능 동작 확인
5. **Side Effect Check**: 의도치 않은 영향 확인

### Key Files

- `.claude/requirements-matrix.md` - 요구사항 추적 매트릭스
- `.claude/agents/feedback-loop.md` - 피드백 루프 에이전트
- `.claude/skills/regression-test.md` - 회귀 테스트 정의
- `.claude/skills/verification-workflow.md` - 검증 워크플로우

## Document Roles

| 문서 | 역할 | 업데이트 시점 |
|------|------|--------------|
| `todolist.md` | 개발 작업 순서 (Phase 기반) | 작업 시작/완료 시 |
| `.claude/requirements-matrix.md` | **요구사항 상태 추적 (Source of Truth)** | 기능 구현/검증 완료 시 |
| `.claude/skills/regression-test.md` | 상세 테스트 케이스 정의 | 테스트 케이스 추가/수정 시 |
| `.claude/skills/test-checklist.md` | QA 테스트 체크리스트 | 테스트 항목 변경 시 |

> **주의**: 진행 상태 확인 시 `requirements-matrix.md`를 기준으로 합니다.

### Pass Criteria

- ✅ 모든 PRD 요구사항 충족
- ✅ 회귀 테스트 100% 통과
- ✅ 사이드이펙트 없음
- ✅ 성능 저하 없음

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
