# TODO — my-first-web

## 1단계: 기본 구조 및 디자인 (완료)

- [x] 프로젝트 초기 설정 및 컨텍스트 관리
- [x] shadcn/ui 설치 및 테마 설정
- [x] 헤더/푸터 및 메인 홈 레이아웃 구축

## 2단계: 핵심 기능 및 DB 연동 (Ch7-Ch8) (완료)

- [x] 더미 데이터 기반 포스트 목록/상세 페이지 구축
- [x] Supabase 프로젝트 연결 및 마이그레이션 적용 (profiles, posts)
- [x] Supabase 브라우저 클라이언트 설정 (`lib/supabase/client.ts` 활용)

## 3단계: Supabase Auth 인증 (Ch9) (완료)

- [x] 회원가입 페이지(`signup`) 기능 구현
- [x] 로그인 페이지(`login`) 기능 구현 (signInWithPassword)
- [x] `useAuth` / `AuthProvider` 를 활용한 전역 인증 상태 관리
- [x] `middleware.ts`를 활용한 라우트 보호 (작성, 마이페이지 등)
- [x] 헤더 내 로그인 상태에 따른 UI 분기 처리

## 4단계: 게시글 CRUD 구현 (Ch10) (완료)

- [x] Server Actions를 활용한 글 작성/수정/삭제 연동
- [x] 글 작성 화면 구현 (마크다운 에디터 등)
- [x] 글 수정/삭제 UI 구현 (UX 용도, 실제 보안은 Ch11에서 처리)
- [x] posts 컬럼명 Ch8 스키마 그대로 사용 확인

## 5단계: RLS 보안 및 고도화 (Ch11 이후) (진행 중)

- [x] Row Level Security (RLS) 정책 설계 및 가이드 문서(`docs/ch11.md`) 작성
- [x] `profiles` 테이블 RLS 정책 설정 (Supabase CLI 마이그레이션 생성)
- [x] `posts` 테이블 RLS 정책 설정 (Supabase CLI 마이그레이션 생성)
- [x] `service_role` 키 노출 여부 전수 검사
- [x] RLS 정책 적용 후 비인가 API 호출 차단 검증
- [x] 댓글 시스템 구현
- [x] 프로필 이미지 업로드 (Supabase Storage)
## 6단계: 에러 처리 및 UX 개선 (Ch12) (완료)

- [x] 로딩 상태 UI 적용 (loading.tsx 및 스켈레톤 디자인)
- [x] 빈 화면(Empty State) 친절한 안내 문구 적용
- [x] 에러 발생 시 앱 중단 방지 및 error.tsx 추가
- [x] 친절한 에러 메시지 변환 유틸리티 (lib/error-message.ts)
- [x] 문서(context, todo, ARCHITECTURE) 최신화 작업

## 7단계: 최종 검증 및 배포 테스트 (진행 중)

- [x] Playwright E2E 테스트 스크립트 구축 완료 (테스트 자체는 통과)
- [ ] 로컬 E2E 테스트 환경 변수 주입 후 재확인
- [x] Vercel 환경 변수 등록 확인
- [ ] Vercel 실제 배포 URL 수동 접속 및 기능(Auth, DB) 검증

## 진행률: 28/31 (90%)
