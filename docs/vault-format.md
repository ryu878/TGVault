# TGVault Vault Format

This document specifies the binary format of the encrypted vault blob stored on the backend.

## Overview

The vault is a single encrypted blob. Structure:

```
[Header][Encrypted Payload]
```

## Header (Plaintext)

| Field      | Size     | Description                          |
| ---------- | -------- | ------------------------------------ |
| Magic      | 4 bytes  | `TGV1` (0x54475631)                  |
| Version    | 2 bytes  | Format version (1 = current)         |
| Salt       | 16 bytes | Argon2id salt                        |
| Nonce      | 24 bytes | XChaCha20-Poly1305 nonce             |
| Reserved   | 6 bytes  | For future use (must be zero)        |

**Total header**: 52 bytes

## Encrypted Payload

The remainder is the ciphertext of the JSON vault content, encrypted with XChaCha20-Poly1305.

**Plaintext (before encryption)** — JSON:

```json
{
  "version": 1,
  "entries": [
    {
      "id": "uuid",
      "title": "string",
      "username": "string",
      "password": "string",
      "url": "string",
      "notes": "string",
      "totpSecret": "string",
      "createdAt": "ISO8601",
      "updatedAt": "ISO8601"
    }
  ],
  "updatedAt": "ISO8601"
}
```

## Encryption Process

1. Serialize plaintext JSON to UTF-8
2. Generate random 24-byte nonce
3. Encrypt with XChaCha20-Poly1305(key, nonce, plaintext, aad=header)
4. Prepend header (magic, version, salt, nonce, reserved) to ciphertext

## Decryption Process

1. Parse header; verify magic and version
2. Derive key from master password + salt via Argon2id
3. Decrypt ciphertext with XChaCha20-Poly1305; fail on auth tag mismatch
4. Parse JSON; validate schema

## Versioning

- Version 1: Current format
- Future versions may add header fields; clients must support reading at least the last two versions
