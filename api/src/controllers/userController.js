import { Router } from "express";
import { register, login, logout, refreshUserToken } from "../services/userService.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { registerValidation, loginValidation } from "../validations/userValidation.js";
import { validate } from "../middlewares/validateMiddleware.js";
import { authRateLimiter } from "../middlewares/rateLimiters/authRateLimiter.js";
import { refreshRateLimiter } from "../middlewares/rateLimiters/refreshRateLimiter.js";
import { attachTokensToResponse } from "../utils/tokenUtils.js";

const userController = Router();

userController.post("/register", authRateLimiter, registerValidation, validate, async (req, res, next) => {
   try {
      const { email, password, rePass } = req.body;
      const tokens = await register(email, password, rePass);

      res.status(201).json(tokens);
   } catch (error) {
      next(error);
   }
});

userController.post("/login", authRateLimiter, loginValidation, validate, async (req, res, next) => {
   try {
      const { email, password } = req.body;
      const tokens = await login(email, password);

      res.status(200).json(tokens);
   } catch (error) {
      next(error);
   }
});

userController.post("/logout", authMiddleware, async (req, res, next) => {
   try {
      await logout(req.user.id);
      res.status(200).json({ message: "Logout successful" });
   } catch (error) {
      next(error);
   }
});

userController.post("/refresh", refreshRateLimiter, async (req, res, next) => {
   try {
      const refreshToken = req.cookies?.refreshToken;

      if (!refreshToken) {
         return res.status(401).json({ message: "Refresh token missing" });
      }

      const tokens = await refreshUserToken(refreshToken);
      attachTokensToResponse(res, tokens.accessToken, tokens.refreshToken);

      res.status(200).json({ accessToken: tokens.accessToken });
   } catch (error) {
      next(error);
   }
});

export default userController;
