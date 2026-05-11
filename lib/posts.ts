export type Post = {
  id: number;
  title: string;
  content: string;
  author: string;
  date: string;
};

export let posts: Post[] = [
  {
    id: 1,
    title: "React 19 새 기능 정리",
    content:
      "React 19에서 달라진 핵심 기능을 간단히 정리했다. use() 훅, 서버 액션 기본 지원, 폼 상태 관리 개선 등이 주요 변경 사항이다. 특히 use()는 Promise와 Context 모두를 구독할 수 있어 코드가 훨씬 간결해졌다.",
    author: "김코딩",
    date: "2026-03-30",
  },
  {
    id: 2,
    title: "Tailwind CSS 4 변경사항",
    content:
      "Tailwind CSS 4에서는 tailwind.config.js 없이 @import 'tailwindcss'와 @theme 블록만으로 설정이 완료된다. 빌드 속도가 크게 개선되었으며, 기존 설정 방식과 호환성에 주의가 필요하다.",
    author: "이디자인",
    date: "2026-03-28",
  },
  {
    id: 3,
    title: "Next.js App Router 완벽 가이드",
    content:
      "App Router는 파일 기반 라우팅을 더욱 강력하게 만들었다. layout.tsx로 공통 레이아웃을 구성하고, page.tsx로 각 URL의 콘텐츠를 정의한다. 동적 라우트는 [id] 폴더 구조로 만들며, Next.js 16부터 params를 await해야 한다.",
    author: "박개발",
    date: "2026-03-25",
  },
];

export function getPostById(id: number): Post | undefined {
  return posts.find((p) => p.id === id);
}

export function deletePost(id: number): void {
  posts = posts.filter((p) => p.id !== id);
}
