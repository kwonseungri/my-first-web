import ExternalPostList from "@/components/ExternalPostList";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const metadata = {
  title: "리액트 실습 | 내 블로그",
  description: "useEffect를 사용한 외부 데이터 페칭 실습 페이지입니다.",
};

export default function PracticePage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 py-6">
      <header className="space-y-2 border-b pb-4">
        <h1 className="text-3xl font-bold">7장 실습: useEffect & API</h1>
        <p className="text-muted-foreground">
          컴포넌트 라이프사이클과 외부 데이터 연동(Fetch API)을 실습하는 페이지입니다.
        </p>
      </header>

      <ExternalPostList />

      <footer className="pt-6">
        <Link href="/">
          <Button variant="ghost">← 홈으로 돌아가기</Button>
        </Link>
      </footer>
    </div>
  );
}
