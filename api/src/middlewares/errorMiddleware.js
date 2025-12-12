export function errorMiddleware(err, req, res, next) {
   const status = err.status || 500;

   const message =
      process.env.NODE_ENV === "production" ? (status === 500 ? "Internal server error" : err.message) : err.message;

   const details = process.env.NODE_ENV === "production" ? undefined : err.stack || err.details;

   //   console.error("Error occurred:", {
   //     message: err.message,
   //     stack: err.stack,
   //     status,
   //     path: req.originalUrl,
   //     method: req.method,
   //     body: req.body,
   //   });

   res.status(status).json({ message, details });
}
