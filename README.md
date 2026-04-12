# Vite + TypeScript + Tailwind CSS 게시판

TypeScript, Tailwind CSS, HTML로 만든 게시판 웹 애플리케이션입니다. JavaScript 버전과 동일한 기능을 TypeScript로 구현하여 타입 안전성을 확보했습니다.

## 기능

- 회원가입 / 로그인 / 로그아웃 (JWT 인증)
- 게시글 작성, 수정, 삭제, 상세 조회
- 게시글 목록 페이지네이션
- 댓글 작성, 수정, 삭제
- 해시 기반 SPA 라우팅

## 기술 스택

- **Vite** — 빌드 도구
- **TypeScript** — 프로그래밍 언어
- **Tailwind CSS** — 스타일링
- **REST API** — fullstackfamily.com Education Practice API

## JavaScript 버전과의 차이

| 항목 | JavaScript | TypeScript |
|------|-----------|-----------|
| 파일 확장자 | `.js` | `.ts` |
| 타입 정의 | 없음 | `types.ts` (User, Post, Comment 등) |
| API 클라이언트 | 일반 함수 | 제네릭 함수 `request<T>()` |
| DOM 접근 | `document.getElementById()` | `as HTMLInputElement` 타입 단언 |
| 에러 처리 | `err.message` | `(err as Error).message` |

## 프로젝트 구조

```
src/
├── main.ts              # 라우트 등록 + 진입점
├── style.css            # Tailwind CSS
├── utils/
│   ├── types.ts         # 타입 정의 (User, Post, Comment, PageResponse 등)
│   ├── api.ts           # 제네릭 API 클라이언트
│   └── router.ts        # 타입이 적용된 해시 라우터
└── pages/
    ├── login.ts          # 로그인 페이지
    ├── signup.ts         # 회원가입 페이지
    ├── postList.ts       # 글 목록 + 페이지네이션
    ├── postDetail.ts     # 상세 조회 + 댓글
    ├── postWrite.ts      # 글쓰기
    └── postEdit.ts       # 글 수정
```

## 실행 방법

```bash
# 의존성 설치
npm install

# 개발 서버 시작
npm run dev
```

브라우저에서 `http://localhost:5173`을 열면 게시판이 실행됩니다.

## 타입 체크

```bash
npx tsc --noEmit
```

## API 프록시

개발 환경에서 CORS 문제를 해결하기 위해 Vite 프록시를 사용합니다. `vite.config.ts`에 설정되어 있으며, API 요청은 `/api/edu/ws-283fc1` 경로로 보내면 `https://api.fullstackfamily.com`으로 프록시됩니다.

## 상세 튜토리얼

이 프로젝트를 처음부터 단계별로 만드는 방법은 아래 블로그 글에서 확인할 수 있습니다.

- [Vite + TypeScript + Tailwind CSS로 게시판 만들기](https://www.fullstackfamily.com/@urstory/posts/14399)

## JavaScript 버전

TypeScript 없이 JavaScript로 구현한 버전도 있습니다.

- 저장소: [board-app](https://github.com/urstory/board-app)
- 튜토리얼: [Vite + JavaScript + Tailwind CSS로 게시판 만들기](https://www.fullstackfamily.com/@urstory/posts/14398)
