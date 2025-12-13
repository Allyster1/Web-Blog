import { Router } from "express";
import userController from "../controllers/userController.js";

const router = Router();

router.use("/api/v1/auth", userController);

export default router;
