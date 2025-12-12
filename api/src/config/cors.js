import cors from "cors";

const whitelist =
   process.env.NODE_ENV === "production"
      ? [process.env.FRONTEND_URL] // e.g. https://myfrontend.com
      : ["http://localhost:5173"]; // dev environment

const corsMiddleware = cors({
   origin: function (origin, callback) {
      if (!origin) return callback(null, true); // allow server-to-server & Postman

      if (whitelist.includes(origin)) {
         return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
   },
   credentials: true,
   methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
   allowedHeaders: ["Content-Type", "Authorization"],
   exposedHeaders: ["Content-Length"],
   preflightContinue: false,
   optionsSuccessStatus: 204,
});

export default corsMiddleware;
