export const AUTH_ERROR_MESSAGES = {
  INVALID_CREDENTIAL: '아이디 또는 비밀번호를 확인해주세요.',
  ACCOUNT_EXISTS: '이미 사용 중인 아이디입니다.',
  WEAK_PASSWORD: '비밀번호 보안 수준이 충분하지 않습니다.',
  TOO_MANY_REQUESTS: '로그인 시도가 너무 많습니다. 잠시 후 다시 시도해주세요.',
  NETWORK_ERROR: '인터넷 연결을 확인해주세요.',
  ACCOUNT_DISABLED: '현재 사용할 수 없는 계정입니다.',
  REQUIRES_RECENT_LOGIN: '보안을 위해 다시 로그인해주세요.',
  OPERATION_NOT_ALLOWED: '현재 인증 기능을 사용할 수 없습니다.',
  PERSISTENCE_FAILED:
    '로그인 환경을 준비하지 못했습니다. 잠시 후 다시 시도해주세요.',
  UNKNOWN: '알 수 없는 오류가 발생했습니다.',
} as const;