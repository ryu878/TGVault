# TGVault Threat Model

This document describes the security assumptions, trust boundaries, and limitations of TGVault.

## Overview

TGVault is a **zero-knowledge** password manager. The design assumes that both the backend server and Telegram are **untrusted** with respect to user secrets. Encryption and decryption happen exclusively on the client; the server stores only ciphertext.

## Trust Assumptions

| Component           | Trust level | Rationale                                              |
| -------------------- | ----------- | ------------------------------------------------------ |
| **User device**      | Trusted     | Master password and decryption keys exist only here    |
| **WebApp (client)**  | Trusted     | Runs in user's browser; performs all crypto operations |
| **Backend**          | Untrusted   | Stores only ciphertext; cannot decrypt vault           |
| **Telegram**         | Untrusted   | Bot/WebApp traffic is not E2E encrypted                 |

## Assets

- **Master password**: Never leaves the device; used to derive encryption key
- **Vault plaintext**: Passwords, TOTP seeds, metadata
- **Encryption key**: Derived from master password via Argon2id; never transmitted

## Threat Scenarios

### In Scope (Mitigated)

- **Backend compromise**: Attacker gains DB access → sees only ciphertext; cannot decrypt without master password
- **Network interception**: HTTPS protects data in transit; even if intercepted, vault blob is encrypted
- **Telegram server access**: Bot receives only Telegram IDs; no secrets in bot traffic

### Out of Scope (Limitations)

- **Malware / keyloggers on user device**: Master password can be captured; no defense
- **Compromised WebApp delivery**: If attacker serves malicious JS, they can steal credentials; use verified builds / self-hosting
- **Physical access to unlocked device**: If vault is unlocked, attacker can read plaintext
- **Social engineering**: User divulging master password

## Security Properties

1. **Zero-knowledge**: Backend and Telegram never see plaintext vault
2. **Client-side crypto**: All sensitive operations in WebApp
3. **Authenticated encryption**: XChaCha20-Poly1305 ensures integrity and confidentiality

## Recommendations for Users

- Use a strong, unique master password
- Prefer self-hosting when possible to control deployment
- Lock the vault when not in use (auto-lock timer)
- Do not use on shared or compromised devices
