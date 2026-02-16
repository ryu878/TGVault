/**
 * Authenticated encryption with XChaCha20-Poly1305
 */

import { xchacha20poly1305 } from "@noble/ciphers/chacha";

const NONCE_LEN = 24;

export function encrypt(key: Uint8Array, plaintext: Uint8Array, aad?: Uint8Array): Uint8Array {
  const nonce = crypto.getRandomValues(new Uint8Array(NONCE_LEN));
  const cipher = xchacha20poly1305(key, nonce);
  const ciphertext = aad ? cipher.encrypt(plaintext, aad) : cipher.encrypt(plaintext);
  const result = new Uint8Array(NONCE_LEN + ciphertext.length);
  result.set(nonce, 0);
  result.set(ciphertext, NONCE_LEN);
  return result;
}

export function decrypt(key: Uint8Array, data: Uint8Array, aad?: Uint8Array): Uint8Array {
  if (data.length < NONCE_LEN) throw new Error("Ciphertext too short");
  const nonce = data.subarray(0, NONCE_LEN);
  const ciphertext = data.subarray(NONCE_LEN);
  const cipher = xchacha20poly1305(key, nonce);
  return aad ? cipher.decrypt(ciphertext, aad) : cipher.decrypt(ciphertext);
}

export { NONCE_LEN };
