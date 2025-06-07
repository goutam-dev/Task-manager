const express = require("express");
const { protect, adminOnly } = require("../middlewears/authMiddlewears"); // Fixed path
const {
    exportTasksReport,
    exportUsersReport
} = require("../controllers/reportControllers"); // Added controller imports

const router = express.Router();

// Export Routes
router.get("/export/tasks", protect, adminOnly, exportTasksReport); // Export all tasks as Excel/PDF
router.get("/export/users", protect, adminOnly, exportUsersReport); // Export user-task report

module.exports = router;