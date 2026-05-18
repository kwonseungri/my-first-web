"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";

interface DeletePostButtonProps {
  postId: string;
}

export default function DeletePostButton({ postId }: DeletePostButtonProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  async function handleDelete() {
    setIsDeleting(true);
    setErrorMsg(null);
    try {
      const supabase = createClient();
      
      // 보안 안내: 여기서는 UX 상의 기능 연동만 담당하며, 
      // 실제 악의적인 삭제 요청 차단은 Ch11의 Row Level Security (RLS)에서 완벽히 처리됩니다.
      const { error } = await supabase
        .from("posts")
        .delete()
        .eq("id", postId);

      if (error) {
        throw error;
      }
      
      setOpen(false);
      router.push("/posts");
    } catch (err: any) {
      setErrorMsg("게시글 삭제에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive">삭제</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>게시글 삭제</DialogTitle>
          <DialogDescription>
            이 게시글을 정말 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
            <br />
            {/* Ch10 학습용 안내 문구 */}
            <span className="text-xs text-muted-foreground block mt-2">
              * 현재 본인 확인 및 삭제 제어 로직은 UI/UX 처리입니다. 실제 백엔드 보안 처리는 Ch11 RLS에서 이루어집니다.
            </span>
          </DialogDescription>
        </DialogHeader>
        {errorMsg && (
          <div className="text-sm text-destructive font-medium px-4">{errorMsg}</div>
        )}
        <DialogFooter className="gap-2">
          <DialogClose asChild>
            <Button variant="outline" disabled={isDeleting}>취소</Button>
          </DialogClose>
          <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
            {isDeleting ? "삭제 중..." : "삭제 확인"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
