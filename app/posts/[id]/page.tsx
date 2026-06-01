"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Post } from "@/lib/posts";
import { CommentWithProfile } from "@/lib/types";
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
import { ArrowLeft, Clock, User, MessageSquare, Trash2, Send } from "lucide-react";

export default function PostDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { user } = useAuth();
  
  // 게시글 상태
  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 댓글 상태
  const [comments, setComments] = useState<CommentWithProfile[]>([]);
  const [newComment, setNewComment] = useState("");
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [isCommentsLoading, setIsCommentsLoading] = useState(true);

  // 1. 게시글 데이터 로드
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

  // 2. 댓글 데이터 로드
  useEffect(() => {
    async function fetchComments() {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("comments")
          .select(`
            id,
            post_id,
            user_id,
            content,
            created_at,
            profiles (
              username,
              avatar_url
            )
          `)
          .eq("post_id", id)
          .order("created_at", { ascending: true });

        if (error) {
          throw error;
        }

        setComments(data as unknown as CommentWithProfile[]);
      } catch (err: any) {
        console.error("댓글 로드 실패:", err.message);
      } finally {
        setIsCommentsLoading(false);
      }
    }

    fetchComments();
  }, [id]);

  // 3. 댓글 작성 핸들러
  async function handleAddComment(e: React.FormEvent) {
    e.preventDefault();
    if (!newComment.trim() || !user) return;

    setIsSubmittingComment(true);
    try {
      const supabase = createClient();
      
      // 사용자 프로필 복구 검사 (신규 가입 유저 등 profiles가 누락된 경우 자동 생성)
      const { data: profile } = await supabase
        .from("profiles")
        .select("username, avatar_url")
        .eq("id", user.id)
        .single();

      let currentUsername = user.email?.split("@")[0] || "user";
      let currentAvatarUrl = null;

      if (!profile) {
        const { error: profileError } = await supabase
          .from("profiles")
          .insert({
            id: user.id,
            username: currentUsername,
          });
        
        if (profileError) throw profileError;
      } else {
        currentUsername = profile.username;
        currentAvatarUrl = profile.avatar_url;
      }

      // 댓글 작성 저장
      const { data, error } = await supabase
        .from("comments")
        .insert({
          post_id: id,
          user_id: user.id,
          content: newComment.trim(),
        })
        .select("id, post_id, user_id, content, created_at")
        .single();

      if (error) throw error;

      const newlyAddedComment: CommentWithProfile = {
        ...data,
        profiles: {
          username: currentUsername,
          avatar_url: currentAvatarUrl,
        },
      };

      setComments((prev) => [...prev, newlyAddedComment]);
      setNewComment("");
    } catch (err: any) {
      alert("댓글 등록 실패: " + err.message);
    } finally {
      setIsSubmittingComment(false);
    }
  }

  // 4. 댓글 삭제 핸들러
  async function handleDeleteComment(commentId: string) {
    if (!confirm("댓글을 삭제하시겠습니까?")) return;

    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("comments")
        .delete()
        .eq("id", commentId);

      if (error) throw error;

      setComments((prev) => prev.filter((c) => c.id !== commentId));
    } catch (err: any) {
      alert("댓글 삭제 실패: " + err.message);
    }
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
        <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
        <p className="text-muted-foreground font-medium animate-pulse">게시글을 불러오는 중입니다...</p>
      </div>
    );
  }

  if (error === "not_found" || !post) {
    notFound();
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-3 text-center px-4">
        <div className="bg-destructive/10 p-4 rounded-full">
          <span className="text-3xl">⚠️</span>
        </div>
        <h2 className="text-xl font-bold text-destructive">오류가 발생했습니다</h2>
        <p className="text-muted-foreground">{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8 py-6 px-4">
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
              <CardTitle className="text-2xl md:text-3xl font-bold tracking-tight leading-snug">
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
          
          <CardContent className="px-0 py-6">
            <p className="text-lg text-foreground/90 leading-relaxed whitespace-pre-wrap font-serif">
              {post.content}
            </p>
          </CardContent>

          <CardFooter className="px-0 py-8 flex flex-col items-center gap-8 border-t">
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

      {/* 댓글 영역 */}
      <section className="pt-8 border-t space-y-6">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-bold">댓글 ({comments.length})</h2>
        </div>

        {/* 댓글 목록 */}
        <div className="space-y-4">
          {isCommentsLoading ? (
            <div className="flex items-center justify-center py-10 space-x-3">
               <div className="w-5 h-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin"></div>
               <p className="text-sm text-muted-foreground">댓글을 불러오는 중입니다...</p>
            </div>
          ) : comments.length === 0 ? (
            <div className="p-8 text-center border rounded-xl bg-muted/20 text-muted-foreground">
              첫 번째 댓글을 남겨보세요!
            </div>
          ) : (
            <div className="space-y-3">
              {comments.map((comment) => {
                const username = comment.profiles?.username || "알 수 없는 사용자";
                const initial = username.charAt(0).toUpperCase();

                return (
                  <div key={comment.id} className="p-4 rounded-xl border bg-card shadow-sm flex gap-3 items-start hover:border-primary/20 transition-all">
                    {/* 아바타 */}
                    <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center font-bold text-primary text-sm flex-shrink-0 select-none">
                      {initial}
                    </div>

                    <div className="flex-grow space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-sm">{username}</span>
                        <div className="flex items-center gap-3">
                          <span className="text-xs text-muted-foreground">
                            {new Date(comment.created_at).toLocaleDateString()}{" "}
                            {new Date(comment.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                          {user?.id === comment.user_id && (
                            <button
                              onClick={() => handleDeleteComment(comment.id)}
                              className="text-muted-foreground hover:text-destructive transition-colors p-1"
                              title="댓글 삭제"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-foreground/95 whitespace-pre-wrap leading-relaxed">
                        {comment.content}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* 댓글 입력 폼 */}
        <div className="pt-4">
          {user ? (
            <form onSubmit={handleAddComment} className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground font-semibold px-1">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>{user.email?.split("@")[0]} 계정으로 로그인됨</span>
              </div>
              <div className="flex gap-2">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="댓글 내용을 여기에 입력하세요..."
                  rows={3}
                  maxLength={1000}
                  disabled={isSubmittingComment}
                  className="flex w-full rounded-xl border border-input bg-transparent px-4 py-3 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50 resize-none font-sans"
                />
                <Button 
                  type="submit" 
                  disabled={isSubmittingComment || !newComment.trim()} 
                  className="h-auto flex flex-col items-center justify-center gap-1 px-5 rounded-xl flex-shrink-0"
                >
                  <Send className="h-4 w-4" />
                  <span className="text-xs">등록</span>
                </Button>
              </div>
            </form>
          ) : (
            <div className="p-6 text-center border border-dashed rounded-xl bg-muted/10 space-y-3">
              <p className="text-sm text-muted-foreground font-medium">로그인하시면 댓글을 작성할 수 있습니다.</p>
              <Link href="/login">
                <Button size="sm" className="rounded-xl px-6">로그인하러 가기</Button>
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
