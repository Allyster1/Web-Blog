import mongoose from "mongoose";
import logger from "../utils/logger.js";

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/myBlog_dev";

const MAX_RETRIES = 5;
const INITIAL_DELAY = 1000; // 1 second

/**
 * Sleep utility for retry delays
 */
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Get user-friendly error message
 */
function getErrorMessage(error) {
  if (error.name === "MongoServerSelectionError") {
    return "Cannot connect to MongoDB. Is MongoDB running?";
  }
  if (error.name === "MongoAuthenticationError") {
    return "MongoDB authentication failed. Check credentials.";
  }
  if (error.name === "MongoNetworkError") {
    return "Network error connecting to MongoDB.";
  }
  return error.message || "Unknown database error";
}

/**
 * Connect to MongoDB with retry logic
 */
export default async function connectDB() {
  let lastError = null;

  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      // Skip delay on first attempt
      if (attempt > 0) {
        const delay = INITIAL_DELAY * Math.pow(2, attempt - 1);
        logger.info(
          `Retrying connection (attempt ${
            attempt + 1
          }/${MAX_RETRIES}) in ${delay}ms...`
        );
        await sleep(delay);
      }

      await mongoose.connect(MONGODB_URI, {
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
      });

      logger.info("MongoDB connected successfully!");

      // Note: Graceful shutdown is now handled in utils/gracefulShutdown.js
      // This avoids duplicate signal handlers

      return;
    } catch (error) {
      lastError = error;
      const errorMsg = getErrorMessage(error);

      // Don't retry on fatal errors
      if (
        error.name === "MongoParseError" ||
        error.name === "MongoAuthenticationError"
      ) {
        logger.error(`Fatal error: ${errorMsg}`, { error: error.name });
        break;
      }

      logger.warn(`Connection attempt ${attempt + 1} failed: ${errorMsg}`);
    }
  }

  // All retries failed
  logger.error(
    `Failed to connect after ${MAX_RETRIES} attempts: ${getErrorMessage(
      lastError
    )}`,
    { error: lastError }
  );
  process.exit(1);
}
