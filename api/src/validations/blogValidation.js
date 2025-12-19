import { body } from "express-validator";

/**
 * Validates image URL if provided as a string
 */
const validateImageUrl = (value) => {
  if (typeof value === "string" && value.trim() !== "") {
    try {
      new URL(value);
      return true;
    } catch {
      return false;
    }
  }
  return true;
};

export const createBlogValidation = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ min: 3, max: 200 })
    .withMessage("Title must be between 3 and 200 characters"),
  body("content")
    .trim()
    .notEmpty()
    .withMessage("Content is required")
    .isLength({ min: 10 })
    .withMessage("Content must be at least 10 characters"),
  body("image")
    .optional()
    .custom(validateImageUrl)
    .withMessage("Image must be a valid URL if provided as a string"),
];

export const updateBlogValidation = [
  body("title")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Title cannot be empty")
    .isLength({ min: 3, max: 200 })
    .withMessage("Title must be between 3 and 200 characters"),
  body("content")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Content cannot be empty")
    .isLength({ min: 10 })
    .withMessage("Content must be at least 10 characters"),
  body("image")
    .optional()
    .custom(validateImageUrl)
    .withMessage("Image must be a valid URL if provided as a string"),
];

export const commentValidation = [
  body("content")
    .trim()
    .notEmpty()
    .withMessage("Comment content is required")
    .isLength({ min: 1, max: 500 })
    .withMessage("Comment must be between 1 and 500 characters"),
];
