"use client";

import { useState, useEffect } from "react";

interface Post {
  id: number;
  title: string;
  body: string;
}

export default function ExternalPostList() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // 컴포넌트가 화면에 나타난 후 실행
    fetch("https://jsonplaceholder.typicode.com/posts?_limit=10")
      .then((res) => res.json())
      .then((data: Post[]) => {
        setPosts(data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("데이터를 불러오는데 실패했습니다:", err);
        setIsLoading(false);
      });
  }, []); // 빈 배열 = 첫 렌더링 시 1회만 실행

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <p className="text-muted-foreground animate-pulse">데이터를 불러오는 중...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold italic text-blue-500"># JSONPlaceholder에서 가져온 실시간 데이터</h2>
      <ul className="grid gap-3 grid-cols-1 sm:grid-cols-2">
        {posts.map((post) => (
          <li key={post.id} className="p-4 border rounded-lg bg-card hover:shadow-md transition-shadow">
            <h3 className="font-bold text-sm mb-1 line-clamp-1">{post.title}</h3>
            <p className="text-xs text-muted-foreground line-clamp-2">{post.body}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
