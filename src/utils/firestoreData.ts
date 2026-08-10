import type { DocumentSnapshot } from 'firebase/firestore';

import type { ServiceResult } from '@/types';

import { createAppError } from './error';

export type DocumentParser<T> = (
  data: Record<string, unknown>,
  id: string,
) => T;

export function parseDocumentSnapshot<T>(
  snapshot: DocumentSnapshot,
  parser: DocumentParser<T>,
): ServiceResult<T> {
  if (!snapshot.exists()) {
    return {
      success: false,
      error: createAppError('NOT_FOUND', '요청한 데이터를 찾을 수 없습니다.', {
        developerMessage: `Missing document: ${snapshot.ref.path}`,
      }),
    };
  }

  try {
    const data = parser(snapshot.data(), snapshot.id);
    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error: createAppError(
        'INTERNAL_ERROR',
        '데이터를 처리하는 중 문제가 발생했습니다.',
        {
          developerMessage: `Failed to parse document: ${snapshot.ref.path}`,
          cause: error,
        },
      ),
    };
  }
}