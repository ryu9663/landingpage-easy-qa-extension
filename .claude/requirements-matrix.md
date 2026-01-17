# Requirements Traceability Matrix (RTM)

PRD 요구사항과 구현 상태를 추적하는 매트릭스

> **Source of Truth**: 이 파일이 요구사항 충족 상태의 **공식 기준**입니다.
> 개발 작업 순서는 `todolist.md`를 참조하세요.

## Legend

- ⬜ Not Started
- 🔄 In Progress
- ✅ Implemented
- ✔️ Verified (Feedback Loop Passed)
- ❌ Failed Verification

---

## Core Requirements

### REQ-1: Toggle (PRD 6.1)

| ID | Requirement | Status | Implementation | Test | Side Effects |
|----|-------------|--------|----------------|------|--------------|
| REQ-1.1 | 확장 아이콘 클릭으로 ON/OFF 토글 | ✅ | background.js | Toggle ON/OFF 테스트 | 없음 |
| REQ-1.2 | ON 상태에서 재클릭 시 즉시 제거 | ✅ | content.js:cleanup | Cleanup 테스트 | 이벤트 리스너 해제 필요 |
| REQ-1.3 | 페이지 새로고침 시 기본 OFF | ✅ | 상태 비저장 | Refresh 테스트 | 없음 |

### REQ-2: Text Detection (PRD 6.2)

| ID | Requirement | Status | Implementation | Test | Side Effects |
|----|-------------|--------|----------------|------|--------------|
| REQ-2.1 | 뷰포트 교차 검사 | ✅ | content.js:isInViewport | 화면 밖 텍스트 미표시 | 스크롤 시 재계산 필요 |
| REQ-2.2 | 실제 텍스트 존재 (1자 이상) | ✅ | content.js:hasText | 빈 요소 미표시 | 없음 |
| REQ-2.3 | display:none 제외 | ✅ | content.js:isVisible | 숨김 테스트 | 없음 |
| REQ-2.4 | visibility:hidden 제외 | ✅ | content.js:isVisible | 숨김 테스트 | 없음 |
| REQ-2.5 | opacity:0 제외 (정확히 0만) | ✅ | content.js:isVisible | 숨김 테스트 | 없음 |

### REQ-3: Badge Display (PRD 6.3)

| ID | Requirement | Status | Implementation | Test | Side Effects |
|----|-------------|--------|----------------|------|--------------|
| REQ-3.1 | font-size 표시 | ✅ | content.js:createBadge | 폰트 크기 정확도 | 없음 |
| REQ-3.2 | font-weight 표시 | ✅ | content.js:createBadge | 폰트 굵기 정확도 | 없음 |
| REQ-3.3 | 텍스트 좌상단 위치 | ✅ | content.js:createBadge | 위치 정확도 | 없음 |
| REQ-3.4 | pointer-events: none | ✅ | styles.css | 클릭 통과 테스트 | 없음 |
| REQ-3.5 | DOM/레이아웃 영향 없음 | ✅ | 독립 컨테이너 | 레이아웃 시프트 테스트 | 없음 |
| REQ-3.6 | color 표시 (hex 형식) | ✅ | content.js:createBadge, rgbToHex | 컬러 정확도 (rgb→hex 변환) | 없음 |
| REQ-3.7 | color 미리보기 박스 표시 | ✅ | content.js:createBadge, styles.css | 색상 박스 시각적 확인 | 없음 |

### REQ-4: Auto Refresh (PRD 6.4)

| ID | Requirement | Status | Implementation | Test | Side Effects |
|----|-------------|--------|----------------|------|--------------|
| REQ-4.1 | scroll 시 갱신 | ✅ | content.js:scrollHandler | 스크롤 후 갱신 확인 | 성능 영향 |
| REQ-4.2 | resize 시 갱신 | ✅ | content.js:resizeHandler | 리사이즈 후 갱신 확인 | 성능 영향 |
| REQ-4.3 | 1000ms 디바운싱 | ✅ | content.js:debounce | 연속 이벤트 테스트 | 갱신 지연 |
| REQ-4.4 | MutationObserver 갱신 | ✅ | content.js:mutationObserver | DOM 변경 감지 테스트 | 성능 영향 |

### REQ-5: Performance (PRD 6.5, 7.1)

| ID | Requirement | Status | Implementation | Test | Side Effects |
|----|-------------|--------|----------------|------|--------------|
| REQ-5.1 | 최대 800개 배지 | ✅ | content.js:MAX_BADGES | 대량 텍스트 페이지 | 일부 텍스트 미표시 |
| REQ-5.2 | 브라우저 프리즈 방지 | ✅ | requestAnimationFrame | 성능 테스트 | 없음 |
| REQ-5.3 | 스크롤 시 체감 지연 최소 | ✅ | 최적화된 탐지 로직 | 스크롤 성능 테스트 | 없음 |

### REQ-6: Cleanup (PRD 수용 기준)

| ID | Requirement | Status | Implementation | Test | Side Effects |
|----|-------------|--------|----------------|------|--------------|
| REQ-6.1 | 오버레이 완전 제거 | ✅ | content.js:cleanup | OFF 후 DOM 검사 | 없음 |
| REQ-6.2 | 이벤트 리스너 해제 | ✅ | content.js:cleanup | 메모리 누수 테스트 | 없음 |
| REQ-6.3 | 잔여 스타일 영향 없음 | ✅ | content.js:cleanup | 스타일 검사 | 없음 |

---

## Edge Cases (PRD 8)

| ID | Case | Status | Implementation | Test |
|----|------|--------|----------------|------|
| EDGE-1 | 중첩 텍스트 중복 제거 | ✅ | Set 사용 | 부모/자식 혼재 테스트 |
| EDGE-2 | 0 크기 요소 제외 | ✅ | hasValidSize | 0 크기 요소 테스트 |
| EDGE-3 | cross-origin iframe 제외 | ✅ | 접근 불가 자동 제외 | iframe 테스트 |

---

## Verification History

| Date | Feature | Result | Issues | Resolution |
|------|---------|--------|--------|------------|
| - | - | - | - | - |

---

## Update Instructions

1. 기능 구현 시작: Status를 🔄로 변경
2. 구현 완료: Status를 ✅로 변경
3. Feedback Loop 통과: Status를 ✔️로 변경
4. 검증 실패: Status를 ❌로 변경하고 Issues에 기록
5. 문제 해결 후: 재검증하여 Status 업데이트
