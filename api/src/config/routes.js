import { Router } from "express";
import userController from "../controllers/userController.js";
import blogController from "../controllers/blogController.js";
import healthController from "../controllers/healthController.js";

const router = Router();

router.use("/api/v1/auth", userController);
router.use("/api/v1/blogs", blogController);
router.use("/api/v1/health", healthController);

export default router;
