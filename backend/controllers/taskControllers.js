const Task = require("../models/Task");

// @desc    Get all tasks (Admin: all, User: only assigned tasks)
// @route   GET /api/tasks/
// @access  Private
const getTasks = async (req, res) => {
  try {
    const { status, search, sortBy } = req.query;
    const now = new Date();

    // Build base filter from status/search
    let filter = {};

    // Special-case "Overdue" filter
    if (status === "Overdue") {
      filter = {
        status: { $ne: "Completed" },
        dueDate: { $lt: now },
      };
    } else if (status) {
      filter.status = status;
    }

    if (search) {
      filter.$or = [
        { title:       { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    // Determine sort order on dueDate
    let sort = {};
    if (sortBy === "newest") {
      sort.dueDate = 1;  // newest first
    } else if (sortBy === "oldest") {
      sort.dueDate =  -1;  // oldest first
    }

    // Restrict to assigned tasks for non-admins
    const queryFilter = 
      req.user.role === "admin"
        ? filter
        : { ...filter, assignedTo: req.user._id };

    // Fetch tasks
    let tasks = await Task.find(queryFilter)
      .sort(sort)
      .populate("assignedTo", "name email profileImageUrl");

    // Map in-overdue and todo counts
    tasks = tasks.map((task) => {
      const obj = task.toObject();
      const completedCount = obj.todoChecklist.filter(t => t.completed).length;

      // If not completed and past due, mark as Overdue
      if (obj.status !== "Completed" && new Date(obj.dueDate) < now) {
        obj.status = "Overdue";
      }

      return {
        ...obj,
        completedTodoCount: completedCount,
        totalTodoCount:     obj.todoChecklist.length,
      };
    });

    // Compute status summaries in parallel
    const baseCountFilter = queryFilter;
    const [
      allCount,
      pendingCount,
      inProgressCount,
      completedCount,
      overdueCount,
    ] = await Promise.all([
      Task.countDocuments(baseCountFilter),
      Task.countDocuments({ ...baseCountFilter, status: "Pending" }),
      Task.countDocuments({ ...baseCountFilter, status: "In Progress" }),
      Task.countDocuments({ ...baseCountFilter, status: "Completed" }),
      Task.countDocuments({
        ...baseCountFilter,
        status:  { $ne: "Completed" },
        dueDate: { $lt: now },
      }),
    ]);

    res.json({
      tasks,
      statusSummary: {
        all:           allCount,
        pending:       pendingCount,
        inProgress:    inProgressCount,
        completed:     completedCount,
        overdue:       overdueCount,
      },
    });
  } catch (error) {
    console.error("Error in getTasks:", error);
    res.status(500).json({
      message: "Server error",
      error:   error.message,
    });
  }
};


// @desc    Get task by ID
// @route   GET /api/tasks/:id
// @access  Private
const getTaskById = async (req, res) => {
  try {
    const now = new Date();

    // Fetch the task
    const taskDoc = await Task.findById(req.params.id)
      .populate("assignedTo", "name email profileImageUrl");

    if (!taskDoc) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Convert to plain object and override status if overdue
    const task = taskDoc.toObject();
    if (task.status !== "Completed" && new Date(task.dueDate) < now) {
      task.status = "Overdue";
    }

    console.log("Task fetched by ID (with overdue check):", task);
    res.status(200).json(task);
  } catch (error) {
    console.error("Error in getTaskById:", error);
    res.status(500).json({
      message: "Server error",
      error:   error.message,
    });
  }
};


// @desc    Create a new task (Admin only)
// @route   POST /api/tasks/
// @access  Private (Admin)
const createTask = async (req, res) => {
  try {
    const {
      title,
      description,
      assignedTo,
      priority,
      dueDate,
      attachments,
      todoChecklist,
    } = req.body;

    if (!Array.isArray(assignedTo)) {
      return res
        .status(400)
        .json({ message: "assignedTo must be an array of userIds" });
    }

    const task = await Task.create({
      title,
      description,
      priority,
      dueDate,
      assignedTo,
      createdBy: req.user._id,
      todoChecklist,
      attachments,
    });

    res.status(201).json({
      // Fixed: changed status[201] to status(201)
      message: "Task created successfully",
      task,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// @desc    Update task details
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) return res.status(404).json({ message: "Task not found" }); // Fixed: added closing parenthesis

    task.title = req.body.title || task.title;
    task.description = req.body.description || task.description;
    task.priority = req.body.priority || task.priority; // Fixed: changed 'empty try' to 'priority'
    task.dueDate = req.body.dueDate || task.dueDate;
    task.todoChecklist = req.body.todoChecklist || task.todoChecklist;
    task.attachments = req.body.attachments || task.attachments;

    if (req.body.assignedTo) {
      if (!Array.isArray(req.body.assignedTo)) {
        return res.status(400).json({
          message: "assignedTo must be an array of user IDs",
        });
      }
      task.assignedTo = req.body.assignedTo;
    }
    const updatedTask = await task.save();

    res.json({
      success: true,
      message: "Task updated successfully",
      task: updatedTask,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// @desc    Delete a task (Admin only)
// @route   DELETE /api/tasks/:id
// @access  Private (Admin)
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid task ID" });
    }
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// @desc    Update task status
// @route   PUT /api/tasks/:id/status
// @access  Private
const updateTaskStatus = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    const isAssigned = task.assignedTo.some(
      (userId) => userId.toString() === req.user._id.toString()
    );

    if (!isAssigned && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized" });
    }

    task.status = req.body.status || task.status;

    if (task.status === "Completed") {
      task.todoChecklist.forEach((item) => (item.completed = true));
      task.progress = 100;
    }

    await task.save();
    res.json({ message: "Task status updated", task });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Update task checklist
// @route   PUT /api/tasks/:id/todo
// @access  Private
const updateTaskCheckList = async (req, res) => {
  try {
    const { todoChecklist } = req.body;
    const task = await Task.findById(req.params.id);

    if (!task) return res.status(404).json({ message: "Task not found" });

    if (
      !(task.assignedTo.includes(req.user._id) && req.user.role !== "admin")
    ) {
      console.log("task assignedTo ", task.assignedTo);
      console.log("req.user_id ", req.user_id);
      console.log("req.user.role ", req.user.role);

      return res
        .status(403)
        .json({ message: "Not authorized to update checkList" });
    }

    task.todoChecklist = todoChecklist; // Replace with updated checkList

    // Auto-update progress based on checklist completion
    const completedCount = task.todoChecklist.filter(
      (item) => item.completed
    ).length;
    const totalItems = task.todoChecklist.length;
    task.progress =
      totalItems > 0 ? Math.round((completedCount / totalItems) * 100) : 0;

    if (task.progress === 100) {
      task.status = "Completed";
    } else if (task.progress > 0) {
      task.status = "In Progress";
    } else {
      task.status = "Pending";
    }

    await task.save();
    const updatedTask = await Task.findById(req.params.id).populate(
      "assignedTo",
      "name email profileImageUrl"
    );

    res.json({ message: "Task checklist updated", task: updatedTask });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
const getDashboardData = async (req, res) => {
  try {
    // Fetch statistics
    const totalTasks = await Task.countDocuments();
    const pendingTasks = await Task.countDocuments({
      status: "Pending",
    });
    const completedTasks = await Task.countDocuments({
      status: "Completed",
    });
    const overdueTasks = await Task.countDocuments({
      status: { $ne: "Completed" }, // Fixed: changed $net to $ne
      dueDate: { $lt: new Date() },
    });
    const inProgressTasks = await Task.countDocuments({
      status: "In Progress",
    });

    // Ensure all possible statuses are included
    const taskStatuses = ["Pending", "In Progress", "Completed"];
    const taskDistributionRaw = await Task.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);
    const taskDistribution = taskStatuses.reduce((acc, status) => {
      const formattedKey = status.replace(/\s+/g, "");
      acc[formattedKey] =
        taskDistributionRaw.find((item) => item._id === status)?.count || 0;
      return acc;
    }, {});
    taskDistribution["All"] = totalTasks; // Add total count to taskDistribution

    // Ensure all priority levels are included
    const taskPriorities = ["Low", "Medium", "High"];
    const taskPriorityLevelsRaw = await Task.aggregate([
      {
        $group: {
          _id: "$priority",
          count: { $sum: 1 },
        },
      },
    ]);

    const taskPriorityLevels = taskPriorities.reduce((acc, priority) => {
      acc[priority] =
        taskPriorityLevelsRaw.find((item) => item._id === priority)?.count || 0;
      return acc;
    }, {});

    // Fetch recent 10 tasks
    const recentTasks = await Task.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .select("title status priority dueDate createdAt");

    res.status(200).json({
      statistics: {
        totalTasks,
        pendingTasks,
        completedTasks,
        overdueTasks,
        inProgressTasks,
      },
      charts: {
        taskDistribution,
        taskPriorityLevels,
      },
      recentTasks,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getUserDashboardData = async (req, res) => {
  try {
    const userId = req.user._id; // Only fetch data for the logged-in user

    // Fetch statistics for user-specific tasks
    const totalTasks = await Task.countDocuments({ assignedTo: userId });
    const pendingTasks = await Task.countDocuments({
      assignedTo: userId,
      status: "Pending",
    });
    const completedTasks = await Task.countDocuments({
      assignedTo: userId,
      status: "Completed",
    });
    const overdueTasks = await Task.countDocuments({
      assignedTo: userId,
      status: { $ne: "Completed" },
      dueDate: { $lt: new Date() },
    });
    // Task distribution by status
    const taskStatuses = ["Pending", "In Progress", "Completed"];
    const taskDistributionRaw = await Task.aggregate([
      { $match: { assignedTo: userId } },
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);

    const taskDistribution = taskStatuses.reduce((acc, status) => {
      const formattedKey = status.replace(/\s+/g, "");
      acc[formattedKey] =
        taskDistributionRaw.find((item) => item._id === status)?.count || 0;
      return acc;
    }, {});
    taskDistribution["All"] = totalTasks;

    // Task distribution by priority
    const taskPriorities = ["Low", "Medium", "High"];
    const taskPriorityLevelsRaw = await Task.aggregate([
      { $match: { assignedTo: userId } },
      { $group: { _id: "$priority", count: { $sum: 1 } } },
    ]);
    const taskPriorityLevels = taskPriorities.reduce((acc, priority) => {
      acc[priority] =
        taskPriorityLevelsRaw.find((item) => item._id === priority)?.count || 0;
      return acc;
    }, {});

    // Fetch recent 10 tasks for the logged-in user
    const recentTasks = await Task.find({ assignedTo: userId })
      .sort({ createdAt: -1 })
      .limit(10)
      .select("title status priority dueDate createdAt");

    res.status(200).json({
      statistics: {
        totalTasks,
        pendingTasks,
        completedTasks,
        overdueTasks,
      },
      charts: {
        taskDistribution,
        taskPriorityLevels,
      },
      recentTasks,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  updateTaskStatus,
  updateTaskCheckList,
  getDashboardData,
  getUserDashboardData,
};
