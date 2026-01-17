# Skill: Verification Workflow

기능 구현 후 자동 실행되는 검증 워크플로우

## Purpose

모든 코드 변경 후 일관된 검증 프로세스를 통해 품질 보장

## Workflow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                     VERIFICATION WORKFLOW                        │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
                    ┌─────────────────┐
                    │  1. PRE-CHECK   │
                    │  변경 파일 분석  │
                    └────────┬────────┘
                              │
                              ▼
                    ┌─────────────────┐
                    │  2. BUILD CHECK │
                    │  문법/구조 검증  │
                    └────────┬────────┘
                              │
                              ▼
                    ┌─────────────────┐
                    │  3. REQUIREMENT │
                    │     CHECK       │
                    └────────┬────────┘
                              │
                              ▼
                    ┌─────────────────┐
                    │  4. REGRESSION  │
                    │     TEST        │
                    └────────┬────────┘
                              │
                              ▼
                    ┌─────────────────┐
                    │  5. SIDE EFFECT │
                    │     CHECK       │
                    └────────┬────────┘
                              │
                    ┌─────────┴─────────┐
                    │                   │
                    ▼                   ▼
            ┌──────────┐         ┌──────────┐
            │  ✅ PASS  │         │  ❌ FAIL  │
            └────┬─────┘         └────┬─────┘
                 │                    │
                 ▼                    ▼
          ┌────────────┐       ┌────────────┐
          │ 다음 태스크 │       │ 문제 수정  │
          │ 진행       │       │ 재검증     │
          └────────────┘       └─────┬──────┘
                                     │
                                     └──────► (1. PRE-CHECK로)
```

## Step Details

### Step 1: Pre-Check

변경된 파일과 영향 범위 분석

```
Input: 변경된 파일 목록
Output:
  - 영향받는 기능 목록
  - 필요한 테스트 Suite
  - 예상 위험도

Example:
  Changed: content.js (detectText function)
  Affected: 텍스트 탐지, 배지 렌더링
  Required Tests: Suite 2, 3
  Risk Level: Medium
```

### Step 2: Build Check

문법 오류 및 구조 검증

```
Checks:
  - JavaScript 문법 오류
  - manifest.json 유효성
  - 참조 파일 존재 여부
  - CSS 문법 오류

Pass Criteria: 모든 체크 통과
```

### Step 3: Requirement Check

PRD 요구사항 충족 여부 및 기능 동작 검증

```
Verification:
  - requirements-matrix.md 요구사항 대조
  - PRD acceptance criteria 확인
  - 기능 단위 Input/Output 검증
  - Edge case 처리 확인

Update: requirements-matrix.md status
```

### Step 4: Regression Test

기존 기능 동작 확인

```
Execute: regression-test.md
Mode: Standard (변경 관련 Suite + Core)
Pass Criteria: 100% 테스트 통과
```

### Step 5: Side Effect Check

의도치 않은 영향 확인

```
Checks:
  - Critical path 동작 확인
  - 성능 지표 비교 (이전 vs 현재)
  - 메모리 사용량 확인
  - 이벤트 리스너 누수 확인
```

## Execution Modes

### Auto Mode (Default)

기능 구현 완료 시 자동 실행

```
Trigger: 코드 변경 후 "구현 완료" 선언 시
Scope: Standard 테스트
Action:
  - PASS → 다음 태스크 진행
  - FAIL → 문제 보고 및 수정 대기
```

### Manual Mode

명시적 명령으로 실행

```
/verify              # 전체 검증
/verify --quick      # 빠른 검증 (핵심만)
/verify --full       # 완전 검증 (모든 테스트)
/verify [feature]    # 특정 기능만 검증
```

### CI Mode

Phase 완료 시 종합 검증

```
Trigger: Phase N 완료 시
Scope: Full 테스트
Action:
  - PASS → Phase N+1 진행 가능
  - FAIL → Phase 완료 취소, 수정 필요
```

## Verification Report

```
┌──────────────────────────────────────────────────────────┐
│              VERIFICATION WORKFLOW REPORT                 │
├──────────────────────────────────────────────────────────┤
│ Feature: 텍스트 탐지 로직                                 │
│ Changed Files: content.js                                │
│ Timestamp: 2024-XX-XX HH:MM                              │
├──────────────────────────────────────────────────────────┤
│                                                          │
│ Step 1: Pre-Check ............................ ✅ PASS   │
│   └─ Affected: Suite 2, 3                               │
│                                                          │
│ Step 2: Build Check .......................... ✅ PASS   │
│   └─ No syntax errors                                    │
│                                                          │
│ Step 3: Requirement Check .................... ✅ PASS   │
│   └─ REQ-2.1 ~ REQ-2.5 satisfied                        │
│                                                          │
│ Step 4: Regression Test ...................... ⚠️ WARN   │
│   └─ 25/26 passed (TEST-3.12 skipped)                   │
│                                                          │
│ Step 5: Side Effect Check .................... ✅ PASS   │
│   └─ No performance degradation                         │
│                                                          │
├──────────────────────────────────────────────────────────┤
│                                                          │
│ VERDICT: ✅ PASS (with warnings)                         │
│                                                          │
│ Notes:                                                   │
│ - TEST-3.12 skipped: styles.css not yet implemented     │
│ - Will be verified in Phase 2.3                         │
│                                                          │
│ Next Action: Proceed to 배지 렌더링 구현                  │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

## Integration Points

### With TodoWrite

```
On task completion:
  1. Run verification workflow
  2. If PASS: Mark task as completed
  3. If FAIL: Keep task as in_progress, report issues
```

### With Requirements Matrix

```
On verification:
  1. Check current requirement status
  2. Update status based on verification result
  3. Record in verification history
```

### With Phase Implementer

```
On phase completion:
  1. Run full verification
  2. Generate phase completion report
  3. Gate next phase on verification pass
```
