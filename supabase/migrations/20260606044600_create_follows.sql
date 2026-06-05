-- 1. notifications 테이블 수정
ALTER TABLE notifications ADD COLUMN type TEXT DEFAULT 'comment';
ALTER TABLE notifications ALTER COLUMN post_id DROP NOT NULL;
ALTER TABLE notifications ALTER COLUMN comment_id DROP NOT NULL;

-- 2. follows 테이블 생성
CREATE TABLE IF NOT EXISTS follows (
  follower_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  following_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (follower_id, following_id)
);

-- 인덱스 생성 (성능 최적화)
CREATE INDEX IF NOT EXISTS idx_follows_follower_id ON follows(follower_id);
CREATE INDEX IF NOT EXISTS idx_follows_following_id ON follows(following_id);

-- RLS 활성화
ALTER TABLE follows ENABLE ROW LEVEL SECURITY;

-- 누구나 팔로우 관계 조회 가능
CREATE POLICY "누구나 팔로우 관계 조회 가능"
ON follows FOR SELECT
USING (true);

-- 로그인한 사용자만 팔로우(INSERT) 가능 (follower_id가 본인일 때만)
CREATE POLICY "본인만 팔로우 가능"
ON follows FOR INSERT
WITH CHECK (auth.uid() = follower_id);

-- 로그인한 사용자만 팔로우 취소(DELETE) 가능 (follower_id가 본인일 때만)
CREATE POLICY "본인만 팔로우 취소 가능"
ON follows FOR DELETE
USING (auth.uid() = follower_id);

-- 3. 이웃 추가(Follow) 시 알림 생성 트리거 함수
CREATE OR REPLACE FUNCTION public.handle_new_follow()
RETURNS TRIGGER AS $$
BEGIN
  -- 알림 테이블에 데이터 추가 (type='follow')
  INSERT INTO public.notifications (user_id, actor_id, type)
  VALUES (NEW.following_id, NEW.follower_id, 'follow');
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. 이웃 추가 트리거
DROP TRIGGER IF EXISTS on_follow_created ON public.follows;
CREATE TRIGGER on_follow_created
  AFTER INSERT ON public.follows
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_follow();
