import mongoose from "mongoose";
import logger from "./logger.js";

let server = null;
let shutdownInProgress = false;

/**
 * Set the server instance for graceful shutdown
 * @param {import('http').Server} serverInstance - Express server instance
 */
export function setServer(serverInstance) {
  server = serverInstance;
}

/**
 * Gracefully shutdown the application
 * @param {string} signal - Signal that triggered shutdown
 * @param {number} exitCode - Exit code to use
 */
async function gracefulShutdown(signal, exitCode = 0) {
  // Prevent multiple shutdown attempts
  if (shutdownInProgress) {
    logger.warn("Shutdown already in progress, forcing exit");
    process.exit(1);
  }

  shutdownInProgress = true;
  logger.info(`Received ${signal}, starting graceful shutdown...`);

  try {
    // Close HTTP server
    if (server) {
      await new Promise((resolve, reject) => {
        server.close((err) => {
          if (err) {
            logger.error("Error closing HTTP server", { error: err });
            reject(err);
          } else {
            logger.info("HTTP server closed");
            resolve();
          }
        });

        // Force close after 10 seconds
        setTimeout(() => {
          logger.warn("Forcing server close after timeout");
          resolve();
        }, 10000);
      });
    }

    // Close MongoDB connection
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close();
      logger.info("MongoDB connection closed");
    }

    logger.info("Graceful shutdown completed");
    process.exit(exitCode);
  } catch (error) {
    logger.error("Error during graceful shutdown", {
      error: error.message,
      stack: error.stack,
    });
    process.exit(1);
  }
}

/**
 * Setup process-level error handlers and graceful shutdown
 */
export function setupProcessHandlers() {
  // Handle uncaught exceptions (synchronous errors)
  process.on("uncaughtException", (error) => {
    logger.error("Uncaught Exception - Application will terminate", {
      error: error.message,
      stack: error.stack,
      name: error.name,
    });

    // Attempt graceful shutdown
    gracefulShutdown("uncaughtException", 1);
  });

  // Handle unhandled promise rejections
  process.on("unhandledRejection", (reason, promise) => {
    logger.error("Unhandled Rejection - Application may be unstable", {
      reason: reason instanceof Error ? reason.message : String(reason),
      stack: reason instanceof Error ? reason.stack : undefined,
      promise: promise.toString(),
    });

    // In production, we might want to exit, but in development we can log and continue
    // For now, we'll just log - but you can change this to exit if needed
    if (process.env.NODE_ENV === "production") {
      logger.error(
        "Unhandled rejection in production - consider investigating and fixing"
      );
      // Optionally exit in production:
      // gracefulShutdown("unhandledRejection", 1);
    }
  });

  // Handle termination signals
  process.on("SIGTERM", () => gracefulShutdown("SIGTERM", 0));
  process.on("SIGINT", () => gracefulShutdown("SIGINT", 0));

  // Handle warning events
  process.on("warning", (warning) => {
    logger.warn("Node.js Warning", {
      name: warning.name,
      message: warning.message,
      stack: warning.stack,
    });
  });

  logger.info("Process-level error handlers registered");
}
