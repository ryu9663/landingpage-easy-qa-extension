# Command: /verify

현재 구현 상태를 검증하고 피드백 루프 실행

## Description

구현된 기능의 요구사항 충족 여부와 사이드이펙트를 검증

## Usage

```
/verify              # 표준 검증 (변경된 부분 + 핵심 기능)
/verify --quick      # 빠른 검증 (핵심 경로만)
/verify --full       # 완전 검증 (모든 테스트)
/verify toggle       # Toggle 기능만 검증
/verify detection    # 텍스트 탐지만 검증
/verify render       # 배지 렌더링만 검증
/verify refresh      # 자동 갱신만 검증
/verify performance  # 성능만 검증
/verify cleanup      # 클린업만 검증
```

## Verification Steps

1. **Pre-Check**: 변경 파일 분석, 영향 범위 식별
2. **Build Check**: 문법/구조 오류 확인
3. **Requirement Check**: PRD 요구사항 충족 확인
4. **Regression Test**: 기존 기능 동작 확인
5. **Side Effect Check**: 의도치 않은 영향 확인

## Example Output

```
═══════════════════════════════════════════════════════════
                   VERIFICATION REPORT
═══════════════════════════════════════════════════════════

Mode: Standard
Scope: Toggle, Detection, Cleanup

───────────────────────────────────────────────────────────
PRE-CHECK
───────────────────────────────────────────────────────────
Changed Files:
  • content.js (toggle, detectText)
Affected Features:
  • Toggle ON/OFF
  • 텍스트 탐지
Impact Level: Medium

───────────────────────────────────────────────────────────
BUILD CHECK
───────────────────────────────────────────────────────────
[✓] manifest.json valid
[✓] background.js syntax OK
[✓] content.js syntax OK
[✓] styles.css valid
[✓] All icons present

Status: ✅ PASS

───────────────────────────────────────────────────────────
REQUIREMENT CHECK
───────────────────────────────────────────────────────────
REQ-1 (Toggle):
  [✓] REQ-1.1: 아이콘 클릭 토글
  [✓] REQ-1.2: 재클릭 시 제거
  [✓] REQ-1.3: 새로고침 시 OFF

REQ-2 (Detection):
  [✓] REQ-2.1: 뷰포트 교차 검사
  [✓] REQ-2.2: 텍스트 존재 검사
  [✓] REQ-2.3: display:none 제외
  [✓] REQ-2.4: visibility:hidden 제외
  [✓] REQ-2.5: opacity:0 제외

Status: ✅ 8/8 PASS

───────────────────────────────────────────────────────────
REGRESSION TEST
───────────────────────────────────────────────────────────
Suite 1 (Toggle): 4/4 ✅
Suite 2 (Detection): 13/13 ✅
Suite 6 (Cleanup): 8/8 ✅

Status: ✅ 25/25 PASS

───────────────────────────────────────────────────────────
SIDE EFFECT CHECK
───────────────────────────────────────────────────────────
[✓] Toggle → Render: 정상 연동
[✓] Detection → Render: 정상 연동
[✓] 성능: 이전과 동일
[✓] 메모리: 누수 없음

Status: ✅ PASS

═══════════════════════════════════════════════════════════
                       VERDICT
═══════════════════════════════════════════════════════════

✅ VERIFICATION PASSED

All requirements satisfied.
No regressions detected.
No side effects found.

Ready to proceed to next task.

═══════════════════════════════════════════════════════════
```

## On Failure

```
═══════════════════════════════════════════════════════════
                       VERDICT
═══════════════════════════════════════════════════════════

❌ VERIFICATION FAILED

Issues Found:
┌────────────────────────────────────────────────────────┐
│ 1. [REQ-2.5] opacity:0 제외 미동작                      │
│    Location: content.js:45                             │
│    Expected: opacity === '0' 검사                      │
│    Actual: opacity 검사 누락                           │
│    Fix: isVisible() 함수에 opacity 검사 추가           │
├────────────────────────────────────────────────────────┤
│ 2. [REGRESSION] TEST-6.2 실패                          │
│    Location: content.js:cleanup()                      │
│    Expected: 모든 배지 제거                            │
│    Actual: 일부 배지 잔존                              │
│    Fix: querySelectorAll 선택자 확인                   │
└────────────────────────────────────────────────────────┘

Required Actions:
1. Fix content.js:45 - opacity 검사 추가
2. Fix content.js:cleanup() - 배지 제거 로직 수정

After fixing, run: /verify

═══════════════════════════════════════════════════════════
```
