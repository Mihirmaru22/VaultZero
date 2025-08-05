
import fs from 'fs';
import crypto from 'crypto';
import { promisify } from 'util';
import { uploadToIPFS } from '../lib/ipfs/uploadToIPFS.js';

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);


const key = crypto.scryptSync('vaultzero-secret', 'salt', 32); 
const iv = Buffer.alloc(16, 0); 

export const encryptFile = async (inputPath, outputPath) => {
  try {
    const data = await readFile(inputPath);
    const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
    const encrypted = Buffer.concat([cipher.update(data), cipher.final()]);
    await writeFile(outputPath, encrypted);

    const cid = await uploadToIPFS(outputPath);
    return cid;
  } catch (err) {
    throw err;
  }
};