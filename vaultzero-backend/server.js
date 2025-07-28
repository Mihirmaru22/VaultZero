// server.js

import express from 'express';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import { encryptFile } from './file-encryption/encryptFile.js';
import { v4 as uuidv4 } from 'uuid';

const app = express();
const PORT = 8000;

// __dirname polyfill
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Directories
const UPLOAD_DIR = path.join(__dirname, 'uploads');
const ENCRYPTED_DIR = path.join(__dirname, 'encrypted');

// Create directories if they don't exist
[UPLOAD_DIR, ENCRYPTED_DIR].forEach((dir) => {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);
});

// Multer setup
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, UPLOAD_DIR),
    filename: (req, file, cb) => {
        const uuid = uuidv4();
        const ext = path.extname(file.originalname); // preserve original extension for upload only
        const newName = `${uuid}${ext}`;
        cb(null, newName);
    },
});
const upload = multer({ storage });

// Upload + Encrypt route
app.post('/upload', upload.single('file'), async (req, res) => {
    try {
        const uploadedPath = path.join(UPLOAD_DIR, req.file.filename);

        // Generate .enc file name (anonymized)
        const baseName = path.parse(req.file.filename).name; // remove extension
        const encryptedName = `${baseName}.enc`;
        const encryptedPath = path.join(ENCRYPTED_DIR, encryptedName);

        await encryptFile(uploadedPath, encryptedPath);

        res.status(200).json({
            message: '✅ File uploaded and encrypted anonymously',
            original_upload: req.file.filename,
            encrypted_file: encryptedName,
        });
    } catch (err) {
        console.error('❌ Encryption error:', err);
        res.status(500).json({ error: 'Encryption failed' });
    }
});

// Health check
app.get('/', (req, res) => {
    res.send('✅ VaultZero backend ready.');
});

app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});