import Link from "next/link";
import { getPostById } from "@/lib/posts";
import { notFound } from "next/navigation";
import LikeButton from "@/components/LikeButton";
import DeletePostButton from "@/components/DeletePostButton";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { ArrowLeft, Clock, User } from "lucide-react";

export default async function PostDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const post = getPostById(parseInt(id));

  if (!post) {
    notFound();
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 py-6">
      {/* 상단 내비게이션 */}
      <Link href="/posts">
        <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-primary transition-colors">
          <ArrowLeft className="h-4 w-4" />
          목록으로 돌아가기
        </Button>
      </Link>

      <article>
        <Card className="border-none shadow-none bg-transparent">
          <CardHeader className="px-0 space-y-4">
            <div className="space-y-2">
              <CardTitle className="text-4xl md:text-5xl font-black tracking-tight leading-tight">
                {post.title}
              </CardTitle>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  {post.author}
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {post.date}
                </div>
              </div>
            </div>
            <hr className="border-border" />
          </CardHeader>
          
          <CardContent className="px-0 py-8">
            <p className="text-lg text-foreground/90 leading-relaxed whitespace-pre-wrap font-serif">
              {post.content}
            </p>
          </CardContent>

          <CardFooter className="px-0 py-10 flex flex-col items-center gap-10 border-t">
            <div className="flex flex-col items-center gap-4">
              <p className="text-sm text-muted-foreground font-medium">이 글이 유익하셨나요?</p>
              <LikeButton />
            </div>
            
            <div className="flex gap-3 w-full justify-end pt-4">
              <DeletePostButton postId={post.id} />
            </div>
          </CardFooter>
        </Card>
      </article>
    </div>
  );
}
