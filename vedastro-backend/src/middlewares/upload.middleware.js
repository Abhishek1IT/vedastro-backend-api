import multer from 'multer';
import path from 'path';
import fs from 'fs';
import e from 'express';

// create upload folder if it doesn't exist
if (!fs.existsSync('uploads')) {
    fs.mkdirSync('uploads');
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },

    filename: function (req, file, cb) {
        const uniqueName = 
        Date.now() + "-" + file.originalname.replace(/\s+/g, "-");

        cb(null, uniqueName);
    }
});

const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/jpg'];
    if(allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error("Only image files are allowed."));
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // limit file size to 5MB
});

export default upload;