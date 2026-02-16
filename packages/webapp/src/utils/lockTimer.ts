/**
 * Auto-lock timer - calls callback after inactivity
 */

let timeoutId: ReturnType<typeof setTimeout> | null = null;
let callback: (() => void) | null = null;
let defaultMs = 5 * 60 * 1000; // 5 minutes

const ACTIVITY_EVENTS = ["mousedown", "keydown", "scroll", "touchstart"] as const;
let boundReset: (() => void) | null = null;

export function setLockTimeout(ms: number): void {
  defaultMs = ms;
}

export function startLockTimer(onLock: () => void, ms?: number): void {
  stopLockTimer();
  callback = onLock;
  const delay = ms ?? defaultMs;

  boundReset = () => {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      callback?.();
      stopLockTimer();
    }, delay);
  };

  boundReset();
  ACTIVITY_EVENTS.forEach((ev) => {
    window.addEventListener(ev, boundReset!);
  });
}

export function stopLockTimer(): void {
  if (boundReset) {
    ACTIVITY_EVENTS.forEach((ev) => {
      window.removeEventListener(ev, boundReset!);
    });
    boundReset = null;
  }
  if (timeoutId) {
    clearTimeout(timeoutId);
    timeoutId = null;
  }
  callback = null;
}
