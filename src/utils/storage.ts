function isBrowserEnvironment(): boolean {
  return typeof window !== 'undefined';
}

export function getLocalStorageItem(key: string): string | null {
  if (!isBrowserEnvironment()) {
    return null;
  }
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

export function setLocalStorageItem(key: string, value: string): boolean {
  if (!isBrowserEnvironment()) {
    return false;
  }
  try {
    window.localStorage.setItem(key, value);
    return true;
  } catch {
    return false;
  }
}

export function removeLocalStorageItem(key: string): boolean {
  if (!isBrowserEnvironment()) {
    return false;
  }
  try {
    window.localStorage.removeItem(key);
    return true;
  } catch {
    return false;
  }
}

export function getSessionStorageItem(key: string): string | null {
  if (!isBrowserEnvironment()) {
    return null;
  }
  try {
    return window.sessionStorage.getItem(key);
  } catch {
    return null;
  }
}

export function setSessionStorageItem(key: string, value: string): boolean {
  if (!isBrowserEnvironment()) {
    return false;
  }
  try {
    window.sessionStorage.setItem(key, value);
    return true;
  } catch {
    return false;
  }
}

export function removeSessionStorageItem(key: string): boolean {
  if (!isBrowserEnvironment()) {
    return false;
  }
  try {
    window.sessionStorage.removeItem(key);
    return true;
  } catch {
    return false;
  }
}

export function getLocalStorageJson<T>(key: string): T | null {
  const rawValue = getLocalStorageItem(key);
  if (rawValue === null) {
    return null;
  }

  try {
    return JSON.parse(rawValue) as T;
  } catch {
    return null;
  }
}

export function setLocalStorageJson<T>(key: string, value: T): boolean {
  try {
    return setLocalStorageItem(key, JSON.stringify(value));
  } catch {
    return false;
  }
}