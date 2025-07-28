// file-encryption/encryptFile.js

import fs from 'fs';
import crypto from 'crypto';
import { promisify } from 'util';
import { uploadToIPFS } from '../lib/ipfs/uploadToIPFS.js';

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

// Dummy static key and IV (for demo only – not secure in production)
const key = crypto.randomBytes(32); // 256-bit key
const iv = crypto.randomBytes(16);  // 128-bit IV

export const encryptFile = async (inputPath, outputPath) => {
    try {
        const data = await readFile(inputPath);

        const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
        const encrypted = Buffer.concat([cipher.update(data), cipher.final()]);

        await writeFile(outputPath, encrypted);
        console.log(`✅ Encrypted: ${outputPath}`);

        // 🔗 Upload encrypted file to IPFS
        const cid = await uploadToIPFS(outputPath);
        console.log(`📡 Uploaded to IPFS: ${cid}`);
        
    } catch (err) {
        console.error('❌ Encryption error:', err.message);
        throw err;
    }
};