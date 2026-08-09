export type Nullable<T> = T | null;

export type Optional<T> = T | undefined;

export type AsyncStatus = 'IDLE' | 'LOADING' | 'SUCCESS' | 'ERROR';

export type LoadingState = {
  status: AsyncStatus;
  error: Nullable<string>;
};