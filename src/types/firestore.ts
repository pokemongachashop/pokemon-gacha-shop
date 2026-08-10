import type {
  DocumentData,
  DocumentSnapshot,
  QueryDocumentSnapshot,
  Timestamp,
} from 'firebase/firestore';

import type { AppError } from './error';

export type FirestoreTimestamp = Timestamp;

export type DocumentId = string;

export type FirestoreDocument<T> = T & {
  id: DocumentId;
};

export type FirestoreSnapshot<T extends DocumentData> = DocumentSnapshot<T>;

export type FirestoreQuerySnapshot<T extends DocumentData> =
  QueryDocumentSnapshot<T>;

export type Unsubscribe = () => void;

export type FirestoreCursor<T extends DocumentData = DocumentData> =
  QueryDocumentSnapshot<T>;

export type PaginatedResult<
  T,
  TDocument extends DocumentData = DocumentData,
> = {
  items: T[];
  nextCursor: FirestoreCursor<TDocument> | null;
  hasMore: boolean;
};

export type PageRequest<TCursor> = {
  pageSize: number;
  startAfter?: TCursor | null;
};

export type TimestampFields = {
  createdAt: FirestoreTimestamp | null;
  createdAtKST: string;
  updatedAt: FirestoreTimestamp | null;
  updatedAtKST: string;
};

export type SnapshotChangeHandler<T> = (value: T) => void;

export type SnapshotErrorHandler = (error: AppError) => void;