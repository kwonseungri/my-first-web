"use client";

import { useState, useEffect } from "react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function SearchBar() {
  const [query, setQuery] = useState<string>("");

  // ✅ 의존성 배열 실습: query가 바뀔 때마다 실행됨
  useEffect(() => {
    if (query.length > 0) {
      console.log(`[Effect] 검색어 변경 감지: ${query}`);
    }
  }, [query]); // query가 변경될 때마다 실행

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setQuery(e.target.value);
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    alert(`검색어: ${query}`);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-1 w-full max-w-sm">
      <div className="flex gap-2">
        <Input
          type="text"
          value={query}
          onChange={handleChange}
          placeholder="검색어를 입력하세요"
          className="flex-1"
        />
        <Button type="submit">검색</Button>
      </div>
      {query && (
        <p className="text-[10px] text-muted-foreground ml-1">
          실시간 입력: <span className="text-primary font-medium">{query}</span>
        </p>
      )}
    </form>
  );
}
