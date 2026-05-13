import { posts } from "@/lib/posts";
import PostsList from "@/components/PostsList";

export default function Home() {
  return (
    <div className="space-y-12">
      <header className="flex flex-col items-center justify-center pt-10 text-center space-y-4">
        <h1 className="text-5xl font-extrabold tracking-tight lg:text-6xl bg-gradient-to-r from-blue-600 to-indigo-400 bg-clip-text text-transparent">
          내 블로그
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          웹 개발을 배우며 기록하는 공간입니다. 방문해주셔서 감사합니다.
        </p>
      </header>

      <div className="bg-card/50 backdrop-blur-sm border rounded-3xl p-6 md:p-8 shadow-sm">
        <h2 className="text-2xl font-bold mb-6">최신 포스트</h2>
        <PostsList initialPosts={posts} />
      </div>
    </div>
  );
}

