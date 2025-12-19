import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
import logger from "../utils/logger.js";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Retry configuration
const MAX_RETRIES = 3;
const INITIAL_DELAY = 500; // 0.5 seconds

/**
 * Sleep utility for retry delays
 */
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Check if an error is retryable
 * @param {Error} error - The error to check
 * @returns {boolean} True if the error is retryable
 */
function isRetryableError(error) {
  // Retry on network errors, timeouts, and rate limits
  const retryableErrors = [
    "ECONNRESET",
    "ETIMEDOUT",
    "ENOTFOUND",
    "ECONNREFUSED",
    "EAI_AGAIN",
    "rate_limit",
    "rate_limit_exceeded",
  ];

  const errorMessage = error.message?.toLowerCase() || "";
  const errorCode = error.code || error.http_code || "";

  // Check if it's a known retryable error
  return (
    retryableErrors.some(
      (retryable) =>
        errorMessage.includes(retryable) ||
        errorCode.toString().includes(retryable)
    ) ||
    // Retry on 5xx server errors
    (error.http_code >= 500 && error.http_code < 600)
  );
}

/**
 * Single upload attempt to Cloudinary
 * @param {Buffer} buffer - Image buffer to upload
 * @param {string} folder - Cloudinary folder path
 * @returns {Promise<Object>} Cloudinary upload result
 */
function attemptUpload(buffer, folder) {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: folder,
        resource_type: "image",
        transformation: [
          {
            width: 1200,
            height: 1200,
            crop: "limit",
            quality: "auto",
            fetch_format: "auto", // Auto-optimize format (WebP when supported)
          },
        ],
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );

    uploadStream.end(buffer);
  });
}

// Use memory storage (file stored in memory as Buffer)
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedMimes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/gif",
    "image/webp",
  ];

  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Invalid file type. Only JPEG, PNG, GIF, and WebP images are allowed."
      ),
      false
    );
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

/**
 * Upload Buffer to Cloudinary with retry logic
 * @param {Buffer} buffer - Image buffer to upload
 * @param {string} folder - Cloudinary folder path (default: "blog-images")
 * @returns {Promise<Object>} Cloudinary upload result
 * @throws {Error} If upload fails after all retries
 */
export async function uploadToCloudinary(buffer, folder = "blog-images") {
  let lastError = null;

  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      // Skip delay on first attempt
      if (attempt > 0) {
        const delay = INITIAL_DELAY * Math.pow(2, attempt - 1);
        logger.info(
          `Retrying Cloudinary upload (attempt ${
            attempt + 1
          }/${MAX_RETRIES}) after ${delay}ms...`
        );
        await sleep(delay);
      }

      const result = await attemptUpload(buffer, folder);

      if (attempt > 0) {
        logger.info(`Cloudinary upload succeeded on attempt ${attempt + 1}`);
      }

      return result;
    } catch (error) {
      lastError = error;

      // Check if error is retryable
      if (!isRetryableError(error)) {
        logger.error("Cloudinary upload failed with non-retryable error", {
          error: error.message,
          http_code: error.http_code,
        });
        throw error; // Don't retry on non-retryable errors
      }

      logger.warn(`Cloudinary upload attempt ${attempt + 1} failed`, {
        error: error.message,
        http_code: error.http_code,
        code: error.code,
      });

      // If this is the last attempt, don't continue
      if (attempt === MAX_RETRIES - 1) {
        break;
      }
    }
  }

  // All retries exhausted
  logger.error(`Cloudinary upload failed after ${MAX_RETRIES} attempts`, {
    error: lastError?.message,
    http_code: lastError?.http_code,
    code: lastError?.code,
  });

  throw new Error(
    `Failed to upload image to Cloudinary after ${MAX_RETRIES} attempts: ${
      lastError?.message || "Unknown error"
    }`
  );
}

export const uploadSingle = upload.single("image");
export { cloudinary };
