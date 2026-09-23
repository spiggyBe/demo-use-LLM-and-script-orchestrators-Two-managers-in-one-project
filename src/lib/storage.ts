/**
 * Thin, SSR-safe wrapper around window.localStorage.
 * The whole app persists state only in the browser — no external database.
 */
const isBrowser = () => typeof window !== "undefined";

export function readStorage<T>(key: string, fallback: T): T {
  if (!isBrowser()) return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function writeStorage<T>(key: string, value: T): void {
  if (!isBrowser()) return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage quota exceeded or unavailable (e.g. private mode) — fail silently.
  }
}

export function removeStorage(key: string): void {
  if (!isBrowser()) return;
  window.localStorage.removeItem(key);
}
