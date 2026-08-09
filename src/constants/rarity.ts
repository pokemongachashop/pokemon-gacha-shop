export const RARITY = {
  NORMAL: 'NORMAL',
  RARE: 'RARE',
  SUPER_RARE: 'SUPER_RARE',
  ULTRA_RARE: 'ULTRA_RARE',
  LEGENDARY: 'LEGENDARY',
} as const;

export type Rarity = (typeof RARITY)[keyof typeof RARITY];