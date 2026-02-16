# Security Policy

## Supported Versions

We release patches for security vulnerabilities for the latest stable release.

## Reporting a Vulnerability

**Please do not report security vulnerabilities in public GitHub issues.**

If you discover a security issue, please email **ryu8777@gmail.com** with:

- A description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if any)

We will acknowledge receipt within 48 hours and provide an initial assessment within 7 days.

## Security Model

TGVault is designed as a zero-knowledge password manager. See [docs/threat-model.md](docs/threat-model.md) and [docs/crypto-design.md](docs/crypto-design.md) for details.

- Your master password never leaves your device
- The backend stores only encrypted ciphertext
- We use Argon2id for key derivation and XChaCha20-Poly1305 for encryption

**Limitations**: TGVault does not protect against malware, keyloggers, or physical access to an unlocked device.
