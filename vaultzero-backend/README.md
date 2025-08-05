# VaultZero Backend

VaultZero Backend is the API server for the VaultZero platform, enabling secure file upload, encryption, and decentralized storage using IPFS. Built with Node.js and Express, it allows users to upload `.zip` files, which are encrypted and stored both locally and on IPFS. Files can be securely downloaded and decrypted on demand.

## Features

- Upload `.zip` files via REST API
- AES-256 encryption of uploaded files
- Secure file storage and retrieval
- Decentralized file storage using IPFS
- Unique download links for each file
- Automatic cleanup of invalid uploads

## Project Structure

```
vaultzero-backend/
├── decrypted/
├── encrypted/
├── file-encryption/
│   ├── decryptFile.js
│   ├── deriveKey.js
│   ├── encryptFile.js
│   └── utils.js
├── lib/
│   └── ipfs/
│       └── uploadToIPFS.js
├── metadata/
├── uploads/
├── package.json
└── server.js
```

## Getting Started

### Prerequisites

- Node.js (v16+ recommended)
- IPFS daemon running locally (`ipfs daemon`)

### Installation

Clone the repository:

```sh
git clone <repo-url>
cd vaultzero-backend
```

Install dependencies:

```sh
npm install
```

### Running the Server

Start the server:

```sh
node server.js
```

The server will run on [http://localhost:8000](http://localhost:8000) by default.

## API Endpoints

### Upload

**POST** `/upload`

- Upload a `.zip` file (multipart/form-data, field name: `file`)
- Response includes:
  - `uuid`: Unique file identifier
  - `ipfsHash`: IPFS CID of the encrypted file
  - `ipfsUrl`: Public IPFS gateway URL
  - `downloadUrl`: Local download endpoint

### Download

**GET** `/download/:uuid`

- Downloads and decrypts the file with the given UUID

## Environment Variables

No environment variables are required by default. If you wish to customize directories or secrets, edit the relevant files in [`file-encryption`](vaultzero-backend/file-encryption/) and [`server.js`](vaultzero-backend/server.js).

## License

This project is licensed under the ISC License. See the