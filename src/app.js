const express = require("express");
const cors = require("cors");
const connectToDb = require("./config/database");
const userRoutes = require("./routes/auth.routes");
const cookieParser = require("cookie-parser");
const taskRoutes = require("./routes/task.routes");
const dashboardRoutes = require("./routes/dashboard.routes");
const errorHandler = require("./middlewares/error.middleware");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const AppError = require("./utils/AppError");

// Swagger imports
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./config/swagger");

const app = express();

// CORS configuration
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  }),
);

// Request logging
app.use(morgan("dev"));

// Rate limiting for all APIs
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: {
    success: false,
    message: "Too many requests, please try again later.",
  },
});

app.use("/api", apiLimiter);

// Middleware
app.use(express.json());
app.use(cookieParser());

// Swagger route
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    status: "OK",
    timestamp: new Date(),
  });
});

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "TaskFlow API is running",
  });
});


// Routes
app.use("/api/auth", userRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/dashboard", dashboardRoutes);

// 404 handler
app.use((req, res, next) => {
  next(new AppError(`Route ${req.originalUrl} not found`, 404));
});

// Error handler
app.use(errorHandler);

// Connect DB
connectToDb();

module.exports = app;
