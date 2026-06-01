import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SearchX } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-6 text-center px-4">
      <div className="bg-muted p-4 rounded-full">
        <SearchX className="h-12 w-12 text-muted-foreground" />
      </div>
      <div className="space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">페이지를 찾을 수 없습니다</h2>
        <p className="text-muted-foreground max-w-md mx-auto">
          요청하신 페이지가 삭제되었거나 주소가 변경되었을 수 있습니다.
        </p>
      </div>
      <Link href="/">
        <Button size="lg" className="rounded-xl">
          홈으로 돌아가기
        </Button>
      </Link>
    </div>
  );
}
