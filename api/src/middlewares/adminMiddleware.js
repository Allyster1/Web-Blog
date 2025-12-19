import User from "../models/User.js";
import { ForbiddenError } from "../utils/AppError.js";

/**
 * Middleware to verify that the user has admin role
 * Must be used after authMiddleware
 */
export async function adminMiddleware(req, res, next) {
  try {
    // Check if user role is in the JWT token first (faster check)
    if (req.user?.role !== "admin") {
      // If not in token, verify from database
      const user = await User.findById(req.user.id);

      if (!user || user.role !== "admin") {
        return next(new ForbiddenError("Admin access required"));
      }

      // Update req.user with role from database
      req.user.role = user.role;
    }

    next();
  } catch (error) {
    next(error);
  }
}
