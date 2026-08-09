export const STATUS = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
  COMING_SOON: 'COMING_SOON',
  ENDED: 'ENDED',
  HIDDEN: 'HIDDEN',
  READY: 'READY',
  ERROR: 'ERROR',
  SUCCESS: 'SUCCESS',
} as const;

export type Status = (typeof STATUS)[keyof typeof STATUS];