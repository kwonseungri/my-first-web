-- =============================================
-- 001: 사용자 프로필(profiles) 및 게시글(posts) 테이블 생성
-- =============================================

-- 1. profiles 테이블 (auth.users 확장)
CREATE TABLE IF NOT EXISTS profiles (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username    TEXT NOT NULL,
  avatar_url  TEXT,
  created_at  TIMESTAMPTZ DEFAULT now()
);

-- 2. posts 테이블
CREATE TABLE IF NOT EXISTS posts (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id     UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title       TEXT NOT NULL,
  content     TEXT NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT now()
);

-- 3. 인덱스: posts를 최신순으로 빠르게 조회
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts (created_at DESC);

-- 4. RLS(Row Level Security) 활성화
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- 5. RLS 정책: 누구나 게시글 읽기 가능
CREATE POLICY "누구나 게시글 읽기 가능"
  ON posts FOR SELECT
  USING (true);

-- 6. RLS 정책: 본인만 게시글 작성 가능
CREATE POLICY "본인만 게시글 작성 가능"
  ON posts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- 7. RLS 정책: 본인만 게시글 삭제 가능
CREATE POLICY "본인만 게시글 삭제 가능"
  ON posts FOR DELETE
  USING (auth.uid() = user_id);

-- 8. RLS 정책: 누구나 사용자 프로필 읽기 가능
CREATE POLICY "누구나 프로필 읽기 가능"
  ON profiles FOR SELECT
  USING (true);
