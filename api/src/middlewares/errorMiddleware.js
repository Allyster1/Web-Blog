export function errorMiddleware(err, req, res, next) {
  if (err.name === "MulterError") {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        message: "File too large. Maximum size is 5MB.",
        details: err,
      });
    }
    return res.status(400).json({
      message: err.message || "File upload error",
      details: err,
    });
  }

  const status = err.status || 500;

  const message =
    process.env.NODE_ENV === "production"
      ? status === 500
        ? "Internal server error"
        : err.message
      : err.message;

  const details =
    process.env.NODE_ENV === "production"
      ? undefined
      : err.stack || err.details;

  const isExpectedAuthError =
    status === 401 && req.path.includes("/auth/refresh");

  if (!isExpectedAuthError) {
    console.error("Error occurred:", {
      message: err.message,
      stack: err.stack,
      status,
      path: req.originalUrl,
      method: req.method,
      body: req.body,
    });
  }

  res.status(status).json({ message, details });
}
