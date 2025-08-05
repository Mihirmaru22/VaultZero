

import express from 'express';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import { encryptFile } from './file-encryption/encryptFile.js';
import { decryptFile } from './file-encryption/decryptFile.js';
import { v4 as uuidv4 } from 'uuid';

const app = express();
const PORT = 8000;


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const UPLOAD_DIR = path.join(__dirname, 'uploads');
const ENCRYPTED_DIR = path.join(__dirname, 'encrypted');
const DECRYPTED_DIR = path.join(__dirname, 'decrypted');


[UPLOAD_DIR, ENCRYPTED_DIR, DECRYPTED_DIR].forEach((dir) => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir);
});


const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => {
    const uuid = uuidv4();
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${uuid}${ext}`);
  },
});
const upload = multer({ storage });

app.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const originalName = req.file.originalname;
    const originalExt = path.extname(originalName).toLowerCase();

    if (originalExt !== '.zip') {
      fs.unlinkSync(req.file.path); // delete bad file
      return res.status(400).json({ error: 'Only .zip files allowed' });
    }

    const filePath = req.file.path; // already in uploads
    const uuid = path.basename(filePath, originalExt); // without .zip
    const encryptedPath = path.join(ENCRYPTED_DIR, `${uuid}.enc`);

    // Encrypt & get IPFS hash
    const ipfsHash = await encryptFile(filePath, encryptedPath);

    res.json({
      message: ' File uploaded & encrypted',
      uuid,
      ipfsHash,
      ipfsUrl: `https://ipfs.io/ipfs/${ipfsHash}`,
      downloadUrl: `http://localhost:${PORT}/download/${uuid}`,
    });
  } catch (err) {
    console.error(' Upload failed:', err);
    return res.status(500).json({ error: 'Upload failed' });
  }
});


app.get('/download/:uuid', async (req, res) => {
  const { uuid } = req.params;
  const encPath = path.join(ENCRYPTED_DIR, `${uuid}.enc`);
  const decPath = path.join(DECRYPTED_DIR, `${uuid}.zip`);

  if (!fs.existsSync(encPath)) {
    return res.status(404).json({ error: 'File not found' });
  }

  try {
    // Decrypt
    await decryptFile(encPath, decPath);

    // Download
    return res.download(decPath, `${uuid}.zip`, (err) => {
      if (err) {
        console.error('Send error:', err);
        res.status(500).json({ error: 'Failed to send file' });
      } else {
        console.log(` Sent file: ${uuid}.zip`);
      }
    });
  } catch (err) {
    console.error(' Decrypt error:', err.message);
    return res.status(500).json({ error: 'Decryption failed' });
  }
});


app.get('/', (req, res) => {
  res.send('VaultZero backend is running. Upload .zip only.');
});

app.listen(PORT, () => {
  console.log(` Server running at http://localhost:${PORT}`);
});