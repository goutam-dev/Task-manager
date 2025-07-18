const express = require("express");
const { adminOnly, protect } = require("../middlewears/authMiddlewears"); // Fixed path
const {
  getUsers,
  getUserById,
  deleteUser,
  getUserDetails,
  updateUserByAdmin
} = require("../controllers/userControllers"); // Added controller imports

const router = express.Router();

// User Management Routes
router.get("/", protect, adminOnly, getUsers); // Get all users (Admin only)
router.get("/:id", protect, getUserById); // Get a specific user
router.delete("/:id", protect, adminOnly, deleteUser); // Delete user (Admin only)
// @route   GET /api/users/details/:id
// @desc    Get detailed user information with tasks (Admin only)
// @access  Private (Admin)
router.get("/details/:id", protect, adminOnly, getUserDetails);
router.put("/:id", protect, adminOnly, updateUserByAdmin); // Admin update user profile

module.exports = router;
