const mongoose = require("mongoose");
require("dotenv").config();
mongoose.set("strictQuery", false);

const connectDB = async (logger) => {
  try {
    logger.info("Attempting to connect to MongoDB with URI:", {
      uri: process.env.MONGO_URI ? "Set" : "Not set",
    });
    await mongoose.connect(process.env.MONGO_URI);
    logger.info("MongoDB connected successfully");
  } catch (error) {
    logger.error("MongoDB connection failed", {
      error: error.message,
      stack: error.stack,
      code: error.code, // Include error code for debugging
    });
    process.exit(1);
  }
};

module.exports = connectDB;
