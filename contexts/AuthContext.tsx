"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import { signInWithEmail, signUpWithEmail, signOut as authSignOut } from "@/lib/auth";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithEmail: typeof signInWithEmail;
  signUpWithEmail: typeof signUpWithEmail;
  signOut: typeof authSignOut;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    // 1. 초기 사용자 확인
    const initUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);
      } catch (error) {
        console.error("초기 유저 로드 실패:", error);
      } finally {
        setLoading(false);
      }
    };

    initUser();

    // 2. 인증 상태 변화 감지
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // 3. 정리(Cleanup)
    return () => {
      subscription.unsubscribe();
    };
  }, [supabase]);

  const value = {
    user,
    loading,
    signInWithEmail,
    signUpWithEmail,
    signOut: authSignOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
