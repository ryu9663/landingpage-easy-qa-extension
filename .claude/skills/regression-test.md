# Skill: Regression Test

기존 기능의 사이드이펙트를 방지하기 위한 회귀 테스트

## Purpose

새로운 기능 구현 또는 코드 수정 후, 기존에 동작하던 기능들이 여전히 정상 동작하는지 검증

## Trigger

- 새로운 기능 구현 완료 시
- 기존 코드 수정 시
- `/verify` 명령 실행 시 (회귀 테스트 단계)

## Test Suites

### Suite 1: Core Toggle (Always Run)

```
[Toggle Basic]
├── TEST-1.1: 아이콘 클릭 → 오버레이 ON
├── TEST-1.2: 재클릭 → 오버레이 OFF
├── TEST-1.3: 빠른 연속 클릭 → 상태 일관성
└── TEST-1.4: 다중 탭 독립성
```

### Suite 2: Text Detection (Run if detection code changed)

```
[Detection Accuracy]
├── TEST-2.1: 일반 텍스트 → 배지 표시
├── TEST-2.2: 빈 텍스트 → 미표시
├── TEST-2.3: 공백만 있는 텍스트 → 미표시
└── TEST-2.4: 특수문자 텍스트 → 표시

[Visibility Check]
├── TEST-2.5: display:none → 미표시
├── TEST-2.6: visibility:hidden → 미표시
├── TEST-2.7: opacity:0 → 미표시
└── TEST-2.8: opacity:0.01 → 표시 (결정사항)

# NOTE: 부모 요소 가시성 추적은 v1에서 구현 예정 (PRD 8 참조)
# TEST-2.9 (v1): 부모 숨김, 자식 표시 → 미표시

[Viewport Check]
├── TEST-2.10: 뷰포트 내 → 표시
├── TEST-2.11: 뷰포트 외 (위) → 미표시
├── TEST-2.12: 뷰포트 외 (아래) → 미표시
├── TEST-2.13: 부분 교차 → 표시
└── TEST-2.14: 스크롤 후 뷰포트 진입 → 표시
```

### Suite 3: Badge Rendering (Run if render code changed)

```
[Badge Content]
├── TEST-3.1: font-size 정확도 (px)
├── TEST-3.2: font-size 정확도 (rem → px 변환)
├── TEST-3.3: font-size 정확도 (em → px 변환)
├── TEST-3.4: font-weight 400 표시
├── TEST-3.5: font-weight 500 표시
├── TEST-3.6: font-weight 600 표시
└── TEST-3.7: font-weight 700 표시

[Badge Position]
├── TEST-3.8: 일반 요소 좌상단 배치
├── TEST-3.9: fixed 요소 위치 정확도
├── TEST-3.10: sticky 요소 위치 정확도
└── TEST-3.11: 스크롤 후 위치 갱신

[Badge Isolation]
├── TEST-3.12: pointer-events 통과
├── TEST-3.13: 페이지 레이아웃 무영향
└── TEST-3.14: z-index 충돌 없음

[Badge Hover]
├── TEST-3.15: 텍스트 호버 → 해당 배지 최상단 표시
├── TEST-3.16: 가려진 배지 → 호버 시 노출
├── TEST-3.17: 호버 해제 → 원래 z-index 복원
└── TEST-3.18: 배지 pointer-events:none 유지 (호버 중에도)
```

### Suite 4: Auto Refresh (Run if event code changed)

```
[Scroll Events]
├── TEST-4.1: 스크롤 → 갱신 트리거
├── TEST-4.2: 빠른 스크롤 → 디바운싱 동작
└── TEST-4.3: 스크롤 후 1초 대기 → 갱신 발생

[Resize Events]
├── TEST-4.4: 창 리사이즈 → 갱신 트리거
├── TEST-4.5: 빠른 리사이즈 → 디바운싱 동작
└── TEST-4.6: 모바일 회전 → 갱신 트리거

[DOM Mutation]
├── TEST-4.7: 새 텍스트 추가 → 배지 추가
├── TEST-4.8: 텍스트 삭제 → 배지 제거
└── TEST-4.9: 연속 DOM 변경 → 디바운싱 동작
```

### Suite 5: Performance (Run if core logic changed)

