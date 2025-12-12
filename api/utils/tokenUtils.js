import jwt from "jsonwebtoken";
import crypto from "crypto";
import User from "../models/User.js";

/**
 * Generate a new JWT access token (short-lived)
 */
export function generateAccessToken(user) {
   const payload = {
      id: user._id,
      email: user.email,
   };

   return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "15m" });
}

/**
 * Generate a new refresh token (long-lived, stored in DB)
 */
export function generateRefreshToken() {
   return crypto.randomBytes(64).toString("hex");
}

/**
 * Verify access token, throws if invalid
 */
export function verifyAccessToken(token) {
   return jwt.verify(token, process.env.JWT_SECRET);
}

/**
 * Handle rotating refresh token logic
 *  - Check if refresh token exists in DB
 *  - Issue new access token and new refresh token
 *  - Save new refresh token to DB
 */
export async function rotateRefreshToken(oldRefreshToken) {
   const user = await User.findOne({ refreshToken: oldRefreshToken }).select("+refreshToken");

   if (!user) throw new Error("Invalid refresh token");

   const newRefreshToken = generateRefreshToken();
   const newAccessToken = generateAccessToken(user);

   user.refreshToken = newRefreshToken;
   await user.save();

   return { user, accessToken: newAccessToken, refreshToken: newRefreshToken };
}

/**
 * Helper to attach new tokens to headers
 */
export function attachTokensToResponse(res, accessToken, refreshToken) {
   res.setHeader("x-access-token", accessToken);
   res.setHeader("x-refresh-token", refreshToken);
}
