import { Router } from "express";
import userController from "../controllers/userController.js";

const router = Router();

router.use("/api/v1/auth", userController);

app.get("/health", (req, res) => res.json({ status: "ok" }));

export default router;
