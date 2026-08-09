import type { Rarity } from '@/constants';

export type Product = {
  id: string;
  name: string;
  rarity: Rarity;
  probability: number;
  stock: number;
  imageUrl: string;
};