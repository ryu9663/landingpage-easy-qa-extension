# Landing Font QA Extension - Todo List

> **Note**: 이 파일은 **개발 작업 순서**를 정의합니다.
> 요구사항 충족 상태 추적은 `.claude/requirements-matrix.md`를 참조하세요.

## Phase 1: 초기 세팅 ✅

### 프로젝트 구조 설정
- [x] 프로젝트 폴더 구조 생성
  ```
  /
  ├── manifest.json
  ├── background.js (service worker)
  ├── content.js (content script)
  ├── styles.css (배지 스타일)
  └── icons/
      ├── icon16.png
      ├── icon48.png
      └── icon128.png
  ```
- [x] `manifest.json` 작성 (MV3 기반)
  - permissions: `activeTab`, `scripting`
  - action 설정 (아이콘 클릭 핸들링)
- [x] 아이콘 파일 준비 (16x16, 48x48, 128x128)

---

## Phase 2: 핵심 기능 구현 ✅

### 2.1 토글 기능
- [x] Background Service Worker 구현
  - [x] 확장 아이콘 클릭 이벤트 리스닝
  - [x] 탭별 ON/OFF 상태 관리
  - [x] Content Script 주입/제거 로직
- [ ] ON/OFF 상태에 따른 아이콘 변경 (선택)

### 2.2 텍스트 요소 탐지 로직
- [x] "보이는 텍스트" 판정 함수 구현
  - [x] A. 뷰포트 교차 검사 (`getBoundingClientRect`)
  - [x] B. 실제 텍스트 존재 검사 (공백 제거 후 1자 이상)
  - [x] C. 숨김 요소 제외 검사
    - [x] `display: none` 체크
    - [x] `visibility: hidden` 체크
    - [x] `opacity: 0` 체크
- [x] 텍스트 노드 순회 로직 구현
  - [x] TreeWalker를 이용한 텍스트 노드 탐색
  - [x] 부모 요소 기준 중복 제거 (Set 사용)
- [x] 매우 작은 요소 (0 크기 rect) 제외 처리

### 2.3 배지(말풍선) 렌더링
- [x] 오버레이 컨테이너 생성
  - [x] 독립 root 컨테이너 (DOM 영향 차단)
  - [x] 높은 z-index 설정
  - [x] `pointer-events: none` 적용
- [x] 배지 스타일 정의 (`styles.css`)
  - [x] 말풍선 디자인 (배경, 테두리, 폰트)
  - [x] 위치 계산 (텍스트 요소 좌상단 근처)
- [x] 배지 생성 함수 구현
  - [x] `font-size` 추출 (computed style)
  - [x] `font-weight` 추출 (computed style)
  - [x] 배지 DOM 요소 생성 및 배치

### 2.4 자동 갱신 트리거
- [x] 디바운스 유틸 함수 구현 (1000ms)
- [x] `scroll` 이벤트 리스너 등록 (디바운싱 적용)
- [x] `resize` 이벤트 리스너 등록 (디바운싱 적용)
- [x] MutationObserver 설정 (선택적)
  - [x] DOM 변경 감지 시 갱신 예약
  - [x] 동일하게 1000ms 디바운싱 적용

### 2.5 성능 안전장치
- [x] 최대 배지 개수 상한 설정 (800개)
- [x] 상한 초과 시 추가 생성 중단 로직
- [x] `requestAnimationFrame` 기반 렌더링 제한

---

## Phase 3: 정리 및 OFF 처리 ✅

### 3.1 클린업 로직
- [x] OFF 시 오버레이 컨테이너 완전 제거
- [x] 이벤트 리스너 해제
- [x] MutationObserver disconnect
- [ ] 페이지에 잔여 DOM/스타일 영향 없음 확인 (테스트 필요)

---

## Phase 4: 테스트 및 QA

### 4.1 기능 테스트
- [ ] 다양한 폰트 사이즈 (px/rem/em) 표시 확인
- [ ] font-weight 400/500/600/700 등 정상 표시
- [ ] 숨김 케이스 테스트
  - [ ] `display: none`
  - [ ] `visibility: hidden`
  - [ ] `opacity: 0`
- [ ] 스크롤이 긴 페이지에서 갱신 확인
- [ ] fixed/sticky 헤더 아래 텍스트 배지 위치 확인

### 4.2 성능 테스트
- [ ] 텍스트가 많은 페이지에서 프리즈 없음 확인
- [ ] 스크롤 시 체감 지연 최소화 확인

### 4.3 엣지 케이스 테스트
- [ ] 중첩 텍스트 (부모/자식 혼재) 중복 제거 확인
- [ ] 0 크기 요소 제외 확인
- [ ] same-origin iframe 처리 확인 (선택)
- [ ] cross-origin iframe 제외 확인

---

## Phase 5: 배포 준비

- [ ] 코드 정리 및 주석 추가
- [ ] README.md 작성
- [ ] Chrome 웹스토어 등록 준비 (선택)

---

## 결정 사항 (PRD 오픈 질문)

| 항목 | 결정 | 비고 |
|------|------|------|
| `opacity` 제외 기준 | **정확히 `0`만 제외** | 0.01 등 거의 안 보이는 요소는 표시함 |
| 배지 최대 표시 개수 | **800개** | 대부분의 랜딩페이지 커버 + 성능 유지 |
| same-origin iframe 포함 여부 | **v0 제외** | 빠른 출시 위해 제외, 추후 구현 예정 |

---

## 추후 구현 예정 (v1+)

- [ ] same-origin iframe 내부 텍스트 탐지 및 배지 표시
- [ ] Shadow DOM (open shadowRoot) 지원
- [ ] pseudo-element 텍스트 (`::before/::after` content) 지원
- [ ] 상위 부모 opacity 추적을 통한 완전한 가시성 판정
- [ ] 색상/라인하이트/폰트패밀리 등 추가 스펙 표기

---

## 참고사항

### 제외 항목 (v0)
- 색상/라인하이트/폰트패밀리 표기
- 클릭/선택/인스펙터 모드
- 리포트 저장/내보내기
- 페이지별 룰/프리셋 관리
- 폰트 스펙 diff 비교
- Shadow DOM 지원
- pseudo-element 텍스트 (`::before/::after`)
