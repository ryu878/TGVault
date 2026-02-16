/**
 * Vault API - fetch and save encrypted blobs
 */

import { apiClient } from "./client";

export interface VaultBlob {
  ciphertext: string;
  version: number;
  updatedAt: string;
}

export async function fetchVault(): Promise<VaultBlob | null> {
  try {
    return await apiClient.get<VaultBlob>("/vault");
  } catch (e) {
    if (e instanceof Error && (e as { status?: number }).status === 404) return null;
    throw e;
  }
}

export async function saveVault(ciphertext: string, version: number): Promise<void> {
  await apiClient.put("/vault", { ciphertext, version });
}
