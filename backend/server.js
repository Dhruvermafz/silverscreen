const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const helmet = require("helmet"); // Security headers
const morgan = require("morgan"); // Request logging
const compression = require("compression"); // Gzip compression
const winston = require("winston"); // Advanced logging
require("dotenv").config();

// Route imports
const listRoutes = require("./routes/listRoutes");
const userRoutes = require("./routes/userRoutes");
const groupRoutes = require("./routes/groupRoutes");
const newsroomRoutes = require("./routes/newsroomRoutes");
const tagsRoutes = require("./routes/tagsRoutes");
const contactRoutes = require("./routes/contactRoutes");

// Initialize express app
const app = express();
const PORT = process.env.PORT || 8000;

// Configure Winston logger
const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: "error.log", level: "error" }),
    new winston.transports.File({ filename: "combined.log" }),
  ],
});

// Add console logging in development
if (process.env.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      format: winston.format.simple(),
    })
  );
}

// Middleware
app.use(helmet()); // Security headers
app.use(compression()); // Gzip compression
app.use(morgan("combined")); // HTTP request logging
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://cinenotes.vercel.app",
      "https://silverscreen.vercel.app",
      "http://localhost:3001",
    ], // Configurable CORS
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json({ limit: "10mb" })); // Limit payload size
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  logger.info(`Incoming request: ${req.method} ${req.url}`, {
    ip: req.ip,
    userAgent: req.get("user-agent"),
  });
  next();
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// MongoDB connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
    });
    logger.info("MongoDB connected successfully");
  } catch (error) {
    logger.error("MongoDB connection failed", { error: error.message });
    process.exit(1);
  }
};

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/users", userRoutes);
app.use("/api/movies", require("./routes/movieRoutes"));
app.use("/api/reviews", require("./routes/reviewRoutes"));
app.use("/api/lists", listRoutes);
app.use("/api/groups", groupRoutes);
app.use("/api/newsroom", newsroomRoutes);
app.use("/api/tags", tagsRoutes);
app.use("/api/contacts", contactRoutes);

// 404 Handler
app.use((req, res) => {
  logger.warn(`404 - Route not found: ${req.method} ${req.url}`);
  res.status(404).json({
    error: "Not Found",
    message: `The requested resource ${req.url} was not found`,
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error("Server error", {
    error: err.message,
    stack: err.stack,
    method: req.method,
    url: req.url,
  });

  res.status(err.status || 500).json({
    error: "Internal Server Error",
    message:
      process.env.NODE_ENV === "production"
        ? "An unexpected error occurred"
        : err.message,
  });
});

// Graceful shutdown
const shutdown = () => {
  logger.info("Received shutdown signal. Closing server...");
  server.close(() => {
    mongoose.connection.close(false, () => {
      logger.info("MongoDB connection closed");
      process.exit(0);
    });
  });
};

// Start server
let server;
const startServer = async () => {
  try {
    await connectDB();
    server = app.listen(PORT, () => {
      logger.info(
        `Server running on port ${PORT} in ${
          process.env.NODE_ENV || "development"
        } mode`
      );
    });

    // Handle process termination
    process.on("SIGTERM", shutdown);
    process.on("SIGINT", shutdown);

    // Handle uncaught exceptions
    process.on("uncaughtException", (error) => {
      logger.error("Uncaught Exception", {
        error: error.message,
        stack: error.stack,
      });
      shutdown();
    });

    // Handle unhandled promise rejections
    process.on("unhandledRejection", (reason, promise) => {
      logger.error("Unhandled Rejection at:", { reason, promise });
    });
  } catch (error) {
    logger.error("Failed to start server", { error: error.message });
    process.exit(1);
  }
};

startServer();