```
[Badge Limit]
├── TEST-5.1: 800개 미만 → 전체 표시
├── TEST-5.2: 800개 초과 → 800개만 표시
└── TEST-5.3: 초과 시 추가 생성 중단

[Responsiveness]
├── TEST-5.4: 일반 페이지 → 반응성 유지
├── TEST-5.5: 텍스트 많은 페이지 → 프리즈 없음
└── TEST-5.6: 스크롤 시 → 60fps 유지
```

### Suite 6: Cleanup (Always Run)

```
[Complete Removal]
├── TEST-6.1: OFF → 오버레이 컨테이너 제거
├── TEST-6.2: OFF → 모든 배지 제거
├── TEST-6.3: OFF → 스타일 영향 없음
└── TEST-6.4: OFF → DOM 원상복구

[Resource Cleanup]
├── TEST-6.5: OFF → scroll 리스너 해제
├── TEST-6.6: OFF → resize 리스너 해제
├── TEST-6.7: OFF → MutationObserver 해제
├── TEST-6.8: 메모리 누수 없음
└── TEST-6.9: OFF → hover 리스너 해제
```

## Execution Strategy

### Quick Mode (`--quick`)
- Suite 1 (Toggle) 전체
- Suite 6 (Cleanup) 전체
- 각 Suite에서 첫 번째 테스트만

### Standard Mode (default)
- Suite 1, 6 전체
- 변경된 코드와 관련된 Suite 전체

### Full Mode (`--full`)
- 모든 Suite의 모든 테스트

## Dependency Detection

```javascript
// 파일별 테스트 Suite 매핑
const testMap = {
  'background.js': ['Suite 1'],
  'content.js:toggle': ['Suite 1', 'Suite 6'],
  'content.js:detect': ['Suite 2'],
  'content.js:render': ['Suite 3'],
  'content.js:hover': ['Suite 3', 'Suite 6'],
  'content.js:events': ['Suite 4'],
  'content.js:performance': ['Suite 5'],
  'content.js:cleanup': ['Suite 6'],
  'styles.css': ['Suite 3']
};
```

## Output Format

```
══════════════════════════════════════════════════════════
                  REGRESSION TEST REPORT
══════════════════════════════════════════════════════════

Changed Files: content.js (render section)
Triggered Suites: 1, 3, 6

──────────────────────────────────────────────────────────
Suite 1: Core Toggle
──────────────────────────────────────────────────────────
[✓] TEST-1.1: 아이콘 클릭 → 오버레이 ON
[✓] TEST-1.2: 재클릭 → 오버레이 OFF
[✓] TEST-1.3: 빠른 연속 클릭 → 상태 일관성
[✓] TEST-1.4: 다중 탭 독립성

Result: 4/4 PASSED

──────────────────────────────────────────────────────────
Suite 3: Badge Rendering
──────────────────────────────────────────────────────────
[✓] TEST-3.1: font-size 정확도 (px)
[✓] TEST-3.2: font-size 정확도 (rem → px 변환)
[✓] TEST-3.3: font-size 정확도 (em → px 변환)
[✓] TEST-3.4 ~ TEST-3.7: font-weight 표시
[✓] TEST-3.8 ~ TEST-3.11: Badge Position
[✗] TEST-3.12: pointer-events 통과 ← FAILED
[✓] TEST-3.13 ~ TEST-3.14: Badge Isolation

Result: 13/14 PASSED

  ⚠️ TEST-3.12 Failure Details:
     Expected: 배지 클릭 시 아래 요소에 이벤트 전달
     Actual: 배지가 클릭 이벤트를 차단함
     Cause: styles.css에서 pointer-events: none 누락 추정

──────────────────────────────────────────────────────────
Suite 6: Cleanup
──────────────────────────────────────────────────────────
[✓] TEST-6.1 ~ TEST-6.8: All passed

Result: 8/8 PASSED

══════════════════════════════════════════════════════════
                       SUMMARY
══════════════════════════════════════════════════════════

Total: 25/26 tests passed (96.2%)
Failed: 1 test

Status: ❌ REGRESSION DETECTED

Required Actions:
1. Fix TEST-3.12: styles.css에 pointer-events: none 확인

══════════════════════════════════════════════════════════
```
