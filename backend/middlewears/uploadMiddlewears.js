const multer = require('multer'); // Fixed module name (was 'mutter')

// Configure storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        // Fixed template literals and property name
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

// File filter
const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png']; // Removed non-standard 'image/jpg'
    // Fixed property name (was 'minetype')
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        // Create error with proper message
        cb(new Error('Only .jpeg and .png formats are allowed'), false);
    }
};

const upload = multer({ 
    storage, 
    fileFilter,
    // Recommended: Add file size limit
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

module.exports = upload;