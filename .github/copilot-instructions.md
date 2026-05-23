## Tech Stack

- Next.js 16.2.6 (교재 기준: 16.2.1, App Router 전용, next/router 금지)
- React 19.2.4
- Tailwind CSS 4
- @supabase/supabase-js 2.105.4 (교재 기준: 2.47.12)
- @supabase/ssr 0.10.3 (교재 기준: 0.5.2)
- shadcn/ui (components/ui/ 경로)

## Version Policy

- 교재 기준: Next.js 16.2.1, @supabase/supabase-js 2.47.12, @supabase/ssr 0.5.2
- 실제 package.json 기준: Next.js 16.2.6, @supabase/supabase-js 2.105.4, @supabase/ssr 0.10.3
- 모든 프롬프트 설명 및 교재 내용은 "교재 기준" 버전을 명시하여 설명함.
- 실제 빌드 및 코드 작성 시에는 package.json의 설치 버전을 우선하며, 버전 차이로 인한 이슈 발생 시에만 확인 절차를 거침.

## Coding Conventions

- Server Component를 기본으로 하며, 인터랙션이 필요한 경우에만 Client Component 사용.
- App Router 전용 (pages/ 폴더 사용 절대 금지). `next/router` 대신 `next/navigation` 필수 사용.
- Next.js 16에서는 params가 Promise이므로 반드시 `await params` 사용.
- Tailwind CSS 4 사용. CSS 변수 기반 디자인 토큰 활용.
- Supabase Auth: `signInWithPassword`를 사용하며, 구버전 `auth.signIn()`은 사용 금지.
- 인증 보호: `middleware.ts`를 사용하여 보호된 라우트(예: /posts/new, /mypage)를 관리.
- 전역 상태 관리: Ch9에서 구현한 `useAuth` / `AuthProvider` 사용.
- Supabase 클라이언트: Ch8 기준의 `lib/supabase/client.ts` 활용.
- 환경변수: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` 고정.
- 소셜 로그인 배제: 이메일/비밀번호 인증만 구현.

## DB Schema & Security (Ch11 기준)

- 데이터 모델은 Ch8 기준을 따르며, 컬럼명을 임의로 절대 변경하지 않는다.
  - `posts`: id, user_id, title, content, created_at
  - `profiles`: id, username, avatar_url, role
- **Row Level Security (RLS) 강제**:
  - 데이터의 생성/수정/삭제 권한 제어는 프론트엔드 UI 조건부 노출이나 미들웨어에 의존하지 않으며, 오직 데이터베이스 RLS 정책(`auth.uid() = user_id`)으로만 강제한다.
  - RLS 활성화 및 모든 보안 정책은 Supabase 대시보드 직접 실행이 아닌 **Supabase CLI 마이그레이션 파일**로 정의하여 프로젝트 코드베이스로 이력을 남겨 관리한다.
  - RLS를 우회하는 `service_role` 키는 절대로 클라이언트(브라우저) 영역에 노출되거나 사용될 수 없으며, 반드시 `anon` 키만을 사용해야 한다.

## Design Tokens

- Primary color: --primary (hsl(220 70% 50%))
- Background: --background
- Card: shadcn/ui Card 컴포넌트 사용 (rounded-3xl shadow-sm)
- Max width: max-w-4xl mx-auto

## Known AI Mistakes

- `next/router` 대신 `next/navigation` 필수 사용.
- `pages/` 폴더 절대 생성 금지 (App Router 전용).
- `auth.signIn()` 대신 `auth.signInWithPassword()` 사용.
- Next.js 16에서는 params가 Promise이므로 반드시 `await params` 사용.
- `service_role` 키는 클라이언트 코드에 노출 금지.
