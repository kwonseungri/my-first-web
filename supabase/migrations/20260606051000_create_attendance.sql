-- 출석체크 테이블 생성
CREATE TABLE public.attendances (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  check_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(user_id, check_date)
);

-- RLS 활성화
ALTER TABLE public.attendances ENABLE ROW LEVEL SECURITY;

-- 출석 기록 조회 권한 (본인만)
CREATE POLICY "Users can view their own attendances"
  ON public.attendances FOR SELECT
  USING (auth.uid() = user_id);

-- 출석 기록 생성 권한 (본인만)
CREATE POLICY "Users can insert their own attendances"
  ON public.attendances FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- 클라이언트 시간 조작 방지 및 중복 방지를 위한 안전한 RPC 함수
CREATE OR REPLACE FUNCTION public.check_in()
RETURNS void AS $$
BEGIN
  -- 인증된 사용자가 아니면 에러를 발생시키거나 무시
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  INSERT INTO public.attendances (user_id, check_date)
  VALUES (auth.uid(), CURRENT_DATE)
  ON CONFLICT (user_id, check_date) DO NOTHING;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
