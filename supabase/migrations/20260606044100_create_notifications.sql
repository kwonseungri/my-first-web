-- 1. notifications 테이블 생성
CREATE TABLE IF NOT EXISTS notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE, -- 알림을 받을 사람 (글 작성자)
  actor_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE, -- 댓글을 작성한 사람
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  comment_id UUID NOT NULL REFERENCES comments(id) ON DELETE CASCADE,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications (user_id);

-- 3. RLS 활성화
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- 4. RLS 정책
CREATE POLICY "본인의 알림만 읽을 수 있음"
ON notifications FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "본인의 알림만 수정할 수 있음"
ON notifications FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- 5. 댓글 작성 시 자동으로 알림을 생성하는 트리거 함수
CREATE OR REPLACE FUNCTION public.handle_new_comment()
RETURNS TRIGGER AS $$
DECLARE
  post_author_id UUID;
BEGIN
  -- 댓글이 달린 게시글의 작성자 ID 조회
  SELECT user_id INTO post_author_id FROM public.posts WHERE id = NEW.post_id;
  
  -- 작성자 본인이 자신의 글에 댓글을 단 경우는 알림 생성 안 함
  IF NEW.user_id != post_author_id THEN
    INSERT INTO public.notifications (user_id, actor_id, post_id, comment_id)
    VALUES (post_author_id, NEW.user_id, NEW.post_id, NEW.id);
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. 트리거 생성
DROP TRIGGER IF EXISTS on_comment_created ON public.comments;
CREATE TRIGGER on_comment_created
  AFTER INSERT ON public.comments
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_comment();
