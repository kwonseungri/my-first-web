import { posts } from "@/lib/posts";
import PostsList from "@/components/PostsList";
import SearchBar from "@/components/SearchBar";

export const metadata = {
  title: "블로그 글 목록 | 내 블로그",
  description: "작성된 블로그 게시글 목록입니다.",
};

export default function PostsPage() {
  return (
    <section className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold">블로그</h1>
        <SearchBar />
      </div>
      <PostsList initialPosts={posts} />
    </section>
  );
}
