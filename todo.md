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

## 4단계: 게시글 CRUD 구현 (Ch10) (진행 중)

- [ ] Server Actions를 활용한 글 작성/수정/삭제 연동
- [ ] 글 작성 화면 구현 (마크다운 에디터 등)
- [ ] 글 수정/삭제 UI 구현 (UX 용도, 실제 보안은 Ch11에서 처리)
- [ ] posts 컬럼명 Ch8 스키마 그대로 사용 확인

## 5단계: RLS 보안 및 고도화 (Ch11 이후) (미착수)

- [ ] Row Level Security (RLS) 정책 설정 (실제 데이터 접근 권한 제어)
- [ ] 댓글 시스템 구현
- [ ] 프로필 이미지 업로드 (Supabase Storage)

## 진행률: 8/15 (53%)
