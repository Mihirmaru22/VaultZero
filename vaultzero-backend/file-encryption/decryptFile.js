

import fs from 'fs';
import crypto from 'crypto';

export const decryptFile = async (sourcePath, destPath) => {
    return new Promise((resolve, reject) => {
        const key = crypto.scryptSync('vaultzero-secret', 'salt', 32);
        const iv = Buffer.alloc(16, 0); 
        const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
        const input = fs.createReadStream(sourcePath);
        const output = fs.createWriteStream(destPath);

        input
            .pipe(decipher)
            .on('error', (err) => {
                console.error(" Decryption error:", err.message);
                reject(err);
            })
            .pipe(output)
            .on('finish', () => {
                console.log(`Decrypted to: ${destPath}`);
                resolve();
            })
            .on('error', reject);
    });
};