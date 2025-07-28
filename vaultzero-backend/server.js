import express from 'express'
import multer from 'multer';
import fs from 'fs'
import path from 'path';
import { v4 as uuidv4 } from 'uuid'; // ✅ You forgot this line


const app = express();
const storage = multer.diskStorage({
    destination : function(req,file,cb){
        const dir = 'uploads';
        if(!fs.existsSync(dir)){
            fs.mkdirSync(dir)
        }
        cb(null,dir)
    },
    filename: function (req, file, cb) {
    const ext = path.extname(file.originalname).toLowerCase(); // Get .zip or .ZIP etc.
    const uniqueName = uuidv4() + ext;
    cb(null, uniqueName);
}
});

const fileFilter = function(req, file, cb){
    const allowedMimeTypes = [
        'application/zip',
        'application/x-zip-compressed'
    ];
    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        req.errorMessage = "the file is invalid, please upload a valid file "
        cb(null, false);
    }
}

const upload = multer({storage , fileFilter})

app.post('/', upload.single('zip'), (req, res) => {
    console.log(req.file);
    if (req.errorMessage) {
        return res.status(422).json({ Message: req.errorMessage }); // 🔧 FIXED
    }
    return res.status(200).json("ZIP uploaded successfully"); // 🔁 fixed text here too
});

app.listen(8000, () => console.log("server is up baby !!!!"));
