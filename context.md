# Context — my-first-web 프로젝트 상태

## 현재 상태

- **마지막 작업일**: 2026-05-13
- **완료된 작업**: 
  - Ch7-Ch8 블로그 UI 및 Supabase DB 연동 기초 완료
  - shadcn/ui 초기화 및 주요 페이지(홈, 목록, 상세, 작성) 구현
  - Supabase 마이그레이션(profiles, posts) 및 브라우저 클라이언트 설정 완료
- **진행 중**: Ch9 Supabase Auth 인증 시스템 구축
- **미착수**: 댓글 시스템, 실제 데이터 쓰기/삭제 연동(Server Actions)

## 기술 결정 사항

- **프레임워크**: Next.js 16.2.6 (App Router)
- **인증**: Supabase Auth (Email/Password 전용)
- **미들웨어**: `middleware.ts`를 활용한 라우트 보호
- **스타일링**: Tailwind CSS 4, shadcn/ui (radix-nova 프리셋)

## Version Policy

- **교재 기준**: Next.js 16.2.1, @supabase/supabase-js 2.47.12, @supabase/ssr 0.5.2
- **현재 설치**: Next.js 16.2.6, @supabase/supabase-js 2.105.4, @supabase/ssr 0.10.3

## 해결된 이슈

- **Build Error**: Next.js 16에서 params가 Promise임에 따라 `await params`를 적용하여 타입 에러 해결.
- **shadcn usage**: `Dialog` 컴포넌트의 `render` prop 에러를 `asChild` 패턴으로 수정하여 해결.
- **Supabase sync**: 마이그레이션 이력 불일치 문제를 `repair` 명령어로 해결 후 동기화 완료.

## 알게 된 점

- Supabase CLI 사용 시 로컬과 서버의 마이그레이션 이력이 다르면 `repair` 명령어로 상태를 강제 조정할 수 있음.
- Tailwind CSS 4와 shadcn/ui 조합 시 CSS 변수 정의 방식이 oklch와 hsl 혼용될 수 있으므로 주의 필요.
