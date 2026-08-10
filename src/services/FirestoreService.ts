import {
  collection,
  doc,
  serverTimestamp,
  type CollectionReference,
  type DocumentData,
  type DocumentReference,
  type FieldValue,
} from 'firebase/firestore';

import { COLLECTIONS, SUBCOLLECTIONS } from '@/constants';
import type { CollectionName } from '@/constants';
import { firestore } from '@/firebase/firestore';

/**
 * 빈 값/공백 값/경로를 깨뜨리는 값을 사전에 차단합니다.
 * 이 함수가 던지는 오류는 "잘못된 코드 사용"에 대한 개발자용 오류이며,
 * 사용자에게 그대로 노출하지 않습니다.
 */
function assertValidId(value: string, label: string): void {
  const trimmedValue = value.trim();

  if (trimmedValue.length === 0) {
    throw new Error(`${label}는 빈 값일 수 없습니다.`);
  }

  if (trimmedValue.includes('/')) {
    throw new Error(`${label}에는 '/' 문자를 포함할 수 없습니다.`);
  }
}

export function getCollectionReference(
  collectionName: CollectionName,
): CollectionReference<DocumentData> {
  return collection(firestore, collectionName);
}

export function getDocumentReference(
  collectionName: CollectionName,
  documentId: string,
): DocumentReference<DocumentData> {
  assertValidId(documentId, 'documentId');
  return doc(firestore, collectionName, documentId);
}

export function getUserDocumentReference(
  uid: string,
): DocumentReference<DocumentData> {
  assertValidId(uid, 'uid');
  return doc(firestore, COLLECTIONS.USERS, uid);
}

export function getUsernameDocumentReference(
  normalizedLoginId: string,
): DocumentReference<DocumentData> {
  assertValidId(normalizedLoginId, 'normalizedLoginId');
  return doc(firestore, COLLECTIONS.USERNAMES, normalizedLoginId);
}

export function getUserInventoryCollectionReference(
  uid: string,
): CollectionReference<DocumentData> {
  assertValidId(uid, 'uid');
  return collection(
    firestore,
    COLLECTIONS.USERS,
    uid,
    SUBCOLLECTIONS.INVENTORIES,
  );
}

export function getUserDrawRequestDocumentReference(
  uid: string,
  requestId: string,
): DocumentReference<DocumentData> {
  assertValidId(uid, 'uid');
  assertValidId(requestId, 'requestId');
  return doc(
    firestore,
    COLLECTIONS.USERS,
    uid,
    SUBCOLLECTIONS.DRAW_REQUESTS,
    requestId,
  );
}

export function getServerTimestamp(): FieldValue {
  return serverTimestamp();
}