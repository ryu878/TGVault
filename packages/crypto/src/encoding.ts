/**
 * Base64 encoding/decoding utilities
 * Standard base64 for backend compatibility
 */

export function encodeBase64(data: Uint8Array): string {
  return btoa(String.fromCharCode(...data));
}

export function decodeBase64(str: string): Uint8Array {
  const binary = atob(str);
  return new Uint8Array([...binary].map((c) => c.charCodeAt(0)));
}
