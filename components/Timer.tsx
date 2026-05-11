"use client";

import { useState, useEffect } from "react";

export default function Timer() {
  const [seconds, setSeconds] = useState<number>(0);

  useEffect(() => {
    console.log("⏰ 타이머가 시작되었습니다.");
    
    const timer = setInterval(() => {
      setSeconds((prev) => prev + 1);
      console.log("1초마다 실행 중...");
    }, 1000);

    // ✅ Cleanup 함수: 컴포넌트가 사라지거나(Unmount) 재실행되기 직전에 수행
    return () => {
      clearInterval(timer);
      console.log("🛑 타이머가 해제되었습니다.");
    };
  }, []); // 처음 1회만 실행

  return (
    <div className="p-6 border-2 border-dashed border-blue-200 rounded-xl bg-blue-50/50 text-center space-y-2">
      <h3 className="text-lg font-bold text-blue-600 flex items-center justify-center gap-2">
        ⏱️ 라이브 타이머
      </h3>
      <p className="text-4xl font-mono font-black text-blue-700">{seconds}초</p>
      <p className="text-xs text-blue-400">
        이 페이지를 떠나면(컴포넌트 제거 시) 자동으로 타이머가 정지됩니다.
      </p>
    </div>
  );
}
