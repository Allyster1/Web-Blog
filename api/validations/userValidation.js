import { body } from "express-validator";

export const registerValidation = [
   body("email").isEmail().withMessage("Invalid email format"),
   body("password")
      .isLength({ min: 8 })
      .withMessage("Password must be at least 8 characters")
      .matches(/[A-Z]/)
      .withMessage("Password must contain an uppercase letter")
      .matches(/[a-z]/)
      .withMessage("Password must contain a lowercase letter")
      .matches(/\d/)
      .withMessage("Password must contain a number")
      .matches(/[@$!%*?&]/)
      .withMessage("Password must contain a special character"),
   body("rePass")
      .exists()
      .withMessage("Confirm password is required")
      .custom((value, { req }) => value === req.body.password)
      .withMessage("Passwords do not match"),
];

export const loginValidation = [
   body("email").isEmail().withMessage("Invalid email format"),
   body("password").notEmpty().withMessage("Password is required"),
];
