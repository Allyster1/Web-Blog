import { Router } from "express";
import { getHealthStatus } from "../services/healthService.js";

const healthController = Router();

healthController.get("/", async (req, res, next) => {
  try {
    const healthStatus = await getHealthStatus();
    const statusCode = healthStatus.status === "healthy" ? 200 : 503;
    res.status(statusCode).json(healthStatus);
  } catch (error) {
    next(error);
  }
});
export default healthController;
