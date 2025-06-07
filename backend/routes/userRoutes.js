const express = require("express");
const { adminOnly, protect } = require("../middlewears/authMiddlewears"); // Fixed path
const {
    getUsers,
    getUserById,
    deleteUser
} = require("../controllers/userControllers"); // Added controller imports

const router = express.Router();

// User Management Routes
router.get("/", protect, adminOnly, getUsers); // Get all users (Admin only)
router.get("/:id", protect, getUserById); // Get a specific user
router.delete("/:id", protect, adminOnly, deleteUser); // Delete user (Admin only)

module.exports = router;