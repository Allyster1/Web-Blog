import mongoose from "mongoose";
import logger from "../utils/logger.js";

/**
 * Ping the database to verify actual connectivity
 * @param {number} timeoutMs - Timeout in milliseconds (default: 3000)
 * @returns {Promise<boolean>} True if database is reachable
 */
async function pingDatabase(timeoutMs = 3000) {
  // Check if connection exists and readyState is connected
  if (mongoose.connection.readyState !== 1) {
    return false;
  }

  // Check if db object exists (might be undefined if connection is not fully established)
  if (!mongoose.connection.db) {
    return false;
  }

  try {
    // Create a promise that will resolve/reject based on ping result
    const pingPromise = mongoose.connection.db.admin().ping();

    // Create a timeout promise
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error("Database ping timeout")), timeoutMs);
    });

    // Race between ping and timeout
    await Promise.race([pingPromise, timeoutPromise]);
    return true;
  } catch (error) {
    logger.debug("Database ping failed", { error: error.message });
    return false;
  }
}

/**
 * Get database connection status
 * @returns {Object} Database status information
 */
function getDatabaseStatus() {
  const readyState = mongoose.connection.readyState;

  // Mongoose readyState values:
  // 0 = disconnected
  // 1 = connected
  // 2 = connecting
  // 3 = disconnecting

  const statusMap = {
    0: "disconnected",
    1: "connected",
    2: "connecting",
    3: "disconnecting",
  };

  return {
    status: statusMap[readyState] || "unknown",
    readyState,
  };
}

/**
 * Get health check information with actual database connectivity test
 * @returns {Promise<Object>} Health check data
 */
export async function getHealthStatus() {
  const dbStatus = getDatabaseStatus();

  // Only ping if connection state suggests it's connected
  let dbReachable = false;
  if (dbStatus.readyState === 1) {
    dbReachable = await pingDatabase();
  }

  // System is healthy only if database is both connected AND reachable
  const isHealthy = dbStatus.readyState === 1 && dbReachable;

  return {
    status: isHealthy ? "healthy" : "unhealthy",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    database: {
      ...dbStatus,
      reachable: dbReachable,
    },
  };
}
