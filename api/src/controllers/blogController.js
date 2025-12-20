import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { optionalAuthMiddleware } from "../middlewares/optionalAuthMiddleware.js";
import { validate } from "../middlewares/validateMiddleware.js";
import {
  uploadSingle,
  uploadToCloudinary,
} from "../middlewares/uploadMiddleware.js";
import {
  createBlogValidation,
  updateBlogValidation,
  commentValidation,
} from "../validations/blogValidation.js";
import {
  createBlog,
  getAllBlogs,
  getBlogById,
  updateBlog,
  deleteBlog,
  likeBlog,
  dislikeBlog,
  addComment,
  getUserBlogs,
} from "../services/blogService.js";

const blogController = Router();

/**
 * @swagger
 * /api/v1/blogs:
 *   get:
 *     summary: Get all blogs (catalog)
 *     tags: [Blogs]
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
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           default: createdAt
 *         description: Sort field
 *     responses:
 *       200:
 *         description: List of blogs
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
 */
blogController.get("/", async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 9;
    const sortBy = req.query.sortBy || "createdAt";

    const result = await getAllBlogs(page, limit, sortBy);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/v1/blogs/{id}:
 *   get:
 *     summary: Get blog by ID
 *     tags: [Blogs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Blog ID
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Blog details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Blog'
 *       404:
 *         description: Blog not found
 */
blogController.get("/:id", optionalAuthMiddleware, async (req, res, next) => {
  try {
    // Pass user if authenticated (for admin access to pending blogs)
    const user = req.user || null;
    const blog = await getBlogById(req.params.id, user);
    res.status(200).json(blog);
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/v1/blogs:
 *   post:
 *     summary: Create a new blog post
 *     tags: [Blogs]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - content
 *             properties:
 *               title:
 *                 type: string
 *                 example: My First Blog Post
 *               content:
 *                 type: string
 *                 example: This is the content of my blog post...
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Image file (optional)
 *     responses:
 *       201:
 *         description: Blog created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Blog'
 *       400:
 *         description: Validation error
 */
blogController.post(
  "/",
  authMiddleware,
  uploadSingle,
  createBlogValidation,
  validate,
  async (req, res, next) => {
    try {
      const { title, content } = req.body;
      let imageUrl = "";

      if (req.file) {
        // Upload to Cloudinary
        const result = await uploadToCloudinary(req.file.buffer);
        imageUrl = result.secure_url; // Use secure_url for HTTPS
      } else if (req.body.image) {
        // Use the provided URL
        imageUrl = req.body.image;
      }

      const blog = await createBlog(title, content, imageUrl, req.user.id);
      res.status(201).json(blog);
    } catch (error) {
      next(error);
    }
  }
);

/**
 * @swagger
 * /api/v1/blogs/{id}:
 *   put:
 *     summary: Update a blog post (author only)
 *     tags: [Blogs]
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
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Blog updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Blog'
 *       403:
 *         description: Not authorized to update this blog
 *       404:
 *         description: Blog not found
 */
blogController.put(
  "/:id",
  authMiddleware,
  uploadSingle,
  updateBlogValidation,
  validate,
  async (req, res, next) => {
    try {
      const { title, content } = req.body;
      const updateData = {};
      if (title) updateData.title = title;
      if (content) updateData.content = content;

      // Handle image: file upload takes precedence over URL
      if (req.file) {
        // Upload to Cloudinary
        const result = await uploadToCloudinary(req.file.buffer);
        updateData.image = result.secure_url;
      } else if (req.body.image !== undefined) {
        updateData.image = req.body.image;
      }

      const blog = await updateBlog(req.params.id, req.user.id, updateData);
      res.status(200).json(blog);
    } catch (error) {
      next(error);
    }
  }
);

/**
 * @swagger
 * /api/v1/blogs/{id}:
 *   delete:
 *     summary: Delete a blog post (author only)
 *     tags: [Blogs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Blog ID
 *     responses:
 *       200:
 *         description: Blog deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       403:
 *         description: Not authorized to delete this blog
 *       404:
 *         description: Blog not found
 */
blogController.delete("/:id", authMiddleware, async (req, res, next) => {
  try {
    // Regular users can only delete their own blogs
    const result = await deleteBlog(req.params.id, req.user.id, false);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/v1/blogs/{id}/like:
 *   post:
 *     summary: Like a blog post
 *     tags: [Blogs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Blog ID
 *     responses:
 *       200:
 *         description: Blog liked successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Blog'
 */
blogController.post("/:id/like", authMiddleware, async (req, res, next) => {
  try {
    const blog = await likeBlog(req.params.id, req.user.id);
    res.status(200).json(blog);
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/v1/blogs/{id}/dislike:
 *   post:
 *     summary: Dislike a blog post (remove like)
 *     tags: [Blogs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Blog ID
 *     responses:
 *       200:
 *         description: Blog disliked successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Blog'
 */
blogController.post("/:id/dislike", authMiddleware, async (req, res, next) => {
  try {
    const blog = await dislikeBlog(req.params.id, req.user.id);
    res.status(200).json(blog);
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/v1/blogs/{id}/comments:
 *   post:
 *     summary: Add a comment to a blog post
 *     tags: [Blogs]
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
 *               - content
 *             properties:
 *               content:
 *                 type: string
 *                 example: Great post!
 *     responses:
 *       201:
 *         description: Comment added successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Blog'
 */
blogController.post(
  "/:id/comments",
  authMiddleware,
  commentValidation,
  validate,
  async (req, res, next) => {
    try {
      const { content } = req.body;
      const blog = await addComment(req.params.id, req.user.id, content);
      res.status(201).json(blog);
    } catch (error) {
      next(error);
    }
  }
);

/**
 * @swagger
 * /api/v1/blogs/user/my-blogs:
 *   get:
 *     summary: Get current user's blog posts
 *     tags: [Blogs]
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
 *         description: User's blog posts
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
 */
blogController.get("/user/my-blogs", authMiddleware, async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const result = await getUserBlogs(req.user.id, page, limit);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

export default blogController;
