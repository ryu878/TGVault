import { create } from "zustand";
import { persist } from "zustand/middleware";

interface SettingsState {
  lockTimeoutMinutes: number;
  clearClipboardSeconds: number;
  theme: "light" | "dark" | "system";
  setLockTimeout: (minutes: number) => void;
  setClearClipboard: (seconds: number) => void;
  setTheme: (theme: "light" | "dark" | "system") => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      lockTimeoutMinutes: 5,
      clearClipboardSeconds: 30,
      theme: "system",
      setLockTimeout: (minutes) => set({ lockTimeoutMinutes: minutes }),
      setClearClipboard: (seconds) => set({ clearClipboardSeconds: seconds }),
      setTheme: (theme) => set({ theme }),
    }),
    { name: "tgvault-settings" }
  )
);
