import type { FirestoreTimestamp } from './firestore';

export type AuditLog = {
  actorId: string;
  action: string;
  targetId: string;
  createdAt: FirestoreTimestamp;
};