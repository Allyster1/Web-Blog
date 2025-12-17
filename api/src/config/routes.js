import { Router } from "express";
import userController from "../controllers/userController.js";
import blogController from "../controllers/blogController.js";

const router = Router();

router.use("/api/v1/auth", userController);
router.use("/api/v1/blogs", blogController);

export default router;
