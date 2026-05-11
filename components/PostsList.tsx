"use client";

import { useState } from "react";
import Link from "next/link";
import { Post } from "@/lib/posts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface PostsListProps {
  initialPosts: Post[];
}

export default function PostsList({ initialPosts }: PostsListProps) {
  const [query, setQuery] = useState("");

  const filtered = initialPosts.filter((post) =>
    post.title.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* 검색창 */}
      <Input
        id="search-posts"
        type="search"
        placeholder="제목으로 검색..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="max-w-sm"
      />

      {/* 게시글 없음 안내 */}
      {filtered.length === 0 && (
        <p className="text-muted-foreground text-center py-12">
          검색 결과가 없습니다.
        </p>
      )}

      {/* 게시글 카드 그리드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map((post) => (
          <Link key={post.id} href={`/posts/${post.id}`}>
            <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="text-lg leading-snug">
                  {post.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-muted-foreground text-sm line-clamp-2">
                  {post.content}
                </p>
                <p className="text-xs text-muted-foreground">
                  {post.author} · {post.date}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
