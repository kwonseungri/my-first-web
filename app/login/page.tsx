export default function LoginPage() {
  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded-lg shadow-sm bg-white">
      <h1 className="text-2xl font-bold mb-6 text-center">로그인</h1>
      <form className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">이메일</label>
          <input
            type="email"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="example@email.com"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">비밀번호</label>
          <input
            type="password"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          로그인
        </button>
      </form>
      <p className="mt-4 text-center text-sm text-gray-600">
        계정이 없으신가요? <a href="/signup" className="text-blue-600 hover:underline">회원가입</a>
      </p>
    </div>
  );
}
