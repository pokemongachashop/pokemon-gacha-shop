export const MESSAGES = {
  SAVED: '저장되었습니다.',
  DELETED: '삭제되었습니다.',
  ERROR: '오류가 발생했습니다.',
  RETRY: '다시 시도해주세요.',
} as const;

export const VALIDATION_MESSAGES = {
  LOGIN_ID_INVALID:
    '아이디는 영문 소문자, 숫자, 밑줄을 사용해 4~20자로 입력해주세요.',
  PASSWORD_INVALID:
    '비밀번호는 영문과 숫자를 포함해 8자 이상 입력해주세요.',
  PASSWORD_CONFIRM_MISMATCH: '비밀번호가 일치하지 않습니다.',
  IMAGE_URL_INVALID:
    '공개적으로 접근 가능한 HTTPS 이미지 URL을 입력해주세요.',
  DISPLAY_NAME_INVALID:
    '활동명은 1자 이상 32자 이하로, 줄바꿈 없이 입력해주세요.',
} as const;

export const USER_MESSAGES = {
  NOT_FOUND: '계정 정보를 찾을 수 없습니다.',
  LOGIN_ID_ALREADY_IN_USE: '이미 사용 중인 아이디입니다.',
  ACCOUNT_ALREADY_EXISTS: '이미 등록된 계정입니다.',
} as const;

export const REGISTER_MESSAGES = {
  LOGIN_ID_TAKEN: '이미 사용 중인 아이디입니다.',
  LOGIN_ID_TAKEN_NEEDS_SUPPORT:
    '이미 사용 중인 아이디입니다. 관리자에게 문의가 필요할 수 있습니다.',
  INITIAL_COIN_UNAVAILABLE:
    '회원가입 설정이 준비되지 않았습니다. 관리자에게 문의해주세요.',
  ROLLBACK_FAILED:
    '회원가입 처리 중 문제가 발생했습니다. 관리자에게 문의해주세요.',
} as const;