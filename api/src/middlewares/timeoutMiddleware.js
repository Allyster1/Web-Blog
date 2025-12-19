import logger from "../utils/logger.js";

/**
 * Default request timeout in milliseconds
 * 30 seconds should be sufficient for most API requests
 */
const DEFAULT_TIMEOUT = 30000; // 30 seconds

/**
 * Request timeout middleware
 * Terminates requests that exceed the timeout duration
 * @param {number} timeoutMs - Timeout in milliseconds (default: 30000)
 * @returns {Function} Express middleware function
 */
export function requestTimeout(timeoutMs = DEFAULT_TIMEOUT) {
  return (req, res, next) => {
    // Set a timeout on the request
    req.setTimeout(timeoutMs, () => {
      // If response hasn't been sent, send timeout error
      if (!res.headersSent) {
        logger.warn("Request timeout", {
          method: req.method,
          url: req.originalUrl,
          timeout: timeoutMs,
          ip: req.ip,
        });

        res.status(408).json({
          message: "Request timeout",
          error: "The request took too long to process. Please try again.",
        });
      }
    });

    // Also set a timeout on the response socket
    const timeoutId = setTimeout(() => {
      // If response hasn't been sent, destroy the connection
      if (!res.headersSent) {
        logger.warn("Forcing connection close due to timeout", {
          method: req.method,
          url: req.originalUrl,
          timeout: timeoutMs,
          ip: req.ip,
        });

        // Destroy the request socket to free up resources
        if (req.socket) {
          req.socket.destroy();
        }
      }
    }, timeoutMs);

    // Clear timeout when response is finished
    res.on("finish", () => {
      clearTimeout(timeoutId);
    });

    // Clear timeout on error
    res.on("error", () => {
      clearTimeout(timeoutId);
    });

    next();
  };
}

/**
 * Set server-level timeouts
 * @param {import('http').Server} server - HTTP server instance
 * @param {number} timeoutMs - Timeout in milliseconds (default: 31000, slightly higher than request timeout)
 */
export function setServerTimeouts(server, timeoutMs = 31000) {
  // Set keep-alive timeout (time to wait for the next request on same connection)
  server.keepAliveTimeout = 65000; // 65 seconds (common default)

  // Set headers timeout (time to wait for request headers)
  server.headersTimeout = 66000; // 66 seconds (must be > keepAliveTimeout)

  // Set request timeout (time to wait for entire request)
  server.timeout = timeoutMs; // 31 seconds (slightly higher than middleware timeout)
}
