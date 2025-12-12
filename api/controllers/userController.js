import { Router } from "express";
import { register, login, logout, refreshUserToken } from "../services/userService.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const userController = Router();

userController.post("/register", async (req, res) => {
   try {
      const { email, password, rePass } = req.body;
      const tokens = await register(email, password, rePass);

      res.status(201).json(tokens);
   } catch (error) {
      res.status(400).json({ error: error.message });
   }
});

userController.post("/login", async (req, res) => {
   try {
      const { email, password } = req.body;
      const tokens = await login(email, password);

      res.status(200).json(tokens);
   } catch (error) {
      res.status(401).json({ error: error.message });
   }
});

userController.post("/logout", authMiddleware, async (req, res) => {
   try {
      await logout(req.user.id);
      res.status(200).json({ message: "Logout successful" });
   } catch (error) {
      res.status(500).json({ error: error.message });
   }
});

userController.post("/refresh", async (req, res) => {
   try {
      const { token } = req.body;
      const tokens = await refreshUserToken(token);
      res.status(200).json(tokens);
   } catch (error) {
      res.status(401).json({ error: error.message });
   }
});

export default userController;
