-- =======================================================
-- Ch11. profiles 테이블 Row Level Security (RLS) 최적화 설정
-- =======================================================

-- [체크포인트 1] profiles 테이블 RLS(행 단위 보안) 활성화
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- [체크포인트 2] 중복 생성 오류(Duplicate Policy) 방지를 위한 기존 정책 안전 삭제
DROP POLICY IF EXISTS "Allow public read access" ON profiles;
DROP POLICY IF EXISTS "누구나 프로필 읽기 가능" ON profiles;
DROP POLICY IF EXISTS "Allow users to insert their own profile" ON profiles;
DROP POLICY IF EXISTS "Allow users to update their own profile" ON profiles;

-- [체크포인트 3] SELECT: 누구나 사용자 프로필 데이터를 읽을 수 있음 (비로그인 포함)
CREATE POLICY "Allow public read access"
ON profiles
FOR SELECT
USING (true);

-- [체크포인트 4] INSERT: 로그인한 사용자가 자신의 UID로만 프로필 데이터를 생성할 수 있음 (자동 복구 등)
CREATE POLICY "Allow users to insert their own profile"
ON profiles
FOR INSERT
WITH CHECK (auth.uid() = id);

-- [체크포인트 5] UPDATE: 로그인한 사용자가 자신의 UID에 해당하는 프로필 데이터만 수정할 수 있음
CREATE POLICY "Allow users to update their own profile"
ON profiles
FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);
