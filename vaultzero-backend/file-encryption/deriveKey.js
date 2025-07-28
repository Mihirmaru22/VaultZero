// file-encryption/deriveKey.js
import crypto from 'crypto';

const SECRET = 'your-strong-password'; // same for both enc/dec

export function deriveKeyAndIV() {
  const key = crypto.createHash('sha256').update(SECRET).digest();
  const iv = crypto.createHash('md5').update(SECRET).digest();
  return { key, iv };
}