import jwt from "jsonwebtoken";
import crypto from "crypto";
import User from "../models/User.js";
import bcrypt from "bcrypt";

const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS) || 12;

export async function hashToken(token) {
   return await bcrypt.hash(token, saltRounds);
}

export async function verifyToken(token, hashedToken) {
   return await bcrypt.compare(token, hashedToken);
}

/**
 * Generate a new JWT access token (short-lived).
 *
 * @param {Object} user - The user object.
 * @param {string} user._id - The user's unique ID.
 * @param {string} user.email - The user's email address.
 * @returns {string} A signed JWT access token valid for 15 minutes.
 */
export function generateAccessToken(user) {
   const payload = {
      id: user._id,
      email: user.email,
   };

   return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "15m" });
}

/**
 * Generate a new refresh token with an expiration date.
 *
 * @param {number} [expiryDays=7] - Number of days until the refresh token expires.
 * @returns {{ token: string, tokenId: string, expiresAt: Date }} An object containing the generated refresh token, its identifier prefix, and expiration date.
 */
export function generateRefreshToken(expiryDays = 7) {
   const token = crypto.randomBytes(64).toString("hex");
   const tokenId = token.substring(0, 32);
   const expiresAt = new Date();
   expiresAt.setDate(expiresAt.getDate() + expiryDays);
   return { token, tokenId, expiresAt };
}

/**
 * Verify a JWT access token.
 *
 * @param {string} token - The JWT access token to verify.
 * @returns {Object} The decoded token payload containing user information.
 * @throws {Error} Throws if the token is invalid or expired.
 */
export function verifyAccessToken(token) {
   return jwt.verify(token, process.env.JWT_SECRET);
}

/**
 * Rotate a refresh token by validating the old token, checking expiration,
 * and issuing a new access token and refresh token.
 *
 * @param {string} oldToken - The old refresh token to rotate.
 * @returns {Promise<{ user: Object, accessToken: string, refreshToken: string }>}
 *          Returns the user object, a new access token, and a new refresh token.
 * @throws {Error} Throws if the old token is invalid or expired.
 */
export async function rotateRefreshToken(oldToken) {
   // Extract tokenId (first 32 chars) for efficient indexed lookup
   const tokenId = oldToken.substring(0, 32);

   // Query user by indexed tokenId instead of scanning all users
   const userFound = await User.findOne({
      "refreshToken.tokenId": tokenId,
   }).select("+refreshToken");

   if (!userFound || !userFound.refreshToken) {
      throw new Error("Invalid refresh token");
   }

   // Verify the token hash matches
   const isValidToken = await verifyToken(oldToken, userFound.refreshToken.token);
   if (!isValidToken) {
      throw new Error("Invalid refresh token");
   }

   // Check expiration
   if (new Date() > userFound.refreshToken.expiresAt) {
      userFound.refreshToken = null;
      await userFound.save();
      throw new Error("Refresh token expired");
   }

   // Generate new tokens
   const { token, tokenId: newTokenId, expiresAt } = generateRefreshToken();
   const accessToken = generateAccessToken(userFound);

   // Store hashed token and tokenId
   userFound.refreshToken = {
      token: await hashToken(token),
      tokenId: newTokenId,
      expiresAt,
   };
   await userFound.save();

   return { user: userFound, accessToken, refreshToken: token };
}

/**
 * Attach access and refresh tokens to the response headers.
 *
 * @param {import('express').Response} res - Express response object.
 * @param {string} accessToken - The JWT access token.
 * @param {string} refreshToken - The refresh token.
 */
export function attachTokensToResponse(res, accessToken, refreshToken) {
   res.setHeader("x-access-token", accessToken);
   res.setHeader("x-refresh-token", refreshToken);
}
