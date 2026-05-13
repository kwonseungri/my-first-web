# 프로젝트 아키텍처 (ARCHITECTURE.md)

이 문서는 개인 블로그 프로젝트의 설계 구조와 주요 흐름을 정리한 문서입니다. 프로젝트의 규모가 커짐에 따라 지속적으로 업데이트됩니다.

---

## 1. 프로젝트 목표
- **기록의 가치**: 웹 개발 학습 과정과 기술적인 고민들을 기록하고 공유하는 공간을 구축합니다.
- **기술 스택 학습**: Next.js App Router, TypeScript, Tailwind CSS 등 최신 웹 기술을 실무 수준으로 익힙니다.
- **사용자 경험(UX)**: 독자에게는 편안한 읽기 환경을, 작성자에게는 효율적인 글쓰기 도구를 제공합니다.

---

## 2. 페이지 맵 (Page Map)

Next.js App Router 구조를 기반으로 한 서비스의 페이지 구성입니다.

| 기능 | URL 경로 | 파일 위치 (app/...) | 설명 |
| :--- | :--- | :--- | :--- |
| **홈** | `/` | `page.tsx` | 블로그 대문 및 최신 게시글 요약 |
| **글 목록** | `/posts` | `posts/page.tsx` | 전체 포스트 리스트 및 카테고리 필터링 |
| **글 상세** | `/posts/[id]` | `posts/[id]/page.tsx` | 게시글 본문 및 댓글 영역 |
| **글 작성** | `/posts/new` | `posts/new/page.tsx` | 마크다운 지원 에디터 및 글 저장 기능 |
| **로그인** | `/login` | `login/page.tsx` | 관리자 및 회원 인증 페이지 |
| **마이페이지** | `/mypage` | `mypage/page.tsx` | 내 프로필 정보 및 작성 글 관리 |
| **회원가입** | `/signup` | `signup/page.tsx` | 신규 사용자 계정 생성 |

---

## 3. 유저 플로우 (User Flow)

### ① 글 읽기 흐름
- **진입**: 메인 페이지(`/`) 또는 직접 링크를 통해 접속
- **탐색**: 포스트 목록(`/posts`)에서 관심 있는 제목 선택
- **도착**: 상세 페이지(`/posts/[id]`)에서 콘텐츠 소비 및 댓글 확인

### ② 글 작성 흐름
- **인증**: 관리자 계정으로 로그인(`/login`)
- **이동**: 상단 메뉴의 '새 글 쓰기' 버튼 클릭 (`/posts/new`)
- **작성**: 제목과 본문 입력 후 저장 버튼 클릭
- **완료**: 생성된 글의 상세 페이지(`/posts/[id]`)로 자동 이동 및 게시 확인

### ③ 마이페이지 확인 흐름
- **로그인**: 회원 계정으로 인증 완료 (`signInWithPassword`)
- **보호**: 미들웨어(`middleware.ts`)가 인증되지 않은 접근을 로그인 페이지로 리다이렉트
- **접근**: 헤더의 프로필 메뉴를 통해 마이페이지(`/mypage`) 진입
- **활동**: 내가 쓴 글 목록 확인, 회원 정보 수정 등의 작업 수행

---

## 4. 인증 시스템 (Auth Architecture)

이 프로젝트는 **Supabase Auth**를 사용하여 보안을 강화합니다.

- **인증 방식**: 이메일 및 비밀번호 (Email/Password)
- **클라이언트**:
  - `lib/supabase/client.ts`: 브라우저 전용 클라이언트
  - `lib/supabase/server.ts`: 서버 컴포넌트, 서버 액션, API 전용 클라이언트 (TODO)
- **라우트 보호**: `middleware.ts`에서 세션을 확인하여 비로그인 사용자의 특정 경로 접근을 제어합니다.
  - 보호 경로: `/posts/new`, `/mypage`, `/posts/[id]/edit` 등


---

## 4. 컴포넌트 구조

이 프로젝트는 **shadcn/ui**를 사용하여 일관된 디자인 시스템을 유지합니다. 모든 UI 컴포넌트는 `@/components/ui` 폴더에 위치하며, 필요한 경우 커스텀 스타일을 적용합니다.

### 주요 UI 컴포넌트 (`@/components/ui`)
- **Button**: 다양한 크기와 변형을 지원하는 버튼 컴포넌트
- **Card**: 게시글 카드, 프로필 카드 등에 사용되는 컨테이너
- **Input**: 글쓰기 및 로그인 폼에서 사용되는 입력창
- **Dialog**: 모달창(글 삭제 확인 등) 구현에 사용

### 공통 컴포넌트 (`@/components`)
- **Header/Footer**: 전역 레이아웃에서 사용되는 네비게이션 및 푸터
- **PostsList**: 글 목록을 렌더링하는 재사용 가능한 컴포넌트
- **SearchBar**: 검색 기능을 담당하는 컴포넌트

---

## 5. 데이터 모델

Supabase를 기반으로 한 데이터베이스 설계입니다. 사용자 프로필과 블로그 포스트 간의 관계를 정의합니다.

### profiles (사용자)
- **id**: `uuid` (Primary Key, `auth.users` 테이블 참조)
- **username**: `text` (사용자 닉네임/이름)
- **avatar_url**: `text` (프로필 이미지 URL)
- **created_at**: `timestamptz` (계정 생성일)

### posts (포스트)
- **id**: `uuid` (Primary Key)
- **user_id**: `uuid` (Foreign Key → `profiles.id`)
- **title**: `text` (포스트 제목)
- **content**: `text` (포스트 본문 내용)
- **created_at**: `timestamptz` (포스트 작성일)

