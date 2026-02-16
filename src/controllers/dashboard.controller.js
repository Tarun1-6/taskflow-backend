const mongoose = require("mongoose");
const taskModel = require("../models/task.model");
const AppError = require("../utils/AppError");
const { redisClient } = require("../config/redis"); // added

async function getDashboardStats(req, res, next) {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id);
    const cacheKey = `dashboard:${req.user.id}`;

    // 1. Check cache first
    const cachedData = await redisClient.get(cacheKey);
    if (cachedData) {
      return res.status(200).json({
        success: true,
        stats: JSON.parse(cachedData),
        source: "cache",
      });
    }

    // 2. If not cached → fetch from DB

    // Total tasks
    const totalTasks = await taskModel.countDocuments({ userId });

    if (totalTasks === 0) {
      const emptyStats = {
        totalTasks: 0,
        completedTasks: 0,
        incompleteTasks: 0,
        tasksByStatus: {},
        tasksByPriority: {},
        overdueTasks: 0,
      };

      // Cache empty stats
      await redisClient.setEx(cacheKey, 300, JSON.stringify(emptyStats));

      return res.status(200).json({
        success: true,
        stats: emptyStats,
        source: "db",
      });
    }

    // Completed tasks
    const completedTasks = await taskModel.countDocuments({
      userId,
      status: "done",
    });

    // Incomplete tasks
    const incompleteTasks = totalTasks - completedTasks;

    // Tasks by status
    const tasksByStatus = await taskModel.aggregate([
      { $match: { userId } },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    const statusObject = {};
    tasksByStatus.forEach((item) => {
      statusObject[item._id] = item.count;
    });

    // Tasks by priority
    const tasksByPriority = await taskModel.aggregate([
      { $match: { userId } },
      {
        $group: {
          _id: "$priority",
          count: { $sum: 1 },
        },
      },
    ]);

    const priorityObject = {};
    tasksByPriority.forEach((item) => {
      priorityObject[item._id] = item.count;
    });

    // Overdue tasks
    const overdueTasks = await taskModel.countDocuments({
      userId,
      status: { $ne: "done" },
      dueDate: { $lt: new Date() },
    });

    const statsData = {
      totalTasks,
      completedTasks,
      incompleteTasks,
      tasksByStatus: statusObject,
      tasksByPriority: priorityObject,
      overdueTasks,
    };

    // 3. Save to cache (5 minutes)
    await redisClient.setEx(cacheKey, 300, JSON.stringify(statsData));

    res.status(200).json({
      success: true,
      stats: statsData,
      source: "db",
    });
  } catch (error) {
    next(error);
  }
}

module.exports = { getDashboardStats };
