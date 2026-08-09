import { MAX_IMAGE_URL_LENGTH, VALIDATION_MESSAGES } from '@/constants';
import type { ImageUrlValidationResult } from '@/types';

export function normalizeImageUrl(value: string): string {
  return value.trim();
}

export function validateImageUrlFormat(
  value: string,
): ImageUrlValidationResult {
  const normalizedUrl = normalizeImageUrl(value);

  if (normalizedUrl.length === 0) {
    return {
      success: false,
      code: 'EMPTY_URL',
      message: VALIDATION_MESSAGES.IMAGE_URL_INVALID,
    };
  }

  if (normalizedUrl.length > MAX_IMAGE_URL_LENGTH) {
    return {
      success: false,
      code: 'URL_TOO_LONG',
      message: VALIDATION_MESSAGES.IMAGE_URL_INVALID,
    };
  }

  let parsedUrl: URL;
  try {
    parsedUrl = new URL(normalizedUrl);
  } catch {
    return {
      success: false,
      code: 'INVALID_URL',
      message: VALIDATION_MESSAGES.IMAGE_URL_INVALID,
    };
  }

  if (parsedUrl.protocol !== 'https:') {
    return {
      success: false,
      code: 'UNSAFE_PROTOCOL',
      message: VALIDATION_MESSAGES.IMAGE_URL_INVALID,
    };
  }

  return {
    success: true,
    normalizedUrl,
  };
}

export function preloadImage(url: string, timeoutMs = 8000): Promise<boolean> {
  return new Promise((resolve) => {
    if (!url || typeof Image === 'undefined') {
      resolve(false);
      return;
    }

    const image = new Image();
    let isSettled = false;

    const settle = (result: boolean) => {
      if (isSettled) {
        return;
      }
      isSettled = true;
      resolve(result);
    };

    const timer = setTimeout(() => settle(false), timeoutMs);

    image.onload = () => {
      clearTimeout(timer);
      settle(true);
    };

    image.onerror = () => {
      clearTimeout(timer);
      settle(false);
    };

    image.src = url;

    if (image.complete) {
      clearTimeout(timer);
      settle(true);
    }
  });
}