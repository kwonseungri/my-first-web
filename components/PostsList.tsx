"use client";

import { useState } from "react";
import Link from "next/link";
import { Post } from "@/lib/posts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search } from "lucide-react";
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
                    {post.author} · {post.date}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground line-clamp-3 text-sm leading-relaxed">
                    {post.content}
                  </p>
                </CardContent>
                <CardFooter>
                  <Button variant="ghost" className="p-0 h-auto group-hover:translate-x-1 transition-transform">
                    자세히 보기 →
                  </Button>
                </CardFooter>
              </Card>
            </Link>
          ))
        ) : (
          <div className="col-span-full py-20 text-center text-muted-foreground border-2 border-dashed rounded-xl">
            검색 결과가 없습니다.
          </div>
        )}
      </div>
    </div>
  );
}
