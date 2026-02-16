/**
 * Key derivation via Argon2id
 * Parameters: 64 MiB memory, 3 iterations, 4 parallelism
 */

import { argon2id } from "@noble/hashes/argon2";

const SALT_LEN = 16;
const KEY_LEN = 32;
const MEMORY = 64 * 1024; // 64 MiB
const ITERATIONS = 3;
const PARALLELISM = 4;

export function deriveKey(password: string, salt: Uint8Array): Uint8Array {
  return argon2id(password, salt, {
    m: MEMORY,
    t: ITERATIONS,
    p: PARALLELISM,
    dkLen: KEY_LEN,
  });
}

export function generateSalt(): Uint8Array {
  return crypto.getRandomValues(new Uint8Array(SALT_LEN));
}

export { SALT_LEN, KEY_LEN };
