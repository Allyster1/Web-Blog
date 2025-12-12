import cors from "cors";

const whitelist =
  process.env.NODE_ENV === "production"
    ? [process.env.FRONTEND_URL]
    : ["http://localhost:5173"];

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
