"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { createClient } from "@/lib/supabase/client";
import { notFound } from "next/navigation";

interface PostForm {
  title: string;
  content: string;
}

export default function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const { id } = use(params);
  const { user, loading: authLoading } = useAuth();
  
  const [form, setForm] = useState<PostForm>({ title: "", content: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPost() {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("posts")
          .select("title, content, user_id")
          .eq("id", id)
          .single();

        if (error) {
          throw error;
        }

        if (!data) {
          return notFound();
        }

        // 💡 UX 관점의 권한 체크:
        // 브라우저 단에서 수정 폼 진입을 막는 역할만 수행합니다. 
        // 실제 API를 직접 찌르는 비정상적인 수정은 Ch11 RLS 정책을 통해 원천 차단됩니다.
        if (user && data.user_id !== user.id) {
          alert("본인이 작성한 글만 수정할 수 있습니다.");
          router.push(`/posts/${id}`);
          return;
        }

        setForm({ title: data.title, content: data.content });
      } catch (err: any) {
        if (err.code === "PGRST116") {
          notFound();
        } else {
          setErrorMsg("데이터를 불러오지 못했습니다.");
        }
      } finally {
        setIsLoading(false);
      }
    }

    if (!authLoading) {
      if (!user) {
        alert("로그인이 필요한 서비스입니다.");
        router.push("/login");
      } else {
        fetchPost();
      }
    }
  }, [id, user, authLoading, router]);

  if (authLoading || isLoading) {
    return <div className="max-w-2xl mx-auto py-20 text-center text-muted-foreground">로딩 중...</div>;
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrorMsg(null);

    if (!form.title.trim() || !form.content.trim()) {
      setErrorMsg("제목과 내용을 모두 입력해주세요.");
      return;
    }

    setIsSubmitting(true);
    
    try {
      const supabase = createClient();
      
      const { error } = await supabase
        .from("posts")
        .update({
          title: form.title,
          content: form.content,
        })
        .eq("id", id);

      if (error) {
        throw error;
      }

      router.push(`/posts/${id}`);
    } catch (err: any) {
      setErrorMsg("게시글 수정에 실패했습니다. " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">게시글 수정</h1>
        <p className="text-sm text-muted-foreground bg-muted/50 p-2 rounded-md">
          * 현재 작성자 본인 확인 로직은 브라우저 상의 UI/UX 처리입니다. 실제 DB 레벨의 완벽한 보안 처리는 <b>Ch11(Row Level Security)</b> 파트에서 학습 및 적용됩니다.
        </p>
      </div>
      
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
            className="text-lg py-6"
            disabled={isSubmitting}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            내용
          </label>
          <textarea
            name="content"
            value={form.content}
            onChange={handleChange}
            placeholder="내용을 자유롭게 입력하세요"
            rows={10}
            disabled={isSubmitting}
            className="flex min-h-[200px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 resize-none"
          />
        </div>
        <div className="flex gap-3 pt-4">
          <Button
            type="submit"
            className="px-8"
            disabled={isSubmitting}
          >
            {isSubmitting ? "수정 중..." : "수정 완료"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push(`/posts/${id}`)}
            disabled={isSubmitting}
          >
            취소
          </Button>
        </div>
      </form>
    </div>
  );
}
