import "dotenv/config";
import express from "express";
import corsMiddleware from "./config/cors.js";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import helmet from "helmet";

import { validateEnvVars } from "./config/envValidation.js";
import connectDB from "./config/database.js";
import router from "./config/routes.js";
import { globalRateLimiter } from "./middlewares/rateLimiters/globalRateLimiter.js";
import {
  requestTimeout,
  setServerTimeouts,
} from "./middlewares/timeoutMiddleware.js";
import { errorMiddleware } from "./middlewares/errorMiddleware.js";
import logger from "./utils/logger.js";
import { setupProcessHandlers, setServer } from "./utils/gracefulShutdown.js";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./config/swagger.js";

setupProcessHandlers();

try {
  validateEnvVars();
} catch (error) {
  console.error("❌ Environment variable validation failed:");
  console.error(error.message);
  console.error(
    "\nPlease check your .env file and ensure all required variables are set."
  );
  process.exit(1);
}

const PORT = process.env.PORT || 5000;

const app = express();

await connectDB();

app.use(helmet.hsts({ maxAge: 63072000, includeSubDomains: true }));

app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

app.use(corsMiddleware);

app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: false, limit: "10kb" }));

app.use(cookieParser());

app.use(requestTimeout(30000)); // 30 seconds

// Swagger API Documentation
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(globalRateLimiter);
app.use(router);
app.use(errorMiddleware);

const server = app.listen(PORT, () =>
  logger.info(`Server is running on http://localhost:${PORT}`)
);

// Set server-level timeouts for additional protection
setServerTimeouts(server, 31000); // 31 seconds (slightly higher than request timeout)

// Register server instance for graceful shutdown
setServer(server);
