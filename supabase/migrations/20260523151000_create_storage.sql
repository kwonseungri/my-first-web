-- =======================================================
-- Ch11. Supabase Storage 생성 및 아바타(avatars) 업로드 RLS 설정
-- =======================================================

-- 1. avatars 버킷 생성 (공개 버킷)
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- 2. RLS 정책 설정 (storage.objects 테이블에 대한 RLS 적용)

-- [체크포인트] 중복 방지를 위한 기존 정책 안전 삭제
DROP POLICY IF EXISTS "Allow public read access to avatars" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to upload avatars" ON storage.objects;
DROP POLICY IF EXISTS "Allow users to update their own avatars" ON storage.objects;
DROP POLICY IF EXISTS "Allow users to delete their own avatars" ON storage.objects;

-- ① SELECT: 누구나 avatars 버킷의 이미지를 읽을 수 있음 (공개 프로필 이미지)
CREATE POLICY "Allow public read access to avatars"
ON storage.objects
FOR SELECT
USING (bucket_id = 'avatars');

-- ② INSERT: 로그인된 사용자가 자신의 UID 폴더 내에만 아바타 이미지 업로드 가능
CREATE POLICY "Allow authenticated users to upload avatars"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'avatars' 
  AND auth.role() = 'authenticated'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- ③ UPDATE: 로그인된 사용자가 자신의 UID 폴더 내 아바타 이미지만 교체(수정) 가능
CREATE POLICY "Allow users to update their own avatars"
ON storage.objects
FOR UPDATE
USING (
  bucket_id = 'avatars'
  AND auth.role() = 'authenticated'
  AND (storage.foldername(name))[1] = auth.uid()::text
)
WITH CHECK (
  bucket_id = 'avatars'
  AND auth.role() = 'authenticated'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- ④ DELETE: 로그인된 사용자가 자신의 UID 폴더 내 아바타 이미지만 삭제 가능
CREATE POLICY "Allow users to delete their own avatars"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'avatars'
  AND auth.role() = 'authenticated'
  AND (storage.foldername(name))[1] = auth.uid()::text
);
