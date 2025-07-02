const express = require("express");
const router = express.Router();



// Import controller functions
const {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile
} = require("../controllers/authControllers");

// Import middleware
const { protect } = require("../middlewears/authMiddlewears");
const { upload, uploadToCloudinary } = require("../middlewears/uploadMiddlewears");

// Auth Routes
router.post("/register", registerUser);    // Register User
router.post("/login", loginUser);          // Login User
router.get("/profile", protect, getUserProfile);  // Get User Profile
router.put("/profile", protect, updateUserProfile); // Update Profile

// Upload image to Cloudinary
router.post("/upload-image", upload.single("image"), uploadToCloudinary, (req, res) => {
    if (!req.file || !req.file.cloudinaryUrl) {
        return res.status(400).json({ message: "No file uploaded" });
    }
    res.status(200).json({ imageUrl: req.file.cloudinaryUrl });
});

module.exports = router;