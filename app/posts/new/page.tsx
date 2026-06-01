"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { createClient } from "@/lib/supabase/client";

interface PostForm {
  title: string;
  content: string;
}

export default function NewPostPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  
  const [form, setForm] = useState<PostForm>({ title: "", content: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<{ title?: string; content?: string }>({});

  // 1. 로그인 체크 (접근 제어)
  useEffect(() => {
    if (!loading && !user) {
      alert("로그인이 필요한 서비스입니다. 로그인 페이지로 이동합니다.");
      router.push("/login");
    }
  }, [user, loading, router]);

  // 로그인 상태 확인 전 로딩 표시
  if (loading || !user) {
    return <div className="max-w-2xl mx-auto py-20 text-center text-muted-foreground">권한을 확인하는 중입니다...</div>;
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  }

  // 2. 게시글 저장 로직
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrorMsg(null);
    setValidationErrors({});

    const errors: { title?: string; content?: string } = {};

    if (!form.title.trim()) {
      errors.title = "제목을 입력해주세요.";
    } else if (form.title.trim().length < 2) {
      errors.title = "제목은 최소 2자 이상 입력해주세요.";
    }

    if (!form.content.trim()) {
      errors.content = "내용을 입력해주세요.";
    } else if (form.content.trim().length < 10) {
      errors.content = "내용은 최소 10자 이상 입력해주세요.";
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    setIsSubmitting(true);
    
    try {
      const supabase = createClient();
      
      // [자동 복구 로직] 기존 계정의 프로필 누락 방지 (외래키 에러 해결)
      const { data: profile } = await supabase
        .from("profiles")
        .select("id")
        .eq("id", user!.id)
        .single();

      if (!profile) {
        // 프로필이 없다면 강제로 생성 시도
        const { error: profileError } = await supabase
          .from("profiles")
          .insert({
            id: user!.id,
            username: user!.email?.split('@')[0] || 'user',
            role: 'user'
          });
        
        if (profileError) {
          throw new Error("프로필(계정 정보) 복구 실패: " + profileError.message + " (이 메시지를 알려주세요!)");
        }
      }

      const { data, error } = await supabase
        .from("posts")
        .insert({
          title: form.title,
          content: form.content,
          user_id: user!.id // 현재 로그인한 사용자의 ID 적용
        })
        .select("id")
        .single(); // 방금 생성된 글의 ID를 받기 위해 추가

      if (error) {
        throw error;
      }

      // 저장 성공 시 생성된 글의 상세 페이지로 이동
      router.push(`/posts/${data.id}`);
    } catch (err: any) {
      console.error("게시글 저장 중 서버 오류 발생:", err);
      setErrorMsg("게시글 저장 중 예상치 못한 문제가 발생했습니다. 잠시 후 다시 시도해주세요.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">새 글 쓰기</h1>
      
      {errorMsg && (
        <div className="p-4 text-sm text-destructive bg-destructive/10 rounded-lg border border-destructive/20">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            제목
          </label>
          <Input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="게시글 제목을 입력하세요"
            className={`text-lg py-6 ${validationErrors.title ? "border-destructive focus-visible:ring-destructive" : ""}`}
            disabled={isSubmitting}
          />
          {validationErrors.title && (
            <p className="text-sm text-destructive font-medium">{validationErrors.title}</p>
          )}
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            내용
          </label>
          <textarea
            name="content"
            value={form.content}
            onChange={handleChange}
            placeholder="내용을 자유롭게 입력하세요 (최소 10자 이상)"
            rows={10}
            disabled={isSubmitting}
            className={`flex min-h-[200px] w-full rounded-md border bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 disabled:cursor-not-allowed disabled:opacity-50 resize-none ${
              validationErrors.content 
                ? "border-destructive focus-visible:ring-destructive" 
                : "border-input focus-visible:ring-ring"
            }`}
          />
          {validationErrors.content && (
            <p className="text-sm text-destructive font-medium">{validationErrors.content}</p>
          )}
        </div>
        <div className="flex gap-3 pt-4">
          <Button
            type="submit"
            className="px-8"
            disabled={isSubmitting}
          >
            {isSubmitting ? "저장 중..." : "작성하기"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/posts")}
            disabled={isSubmitting}
          >
            취소
          </Button>
        </div>
      </form>
    </div>
  );
}
