#file:context.md #file:todo.md #file:ARCHITECTURE.md

Ch9 Supabase Auth 작업을 시작하기 전에 기준 문서들을 정비해줘.

대상:
- .github/copilot-instructions.md
- context.md
- todo.md
- ARCHITECTURE.md
- AGENTS.md
- CLAUDE.md
- .agent/rules/project.md

작업 규칙:
1. 파일이 없으면 Ch7 기준에 맞춰 새로 만들어줘.
2. 파일이 있으면 내용을 읽고 Ch9 기준과 충돌하는 부분을 찾아줘.
3. 충돌하는 부분은 바로 수정해줘.
4. 단, 기존 프로젝트 상태나 실제 package.json과 충돌할 수 있는 부분은 삭제하지 말고 "교재 기준"과 "현재 설치 기준"을 함께 적어줘.
5. 수정 후 어떤 파일을 만들었고, 어떤 파일을 바꿨는지 요약해줘.

Ch9 기준:
- 코드·패키지 설명은 Ch7·Ch8 교재 기준을 따른다.
- Next.js 16.2.1 App Router
- @supabase/supabase-js 2.47.12
- @supabase/ssr 0.5.2
- Supabase 대시보드 메뉴 안내만 2026년 5월 기준이다.
- Ch8 환경변수 이름을 유지한다:
  NEXT_PUBLIC_SUPABASE_URL
  NEXT_PUBLIC_SUPABASE_ANON_KEY
- 이메일/비밀번호 인증만 사용한다.
- 소셜 로그인은 추가하지 않는다.
- App Router만 사용한다.
- next/router, pages router는 사용하지 않는다.
- 이 교재에서는 보호 라우트 파일로 middleware.ts를 사용한다.
- Supabase Auth 로그인은 signInWithPassword를 사용한다.
- 구버전 auth.signIn()은 사용하지 않는다.
- service_role 키는 클라이언트에 절대 두지 않는다.

버전 표기는 다음 정책으로 정리해줘:

## Version Policy

- 교재 기준: Next.js 16.2.1, @supabase/supabase-js 2.47.12, @supabase/ssr 0.5.2
- 실제 package.json이 더 최신일 수 있다.
- 수업 프롬프트와 설명은 교재 기준으로 통일한다.
- 빌드 오류가 버전 차이에서 발생하면 package.json 기준으로 원인을 확인한다.

출력:
- 생성한 파일
- 수정한 파일
- 충돌해서 정리한 항목
- 아직 사람이 확인해야 할 항목