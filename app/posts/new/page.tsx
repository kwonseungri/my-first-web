"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface PostForm {
  title: string;
  content: string;
}

export default function NewPostPage() {
  const router = useRouter();
  const [form, setForm] = useState<PostForm>({ title: "", content: "" });

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value }); // 해당 필드만 업데이트
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!form.title.trim()) {
      alert("제목을 입력해주세요");
      return;
    }

    // Ch8에서 Supabase insert로 교체 예정
    alert("게시글이 저장되었습니다 (더미)");
    router.push("/posts");
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">새 글 쓰기</h1>
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
            className="flex min-h-[200px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 resize-none"
          />
        </div>
        <div className="flex gap-3 pt-4">
          <Button
            type="submit"
            className="px-8"
          >
            작성하기
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/posts")}
          >
            취소
          </Button>
        </div>
      </form>
    </div>
  );
}
