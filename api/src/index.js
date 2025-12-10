import express from "express";
import connectDB from "./config/database.js";
import router from "./routes.js";
import "dotenv/config";

const app = express();

await connectDB();

app.use(express.json());

app.use(router);

app.listen(process.env.PORT, () =>
  console.log(`Server is running on http://localhost:${process.env.PORT}`)
);
