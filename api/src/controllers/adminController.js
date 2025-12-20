import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { adminMiddleware } from "../middlewares/adminMiddleware.js";
import { getPendingBlogs, updateBlogStatus } from "../services/blogService.js";

const adminController = Router();

/**
 * @swagger
 * /api/v1/admin/pending-blogs:
 *   get:
 *     summary: Get all pending blogs (admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 9
 *         description: Items per page
 *     responses:
 *       200:
 *         description: List of pending blogs
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 blogs:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Blog'
 *                 pagination:
 *                   $ref: '#/components/schemas/Pagination'
 *       403:
 *         description: Admin access required
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
 * @swagger
 * /api/v1/admin/blogs/{id}/status:
 *   patch:
 *     summary: Approve or reject a blog post (admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Blog ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [approved, rejected]
 *                 example: approved
 *     responses:
 *       200:
 *         description: Blog status updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 blog:
 *                   $ref: '#/components/schemas/Blog'
 *       403:
 *         description: Admin access required
 *       404:
 *         description: Blog not found
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

export default adminController;
