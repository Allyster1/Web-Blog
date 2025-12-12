import "dotenv/config";
import express from "express";

import router from "./config/routes.js";
import connectDB from "./config/database.js";

const app = express();

await connectDB();

app.use(express.json());

app.use(router);

app.listen(process.env.PORT, () => console.log(`Server is running on http://localhost:${process.env.PORT}`));
