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
import { attachTokensToResponse } from "../utils/tokenUtils.js";

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

      attachTokensToResponse(res, accessToken, refreshToken);

      res.status(201).json({ accessToken });
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
    const isProduction = process.env.NODE_ENV === "production";
    const clearCookieOptions = {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "None" : "Lax",
      path: "/",
      ...(isProduction &&
        process.env.COOKIE_DOMAIN && { domain: process.env.COOKIE_DOMAIN }),
    };

    try {
      const { email, password } = req.body;
      const { accessToken, refreshToken } = await login(email, password);

      // Clear any old cookie before setting a new one
      res.clearCookie("refreshToken", clearCookieOptions);
      attachTokensToResponse(res, accessToken, refreshToken);

      res.status(200).json({ accessToken });
    } catch (error) {
      next(error);
    }
  }
);

userController.post("/logout", authMiddleware, async (req, res, next) => {
  try {
    await logout(req.user.id);

    const isProduction = process.env.NODE_ENV === "production";
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "None" : "Lax",
      path: "/",
      ...(isProduction &&
        process.env.COOKIE_DOMAIN && { domain: process.env.COOKIE_DOMAIN }),
    });

    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    next(error);
  }
});

userController.post("/refresh", refreshRateLimiter, async (req, res, next) => {
  const isProduction = process.env.NODE_ENV === "production";
  const clearCookieOptions = {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "None" : "Lax",
    path: "/",
    ...(isProduction &&
      process.env.COOKIE_DOMAIN && { domain: process.env.COOKIE_DOMAIN }),
  };

  try {
    const refreshToken = req.cookies?.refreshToken || req.body?.refreshToken;

    if (!refreshToken) {
      // Clear any stale cookie
      res.clearCookie("refreshToken", clearCookieOptions);
      return res.status(401).json({ message: "Refresh token missing" });
    }

    const tokens = await refreshUserToken(refreshToken);

    // Clear the old cookie first, then set the new one to ensure proper update
    res.clearCookie("refreshToken", clearCookieOptions);

    attachTokensToResponse(res, tokens.accessToken, tokens.refreshToken);

    res.status(200).json({ accessToken: tokens.accessToken });
  } catch (error) {
    // Clear invalid/stale cookie on error
    res.clearCookie("refreshToken", clearCookieOptions);
    next(error);
  }
});

export default userController;
