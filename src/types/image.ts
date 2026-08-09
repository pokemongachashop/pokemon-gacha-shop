export type ImageUrlErrorCode =
  | 'EMPTY_URL'
  | 'INVALID_URL'
  | 'UNSAFE_PROTOCOL'
  | 'URL_TOO_LONG'
  | 'IMAGE_LOAD_FAILED';

export type ImageUrlValidationResult =
  | {
      success: true;
      normalizedUrl: string;
    }
  | {
      success: false;
      code: ImageUrlErrorCode;
      message: string;
    };