# Context — my-first-web 프로젝트 상태

## 현재 상태

- 마지막 작업일: 2026-05-11
- 완료된 작업: 환경설정 완료
- 진행 중: 블로그 프론트엔드 구축 (Ch 2 ~ Ch 7 기준)
- 미착수: DB 연동, 인증, 댓글

## 기술 결정 사항

- 프레임워크: Next.js 16 (App Router)
- 스타일링: Tailwind CSS 4, shadcn/ui
- 데이터 로딩: Server Component 기반 페칭, Client Component 상태 관리 혼합

## 해결된 이슈

- 없음

## 알게 된 점

- Next.js 16의 동적 라우팅에서는 params가 Promise이므로 `await params`를 필수적으로 사용해야 함.
