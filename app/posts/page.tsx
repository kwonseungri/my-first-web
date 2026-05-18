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
        {isLoading && <p className="text-center text-muted-foreground py-10">로딩 중...</p>}
        
        {error && <p className="text-center text-destructive py-10">{error}</p>}
        
        {!isLoading && !error && posts.length === 0 && (
          <p className="text-center text-muted-foreground py-10">작성된 글이 없습니다.</p>
        )}
        
        {!isLoading && !error && posts.length > 0 && (
          <PostsList initialPosts={posts} />
        )}
      </div>
    </section>
  );
}
