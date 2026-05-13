export default function SignupPage() {
  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded-2xl shadow-sm bg-white animate-in fade-in slide-in-from-bottom-4 duration-700">
      <h1 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-blue-600 to-indigo-400 bg-clip-text text-transparent">
        회원가입
      </h1>
      <form className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">이름</label>
          <input
            type="text"
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            placeholder="홍길동"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">이메일</label>
          <input
            type="email"
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            placeholder="example@email.com"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">비밀번호</label>
          <input
            type="password"
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            placeholder="••••••••"
          />
        </div>
        <button
          type="submit"
          className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-lg text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-500 hover:from-blue-700 hover:to-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all active:scale-95"
        >
          가입하기
        </button>
      </form>
      <p className="mt-6 text-center text-sm text-gray-600">
        이미 계정이 있으신가요? <a href="/login" className="text-blue-600 font-semibold hover:underline">로그인</a>
      </p>
    </div>
  );
}
