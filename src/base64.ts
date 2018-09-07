/**
 * Converts a buffer into url-safe base64.
 * @param buf - The Buffer to convert.
 */
export function bufferToSafeBase64(buf: Buffer): string {
  return buf
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

/**
 * Converts a url-safe base64 string into a buffer.
 * @param base64 - The base64 string to convert.
 */
export function bufferFromSafeBase64(base64: string): Buffer {
  base64 = base64 + '==='.slice((base64.length + 3) % 4);
  base64.replace(/-/g, '+').replace(/_/g, '/');
  return Buffer.alloc(Buffer.byteLength(base64, 'base64'), base64, 'base64');
}
