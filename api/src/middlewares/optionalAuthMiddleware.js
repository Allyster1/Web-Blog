import {
  verifyAccessToken,
  rotateRefreshToken,
  attachTokensToResponse,
} from "../utils/tokenUtils.js";
import User from "../models/User.js";

/**
 * Optional authentication middleware
 * Sets req.user if authenticated, but doesn't throw if not
 * Useful for routes that work for both authenticated and unauthenticated users
 */
export async function optionalAuthMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  const refreshToken = req.cookies?.refreshToken;

  // If no auth header, just continue without setting req.user
  if (!authHeader) {
    return next();
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = verifyAccessToken(token);
    // Get full user info including role
    const user = await User.findById(decoded.id).select("role email");
    req.user = {
      id: user._id,
      email: user.email,
      role: user.role || "user",
    };
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError" && refreshToken) {
      try {
        const {
          user,
          accessToken,
          refreshToken: newRefreshToken,
        } = await rotateRefreshToken(refreshToken);

        attachTokensToResponse(res, accessToken, newRefreshToken, req);

        req.user = {
          id: user._id,
          email: user.email,
          role: user.role || "user",
        };
        next();
      } catch (error) {
        // If refresh fails, just continue without authentication
        next();
      }
    } else {
      // If token is invalid, just continue without authentication
      next();
    }
  }
}
