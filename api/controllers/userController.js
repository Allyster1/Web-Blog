import { Router } from "express";
import { register, login } from "../services/userService.js";

const userController = Router();

// Register
userController.post("/register", async (req, res) => {
  try {
    const { email, password, rePass } = req.body;
    const token = await register(email, password, rePass);

    res.status(201).json({ token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Login
userController.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const token = await login(email, password);

    res.status(200).json({ token });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
});

// Logout
userController.post("/logout", async (req, res) => {
  res.send("logout");

  res.end();
});

export default userController;
