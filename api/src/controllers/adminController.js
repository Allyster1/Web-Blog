import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { adminMiddleware } from "../middlewares/adminMiddleware.js";
import {
  getPendingBlogs,
  getRejectedBlogs,
  updateBlogStatus,
  deleteBlog,
} from "../services/blogService.js";

const adminController = Router();

/**
 * GET /api/v1/admin/pending-blogs
 * Get all pending blogs that need approval
 */
adminController.get(
  "/pending-blogs",
  authMiddleware,
  adminMiddleware,
  async (req, res, next) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 9;
      const result = await getPendingBlogs(page, limit);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
);

/**
 * PATCH /api/v1/admin/blogs/:id/status
 * Approve or reject a blog
 * Body: { status: "approved" | "rejected" }
 */
adminController.patch(
  "/blogs/:id/status",
  authMiddleware,
  adminMiddleware,
  async (req, res, next) => {
    try {
      const { status } = req.body;

      if (!status) {
        return res.status(400).json({
          error: "Status is required",
          message: "Please provide a status field in the request body",
        });
      }

      if (!["approved", "rejected"].includes(status)) {
        return res.status(400).json({
          error: "Invalid status",
          message: "Status must be either 'approved' or 'rejected'",
        });
      }

      const blog = await updateBlogStatus(req.params.id, status);
      res.status(200).json({
        message: `Blog ${status} successfully`,
        blog,
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * GET /api/v1/admin/rejected-blogs
 * Get all rejected blogs
 */
adminController.get(
  "/rejected-blogs",
  authMiddleware,
  adminMiddleware,
  async (req, res, next) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 9;
      const result = await getRejectedBlogs(page, limit);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
);

/**
 * DELETE /api/v1/admin/blogs/:id
 * Delete a blog (admin only - can delete any blog)
 */
adminController.delete(
  "/blogs/:id",
  authMiddleware,
  adminMiddleware,
  async (req, res, next) => {
    try {
      const result = await deleteBlog(req.params.id, req.user.id, true);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
);

export default adminController;
