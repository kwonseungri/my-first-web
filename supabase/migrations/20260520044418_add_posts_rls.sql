-- =======================================================
-- Ch11. posts 테이블 Row Level Security (RLS) 최적화 설정
-- =======================================================

-- [체크포인트 1] posts 테이블 RLS(행 단위 보안) 활성화
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- [체크포인트 6] 중복 생성 오류(Duplicate Policy) 방지를 위한 기존 정책 안전 삭제
DROP POLICY IF EXISTS "Allow public read access" ON posts;
DROP POLICY IF EXISTS "Allow authenticated users to insert their own posts" ON posts;
DROP POLICY IF EXISTS "Allow users to update their own posts" ON posts;
DROP POLICY IF EXISTS "Allow users to delete their own posts" ON posts;

-- [체크포인트 2] SELECT: 누구나 모든 게시글을 읽을 수 있음 (비로그인 포함)
CREATE POLICY "Allow public read access"
ON posts
FOR SELECT
USING (true);

-- [체크포인트 3] INSERT: 로그인한 사용자가 자신의 user_id로만 글을 작성할 수 있음
CREATE POLICY "Allow authenticated users to insert their own posts"
ON posts
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- [체크포인트 4] UPDATE: 작성자 본인만 글을 수정할 수 있고, 수정 후에도 소유권이 보장됨
CREATE POLICY "Allow users to update their own posts"
ON posts
FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- [체크포인트 5] DELETE: 작성자 본인만 글을 삭제할 수 있음
CREATE POLICY "Allow users to delete their own posts"
ON posts
FOR DELETE
USING (auth.uid() = user_id);
