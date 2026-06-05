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
  views: number;       // 조회수
  created_at: string;  // ISO 8601 형식
}

// posts 조회 시 작성자(profile) 정보를 함께 가져올 때 사용하는 타입
export interface PostWithProfile extends Post {
  profiles: Pick<Profile, "username" | "avatar_url">;
}

export interface Comment {
  id: string;          // UUID
  post_id: string;     // → posts.id 참조
  user_id: string;     // → profiles.id 참조
  parent_id: string | null; // → comments.id 참조 (대댓글인 경우)
  content: string;
  created_at: string;  // ISO 8601 형식
}

// comments 조회 시 작성자(profile) 정보를 함께 가져올 때 사용하는 타입
export interface CommentWithProfile extends Comment {
  profiles: Pick<Profile, "username" | "avatar_url"> | null;
  replies?: CommentWithProfile[]; // 프론트엔드 계층 구조용
}


export interface Notification {
  id: string;
  type: 'comment' | 'follow';
  user_id: string;
  actor_id: string;
  post_id: string | null;
  comment_id: string | null;
  is_read: boolean;
  created_at: string;
}

export interface NotificationWithDetails extends Notification {
  actor: Pick<Profile, "username" | "avatar_url"> | null;
  post: Pick<Post, "title"> | null;
  comment: Pick<Comment, "content"> | null;
}

export interface Follow {
  follower_id: string;
  following_id: string;
  created_at: string;
}

export interface Attendance {
  id: string;
  user_id: string;
  check_date: string;
  created_at: string;
}
