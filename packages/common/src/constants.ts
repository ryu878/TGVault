/**
 * Shared constants for TGVault
 */

/** Vault format version */
export const VAULT_FORMAT_VERSION = 1;

/** Magic bytes for vault header */
export const VAULT_MAGIC = new TextEncoder().encode("TGV1");

/** Header sizes */
export const VAULT_HEADER_SALT_LEN = 16;
export const VAULT_HEADER_NONCE_LEN = 24;
export const VAULT_HEADER_RESERVED_LEN = 6;

/** Total header length: magic(4) + version(2) + salt(16) + nonce(24) + reserved(6) */
export const VAULT_HEADER_LEN =
  4 + 2 + VAULT_HEADER_SALT_LEN + VAULT_HEADER_NONCE_LEN + VAULT_HEADER_RESERVED_LEN;
