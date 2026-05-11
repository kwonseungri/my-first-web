"use client";

import { useState } from "react";

export default function LikeButton() {
  const [count, setCount] = useState<number>(0);
  // count = 현재 값, setCount = 값을 바꾸는 함수, 0 = 초기값

  return (
    <button
      onClick={() => setCount(count + 1)}
      className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors flex items-center gap-2"
    >
      ❤️ <span>{count}</span>
    </button>
  );
}
