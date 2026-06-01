"use client";

import { useEffect, useState } from "react";
import PostsList from "@/components/PostsList";
import { createClient } from "@/lib/supabase/client";
import { Post } from "@/lib/posts";

export default function PostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("posts")
          .select("id, title, content, created_at, user_id")
          .order("created_at", { ascending: false });

        if (error) {
          throw error;
        }
        
        setPosts(data as Post[]);
      } catch (err) {
        setError("데이터를 불러오지 못했습니다.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchPosts();
  }, []);

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

      <div className="bg-card/50 backdrop-blur-sm border rounded-3xl p-6 md:p-8 shadow-sm min-h-[300px]">
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
            <p className="text-muted-foreground font-medium animate-pulse">로딩 중...</p>
          </div>
        )}
        
        {error && (
          <div className="flex flex-col items-center justify-center py-20 space-y-3 text-center bg-destructive/5 rounded-xl border border-destructive/20 mt-4">
            <div className="text-destructive font-bold text-lg">오류가 발생했습니다</div>
            <p className="text-muted-foreground">{error}</p>
          </div>
        )}
        
        {!isLoading && !error && posts.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 space-y-4 text-center border-2 border-dashed rounded-xl bg-card/30">
            <div className="text-4xl opacity-50 mb-2">📝</div>
            <p className="text-muted-foreground font-medium text-lg">아직 작성된 글이 없습니다.</p>
            <p className="text-sm text-muted-foreground">첫 번째 게시글의 주인공이 되어보세요!</p>
          </div>
        )}
        
        {!isLoading && !error && posts.length > 0 && (
          <PostsList initialPosts={posts} />
        )}
      </div>
    </section>
  );
}
