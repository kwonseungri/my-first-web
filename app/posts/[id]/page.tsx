"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Post } from "@/lib/posts";
import LikeButton from "@/components/LikeButton";
import DeletePostButton from "@/components/DeletePostButton";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeft, Clock, User } from "lucide-react";

export default function PostDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { user } = useAuth();
  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPost() {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("posts")
          .select("id, user_id, title, content, created_at")
          .eq("id", id)
          .single();

        if (error) {
          throw error;
        }
        
        if (!data) {
          setError("not_found");
        } else {
          setPost(data as Post);
        }
      } catch (err: any) {
        // Supabase에서 single() 호출 시 결과가 없으면 PGRST116 에러 반환
        if (err.code === "PGRST116") {
          setError("not_found");
        } else {
          setError("데이터를 불러오지 못했습니다.");
        }
      } finally {
        setIsLoading(false);
      }
    }

    fetchPost();
  }, [id]);

  if (isLoading) {
    return <div className="max-w-3xl mx-auto py-20 text-center text-muted-foreground">로딩 중...</div>;
  }

  if (error === "not_found" || !post) {
    notFound(); // Next.js의 not-found 페이지로 이동
  }

  if (error) {
    return <div className="max-w-3xl mx-auto py-20 text-center text-destructive">{error}</div>;
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 py-6">
      {/* 상단 내비게이션 */}
      <Link href="/posts">
        <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-primary transition-colors">
          <ArrowLeft className="h-4 w-4" />
          목록으로 돌아가기
        </Button>
      </Link>

      <article>
        <Card className="border-none shadow-none bg-transparent">
          <CardHeader className="px-0 space-y-4">
            <div className="space-y-2">
              <CardTitle className="text-4xl md:text-5xl font-black tracking-tight leading-tight">
                {post.title}
              </CardTitle>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  ID: {post.user_id}
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {new Date(post.created_at).toLocaleDateString()}
                </div>
              </div>
            </div>
            <hr className="border-border" />
          </CardHeader>
          
          <CardContent className="px-0 py-8">
            <p className="text-lg text-foreground/90 leading-relaxed whitespace-pre-wrap font-serif">
              {post.content}
            </p>
          </CardContent>

          <CardFooter className="px-0 py-10 flex flex-col items-center gap-10 border-t">
            <div className="flex flex-col items-center gap-4">
              <p className="text-sm text-muted-foreground font-medium">이 글이 유익하셨나요?</p>
              <LikeButton />
            </div>
            
            <div className="flex gap-3 w-full justify-end pt-4">
              {user?.id === post.user_id && (
                <>
                  <Link href={`/posts/${post.id}/edit`}>
                    <Button variant="outline">수정</Button>
                  </Link>
                  <DeletePostButton postId={post.id} />
                </>
              )}
            </div>
          </CardFooter>
        </Card>
      </article>
    </div>
  );
}
