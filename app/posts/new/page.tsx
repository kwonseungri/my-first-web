"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

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
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="제목"
          className="w-full px-3 py-2 border rounded text-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
        <textarea
          name="content"
          value={form.content}
          onChange={handleChange}
          placeholder="내용을 입력하세요"
          rows={10}
          className="w-full px-3 py-2 border rounded resize-none focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
        <div className="flex gap-3">
          <Button
            type="submit"
            className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
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
