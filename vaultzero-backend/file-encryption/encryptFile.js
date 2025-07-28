// file-encryption/encryptFile.js

import fs from 'fs';
import crypto from 'crypto';
import { promisify } from 'util';

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

// Dummy static key and IV (don't use this in production!)
const key = crypto.randomBytes(32); // 256-bit key
const iv = crypto.randomBytes(16);  // 128-bit IV

export const encryptFile = async (inputPath, outputPath) => {
    try {
        const data = await readFile(inputPath);
        const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
        const encrypted = Buffer.concat([cipher.update(data), cipher.final()]);
        await writeFile(outputPath, encrypted);
        console.log(`✅ Encrypted: ${outputPath}`);
    } catch (err) {
        console.error('❌ Encryption error:', err.message);
        throw err;
    }
};