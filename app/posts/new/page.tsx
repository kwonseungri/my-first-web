"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function NewPostPage() {
  const router = useRouter();
  const [form, setForm] = useState({ title: "", content: "" });
  const [errors, setErrors] = useState({ title: "", content: "" });

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // 입력 시 해당 필드 에러 초기화
    setErrors((prev) => ({ ...prev, [name]: "" }));
  }

  function validate() {
    const newErrors = { title: "", content: "" };
    let isValid = true;

    if (!form.title.trim()) {
      newErrors.title = "제목을 입력해주세요.";
      isValid = false;
    }
    if (!form.content.trim()) {
      newErrors.content = "내용을 입력해주세요.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    // 실제 저장 로직은 향후 Supabase 연동 시 구현
    alert(`"${form.title}" 게시글이 저장되었습니다.`);
    router.push("/posts");
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">새 글 쓰기</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* 제목 */}
        <div className="space-y-1">
          <label htmlFor="title" className="text-sm font-medium">
            제목 <span className="text-destructive">*</span>
          </label>
          <Input
            id="title"
            name="title"
            placeholder="제목을 입력하세요"
            value={form.title}
            onChange={handleChange}
            className={errors.title ? "border-destructive" : ""}
          />
          {errors.title && (
            <p className="text-destructive text-sm">{errors.title}</p>
          )}
        </div>

        {/* 내용 */}
        <div className="space-y-1">
          <label htmlFor="content" className="text-sm font-medium">
            내용 <span className="text-destructive">*</span>
          </label>
          <textarea
            id="content"
            name="content"
            placeholder="내용을 입력하세요"
            value={form.content}
            onChange={handleChange}
            rows={10}
            className={`w-full rounded-md border px-3 py-2 text-sm shadow-sm resize-none focus:outline-none focus:ring-1 focus:ring-ring ${
              errors.content ? "border-destructive" : "border-input"
            }`}
          />
          {errors.content && (
            <p className="text-destructive text-sm">{errors.content}</p>
          )}
        </div>

        {/* 버튼 */}
        <div className="flex gap-3 pt-2">
          <Button type="submit">저장하기</Button>
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
