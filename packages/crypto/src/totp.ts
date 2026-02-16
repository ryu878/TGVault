/**
 * TOTP (RFC 6238) - HMAC-SHA1 based, 30s window, 6 digits
 */

import { hmac } from "@noble/hashes/hmac";
import { sha1 } from "@noble/hashes/sha1";

const STEP = 30;
const DIGITS = 6;

/**
 * Generate TOTP code from base32-encoded secret
 */
export function generateTOTP(secretBase32: string, timestamp = Date.now()): string {
  const secret = decodeBase32(secretBase32);
  const counter = Math.floor(timestamp / 1000 / STEP);
  const counterBytes = new ArrayBuffer(8);
  new DataView(counterBytes).setBigUint64(0, BigInt(counter), false);
  const hash = hmac(sha1, secret, new Uint8Array(counterBytes));
  const offset = hash[19]! & 0x0f;
  const code =
    ((hash[offset]! & 0x7f) << 24) |
    (hash[offset + 1]! << 16) |
    (hash[offset + 2]! << 8) |
    hash[offset + 3]!;
  const otp = (code % 10 ** DIGITS).toString().padStart(DIGITS, "0");
  return otp;
}

function decodeBase32(str: string): Uint8Array {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
  const clean = str.replace(/\s/g, "").toUpperCase();
  const bits: number[] = [];
  for (const c of clean) {
    const idx = alphabet.indexOf(c);
    if (idx < 0) continue;
    for (let i = 4; i >= 0; i--) bits.push((idx >> i) & 1);
  }
  const bytes: number[] = [];
  for (let i = 0; i < bits.length; i += 8) {
    let byte = 0;
    for (let j = 0; j < 8 && i + j < bits.length; j++) byte = (byte << 1) | bits[i + j]!;
    bytes.push(byte);
  }
  return new Uint8Array(bytes);
}
