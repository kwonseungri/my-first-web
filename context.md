# Context — my-first-web 프로젝트 상태

## 현재 상태

- **마지막 작업일**: 2026-05-20
- **완료된 작업**: 
  - Ch7-Ch8 블로그 UI 및 Supabase DB 연동 기초 완료
  - Ch9 Supabase Auth 인증 시스템 구축 (회원가입, 로그인, useAuth/AuthProvider 전역 상태, middleware 라우트 보호)
  - Ch10 게시글 CRUD 작업 (작성/수정/삭제 연동 및 UI 구현) 완료
- **진행 중**: Ch11 RLS 보안(실제 접근 제어) 설정 및 DB 보안 정책 고도화
- **미착수**: 댓글 시스템, 스토리지 이미지 업로드

## 기술 결정 사항

- **프레임워크**: Next.js 16.2.6 (App Router 전용, next/router 사용 금지)
- **인증**: Supabase Auth (Email/Password 전용), `useAuth` 및 `AuthProvider` 사용
- **데이터베이스 연동**: `lib/supabase/client.ts` (Ch8 기준) 활용
- **게시글 스키마**: posts 테이블 컬럼명은 Ch8 스키마를 엄격히 따름
- **수정/삭제 접근 제어 (RLS 보안)**: 데이터베이스 단의 실제 보안은 Supabase RLS 정책을 강제하며, SQL Editor 직접 실행 대신 Supabase CLI 마이그레이션 파일로 관리
- **미들웨어**: `middleware.ts`를 활용한 라우트 보호
- **서비스 역할 키(`service_role`) 제한**: RLS를 우회하는 `service_role` 키는 클라이언트(브라우저) 코드에 노출하지 않으며 오직 `anon` 키만 사용
- **스타일링**: Tailwind CSS 4, shadcn/ui (radix-nova 프리셋)

## Version Policy

- **교재 기준**: Next.js 16.2.1, @supabase/supabase-js 2.47.12, @supabase/ssr 0.5.2
- **현재 설치**: Next.js 16.2.6, @supabase/supabase-js 2.105.4, @supabase/ssr 0.10.3

## 해결된 이슈

- **Build Error**: Next.js 16에서 params가 Promise임에 따라 `await params`를 적용하여 타입 에러 해결.
- **shadcn usage**: `Dialog` 컴포넌트의 `render` prop 에러를 `asChild` 패턴으로 수정하여 해결.
- **Supabase sync**: 마이그레이션 이력 불일치 문제를 `repair` 명령어로 해결 후 동기화 완료.
- **Vercel 배포 에러**: Vercel 환경에 Supabase 환경변수를 추가하여 정상 배포 연동 완료.
