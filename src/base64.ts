export function bufferToSafeBase64(buf: Buffer): string {
  return buf
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

export function bufferFromSafeBase64(base64: string): Buffer {
  base64 = base64 + '==='.slice((base64.length + 3) % 4);
  base64.replace(/-/g, '+').replace(/_/g, '/');
  return Buffer.alloc(Buffer.byteLength(base64, 'base64'), base64, 'base64');
}
