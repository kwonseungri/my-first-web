"use client";

import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export default function Header() {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push("/");
      router.refresh();
    } catch (error) {
      console.error("로그아웃 실패:", error);
    }
  };

  return (
    <header className="bg-gray-800 text-white p-4">
      <nav className="max-w-4xl mx-auto flex items-center justify-between">
        <Link href="/" className="font-bold text-lg">내 블로그</Link>
        
        <div className="flex items-center gap-4">
          <Link href="/" className="text-sm hover:underline">홈</Link>
          <Link href="/posts" className="text-sm hover:underline">블로그</Link>

          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
          ) : user ? (
            <>
              <Link href="/posts/new" className="text-sm hover:underline text-blue-400 font-medium">
                새 글 쓰기
              </Link>
              <Link href="/mypage" className="text-sm hover:underline">
                마이페이지
              </Link>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleSignOut}
                className="text-white hover:bg-gray-700 hover:text-white h-8 px-3"
              >
                로그아웃
              </Button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-sm hover:underline">
                로그인
              </Link>
              <Link href="/signup" className="text-sm hover:underline">
                회원가입
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
