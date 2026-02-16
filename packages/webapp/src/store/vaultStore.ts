import { create } from "zustand";
import type { VaultPlaintext, VaultEntry } from "@tgvault/common";
import { encryptVault, decryptVault } from "@tgvault/crypto";
import { fetchVault, saveVault } from "../api/vault";
import { setAuthToken } from "../api/client";
import { getAuthToken } from "../tg/auth";
import { startLockTimer, stopLockTimer } from "../utils/lockTimer";
import { useSettingsStore } from "./settingsStore";

interface VaultState {
  vault: VaultPlaintext | null;
  isUnlocked: boolean;
  isLoading: boolean;
  error: string | null;
  _password: string | null; // Held only during session for re-encryption
  unlock: (password: string) => Promise<boolean>;
  lock: () => void;
  sync: () => Promise<void>;
  addEntry: (entry: Partial<Omit<VaultEntry, "id" | "createdAt" | "updatedAt">>) => void;
  updateEntry: (id: string, entry: Partial<VaultEntry>) => void;
  deleteEntry: (id: string) => void;
  getEntry: (id: string) => VaultEntry | undefined;
}

function generateId(): string {
  return crypto.randomUUID?.() ?? `id-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

const emptyVault = (): VaultPlaintext => ({
  version: 1,
  entries: [],
  updatedAt: new Date().toISOString(),
});

export const useVaultStore = create<VaultState>((set, get) => ({
  vault: null,
  isUnlocked: false,
  isLoading: false,
  error: null,
  _password: null,

  unlock: async (password: string) => {
    set({ isLoading: true, error: null });
    try {
      const token = await getAuthToken();
      if (!token) {
        set({ error: "Open from Telegram to continue", isLoading: false });
        return false;
      }
      setAuthToken(token);
      const blob = await fetchVault();
      let vault: VaultPlaintext;
      if (blob?.ciphertext) {
        vault = decryptVault(blob.ciphertext, password);
      } else {
        vault = emptyVault();
      }
      set({ vault, isUnlocked: true, error: null, _password: password });
      const lockMs = useSettingsStore.getState().lockTimeoutMinutes * 60 * 1000;
      startLockTimer(() => get().lock(), lockMs);
      return true;
    } catch (e) {
      set({
        error: e instanceof Error ? e.message : "Decryption failed",
        isLoading: false,
      });
      return false;
    } finally {
      set({ isLoading: false });
    }
  },

  lock: () => {
    stopLockTimer();
    set({ vault: null, isUnlocked: false, _password: null });
  },

  sync: async () => {
    const { vault, _password } = get();
    if (!vault || !_password) return;
    try {
      const ciphertext = encryptVault(vault, _password);
      await saveVault(ciphertext, vault.version);
      set({ error: null });
    } catch (e) {
      set({ error: e instanceof Error ? e.message : "Sync failed" });
    }
  },

  addEntry: (entryPartial) => {
    const { vault } = get();
    if (!vault) return;
    const now = new Date().toISOString();
    const newEntry: VaultEntry = {
      title: entryPartial.title ?? "",
      username: entryPartial.username ?? "",
      password: entryPartial.password ?? "",
      url: entryPartial.url ?? "",
      notes: entryPartial.notes ?? "",
      totpSecret: entryPartial.totpSecret ?? "",
      id: generateId(),
      createdAt: now,
      updatedAt: now,
    };
    const updated = {
      ...vault,
      entries: [...vault.entries, newEntry],
      updatedAt: now,
    };
    set({ vault: updated });
  },

  updateEntry: (id, updates) => {
    const { vault } = get();
    if (!vault) return;
    const now = new Date().toISOString();
    const entries = vault.entries.map((e) =>
      e.id === id ? { ...e, ...updates, updatedAt: now } : e
    );
    set({ vault: { ...vault, entries, updatedAt: now } });
  },

  deleteEntry: (id) => {
    const { vault } = get();
    if (!vault) return;
    const entries = vault.entries.filter((e) => e.id !== id);
    set({ vault: { ...vault, entries, updatedAt: new Date().toISOString() } });
  },

  getEntry: (id) => {
    return get().vault?.entries.find((e) => e.id === id);
  },
}));
