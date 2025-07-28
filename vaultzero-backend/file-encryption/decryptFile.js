import fs from 'fs';
import crypto from 'crypto';

export const decryptFile = (inputPath, outputPath, password) => {
  return new Promise((resolve, reject) => {
    const decipher = crypto.createDecipher('aes-256-cbc', password);
    const input = fs.createReadStream(inputPath);
    const output = fs.createWriteStream(outputPath);

    input.pipe(decipher).pipe(output);

    output.on('finish', resolve);
    output.on('error', reject);
  });
};