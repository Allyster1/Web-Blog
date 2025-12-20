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

userController.post(
  "/login",
  authRateLimiter,
  loginValidation,
  validate,
  async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const { accessToken, refreshToken } = await login(email, password);

      attachTokensToResponse(res, accessToken, refreshToken, req);

      // For localhost: include refreshToken in response body (for localStorage fallback)
      const isLocalhostOrigin =
        req?.headers?.origin &&
        (req.headers.origin.includes("localhost") ||
          req.headers.origin.includes("127.0.0.1"));

      res.status(200).json({
        accessToken,
        ...(isLocalhostOrigin && { refreshToken }),
      });
    } catch (error) {
      next(error);
    }
  }
);

userController.post("/logout", authMiddleware, async (req, res, next) => {
  try {
    await logout(req.user.id);

    res.clearCookie("refreshToken", getRefreshTokenCookieOptions(req));

    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    next(error);
  }
});

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
