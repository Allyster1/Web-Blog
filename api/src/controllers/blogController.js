import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { validate } from "../middlewares/validateMiddleware.js";
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

blogController.get("/:id", async (req, res, next) => {
  try {
    const blog = await getBlogById(req.params.id);
    res.status(200).json(blog);
  } catch (error) {
    next(error);
  }
});

blogController.post(
  "/",
  authMiddleware,
  createBlogValidation,
  validate,
  async (req, res, next) => {
    try {
      const { title, content, image } = req.body;
      const blog = await createBlog(title, content, image, req.user.id);
      res.status(201).json(blog);
    } catch (error) {
      next(error);
    }
  }
);

blogController.put(
  "/:id",
  authMiddleware,
  updateBlogValidation,
  validate,
  async (req, res, next) => {
    try {
      const { title, content, image } = req.body;
      const updateData = {};
      if (title) updateData.title = title;
      if (content) updateData.content = content;
      if (image !== undefined) updateData.image = image;

      const blog = await updateBlog(req.params.id, req.user.id, updateData);
      res.status(200).json(blog);
    } catch (error) {
      next(error);
    }
  }
);

blogController.delete("/:id", authMiddleware, async (req, res, next) => {
  try {
    const result = await deleteBlog(req.params.id, req.user.id);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

blogController.post("/:id/like", authMiddleware, async (req, res, next) => {
  try {
    const blog = await likeBlog(req.params.id, req.user.id);
    res.status(200).json(blog);
  } catch (error) {
    next(error);
  }
});

blogController.post("/:id/dislike", authMiddleware, async (req, res, next) => {
  try {
    const blog = await dislikeBlog(req.params.id, req.user.id);
    res.status(200).json(blog);
  } catch (error) {
    next(error);
  }
});

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
