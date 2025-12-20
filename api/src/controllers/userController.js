import { Router } from "express";
import {
  register,
  login,
  logout,
  refreshUserToken,
} from "../services/userService.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import {
  registerValidation,
  loginValidation,
} from "../validations/userValidation.js";
import { validate } from "../middlewares/validateMiddleware.js";
import { authRateLimiter } from "../middlewares/rateLimiters/authRateLimiter.js";
import { refreshRateLimiter } from "../middlewares/rateLimiters/refreshRateLimiter.js";
import {
  attachTokensToResponse,
  getRefreshTokenCookieOptions,
} from "../utils/tokenUtils.js";

const userController = Router();

/**
 * @swagger
 * /api/v1/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - fullName
 *               - email
 *               - password
 *               - rePass
 *             properties:
 *               fullName:
 *                 type: string
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: password123
 *               rePass:
 *                 type: string
 *                 format: password
 *                 example: password123
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
userController.post(
  "/register",
  authRateLimiter,
  registerValidation,
  validate,
  async (req, res, next) => {
    try {
      const { fullName, email, password, rePass } = req.body;
      const { accessToken, refreshToken } = await register(
        fullName,
        email,
        password,
        rePass
      );

      attachTokensToResponse(res, accessToken, refreshToken, req);

      // For localhost: include refreshToken in response body (for localStorage fallback)
      const isLocalhostOrigin =
        req?.headers?.origin &&
        (req.headers.origin.includes("localhost") ||
          req.headers.origin.includes("127.0.0.1"));

      res.status(201).json({
        accessToken,
        ...(isLocalhostOrigin && { refreshToken }),
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * @swagger
 * /api/v1/auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: password123
 *               rememberMe:
 *                 type: boolean
 *                 example: false
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *       401:
 *         description: Invalid credentials
 */
userController.post(
  "/login",
  authRateLimiter,
  loginValidation,
  validate,
  async (req, res, next) => {
    try {
      const { email, password, rememberMe = false } = req.body;
      const { accessToken, refreshToken, expiryDays } = await login(
        email,
        password,
        rememberMe
      );

      attachTokensToResponse(res, accessToken, refreshToken, req, expiryDays);

      // For localhost: include refreshToken in response body (for localStorage fallback)
      const isLocalhostOrigin =
        req?.headers?.origin &&
        (req.headers.origin.includes("localhost") ||
          req.headers.origin.includes("127.0.0.1"));

      res.status(200).json({
        accessToken,
        ...(isLocalhostOrigin && { refreshToken, expiryDays }),
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * @swagger
 * /api/v1/auth/logout:
 *   post:
 *     summary: Logout user
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logout successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Logout successful
 */
userController.post("/logout", authMiddleware, async (req, res, next) => {
  try {
    await logout(req.user.id);

    res.clearCookie("refreshToken", getRefreshTokenCookieOptions(req));

    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/v1/auth/refresh:
 *   post:
 *     summary: Refresh access token
 *     tags: [Authentication]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 description: Refresh token (if not in cookie)
 *     responses:
 *       200:
 *         description: Token refreshed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *       401:
 *         description: Invalid or expired refresh token
 */
userController.post("/refresh", refreshRateLimiter, async (req, res, next) => {
  const cookieOptions = getRefreshTokenCookieOptions(req);

  try {
    const refreshToken = req.cookies?.refreshToken || req.body?.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({ message: "Refresh token missing" });
    }

    const tokens = await refreshUserToken(refreshToken);

    attachTokensToResponse(res, tokens.accessToken, tokens.refreshToken, req);

    // For localhost: include refreshToken in response body (for localStorage fallback)
    const isLocalhostOrigin =
      req?.headers?.origin &&
      (req.headers.origin.includes("localhost") ||
        req.headers.origin.includes("127.0.0.1"));

    res.status(200).json({
      accessToken: tokens.accessToken,
      ...(isLocalhostOrigin && { refreshToken: tokens.refreshToken }),
    });
  } catch (error) {
    res.clearCookie("refreshToken", cookieOptions);
    next(error);
  }
});

export default userController;
