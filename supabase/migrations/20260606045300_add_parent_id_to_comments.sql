-- 1. parent_id 컬럼 추가 (대댓글 구조)
ALTER TABLE comments ADD COLUMN parent_id UUID REFERENCES comments(id) ON DELETE CASCADE;

-- 인덱스 추가 (조회 성능)
CREATE INDEX IF NOT EXISTS idx_comments_parent_id ON comments (parent_id);

-- 2. 알림 트리거 함수 수정 (대댓글 작성 시 원댓글 작성자에게 알림)
CREATE OR REPLACE FUNCTION public.handle_new_comment()
RETURNS TRIGGER AS $$
DECLARE
  post_author_id UUID;
  parent_author_id UUID;
BEGIN
  -- 1) 게시글 작성자 ID 조회
  SELECT user_id INTO post_author_id FROM public.posts WHERE id = NEW.post_id;
  
  -- 2) 일반 댓글인 경우 (게시글 작성자에게 알림)
  IF NEW.parent_id IS NULL THEN
    IF NEW.user_id != post_author_id THEN
      INSERT INTO public.notifications (user_id, actor_id, post_id, comment_id, type)
      VALUES (post_author_id, NEW.user_id, NEW.post_id, NEW.id, 'comment');
    END IF;
  
  -- 3) 대댓글인 경우 (원댓글 작성자에게 알림)
  ELSE
    SELECT user_id INTO parent_author_id FROM public.comments WHERE id = NEW.parent_id;
    
    IF NEW.user_id != parent_author_id THEN
      INSERT INTO public.notifications (user_id, actor_id, post_id, comment_id, type)
      VALUES (parent_author_id, NEW.user_id, NEW.post_id, NEW.id, 'comment');
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
