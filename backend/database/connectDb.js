const mongoose = require("mongoose");
require("dotenv").config();
mongoose.set("strictQuery", false);

const connectDB = async (logger) => {
  try {
    logger.info("Attempting to connect to MongoDB", {
      uri: process.env.MONGO_URI ? "Set" : "Not set",
      redactedUri: process.env.MONGO_URI
        ? process.env.MONGO_URI.replace(/\/\/(.+?)@/, "//<credentials>@")
        : "Not set", // Redact credentials for logging
    });
    await mongoose.connect(process.env.MONGO_URI, {
      connectTimeoutMS: 10000, // 10s timeout
      serverSelectionTimeoutMS: 10000,
    });
    logger.info("MongoDB connected successfully");
  } catch (error) {
    logger.error("MongoDB connection failed", {
      error: error.message,
      stack: error.stack,
      code: error.code,
      uri: process.env.MONGO_URI ? "Set" : "Not set",
    });
    throw error; // Throw to let startServer handle the exit
  }
};

module.exports = connectDB;
