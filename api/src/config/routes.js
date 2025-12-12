import { Router } from "express";
import userController from "../../controllers/userController.js";

const router = Router();

router.use("/api/auth/users", userController);

export default router;
