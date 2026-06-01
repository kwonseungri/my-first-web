export function getFriendlyErrorMessage(error: any): string {
  if (!error) return "일시적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요.";

  const message = error.message || error.toString();
  const code = error.code || "";

  // 1. RLS 및 권한 에러
  if (code === "42501" || message.toLowerCase().includes("row-level security") || message.toLowerCase().includes("rls")) {
    return "이 작업을 수행할 권한이 없습니다.";
  }

  // 2. 네트워크 에러
  if (message.toLowerCase().includes("failed to fetch") || message.toLowerCase().includes("network error")) {
    return "인터넷 연결을 확인해주세요.";
  }

  // 3. Not Found (데이터 없음)
  if (code === "PGRST116" || message.toLowerCase().includes("not found")) {
    return "요청한 게시글을 찾을 수 없습니다.";
  }

  // 4. 인증 관련 기본 에러 (선택적으로 추가 가능, 하지만 요구사항 외의 것은 기본값 처리하거나 남겨도 됨)
  if (message.toLowerCase().includes("invalid login credentials")) {
    return "이메일 또는 비밀번호가 올바르지 않습니다.";
  }
  if (message.toLowerCase().includes("user already registered")) {
    return "이미 가입된 이메일입니다.";
  }

  // 5. 기본값
  return "일시적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요.";
}
