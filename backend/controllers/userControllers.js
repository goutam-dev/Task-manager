const Task = require("../models/Task");
const User = require("../models/User");
const bcrypt = require("bcryptjs"); 

// @desc    Get all users (Admin only)
// @route   GET /api/users/
// @access  Private (Admin)
const getUsers = async (req, res) => {
    try {
        const { search } = req.query;
        let filter = { role: "member" };

        // Add search filter if provided
        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } }
            ];
        }

        // Fetch all users excluding password fields with search filter
        const users = await User.find(filter).select("-password");

        // Add task counts to each user
        const usersWithTaskCounts = await Promise.all(users.map(async (user) => {
            const pendingTasks = await Task.countDocuments({ assignedTo: user._id, status: "Pending" });
            const inProgressTasks = await Task.countDocuments({ assignedTo: user._id, status: "In Progress" });
            const completedTasks = await Task.countDocuments({ assignedTo: user._id, status: "Completed" });

            return {
                ...user._doc,
                pendingTasks,
                inProgressTasks,
                completedTasks,
            };
        }));

        res.json(usersWithTaskCounts);
    } catch (error) {
        res.status(500).json({ 
            message: "Server error", 
            error: error.message 
        });
    }
};

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private
const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
            .select("-password -__v");
        
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        
        res.status(200).json(user);
    } catch (error) {
        // Handle invalid ID format
        if (error.name === "CastError") {
            return res.status(400).json({ message: "Invalid user ID" });
        }
        res.status(500).json({ 
            message: "Server error", 
            error: error.message 
        });
    }
};

// @desc    Get detailed user information with tasks
// @route   GET /api/users/details/:id
// @access  Private (Admin)
const getUserDetails = async (req, res) => {
    try {
        const userId = req.params.id;
        
        // Validate user ID format
        if (!userId.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ message: "Invalid user ID format" });
        }

        // Check if user exists
        const user = await User.findById(userId).select("-password -__v");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Get all tasks assigned to the user
        const tasks = await Task.find({ assignedTo: userId })
            .populate("assignedTo", "name email profileImageUrl")
            .populate("createdBy", "name email")
            .sort({ createdAt: -1 }); // Sort by newest first

        // Add completed todoChecklist count to each task
        const tasksWithCounts = tasks.map((task) => {
            const completedCount = task.todoChecklist.filter(
                (item) => item.completed
            ).length;
            return {
                ...task.toObject(),
                completedTodoCount: completedCount,
                totalTodoCount: task.todoChecklist.length,
            };
        });

        // Calculate status summary using Promise.all for better performance
        const [allTasks, pendingTasks, inProgressTasks, completedTasks] = await Promise.all([
            Task.countDocuments({ assignedTo: userId }),
            Task.countDocuments({ assignedTo: userId, status: "Pending" }),
            Task.countDocuments({ assignedTo: userId, status: "In Progress" }),
            Task.countDocuments({ assignedTo: userId, status: "Completed" }),
        ]);

        const statusSummary = {
            all: allTasks,
            pendingTasks,
            inProgressTasks,
            completedTasks,
        };

        res.status(200).json({
            tasks: tasksWithCounts,
            statusSummary,
            user: user // Optional: include user info in response
        });

    } catch (error) {
        console.error("Error fetching user details:", error);
        res.status(500).json({ 
            message: "Server error", 
            error: error.message 
        });
    }
};

// @desc    Delete a user (Admin only)
// @route   DELETE /api/users/:id
// @access  Private (Admin)
const deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        
        // Delete all tasks associated with the user
        await Task.deleteMany({ user: req.params.id });
        
        res.status(200).json({ 
            message: "User and associated tasks deleted successfully" 
        });
    } catch (error) {
        if (error.name === "CastError") {
            return res.status(400).json({ message: "Invalid user ID" });
        }
        res.status(500).json({ 
            message: "Server error", 
            error: error.message 
        });
    }
};

module.exports = { 
    getUsers, 
    getUserById, 
    getUserDetails, // Add the new function to exports
    deleteUser 
};