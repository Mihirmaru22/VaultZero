// lib/ipfs/uploadToIPFS.js

import { create } from 'ipfs-http-client';
import fs from 'fs';
import path from 'path';

const client = create({ url: 'http://127.0.0.1:5001/api/v0' });  // ✅ LOCAL IPFS DAEMON

export const uploadToIPFS = async (filePath) => {
  try {
    const fileName = path.basename(filePath);
    const fileContent = await fs.promises.readFile(filePath); // async read

    const result = await client.add({
      path: fileName,
      content: fileContent,
    });

    const cid = result.cid.toString();
    const gatewayUrl = `https://ipfs.io/ipfs/${cid}`;

    console.log(`✅ Uploaded to IPFS: ${cid}`);
    console.log(`🌐 Preview URL: ${gatewayUrl}`);

    return cid; // or return gatewayUrl if needed by frontend
  } catch (err) {
    console.error('❌ IPFS Upload Error:', err.message);
    return null;
  }
};