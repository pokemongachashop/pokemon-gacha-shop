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
  IMAGE_URL_INVALID:
    '공개적으로 접근 가능한 HTTPS 이미지 URL을 입력해주세요.',
} as const;