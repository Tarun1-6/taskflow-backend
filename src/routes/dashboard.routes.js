const express = require("express");
const dashboardRouter = express.Router();

const authMiddleware = require("../middlewares/auth.middleware");
const dashboardController = require("../controllers/dashboard.controller");

// Protect all routes
dashboardRouter.use(authMiddleware);

/**
 * @swagger
 * /api/dashboard/stats:
 *   get:
 *     summary: Get dashboard statistics
 *     tags: [Dashboard]
 *     responses:
 *       200:
 *         description: Dashboard statistics retrieved successfully
 */
dashboardRouter.get("/stats", dashboardController.getDashboardStats);

module.exports = dashboardRouter;
