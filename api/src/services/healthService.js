import mongoose from "mongoose";
import logger from "../utils/logger.js";

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
 * Get health check information
 * @returns {Object} Health check data
 */
export function getHealthStatus() {
  // logger.debug("Health check requested");
  const dbStatus = getDatabaseStatus();
  const isHealthy = dbStatus.readyState === 1;

  return {
    status: isHealthy ? "healthy" : "unhealthy",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    database: dbStatus,
  };
}
