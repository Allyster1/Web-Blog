import { Router } from "express";

const userController = Router();

// Register
userController.post("/register", async (req, res) => {
  res.send("register");

  res.end();
});

// Login
userController.post("/login", async (req, res) => {
  res.send("login");

  res.end();
});

// Logout
userController.post("/logout", async (req, res) => {
  res.send("logout");

  res.end();
});

export default userController;
