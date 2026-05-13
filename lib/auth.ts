import { createClient } from "./supabase/client";

const supabase = createClient();

/**
 * 이메일/비밀번호 로그인
 */
export async function signInWithEmail(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;
  return data;
}

/**
 * 이메일/비밀번호 회원가입
 */
export async function signUpWithEmail(email: string, password: string, name: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name: name,
      },
    },
  });

  if (error) throw error;
  return data;
}

/**
 * 로그아웃
 */
export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}
