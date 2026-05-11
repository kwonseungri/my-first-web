import { posts } from "@/lib/posts";
import PostsList from "@/components/PostsList";

export const metadata = {
  title: "블로그 글 목록 | 내 블로그",
  description: "작성된 블로그 게시글 목록입니다.",
};

export default function PostsPage() {
  return (
    <section>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">블로그</h1>
      </div>
      <PostsList initialPosts={posts} />
    </section>
  );
}
