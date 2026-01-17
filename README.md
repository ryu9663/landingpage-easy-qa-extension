# Landing Font QA

<p align="center">
  <img src="icons/icon128.png" alt="Landing Font QA Logo" width="128" height="128">
</p>

<p align="center">
  <strong>랜딩페이지 폰트 스펙을 한눈에 확인하는 Chrome 확장 프로그램</strong>
</p>

<p align="center">
  <a href="#features">Features</a> •
  <a href="#installation">Installation</a> •
  <a href="#usage">Usage</a> •
  <a href="#screenshots">Screenshots</a>
</p>

---

## Features

- **폰트 정보 표시** - font-size, font-weight, color를 배지로 표시
- **레이아웃 정보** - margin, padding, width, height 표시
- **포지션 정보** - absolute, fixed, relative 등 위치 속성 표시
- **색상 미리보기** - hex 코드 옆에 실제 색상 박스 표시
- **원클릭 토글** - 확장 아이콘 클릭으로 ON/OFF
- **자동 갱신** - 스크롤, 리사이즈, DOM 변경 시 자동 업데이트
- **호버 하이라이트** - 텍스트 요소에 마우스 오버 시 해당 배지 강조

## Installation

### Chrome 웹스토어
> 준비 중

### 수동 설치 (개발자 모드)

1. 이 저장소를 클론하거나 ZIP으로 다운로드
   ```bash
   git clone https://github.com/your-username/landing-font-qa.git
   ```

2. Chrome에서 `chrome://extensions` 접속

3. 우측 상단 **개발자 모드** 활성화

4. **압축해제된 확장 프로그램을 로드합니다** 클릭

5. 다운로드한 폴더 선택

## Usage

1. 확인하고 싶은 랜딩페이지로 이동

2. 툴바의 **Landing Font QA** 아이콘 클릭 → ON

3. 텍스트 요소 위에 배지가 표시됨
   ```
   16px / 700 / #333333 [■]
   mt:20 mb:20
   pt:10 pr:15 pb:10 pl:15
   w:200px h:50px
   ```

4. 다시 아이콘 클릭 → OFF (배지 제거)

### 배지 정보 설명

| 행 | 색상 | 내용 |
|---|---|---|
| 1행 | 흰색 | `font-size` / `font-weight` / `color` + 색상 박스 |
| 2행 | 🟢 초록 | margin (mt/mr/mb/ml) |
| 3행 | 🔵 파랑 | padding (pt/pr/pb/pl) |
| 4행 | 🟠 주황 | width / height |
| 5행 | 🟡 노랑 | position 속성 (static 제외) |

> 값이 0이거나 auto인 경우 해당 항목은 생략됩니다.

## Screenshots

> 스크린샷 준비 중

## Tech Stack

- Vanilla JavaScript (ES6+)
- Chrome Extension Manifest V3
- CSS3

## Browser Support

- Google Chrome (v88+)
- Microsoft Edge (Chromium)
- 기타 Chromium 기반 브라우저

## Performance

- 최대 배지 개수: 800개
- 디바운스: 1000ms (scroll/resize/mutation)
- `requestAnimationFrame` 기반 렌더링
- `pointer-events: none`으로 페이지 인터랙션 방해 없음

## License

MIT License

## Contributing

버그 리포트나 기능 제안은 [Issues](https://github.com/your-username/landing-font-qa/issues)에 등록해주세요.

---

<p align="center">
  Made with ❤️ for QA teams
</p>
