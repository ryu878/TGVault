/**
 * Shared types for TGVault
 */

/** A single vault entry (password, login, etc.) */
export interface VaultEntry {
  id: string;
  title: string;
  username: string;
  password: string;
  url: string;
  notes: string;
  totpSecret: string;
  createdAt: string;
  updatedAt: string;
}

/** Plaintext vault structure (before encryption) */
export interface VaultPlaintext {
  version: number;
  entries: VaultEntry[];
  updatedAt: string;
}

/** Encrypted vault blob metadata from backend */
export interface VaultBlob {
  ciphertext: string;
  version: number;
  updatedAt: string;
}
