import cors from "cors";

const whitelist = ["http://localhost:5173", "https://your-production-fe.com"];

const corsMiddleware = cors({
   origin: function (origin, callback) {
      if (!origin) return callback(null, true); // allows Postman / server-to-server
      if (whitelist.includes(origin)) return callback(null, true);
      return callback(new Error("Not allowed by CORS"));
   },
   credentials: true,
   methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
});

export default corsMiddleware;
