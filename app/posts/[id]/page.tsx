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
import { ArrowLeft, Clock, User, MessageSquare, Trash2, Send, Users, UserPlus, UserMinus, Eye } from "lucide-react";

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
  
  // 대댓글(답글) 상태
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);

  // 이웃(팔로우) 상태
  const [authorName, setAuthorName] = useState("알 수 없는 사용자");
  const [followerCount, setFollowerCount] = useState(0);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isTogglingFollow, setIsTogglingFollow] = useState(false);

  // 1. 게시글 데이터 로드
  useEffect(() => {
    async function fetchPost() {
      try {
        const supabase = createClient();
        
        // 조회수 증가
        await supabase.rpc("increment_page_view", { post_id: id });

        const { data, error } = await supabase
          .from("posts")
          .select(`
            id, user_id, title, content, views, created_at,
            profiles(username)
          `)
          .eq("id", id)
          .single();

        if (error) {
          throw error;
        }
        
        if (!data) {
          setError("not_found");
        } else {
          setPost(data as unknown as Post);
          setAuthorName((data as any).profiles?.username || "알 수 없는 사용자");

          // 팔로워 수 조회
          const { count } = await supabase
            .from("follows")
            .select("*", { count: "exact", head: true })
            .eq("following_id", data.user_id);
          
          setFollowerCount(count || 0);
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

  // 이웃 상태 확인 (user가 변경되거나 post가 로드되었을 때)
  useEffect(() => {
    if (!user || !post || user.id === post.user_id) return;

    async function checkFollowStatus() {
      const supabase = createClient();
      const { data } = await supabase
        .from("follows")
        .select("follower_id")
        .eq("follower_id", user!.id)
        .eq("following_id", post!.user_id)
        .single();
      
      setIsFollowing(!!data);
    }

    checkFollowStatus();
  }, [user, post]);

  // 이웃 추가/취소 핸들러
  async function handleToggleFollow() {
    if (!user || !post) return;
    setIsTogglingFollow(true);
    
    try {
      const supabase = createClient();
      if (isFollowing) {
        // 언팔로우
        await supabase
          .from("follows")
          .delete()
          .eq("follower_id", user.id)
          .eq("following_id", post.user_id);
        
        setFollowerCount((prev) => Math.max(0, prev - 1));
        setIsFollowing(false);
      } else {
        // 팔로우
        await supabase
          .from("follows")
          .insert({
            follower_id: user.id,
            following_id: post.user_id,
          });
        
        setFollowerCount((prev) => prev + 1);
        setIsFollowing(true);
      }
    } catch (error: any) {
      alert("이웃 처리에 실패했습니다: " + error.message);
    } finally {
      setIsTogglingFollow(false);
    }
  }

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
            parent_id,
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

        const rawComments = data as unknown as CommentWithProfile[];
        const topLevelComments: CommentWithProfile[] = [];
        const repliesMap: Record<string, CommentWithProfile[]> = {};

        rawComments.forEach(comment => {
          if (comment.parent_id) {
            if (!repliesMap[comment.parent_id]) repliesMap[comment.parent_id] = [];
            repliesMap[comment.parent_id].push(comment);
          } else {
            topLevelComments.push(comment);
          }
        });

        const structuredComments = topLevelComments.map(comment => ({
          ...comment,
          replies: repliesMap[comment.id] || []
        }));

        setComments(structuredComments);
      } catch (err: any) {
        console.error("댓글 로드 실패:", err.message);
      } finally {
        setIsCommentsLoading(false);
      }
    }

    fetchComments();
  }, [id]);

  // 3. 일반 댓글 작성 핸들러
  async function handleAddComment(e: React.FormEvent) {
    e.preventDefault();
    if (!newComment.trim() || !user) return;

    setIsSubmittingComment(true);
    try {
      const supabase = createClient();
      
      const { data: profile } = await supabase
        .from("profiles")
        .select("username, avatar_url")
        .eq("id", user.id)
        .single();

      const currentUsername = profile?.username || user.email?.split("@")[0] || "user";
      const currentAvatarUrl = profile?.avatar_url || null;

      const { data, error } = await supabase
        .from("comments")
        .insert({
          post_id: id,
          user_id: user.id,
          content: newComment.trim(),
          parent_id: null
        })
        .select("id, post_id, user_id, parent_id, content, created_at")
        .single();

      if (error) throw error;

      const newlyAddedComment: CommentWithProfile = {
        ...data,
        profiles: { username: currentUsername, avatar_url: currentAvatarUrl },
        replies: []
      };

      setComments((prev) => [...prev, newlyAddedComment]);
      setNewComment("");
    } catch (err: any) {
      alert("댓글 등록 실패: " + err.message);
    } finally {
      setIsSubmittingComment(false);
    }
  }

  // 4. 대댓글 작성 핸들러
  async function handleAddReply(e: React.FormEvent, parentId: string) {
    e.preventDefault();
    if (!replyContent.trim() || !user) return;

    setIsSubmittingReply(true);
    try {
      const supabase = createClient();
      
      const { data: profile } = await supabase
        .from("profiles")
        .select("username, avatar_url")
        .eq("id", user.id)
        .single();

      const currentUsername = profile?.username || user.email?.split("@")[0] || "user";
      const currentAvatarUrl = profile?.avatar_url || null;

      const { data, error } = await supabase
        .from("comments")
        .insert({
          post_id: id,
          user_id: user.id,
          content: replyContent.trim(),
          parent_id: parentId
        })
        .select("id, post_id, user_id, parent_id, content, created_at")
        .single();

      if (error) throw error;

      const newlyAddedReply: CommentWithProfile = {
        ...data,
        profiles: { username: currentUsername, avatar_url: currentAvatarUrl },
      };

      setComments((prev) => 
        prev.map(comment => {
          if (comment.id === parentId) {
            return {
              ...comment,
              replies: [...(comment.replies || []), newlyAddedReply]
            };
          }
          return comment;
        })
      );
      setReplyContent("");
      setReplyingTo(null);
    } catch (err: any) {
      alert("답글 등록 실패: " + err.message);
    } finally {
      setIsSubmittingReply(false);
    }
  }

  // 5. 댓글 삭제 핸들러
  async function handleDeleteComment(commentId: string, isReply: boolean = false, parentId?: string) {
    if (!confirm("댓글을 삭제하시겠습니까?")) return;

    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("comments")
        .delete()
        .eq("id", commentId);

      if (error) throw error;

      if (isReply && parentId) {
        setComments((prev) => 
          prev.map(c => c.id === parentId ? { ...c, replies: c.replies?.filter(r => r.id !== commentId) } : c)
        );
      } else {
        setComments((prev) => prev.filter((c) => c.id !== commentId));
      }
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
              <div className="flex items-center justify-between text-sm text-muted-foreground flex-wrap gap-4">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1 font-medium text-foreground">
                    <User className="h-4 w-4 text-primary" />
                    {authorName}
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    팔로워 {followerCount}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {new Date(post.created_at).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-1">
                    <Eye className="h-4 w-4" />
                    {post.views || 0}
                  </div>
                </div>
                
                {user && user.id !== post.user_id && (
                  <Button 
                    variant={isFollowing ? "outline" : "default"} 
                    size="sm" 
                    className="gap-2 rounded-full h-8 px-4"
                    onClick={handleToggleFollow}
                    disabled={isTogglingFollow}
                  >
                    {isTogglingFollow ? (
                      <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    ) : isFollowing ? (
                      <>
                        <UserMinus className="h-3.5 w-3.5" />
                        이웃 끊기
                      </>
                    ) : (
                      <>
                        <UserPlus className="h-3.5 w-3.5" />
                        이웃 추가
                      </>
                    )}
                  </Button>
                )}
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
          <h2 className="text-xl font-bold">
            댓글 ({comments.reduce((acc, c) => acc + 1 + (c.replies?.length || 0), 0)})
          </h2>
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
                  <div key={comment.id} className="space-y-4">
                    {/* 원댓글 */}
                    <div className="p-4 rounded-xl border bg-card shadow-sm flex gap-3 items-start hover:border-primary/20 transition-all">
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
                        <p className="text-sm text-foreground/95 whitespace-pre-wrap leading-relaxed py-1">
                          {comment.content}
                        </p>
                        
                        {/* 답글 달기 버튼 */}
                        {user && (
                          <div className="pt-1">
                            <button
                              onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                              className="text-xs font-semibold text-muted-foreground hover:text-primary transition-colors"
                            >
                              {replyingTo === comment.id ? "취소" : "답글 달기"}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* 대댓글 입력 폼 */}
                    {replyingTo === comment.id && (
                      <div className="ml-8 pl-4 border-l-2 border-primary/20">
                        <form onSubmit={(e) => handleAddReply(e, comment.id)} className="flex gap-2">
                          <textarea
                            value={replyContent}
                            onChange={(e) => setReplyContent(e.target.value)}
                            placeholder={`${username}님에게 답글 남기기...`}
                            rows={2}
                            maxLength={500}
                            disabled={isSubmittingReply}
                            className="flex w-full rounded-xl border border-input bg-background px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50 resize-none font-sans"
                            autoFocus
                          />
                          <Button 
                            type="submit" 
                            disabled={isSubmittingReply || !replyContent.trim()} 
                            className="h-auto flex flex-col items-center justify-center gap-1 px-4 rounded-xl flex-shrink-0"
                            size="sm"
                          >
                            <Send className="h-3.5 w-3.5" />
                            <span className="text-[10px]">등록</span>
                          </Button>
                        </form>
                      </div>
                    )}

                    {/* 대댓글 목록 */}
                    {comment.replies && comment.replies.length > 0 && (
                      <div className="ml-8 space-y-3">
                        {comment.replies.map(reply => {
                          const replyUsername = reply.profiles?.username || "알 수 없는 사용자";
                          const replyInitial = replyUsername.charAt(0).toUpperCase();
                          
                          return (
                            <div key={reply.id} className="p-3 rounded-xl border bg-muted/30 shadow-sm flex gap-3 items-start relative">
                              {/* 들여쓰기 꺾쇠 표시를 위한 장식 */}
                              <div className="absolute -left-5 top-4 w-4 h-4 border-l-2 border-b-2 border-primary/20 rounded-bl-lg"></div>
                              
                              <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center font-bold text-primary text-xs flex-shrink-0 select-none">
                                {replyInitial}
                              </div>

                              <div className="flex-grow space-y-0.5">
                                <div className="flex items-center justify-between">
                                  <span className="font-semibold text-sm">{replyUsername}</span>
                                  <div className="flex items-center gap-2">
                                    <span className="text-[10px] text-muted-foreground">
                                      {new Date(reply.created_at).toLocaleDateString()}{" "}
                                      {new Date(reply.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                    {user?.id === reply.user_id && (
                                      <button
                                        onClick={() => handleDeleteComment(reply.id, true, comment.id)}
                                        className="text-muted-foreground hover:text-destructive transition-colors p-1"
                                        title="답글 삭제"
                                      >
                                        <Trash2 className="h-3 w-3" />
                                      </button>
                                    )}
                                  </div>
                                </div>
                                <p className="text-sm text-foreground/90 whitespace-pre-wrap leading-relaxed">
                                  {reply.content}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
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
