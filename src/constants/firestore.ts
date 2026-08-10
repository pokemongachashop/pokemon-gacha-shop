export const FIRESTORE_DOCUMENTS = {
  SITE_CONFIG: 'config',
} as const;

// 사이트 설정을 아직 불러오지 못했을 때만 쓰는 기술적 기본값입니다.
// 실제 운영 페이지 크기는 이후 Site Settings에서 관리합니다.
export const DEFAULT_PAGE_SIZE = 20;