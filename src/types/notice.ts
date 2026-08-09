import type { FirestoreTimestamp } from './firebase';

export type NoticeType = 'GENERAL' | 'POPUP' | 'URGENT';

export type Notice = {
  title: string;
  content: string;
  type: NoticeType;
  startAt: FirestoreTimestamp;
  endAt: FirestoreTimestamp;
};