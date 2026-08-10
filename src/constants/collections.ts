export const COLLECTIONS = {
  USERS: 'users',
  USERNAMES: 'usernames',
  CARD_PACKS: 'cardPacks',
  PRODUCTS: 'products',
  DRAW_LOGS: 'drawLogs',
  COIN_LEDGERS: 'coinLedgers',
  NOTICES: 'notices',
  SITE_SETTINGS: 'siteSettings',
  AUDIT_LOGS: 'auditLogs',
  SYSTEM_LOGS: 'systemLogs',
  BACKUPS: 'backups',
  STATISTICS: 'statistics',
} as const;

export const SUBCOLLECTIONS = {
  INVENTORIES: 'inventories',
  DRAW_REQUESTS: 'drawRequests',
} as const;

export type CollectionName = (typeof COLLECTIONS)[keyof typeof COLLECTIONS];
export type SubcollectionName =
  (typeof SUBCOLLECTIONS)[keyof typeof SUBCOLLECTIONS];