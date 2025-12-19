import "dotenv/config";
import express from "express";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import corsMiddleware from "./config/cors.js";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import helmet from "helmet";

import connectDB from "./config/database.js";
import router from "./config/routes.js";
import { globalRateLimiter } from "./middlewares/rateLimiters/globalRateLimiter.js";
import { errorMiddleware } from "./middlewares/errorMiddleware.js";
import logger from "./utils/logger.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const PORT = process.env.PORT || 5000;

const app = express();

await connectDB();

app.use(helmet.hsts({ maxAge: 63072000, includeSubDomains: true }));

app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

app.use(corsMiddleware);

app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: false, limit: "10kb" }));

app.use(cookieParser());

// Remove local uploads serving - images are now served from Cloudinary
// app.use("/uploads", express.static(join(__dirname, "uploads")));

app.use(globalRateLimiter);
app.use(router);
app.use(errorMiddleware);

app.listen(PORT, () =>
  logger.info(`Server is running on http://localhost:${PORT}`)
);
