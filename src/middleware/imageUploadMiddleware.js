const multer = require('multer');
const path = require('path');

// Define storage for the images
const storage = multer.diskStorage({
    // Destination for files
    destination: function (req, file, callback) {
        callback(null, './uploads/');
    },

    // Add back the extension
    filename: function (req, file, callback) {
        callback(null, Date.now() + path.extname(file.originalname));
    },
});

// Upload parameters for multer
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5, // 5 MB upload limit
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype === "image/png" || file.mimetype === "image/jpeg") {
            cb(null, true);
        } else {
            cb(null, false); // reject file
            return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
        }
    },
});

module.exports = upload;
