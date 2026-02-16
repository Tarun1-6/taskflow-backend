const taskModel = require("../models/task.model");
const AppError = require("../utils/AppError");
const { redisClient } = require("../config/redis"); // added

// Helper to clear dashboard cache
async function clearDashboardCache(userId) {
  const cacheKey = `dashboard:${userId}`;
  await redisClient.del(cacheKey);
}

// GET ALL TASKS
async function allTasks(req, res, next) {
  try {
    const filter = { userId: req.user.id };

    // Filtering
    if (req.query.status) filter.status = req.query.status;
    if (req.query.priority) filter.priority = req.query.priority;

    if (req.query.search) {
      filter.$or = [
        { title: { $regex: req.query.search, $options: "i" } },
        { description: { $regex: req.query.search, $options: "i" } },
      ];
    }

    if (req.query.dueDate) filter.dueDate = req.query.dueDate;

    // Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Sorting
    const allowedSortFields = [
      "title",
      "status",
      "priority",
      "dueDate",
      "createdAt",
      "updatedAt",
    ];

    const sortBy = allowedSortFields.includes(req.query.sortBy)
      ? req.query.sortBy
      : "createdAt";

    const order = req.query.order === "asc" ? 1 : -1;

    const sortObject = {};
    sortObject[sortBy] = order;

    const totalTasks = await taskModel.countDocuments(filter);
    const totalPages = Math.ceil(totalTasks / limit);

    const tasks = await taskModel
      .find(filter)
      .limit(limit)
      .skip(skip)
      .sort(sortObject);

    res.status(200).json({
      success: true,
      meta: {
        page,
        limit,
        totalTasks,
        totalPages,
        count: tasks.length,
        sortBy,
        order: order === 1 ? "asc" : "desc",
      },
      data: tasks,
    });
  } catch (error) {
    next(error);
  }
}

// CREATE TASK
async function createTask(req, res, next) {
  try {
    const { title, description, status, priority, dueDate } = req.body;

    const newTask = await taskModel.create({
      title,
      description,
      status,
      priority,
      dueDate,
      userId: req.user.id,
    });

    // Clear dashboard cache
    await clearDashboardCache(req.user.id);

    res.status(201).json({
      success: true,
      data: newTask,
    });
  } catch (error) {
    next(error);
  }
}

// GET SINGLE TASK
async function getTask(req, res, next) {
  try {
    const taskId = req.params.id;

    const task = await taskModel.findOne({
      _id: taskId,
      userId: req.user.id,
    });

    if (!task) {
      return next(new AppError("Task not found", 404));
    }

    res.status(200).json({
      success: true,
      data: task,
    });
  } catch (error) {
    next(error);
  }
}

// UPDATE TASK
async function updateTask(req, res, next) {
  try {
    const taskId = req.params.id;
    const { title, description, status, priority, dueDate } = req.body;

    const task = await taskModel.findOneAndUpdate(
      { _id: taskId, userId: req.user.id },
      { title, description, status, priority, dueDate },
      { new: true, runValidators: true },
    );

    if (!task) {
      return next(new AppError("Task not found", 404));
    }

    // Clear dashboard cache
    await clearDashboardCache(req.user.id);

    res.status(200).json({
      success: true,
      data: task,
    });
  } catch (error) {
    next(error);
  }
}

// DELETE TASK
async function deleteTask(req, res, next) {
  try {
    const taskId = req.params.id;

    const task = await taskModel.findOneAndDelete({
      _id: taskId,
      userId: req.user.id,
    });

    if (!task) {
      return next(new AppError("Task not found", 404));
    }

    // Clear dashboard cache
    await clearDashboardCache(req.user.id);

    res.status(200).json({
      success: true,
      message: "Task deleted successfully",
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  allTasks,
  createTask,
  getTask,
  updateTask,
  deleteTask,
};
