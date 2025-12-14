import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/myBlog_dev";

export default async function connectDB() {
   try {
      await mongoose.connect(MONGODB_URI);
      console.log("MongoDB connected successfully!");
   } catch (error) {
      console.error(error);
      process.exit(1);
   }
}
