import type { DocumentId, FirestoreTimestamp, RequestId } from './firebase';

export type Draw = {
  requestId: RequestId;
  packId: DocumentId;
  result: string[];
  createdAt: FirestoreTimestamp;
};