import type { Status } from '@/constants';
import type { FirestoreTimestamp } from './firebase';

export type Inventory = {
  id: string;
  productId: string;
  status: Status;
  imageUrl: string;
  obtainedAt: FirestoreTimestamp;
};