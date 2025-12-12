import "dotenv/config";
import express from "express";
import corseMiddleware from "./config/cors.js";
import cookieParser from "cookie-parser";

import connectDB from "./config/database.js";
import router from "./config/routes.js";
import { globalRateLimiter } from "./middlewares/globalRateLimiter.js";
import { errorMiddleware } from "./middlewares/errorMiddleware.js";

const app = express();

await connectDB();

app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

app.use(corseMiddleware);
app.use(express.json());
app.use(cookieParser());

app.use(globalRateLimiter);
app.use(router);
app.use(errorMiddleware);

app.listen(process.env.PORT, () => console.log(`Server is running on http://localhost:${process.env.PORT}`));
