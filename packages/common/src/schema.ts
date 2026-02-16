/**
 * Validation schemas (for runtime checks)
 * Used by crypto and webapp to validate vault structure
 */

import type { VaultEntry, VaultPlaintext } from "./types.js";

export function isValidVaultPlaintext(obj: unknown): obj is VaultPlaintext {
  if (!obj || typeof obj !== "object") return false;
  const o = obj as Record<string, unknown>;
  if (typeof o.version !== "number" || o.version < 1) return false;
  if (!Array.isArray(o.entries)) return false;
  if (typeof o.updatedAt !== "string") return false;
  return o.entries.every(isValidVaultEntry);
}

export function isValidVaultEntry(obj: unknown): obj is VaultEntry {
  if (!obj || typeof obj !== "object") return false;
  const o = obj as Record<string, unknown>;
  return (
    typeof o.id === "string" &&
    typeof o.title === "string" &&
    typeof o.username === "string" &&
    typeof o.password === "string" &&
    typeof o.url === "string" &&
    typeof o.notes === "string" &&
    typeof o.totpSecret === "string" &&
    typeof o.createdAt === "string" &&
    typeof o.updatedAt === "string"
  );
}
