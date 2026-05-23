"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { createClient } from "@/lib/supabase/client";
import { Post } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  User as UserIcon,
  Camera,
  Mail,
  FileText,
  Plus,
  Calendar,
  ChevronRight,
  Loader2,
  Check,
} from "lucide-react";

export default function MyPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  
  // 상태 관리
  const [profile, setProfile] = useState<{ username: string; avatar_url: string | null } | null>(null);
  const [myPosts, setMyPosts] = useState<Post[]>([]);
  const [usernameInput, setUsernameInput] = useState("");
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // 1. 권한 체크 및 초기 데이터 로드
  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.push("/login");
      return;
    }

    async function loadUserData() {
      try {
        const supabase = createClient();

        // 프로필 정보 로드
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("username, avatar_url")
          .eq("id", user!.id)
          .single();

        let currentUsername = user!.email?.split("@")[0] || "user";
        let currentAvatarUrl = null;

        if (profileError || !profileData) {
          // 프로필 정보가 없으면 자동 복구 및 생성
          const { error: insertError } = await supabase
            .from("profiles")
            .insert({
              id: user!.id,
              username: currentUsername,
            });

          if (!insertError) {
            setProfile({ username: currentUsername, avatar_url: null });
            setUsernameInput(currentUsername);
          }
        } else {
          setProfile(profileData);
          setUsernameInput(profileData.username);
          currentAvatarUrl = profileData.avatar_url;
        }

        // 내가 작성한 글 로드
        const { data: postsData, error: postsError } = await supabase
          .from("posts")
          .select("id, title, content, created_at, user_id")
          .eq("user_id", user!.id)
          .order("created_at", { ascending: false });

        if (!postsError && postsData) {
          setMyPosts(postsData as Post[]);
        }
      } catch (err) {
        console.error("데이터를 불러오는데 실패했습니다:", err);
      } finally {
        setIsDataLoading(false);
      }
    }

    loadUserData();
  }, [user, loading, router]);

  // 2. 닉네임(프로필) 수정 저장
  async function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault();
    if (!profile || !user || !usernameInput.trim()) return;

    setIsSavingProfile(true);
    setSaveSuccess(false);

    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("profiles")
        .update({ username: usernameInput.trim() })
        .eq("id", user.id);

      if (error) throw error;

      setProfile((prev) => prev ? { ...prev, username: usernameInput.trim() } : null);
      setSaveSuccess(true);
      
      // 2초 후 성공 표시 숨김
      setTimeout(() => setSaveSuccess(false), 2000);
    } catch (err: any) {
      alert("프로필 수정에 실패했습니다: " + err.message);
    } finally {
      setIsSavingProfile(false);
    }
  }

  // 3. 아바타 이미지 업로드 및 연동
  async function handleAvatarUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    // 용량 제한 (2MB) 및 파일 타입 검사
    if (file.size > 2 * 1024 * 1024) {
      alert("파일 크기는 2MB 이하여야 합니다.");
      return;
    }

    if (!file.type.startsWith("image/")) {
      alert("이미지 파일만 업로드할 수 있습니다.");
      return;
    }

    setIsUploadingAvatar(true);
    try {
      const supabase = createClient();
      
      // 고유 파일 이름 생성 (타임스탬프 포함)
      const fileExt = file.name.split(".").pop();
      const fileName = `avatar_${Date.now()}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      // 1) Supabase Storage 업로드
      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      // 2) 공개 URL 획득
      const { data: { publicUrl } } = supabase.storage
        .from("avatars")
        .getPublicUrl(filePath);

      // 3) profiles 테이블의 avatar_url 컬럼 업데이트
      const { error: dbError } = await supabase
        .from("profiles")
        .update({ avatar_url: publicUrl })
        .eq("id", user.id);

      if (dbError) throw dbError;

      // 4) 로컬 상태 동기화
      setProfile((prev) => prev ? { ...prev, avatar_url: publicUrl } : null);
      alert("프로필 이미지가 변경되었습니다.");
    } catch (err: any) {
      alert("이미지 업로드에 실패했습니다: " + err.message);
    } finally {
      setIsUploadingAvatar(false);
    }
  }

  if (loading || isDataLoading) {
    return <div className="max-w-4xl mx-auto py-24 text-center text-muted-foreground">로딩 중...</div>;
  }

  if (!user || !profile) return null;

  const initial = profile.username.charAt(0).toUpperCase();

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-6 px-4">
      <header className="border-b pb-4">
        <h1 className="text-3xl font-black tracking-tight text-foreground">마이페이지</h1>
        <p className="text-muted-foreground mt-1">프로필 관리와 내가 쓴 글 목록을 모아보는 대시보드입니다.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* 프로필 편집 카드 */}
        <Card className="md:col-span-1 shadow-sm border border-border/80 bg-card/60 backdrop-blur-md">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-lg font-bold">프로필 편집</CardTitle>
            <CardDescription>나의 개인 정보를 관리합니다</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-6">
            {/* 아바타 업로드 영역 */}
            <div className="relative group select-none">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleAvatarUpload}
                accept="image/*"
                className="hidden"
                disabled={isUploadingAvatar}
              />
              
              <div className="w-24 h-24 rounded-full border border-primary/20 bg-primary/5 flex items-center justify-center font-bold text-primary text-3xl overflow-hidden shadow-md transition-all">
                {isUploadingAvatar ? (
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                ) : profile.avatar_url ? (
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

              {/* 이미지 변경 호버 오버레이 */}
              {!isUploadingAvatar && (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute inset-0 bg-black/60 rounded-full flex flex-col items-center justify-center gap-1 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer"
                >
                  <Camera className="h-4 w-4" />
                  <span>변경</span>
                </button>
              )}
            </div>

            {/* 프로필 입력 양식 */}
            <form onSubmit={handleSaveProfile} className="w-full space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
                  <Mail className="h-3 w-3" /> 이메일 (변경 불가)
                </label>
                <div className="text-sm font-medium bg-muted/50 text-muted-foreground/80 px-3 py-2 rounded-lg border border-muted/50 select-all">
                  {user.email}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1" htmlFor="username">
                  <UserIcon className="h-3 w-3" /> 닉네임 (username)
                </label>
                <Input
                  id="username"
                  type="text"
                  value={usernameInput}
                  onChange={(e) => setUsernameInput(e.target.value)}
                  placeholder="닉네임을 입력하세요"
                  required
                  disabled={isSavingProfile || isUploadingAvatar}
                  className="rounded-lg text-sm"
                />
              </div>

              <Button
                type="submit"
                disabled={isSavingProfile || isUploadingAvatar || usernameInput.trim() === profile.username}
                className="w-full rounded-lg"
              >
                {isSavingProfile ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    저장 중...
                  </>
                ) : saveSuccess ? (
                  <>
                    <Check className="mr-2 h-4 w-4 text-emerald-400" />
                    저장 완료!
                  </>
                ) : (
                  "닉네임 변경"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* 내가 쓴 글 카드 */}
        <Card className="md:col-span-2 shadow-sm border border-border/80">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl font-bold flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              내가 쓴 글 ({myPosts.length})
            </CardTitle>
            <CardDescription>내가 이 블로그에 남긴 유용한 포스팅 목록입니다</CardDescription>
          </CardHeader>
          <CardContent>
            {myPosts.length === 0 ? (
              <div className="p-12 text-center border-2 border-dashed rounded-xl flex flex-col items-center justify-center gap-4 text-muted-foreground">
                <FileText className="h-10 w-10 text-muted-foreground/40" />
                <div className="space-y-1">
                  <p className="font-semibold text-sm">아직 작성한 포스트가 없습니다.</p>
                  <p className="text-xs">첫 번째 지식 공유를 시작해보세요!</p>
                </div>
                <Link href="/posts/new">
                  <Button size="sm" className="rounded-lg gap-2 mt-2">
                    <Plus className="h-4 w-4" />
                    첫 글 작성하러 가기
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                {myPosts.map((post) => (
                  <Link key={post.id} href={`/posts/${post.id}`}>
                    <div className="p-4 rounded-xl border bg-card/40 hover:bg-muted/10 hover:border-primary/20 transition-all flex justify-between items-center group cursor-pointer">
                      <div className="space-y-1 text-left">
                        <h3 className="font-bold text-base group-hover:text-primary transition-colors text-foreground line-clamp-1">
                          {post.title}
                        </h3>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(post.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <ChevronRight className="h-5 w-5 text-muted-foreground/60 group-hover:text-primary transition-colors transform group-hover:translate-x-1 duration-200 flex-shrink-0" />
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
