const multer = require('multer');
const cloudinary = require('../config/cloudinary');
const streamifier = require('streamifier');

// Use memory storage for multer
const storage = multer.memoryStorage();

// File filter
const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Only .jpeg and .png formats are allowed'), false);
    }
};

const upload = multer({ 
    storage, 
    fileFilter,
    // Recommended: Add file size limit
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// Middleware to upload to Cloudinary
const uploadToCloudinary = async (req, res, next) => {
    if (!req.file) return next();
    try {
        const streamUpload = () => {
            return new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                    { folder: 'task-manager' },
                    (error, result) => {
                        if (result) {
                            resolve(result);
                        } else {
                            reject(error);
                        }
                    }
                );
                streamifier.createReadStream(req.file.buffer).pipe(stream);
            });
        };
        const result = await streamUpload();
        req.file.cloudinaryUrl = result.secure_url;
        next();
    } catch (err) {
        next(err);
    }
};

module.exports = { upload, uploadToCloudinary };