/**
 * Initialize Telegram WebApp
 */

declare global {
  interface Window {
    Telegram?: {
      WebApp: {
        ready: () => void;
        expand: () => void;
        close: () => void;
        MainButton: {
          show: () => void;
          hide: () => void;
          setText: (text: string) => void;
          onClick: (cb: () => void) => void;
        };
        initData: string;
        themeParams?: Record<string, string>;
      };
    };
  }
}

export function initTelegram(): void {
  const tg = window.Telegram?.WebApp;
  if (tg) {
    tg.ready();
    tg.expand();
  }
}

export function getInitData(): string {
  return window.Telegram?.WebApp?.initData ?? "";
}
