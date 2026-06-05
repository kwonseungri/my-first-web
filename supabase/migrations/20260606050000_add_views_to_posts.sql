-- 1. posts 테이블에 views 컬럼 추가
ALTER TABLE public.posts ADD COLUMN views INTEGER DEFAULT 0 NOT NULL;

-- 2. 안전하게 조회수를 1 증가시키는 함수 (RPC)
CREATE OR REPLACE FUNCTION public.increment_page_view(post_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE public.posts
  SET views = views + 1
  WHERE id = post_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
