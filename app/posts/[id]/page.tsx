import Link from "next/link";
import { getPostById } from "@/lib/posts";
import { Button } from "@/components/ui/button";
import DeletePostButton from "@/components/DeletePostButton";
import LikeButton from "@/components/LikeButton";

export const metadata = {
  title: "게시글 상세 | 내 블로그",
};

export default async function PostDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const post = getPostById(Number(id));

  if (!post) {
    return (
      <div className="text-center py-24 space-y-4">
        <h1 className="text-2xl font-bold text-destructive">
          게시글을 찾을 수 없습니다
        </h1>
        <Link href="/posts">
          <Button variant="outline">← 목록으로 돌아가기</Button>
        </Link>
      </div>
    );
  }

  return (
    <article className="max-w-2xl mx-auto space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold">{post.title}</h1>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>{post.author}</span>
          <span>·</span>
          <span>{post.date}</span>
        </div>
      </header>

      <div className="prose max-w-none leading-relaxed text-foreground">
        <p>{post.content}</p>
      </div>

      <div className="flex justify-center py-8">
        <LikeButton />
      </div>

      <footer className="flex items-center justify-between pt-6 border-t">
        <Link href="/posts">
          <Button variant="outline">← 목록으로 돌아가기</Button>
        </Link>
        <DeletePostButton postId={post.id} />
      </footer>
    </article>
  );
}
