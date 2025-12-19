import logger from "../utils/logger.js";

/**
 * Validates that all required environment variables are present
 * @throws {Error} If any required environment variables are missing
 */
export function validateEnvVars() {
  const isProduction = process.env.NODE_ENV === "production";
  const missing = [];
  const warnings = [];

  // Required in all environments
  const required = [
    "JWT_SECRET",
    "CLOUDINARY_CLOUD_NAME",
    "CLOUDINARY_API_KEY",
    "CLOUDINARY_API_SECRET",
  ];

  // Required only in production
  const requiredInProduction = ["MONGODB_URI"];

  // Check required variables
  for (const varName of required) {
    if (!process.env[varName] || process.env[varName].trim() === "") {
      missing.push(varName);
    }
  }

  // Check production-only requirements
  if (isProduction) {
    for (const varName of requiredInProduction) {
      if (!process.env[varName] || process.env[varName].trim() === "") {
        missing.push(varName);
      }
    }
  } else {
    // In development, warn if production vars are missing (for testing)
    for (const varName of requiredInProduction) {
      if (!process.env[varName] || process.env[varName].trim() === "") {
        warnings.push(varName);
      }
    }
  }

  if (
    isProduction &&
    (!process.env.FRONTEND_URL || process.env.FRONTEND_URL.trim() === "")
  ) {
    warnings.push(
      "FRONTEND_URL is not set in production. CORS will allow all origins. Set this when you have a domain."
    );
  }

  // Validate JWT_SECRET length (should be at least 32 characters for security)
  if (process.env.JWT_SECRET && process.env.JWT_SECRET.length < 32) {
    warnings.push(
      "JWT_SECRET should be at least 32 characters long for security"
    );
  }

  // Validate MongoDB URI format
  if (process.env.MONGODB_URI) {
    const mongoUri = process.env.MONGODB_URI;
    if (
      !mongoUri.startsWith("mongodb://") &&
      !mongoUri.startsWith("mongodb+srv://")
    ) {
      warnings.push("MONGODB_URI format appears invalid");
    }
  }

  // Log warnings
  if (warnings.length > 0) {
    logger.warn("Environment variable warnings:", { warnings });
  }

  // Throw error if required variables are missing
  if (missing.length > 0) {
    const errorMessage = `Missing required environment variables: ${missing.join(
      ", "
    )}`;
    logger.error(errorMessage);
    throw new Error(errorMessage);
  }

  logger.info("Environment variables validated successfully");
}
