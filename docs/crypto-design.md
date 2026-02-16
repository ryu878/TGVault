# TGVault Cryptographic Design

This document describes the cryptographic primitives and protocols used by TGVault.

## Overview

- **KDF**: Argon2id — derives a 256-bit encryption key from the master password
- **AEAD**: XChaCha20-Poly1305 — encrypts the vault with associated data for integrity

All crypto runs in the WebApp (client); the backend never sees keys or plaintext.

## Key Derivation (KDF)

**Algorithm**: Argon2id

| Parameter  | Value   | Rationale                          |
| ---------- | ------- | ---------------------------------- |
| Memory     | 64 MiB  | Balance between security and UX    |
| Iterations | 3       | Argon2id default                   |
| Parallelism| 4      | Multi-core friendly                |
| Salt       | 16 bytes| Random per vault                   |
| Output     | 32 bytes| 256-bit key for XChaCha20-Poly1305 |

The salt is stored with the ciphertext (in the vault header) and is unique per vault.

## Encryption (AEAD)

**Algorithm**: XChaCha20-Poly1305 (RFC 8439, extended nonce variant)

- **Key**: 256-bit from KDF
- **Nonce**: 192-bit (24 bytes), randomly generated per encryption
- **Associated Data (AAD)**: Optional metadata (e.g. version, user ID) for binding ciphertext to context

XChaCha20 uses a 192-bit nonce, eliminating the risk of nonce reuse in practice when using random nonces.

## TOTP

**Algorithm**: TOTP (RFC 6238) — HMAC-SHA1 based, 30s window, 6 digits

TOTP seeds are stored encrypted inside the vault. Generation runs entirely in the WebApp.

## Vault Format

See [vault-format.md](./vault-format.md) for the binary layout of the encrypted vault blob.

## Implementation Notes

- Use well-audited libraries (e.g. `@noble/ciphers`, `argon2` for Node/browser)
- Never log or transmit the master password or derived key
- Validate ciphertext before decryption; reject on auth tag failure
