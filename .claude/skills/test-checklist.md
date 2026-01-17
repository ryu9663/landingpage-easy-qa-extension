# Skill: Test Checklist

Extension 기능 테스트용 QA 체크리스트

## Trigger

사용자가 확장 기능을 테스트하고자 할 때 (`/test` 명령 실행 시)

## Test Categories

### 1. Toggle Tests
- [ ] Extension icon click toggles overlay ON
- [ ] Second click toggles overlay OFF
- [ ] Page refresh resets to OFF state
- [ ] Tab-specific state (doesn't affect other tabs)

### 2. Text Detection Tests
- [ ] Visible text shows badges
- [ ] `display: none` elements excluded
- [ ] `visibility: hidden` elements excluded
- [ ] `opacity: 0` elements excluded
- [ ] Empty/whitespace-only text excluded
- [ ] Off-viewport text excluded

### 3. Badge Rendering Tests
- [ ] Shows font-size in px
- [ ] Shows font-weight correctly
- [ ] Badge positioned near text element
- [ ] Badge doesn't block page interaction

### 4. Auto-refresh Tests
- [ ] Scroll triggers update (after 1000ms debounce)
- [ ] Resize triggers update (after 1000ms debounce)
- [ ] DOM changes trigger update (MutationObserver)

### 5. Performance Tests
- [ ] Max 800 badges enforced
- [ ] No browser freeze on text-heavy pages
- [ ] Smooth scrolling maintained

### 6. Cleanup Tests
- [ ] OFF removes all overlay elements
- [ ] No residual styles on page
- [ ] Event listeners properly removed
- [ ] MutationObserver disconnected

## Test Sites

- Simple landing page
- Long scrolling page
- Text-heavy news article
- Page with fixed/sticky headers
- Page with various font sizes (px, rem, em)

## Output Format

```
Test Results
============
Toggle: 4/4 passed
Detection: 6/6 passed
Render: 4/4 passed
Refresh: 3/3 passed
Performance: 3/3 passed
Cleanup: 4/4 passed

Overall: 24/24 PASSED
```
