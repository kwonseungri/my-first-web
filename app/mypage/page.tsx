export default function MyPage() {
  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <header className="border-b pb-4">
        <h1 className="text-3xl font-bold">마이페이지</h1>
        <p className="text-gray-600">내 정보와 활동 내역을 확인하세요.</p>
      </header>

      <section className="bg-gray-50 p-6 rounded-xl border border-gray-100">
        <h2 className="text-xl font-semibold mb-4">내 프로필</h2>
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-2xl font-bold">
            U
          </div>
          <div>
            <p className="text-lg font-medium">사용자 이름</p>
            <p className="text-gray-500">user@example.com</p>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4">내가 쓴 글</h2>
        <div className="space-y-4">
          {/* 글 목록이 없을 경우의 예시 */}
          <div className="p-8 text-center border-2 border-dashed rounded-lg text-gray-400">
            아직 작성한 글이 없습니다.
          </div>
        </div>
      </section>
    </div>
  );
}
