"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Post } from "@/lib/posts";
import { Search, Eye } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface PostsListProps {
  initialPosts: Post[];
}

export default function PostsList({ initialPosts }: PostsListProps) {
  const [query, setQuery] = useState("");
  const [filteredPosts, setFilteredPosts] = useState(initialPosts);

  useEffect(() => {
    const filtered = initialPosts.filter((post) =>
      post.title.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredPosts(filtered);
  }, [query, initialPosts]);

  return (
    <div className="space-y-6">
      {/* 검색 바 */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="게시글 제목으로 검색..."
          className="pl-10"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {/* 게시글 목록 */}
      <div className="grid gap-6 sm:grid-cols-2">
        {filteredPosts.length > 0 ? (
          filteredPosts.map((post) => (
            <Link key={post.id} href={`/posts/${post.id}`}>
              <Card className="h-full hover:shadow-lg transition-all duration-300 border-border hover:border-primary/20 group">
                <CardHeader className="space-y-1">
                  <CardTitle className="text-xl group-hover:text-primary transition-colors">
                    {post.title}
                  </CardTitle>
                  <CardDescription>
                    작성자 ID: {post.user_id} · {new Date(post.created_at).toLocaleDateString()}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground line-clamp-3 text-sm leading-relaxed">
                    {post.content}
                  </p>
                </CardContent>
                <CardFooter className="flex justify-between items-center text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Eye className="h-4 w-4" />
                    <span>{post.views || 0}</span>
                  </div>
                  <Button variant="ghost" className="p-0 h-auto group-hover:translate-x-1 transition-transform text-foreground">
                    자세히 보기 →
                  </Button>
                </CardFooter>
              </Card>
            </Link>
          ))
        ) : (
          <div className="col-span-full py-20 text-center flex flex-col items-center justify-center space-y-3 border-2 border-dashed border-border rounded-xl bg-card/30">
            <div className="text-4xl opacity-50 mb-2">🔍</div>
            <p className="text-muted-foreground font-medium text-lg">검색 결과가 없습니다</p>
            <p className="text-sm text-muted-foreground">다른 검색어로 다시 시도해보세요.</p>
          </div>
        )}
      </div>
    </div>
  );
}
