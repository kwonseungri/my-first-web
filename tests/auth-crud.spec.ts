import { test, expect } from '@playwright/test';

test.describe('Auth and CRUD Flow', () => {
  test('행복 경로: 로그인 후 새 글 작성 및 목록 확인', async ({ page }) => {
    // 1. /login에서 TEST_EMAIL, TEST_PASSWORD 환경변수로 로그인
    await page.goto('/login');
    
    const email = process.env.TEST_EMAIL;
    const password = process.env.TEST_PASSWORD;
    
    if (!email || !password) {
      throw new Error('TEST_EMAIL or TEST_PASSWORD environment variables are not set.');
    }

    await page.getByLabel('이메일').fill(email);
    await page.getByLabel('비밀번호').fill(password);
    await page.getByRole('button', { name: '로그인' }).click();

    // 로그인 완료 후 /posts 또는 다른 페이지로 이동하는 것을 대기
    await page.waitForURL('**/posts**');

    // 2. /posts/new에서 제목/내용 입력 후 저장
    await page.goto('/posts/new');
    
    const uniqueTitle = `E2E 테스트 제목 ${Date.now()}`;
    const uniqueContent = `E2E 테스트 내용 ${Date.now()}`;
    
    // Label 텍스트 기준
    await page.getByLabel('제목').fill(uniqueTitle);
    await page.getByLabel('내용').fill(uniqueContent);
    await page.getByRole('button', { name: '작성하기' }).click();

    // 작성 완료 후 상세 페이지(/posts/[id])로 리다이렉트 대기
    await page.waitForURL('**/posts/*');

    // 3. /posts 목록에서 새 글 제목 확인
    await page.goto('/posts');
    await expect(page.getByText(uniqueTitle)).toBeVisible();
  });

  test('거절 경로: 비로그인 상태에서 새 글 작성 접근 시 로그인 페이지로 리다이렉트', async ({ page }) => {
    // alert 창이 뜨면 자동으로 accept 처리
    page.on('dialog', dialog => dialog.accept());

    // 1. 로그아웃 상태(새 브라우저 컨텍스트이므로 이미 비로그인 상태)에서 /posts/new 접속
    await page.goto('/posts/new');

    // 2. /login으로 리다이렉트되는지 확인
    await page.waitForURL('**/login**');
    
    await expect(page).toHaveURL(/.*\/login/);
    await expect(page.getByRole('button', { name: '로그인' })).toBeVisible();
  });
});
