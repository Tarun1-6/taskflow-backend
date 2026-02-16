const express = require("express");
const taskRouter = express.Router();

const taskController = require("../controllers/task.controller");
const authMiddleware = require("../middlewares/auth.middleware");

const validate = require("../middlewares/validate.middleware");
const {
  createTaskValidation,
  updateTaskValidation,
} = require("../validators/task.validator");

// Protect all routes
taskRouter.use(authMiddleware);

/**
 * @swagger
 * /api/tasks:
 *   get:
 *     summary: Get all tasks with filtering, pagination and sorting
 *     tags: [Tasks]
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *       - in: query
 *         name: priority
 *         schema:
 *           type: string
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *       - in: query
 *         name: page
 *         schema:
 *           type: number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: List of tasks
 */
taskRouter.get("/", taskController.allTasks);

/**
 * @swagger
 * /api/tasks:
 *   post:
 *     summary: Create a new task
 *     tags: [Tasks]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *             properties:
 *               title:
 *                 type: string
 *                 example: Complete backend API
 *               description:
 *                 type: string
 *                 example: Finish controllers and routes
 *               status:
 *                 type: string
 *                 example: todo
 *               priority:
 *                 type: string
 *                 example: high
 *               dueDate:
 *                 type: string
 *                 example: 2026-03-01
 *     responses:
 *       201:
 *         description: Task created successfully
 */
taskRouter.post("/", createTaskValidation, validate, taskController.createTask);

/**
 * @swagger
 * /api/tasks/{id}:
 *   get:
 *     summary: Get a single task
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Task fetched successfully
 */
taskRouter.get("/:id", taskController.getTask);

/**
 * @swagger
 * /api/tasks/{id}:
 *   put:
 *     summary: Update a task
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Task updated successfully
 */
taskRouter.put(
  "/:id",
  updateTaskValidation,
  validate,
  taskController.updateTask,
);

/**
 * @swagger
 * /api/tasks/{id}:
 *   delete:
 *     summary: Delete a task
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Task deleted successfully
 */
taskRouter.delete("/:id", taskController.deleteTask);

module.exports = taskRouter;
