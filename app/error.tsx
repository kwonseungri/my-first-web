"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // 개발자용 로그는 콘솔에 남김
    console.error("앱 오류 발생:", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-6 text-center px-4">
      <div className="bg-destructive/10 p-4 rounded-full">
        <AlertTriangle className="h-12 w-12 text-destructive" />
      </div>
      <div className="space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">앗, 문제가 발생했습니다</h2>
        <p className="text-muted-foreground max-w-md mx-auto">
          요청을 처리하는 도중 예상치 못한 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.
        </p>
      </div>
      <Button onClick={reset} size="lg" className="rounded-xl">
        다시 시도하기
      </Button>
    </div>
  );
}
