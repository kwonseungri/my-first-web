import { posts } from "@/lib/posts";
import PostsList from "@/components/PostsList";

export const metadata = {
  title: "블로그 글 목록 | 내 블로그",
  description: "웹 개발과 일상을 기록하는 블로그 게시글 목록입니다.",
};

export default function PostsPage() {
  return (
    <section className="animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <div className="mb-10 space-y-2">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl bg-gradient-to-r from-blue-600 to-indigo-400 bg-clip-text text-transparent">
          블로그 글 목록
        </h1>
        <p className="text-muted-foreground text-lg italic">
          생각과 기록을 나누는 공간입니다.
        </p>
      </div>

      <div className="bg-card/50 backdrop-blur-sm border rounded-3xl p-6 md:p-8 shadow-sm">
        <PostsList initialPosts={posts} />
      </div>
    </section>
  );
}

