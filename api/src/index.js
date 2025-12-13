import "dotenv/config";
import express from "express";
import corsMiddleware from "./config/cors.js";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import helmet from "helmet";

import connectDB from "./config/database.js";
import router from "./config/routes.js";
import { globalRateLimiter } from "./middlewares/rateLimiters/globalRateLimiter.js";
import { errorMiddleware } from "./middlewares/errorMiddleware.js";

const app = express();

await connectDB();

app.use(helmet());

app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

app.use(corsMiddleware);

app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: false, limit: "10kb" }));

app.use(cookieParser());

app.use(globalRateLimiter);
app.use(router);
app.use(errorMiddleware);

app.listen(process.env.PORT, () => console.log(`Server is running on http://localhost:${process.env.PORT}`));
