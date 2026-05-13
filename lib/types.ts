// Supabase 데이터베이스 타입 정의
// users 테이블과 posts 테이블의 TypeScript 인터페이스

export interface Profile {
  id: string;          // UUID (auth.users 참조)
  username: string;
  avatar_url: string | null;
  created_at: string;  // ISO 8601 형식
}

export interface Post {
  id: string;          // UUID
  user_id: string;     // → profiles.id 참조
  title: string;
  content: string;
  created_at: string;  // ISO 8601 형식
}

// posts 조회 시 작성자(profile) 정보를 함께 가져올 때 사용하는 타입
export interface PostWithProfile extends Post {
  profiles: Pick<Profile, "username" | "avatar_url">;
}

