"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Loader2, PenSquare, LogOut, User as UserIcon, ChevronDown, BookOpen } from "lucide-react";

interface UserProfile {
  username: string;
  avatar_url: string | null;
}

export default function Header() {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 프로필 데이터 로드
  useEffect(() => {
    if (!user) {
      setProfile(null);
      return;
    }

    const supabase = createClient();
    supabase
      .from("profiles")
      .select("username, avatar_url")
      .eq("id", user.id)
      .single()
      .then(({ data }) => {
        if (data) setProfile(data);
        else {
          // 프로필 없으면 이메일 앞부분을 닉네임으로 표시
          setProfile({
            username: user.email?.split("@")[0] || "user",
            avatar_url: null,
          });
        }
      });
  }, [user]);

  // 드롭다운 외부 클릭 시 닫기
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 페이지 이동 시 드롭다운 닫기
  useEffect(() => {
    setDropdownOpen(false);
  }, [pathname]);

  const handleSignOut = async () => {
    try {
      setDropdownOpen(false);
      await signOut();
      router.push("/");
      router.refresh();
    } catch (error) {
      console.error("로그아웃 실패:", error);
    }
  };

  const initial = profile?.username?.charAt(0).toUpperCase() ?? "U";

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md text-foreground">
      <nav className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
        {/* 로고 */}
        <Link
          href="/"
          className="font-black text-lg tracking-tight hover:opacity-80 transition-opacity flex items-center gap-2"
        >
          <BookOpen className="h-5 w-5 text-foreground" />
          승리의 블로그
        </Link>

        {/* 우측 메뉴 */}
        <div className="flex items-center gap-1">
          <Link
            href="/"
            className="text-sm px-3 py-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
          >
            홈
          </Link>
          <Link
            href="/posts"
            className="text-sm px-3 py-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
          >
            블로그
          </Link>

          {/* 인증 영역 */}
          {loading ? (
            <div className="w-8 h-8 flex items-center justify-center">
              <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
            </div>
          ) : user ? (
            <div className="flex items-center gap-2 ml-2">
              {/* 새 글 쓰기 버튼 */}
              <Link
                href="/posts/new"
                className="hidden sm:flex items-center gap-1.5 text-sm px-4 py-1.5 rounded-md bg-primary text-primary-foreground border border-border hover:opacity-90 transition-opacity font-medium"
              >
                <PenSquare className="h-3.5 w-3.5" />
                새 글 쓰기
              </Link>

              {/* 아바타 + 드롭다운 */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen((prev) => !prev)}
                  className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-full hover:bg-muted transition-all group"
                  aria-label="사용자 메뉴"
                >
                  {/* 아바타 */}
                  <div className="w-8 h-8 rounded-full bg-muted border border-border flex items-center justify-center font-bold text-foreground text-sm overflow-hidden flex-shrink-0 ring-2 ring-transparent group-hover:ring-border transition-all">
                    {profile?.avatar_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={profile.avatar_url}
                        alt={profile.username}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      initial
                    )}
                  </div>
                  {/* 닉네임 (md 이상에서만 표시) */}
                  <span className="hidden md:block text-sm text-muted-foreground group-hover:text-foreground transition-colors max-w-[80px] truncate">
                    {profile?.username}
                  </span>
                  <ChevronDown
                    className={`h-3.5 w-3.5 text-muted-foreground transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {/* 드롭다운 메뉴 */}
                {dropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-52 rounded-xl border border-border bg-popover text-popover-foreground shadow-lg overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
                    {/* 프로필 헤더 */}
                    <div className="px-4 py-3 border-b border-border bg-muted/50">
                      <p className="text-xs text-muted-foreground font-medium">로그인 계정</p>
                      <p className="text-sm font-semibold truncate mt-0.5">
                        {profile?.username}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                    </div>

                    {/* 메뉴 항목들 */}
                    <div className="py-1">
                      <Link
                        href="/mypage"
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-foreground hover:bg-muted transition-colors"
                      >
                        <UserIcon className="h-4 w-4 text-muted-foreground" />
                        마이페이지
                      </Link>
                      <Link
                        href="/posts/new"
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-foreground hover:bg-muted transition-colors sm:hidden"
                      >
                        <PenSquare className="h-4 w-4 text-muted-foreground" />
                        새 글 쓰기
                      </Link>
                    </div>

                    {/* 로그아웃 */}
                    <div className="border-t border-border py-1">
                      <button
                        onClick={handleSignOut}
                        className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-destructive hover:bg-destructive/10 transition-colors"
                      >
                        <LogOut className="h-4 w-4" />
                        로그아웃
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-1 ml-2">
              <Link
                href="/login"
                className="text-sm px-3 py-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
              >
                로그인
              </Link>
              <Link
                href="/signup"
                className="text-sm px-4 py-1.5 rounded-md bg-primary text-primary-foreground border border-border hover:opacity-90 transition-opacity font-medium"
              >
                회원가입
              </Link>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}
