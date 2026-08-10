import type { RequestId } from './firebase';
import type { DocumentId, FirestoreTimestamp } from './firestore';

export type Draw = {
  requestId: RequestId;
  packId: DocumentId;
  result: string[];
  createdAt: FirestoreTimestamp;
};