const express = require("express");
const { protect, adminOnly } = require("../middlewears/authMiddlewears");
const {
    getDashboardData,
    getUserDashboardData,
    getTasks,
    getTaskById,
    createTask,
    updateTask,
    deleteTask,
    updateTaskStatus,
    updateTaskCheckList,
} = require("../controllers/taskControllers"); // Added controller imports

const router = express.Router();

// Task Management Routes
router.get("/dashboard-data", protect, adminOnly, getDashboardData); // Admin dashboard
router.get("/user-dashboard-data", protect, getUserDashboardData); // User dashboard
router.get("/", protect, getTasks); // Get all tasks (Admin: all, User: assigned)
router.get("/:id", protect, getTaskById); //Get task by ID
router.post("/", protect, adminOnly, createTask); //Create Task
router.put("/:id", protect, updateTask); //Update Task
router.delete("/:id", protect, adminOnly, deleteTask); //Delete Task
router.put("/:id/status", protect, updateTaskStatus); //Update Task Status
router.put("/:id/todo", protect, updateTaskCheckList); //Update checklist

module.exports = router;