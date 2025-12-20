import jwt from "jsonwebtoken";
import crypto from "crypto";
import User from "../models/User.js";
import bcrypt from "bcrypt";
import { UnauthorizedError } from "../utils/AppError.js";

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
    role: user.role || "user",
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
  // Validate token exists and has minimum length
  if (!oldToken || typeof oldToken !== "string" || oldToken.length < 32) {
    throw new UnauthorizedError("Invalid refresh token");
  }

  // Extract tokenId (first 32 chars) for efficient indexed lookup
  const tokenId = oldToken.substring(0, 32);

  // Query user by indexed tokenId instead of scanning all users
  const userFound = await User.findOne({
    "refreshToken.tokenId": tokenId,
  }).select("+refreshToken");

  if (!userFound || !userFound.refreshToken || !userFound.refreshToken.token) {
    throw new UnauthorizedError("Invalid refresh token");
  }

  // Verify the token hash matches
  const isValidToken = await verifyToken(
    oldToken,
    userFound.refreshToken.token
  );
  if (!isValidToken) {
    throw new UnauthorizedError("Invalid refresh token");
  }

  // Check expiration
  if (new Date() > userFound.refreshToken.expiresAt) {
    userFound.refreshToken = null;
    await userFound.save();
    throw new UnauthorizedError("Invalid refresh token");
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
 * Attach access and refresh tokens to the response.
 *
 * @param {import('express').Response} res - Express response object.
 * @param {string} accessToken - The JWT access token.
 * @param {string} refreshToken - The refresh token.
 */

const isProduction = process.env.NODE_ENV === "production";

/**
 * Get cookie options for refresh token (used for both setting and clearing)
 * @param {import('express').Request} [req] - Optional request object to detect origin
 * @returns {Object} Cookie options object
 */
export function getRefreshTokenCookieOptions(req = null) {
  // Check if request is from localhost (development frontend)
  const isLocalhostOrigin =
    req?.headers?.origin &&
    (req.headers.origin.includes("localhost") ||
      req.headers.origin.includes("127.0.0.1"));

  // For localhost origins, use Lax and non-secure (works with HTTP)
  // For production origins, use None and secure (requires HTTPS)
  const options = {
    httpOnly: true,
    secure: isProduction && !isLocalhostOrigin, // Secure only in production with non-localhost
    sameSite: isLocalhostOrigin ? "Lax" : isProduction ? "None" : "Lax",
    path: "/",
  };

  if (isProduction && process.env.COOKIE_DOMAIN && !isLocalhostOrigin) {
    options.domain = process.env.COOKIE_DOMAIN;
  }

  return options;
}

export function attachTokensToResponse(
  res,
  accessToken,
  refreshToken,
  req = null
) {
  res.setHeader("x-access-token", accessToken);

  const cookieOptions = {
    ...getRefreshTokenCookieOptions(req),
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  };

  res.cookie("refreshToken", refreshToken, cookieOptions);

  // For localhost development: also return refreshToken in response body
  // This allows frontend to store it in localStorage when cookies don't work cross-origin
  const isLocalhostOrigin =
    req?.headers?.origin &&
    (req.headers.origin.includes("localhost") ||
      req.headers.origin.includes("127.0.0.1"));

  if (isLocalhostOrigin) {
    res.setHeader("x-refresh-token", refreshToken);
  }
}
