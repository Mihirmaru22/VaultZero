// file-encryption/test.js
import path from 'path';
import { fileURLToPath } from 'url';
import { encryptFile } from './encryptFile.js';
import { decryptFile } from './decryptFile.js';
import { deriveKey } from './deriveKey.js';
import fs from 'fs';

// Support for __dirname in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Actual file paths (point to root-level /uploads)
const inputPath = path.join(__dirname, '../uploads/example.zip');
const encryptedPath = path.join(__dirname, '../uploads/example_encrypted.zip');
const decryptedPath = path.join(__dirname, '../uploads/example_decrypted.zip');

// Password and key
const password = 'vaultzero2025';
const key = deriveKey(password);

// Make sure input file exists
if (!fs.existsSync(inputPath)) {
  console.error(`❌ Error: Input file not found at ${inputPath}`);
  process.exit(1);
}

// Encrypt and then decrypt
encryptFile(inputPath, encryptedPath, key)
  .then(() => {
    console.log('✅ File encrypted');
    return decryptFile(encryptedPath, decryptedPath, key);
  })
  .then(() => {
    console.log('✅ File decrypted');
  })
  .catch((err) => {
    console.error('❌ Error:', err.message);
  });