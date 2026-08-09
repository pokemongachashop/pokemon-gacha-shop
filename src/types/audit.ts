import type { FirestoreTimestamp } from './firebase';

export type AuditLog = {
  actorId: string;
  action: string;
  targetId: string;
  createdAt: FirestoreTimestamp;
};