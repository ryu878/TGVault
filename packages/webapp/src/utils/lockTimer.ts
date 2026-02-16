/**
 * Auto-lock timer - calls callback after inactivity
 */

let timeoutId: ReturnType<typeof setTimeout> | null = null;
let callback: (() => void) | null = null;
let defaultMs = 5 * 60 * 1000; // 5 minutes

export function setLockTimeout(ms: number): void {
  defaultMs = ms;
}

export function startLockTimer(onLock: () => void, ms?: number): void {
  stopLockTimer();
  callback = onLock;
  const delay = ms ?? defaultMs;

  const reset = () => {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      callback?.();
      stopLockTimer();
    }, delay);
  };

  reset();
  ["mousedown", "keydown", "scroll", "touchstart"].forEach((ev) => {
    window.addEventListener(ev, reset);
  });
}

export function stopLockTimer(): void {
  if (timeoutId) {
    clearTimeout(timeoutId);
    timeoutId = null;
  }
  callback = null;
}
