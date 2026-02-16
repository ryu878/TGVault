/**
 * Vault encryption/decryption using KDF + AEAD
 * Format: header (magic, version, salt, nonce, reserved) + ciphertext
 */

import { xchacha20poly1305 } from "@noble/ciphers/chacha";
import {
  VAULT_MAGIC,
  VAULT_FORMAT_VERSION,
  VAULT_HEADER_LEN,
  VAULT_HEADER_SALT_LEN,
  VAULT_HEADER_NONCE_LEN,
} from "@tgvault/common";
import type { VaultPlaintext } from "@tgvault/common";
import { isValidVaultPlaintext } from "@tgvault/common";
import { deriveKey, generateSalt } from "./kdf.js";
import { encodeBase64, decodeBase64 } from "./encoding.js";

export function encryptVault(plaintext: VaultPlaintext, password: string): string {
  if (!isValidVaultPlaintext(plaintext)) throw new Error("Invalid vault plaintext");
  const salt = generateSalt();
  const key = deriveKey(password, salt);
  const payload = new TextEncoder().encode(JSON.stringify(plaintext));
  const nonce = crypto.getRandomValues(new Uint8Array(VAULT_HEADER_NONCE_LEN));
  const cipher = xchacha20poly1305(key, nonce);
  const ciphertext = cipher.encrypt(payload);

  const header = new Uint8Array(VAULT_HEADER_LEN);
  header.set(VAULT_MAGIC, 0);
  new DataView(header.buffer).setUint16(4, VAULT_FORMAT_VERSION, false);
  header.set(salt, 6);
  header.set(nonce, 6 + VAULT_HEADER_SALT_LEN);

  const result = new Uint8Array(header.length + ciphertext.length);
  result.set(header, 0);
  result.set(ciphertext, header.length);
  return encodeBase64(result);
}

export function decryptVault(encoded: string, password: string): VaultPlaintext {
  const data = decodeBase64(encoded);
  if (data.length < VAULT_HEADER_LEN) throw new Error("Vault data too short");
  const magic = data.subarray(0, 4);
  if (!magic.every((b, i) => b === VAULT_MAGIC[i])) {
    throw new Error("Invalid vault magic");
  }
  const version = new DataView(data.buffer, data.byteOffset).getUint16(4, false);
  if (version !== VAULT_FORMAT_VERSION) throw new Error(`Unsupported vault version: ${version}`);
  const salt = data.subarray(6, 6 + VAULT_HEADER_SALT_LEN);
  const nonce = data.subarray(6 + VAULT_HEADER_SALT_LEN, 6 + VAULT_HEADER_SALT_LEN + VAULT_HEADER_NONCE_LEN);
  const ciphertext = data.subarray(VAULT_HEADER_LEN);

  const key = deriveKey(password, salt);
  const cipher = xchacha20poly1305(key, nonce);
  const payload = cipher.decrypt(ciphertext);
  const plaintext = JSON.parse(new TextDecoder().decode(payload)) as unknown;
  if (!isValidVaultPlaintext(plaintext)) throw new Error("Invalid decrypted vault structure");
  return plaintext;
}
