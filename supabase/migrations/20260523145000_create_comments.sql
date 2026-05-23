-- =======================================================
-- Ch11. 댓글(comments) 테이블 생성 및 Row Level Security (RLS) 설정
-- =======================================================

-- 1. comments 테이블 생성
CREATE TABLE IF NOT EXISTS comments (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id     UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  user_id     UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  content     TEXT NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT now()
);

-- 2. 인덱스 생성: 특정 포스트의 댓글을 빠르게 가져오기 위함
CREATE INDEX IF NOT EXISTS idx_comments_post_id ON comments (post_id);

-- 3. Row Level Security (RLS) 활성화
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- 4. 중복 방지를 위한 기존 정책 안전 삭제
DROP POLICY IF EXISTS "Allow public read access to comments" ON comments;
DROP POLICY IF EXISTS "Allow authenticated users to insert comments" ON comments;
DROP POLICY IF EXISTS "Allow owners to update comments" ON comments;
DROP POLICY IF EXISTS "Allow owners to delete comments" ON comments;

-- 5. SELECT: 누구나 포스트의 댓글을 읽을 수 있음 (비로그인 포함)
CREATE POLICY "Allow public read access to comments"
ON comments
FOR SELECT
USING (true);

-- 6. INSERT: 로그인한 사용자가 본인의 user_id로만 댓글을 작성할 수 있음
CREATE POLICY "Allow authenticated users to insert comments"
ON comments
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- 7. UPDATE: 댓글 작성자 본인만 댓글을 수정할 수 있음
CREATE POLICY "Allow owners to update comments"
ON comments
FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- 8. DELETE: 댓글 작성자 본인만 댓글을 삭제할 수 있음
CREATE POLICY "Allow owners to delete comments"
ON comments
FOR DELETE
USING (auth.uid() = user_id);
