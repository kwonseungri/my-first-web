import { posts } from "@/lib/posts";
import PostsList from "@/components/PostsList";
import Image from "next/image";

export default function Home() {
  return (
    <div className="space-y-12">
      <header className="flex flex-col items-center justify-center pt-10 text-center space-y-4">
        <div className="relative w-32 h-32 mb-2 hover:-translate-y-3 transition-transform duration-500 ease-out cursor-pointer drop-shadow-lg animate-in zoom-in duration-700 mix-blend-multiply">
          <Image 
            src="/mascot.png" 
            alt="귀여운 블로그 마스코트" 
            fill 
            className="object-contain rounded-full"
            priority
          />
        </div>
        <h1 className="text-5xl font-extrabold tracking-tight lg:text-6xl text-foreground drop-shadow-sm">
          승리의 블로그
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

