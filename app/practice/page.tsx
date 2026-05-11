import ExternalPostList from "@/components/ExternalPostList";
import Timer from "@/components/Timer";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const metadata = {
  title: "리액트 실습 | 내 블로그",
  description: "useEffect를 사용한 외부 데이터 페칭 및 타이머 실습 페이지입니다.",
};

export default function PracticePage() {
  return (
    <div className="max-w-4xl mx-auto space-y-12 py-6">
      <header className="space-y-2 border-b pb-4">
        <h1 className="text-3xl font-bold">7장 실습: useEffect & Lifecycle</h1>
        <p className="text-muted-foreground">
          컴포넌트 라이프사이클, 외부 데이터 연동, 그리고 Cleanup 기능을 실습하는 페이지입니다.
        </p>
      </header>

      <section className="grid gap-8 md:grid-cols-2">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">1. 데이터 페칭 (Mount)</h2>
          <ExternalPostList />
        </div>
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">2. 타이머 & 정리 (Cleanup)</h2>
          <Timer />
        </div>
      </section>

      <footer className="pt-6">
        <Link href="/">
          <Button variant="ghost">← 홈으로 돌아가기</Button>
        </Link>
      </footer>
    </div>
  );
}
