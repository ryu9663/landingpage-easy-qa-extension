# Command: /phase

Show current development phase status.

## Description

Displays progress through the development phases defined in todolist.md.

## Usage

```
/phase
/phase 1    # Show Phase 1 details
/phase 2    # Show Phase 2 details
```

## Output

```
Development Phase Status
========================

Phase 1: 초기 세팅
├── [ ] 프로젝트 폴더 구조 생성
├── [ ] manifest.json 작성
└── [ ] 아이콘 파일 준비
Progress: 0/3 (0%)

Phase 2: 핵심 기능 구현
├── 2.1 토글 기능 (0/4)
├── 2.2 텍스트 요소 탐지 (0/9)
├── 2.3 배지 렌더링 (0/8)
├── 2.4 자동 갱신 (0/6)
└── 2.5 성능 안전장치 (0/3)
Progress: 0/30 (0%)

Phase 3: 정리 및 OFF 처리
├── [ ] OFF 시 오버레이 제거
├── [ ] 이벤트 리스너 해제
├── [ ] MutationObserver disconnect
└── [ ] 잔여 영향 없음 확인
Progress: 0/4 (0%)

Phase 4: 테스트 및 QA
├── 4.1 기능 테스트 (0/6)
├── 4.2 성능 테스트 (0/2)
└── 4.3 엣지 케이스 (0/4)
Progress: 0/12 (0%)

Phase 5: 배포 준비
├── [ ] 코드 정리
├── [ ] README.md 작성
└── [ ] 웹스토어 등록 준비
Progress: 0/3 (0%)

Overall: 0/52 tasks (0%)
Current Phase: 1 - 초기 세팅

Next Action: 프로젝트 폴더 구조 생성
```
