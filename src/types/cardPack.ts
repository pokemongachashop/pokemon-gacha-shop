import type { Status } from '@/constants';

export type CardPack = {
  id: string;
  name: string;
  thumbnailUrl: string;
  status: Status;
  price: number;
  drawStatus: Status;
};