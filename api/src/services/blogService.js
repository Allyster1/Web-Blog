import Blog from "../models/Blog.js";
import User from "../models/User.js";
import { BadRequestError, ForbiddenError } from "../utils/AppError.js";

export async function createBlog(title, content, image, authorId) {
  const author = await User.findById(authorId);
  if (!author) {
    throw new BadRequestError("Author not found");
  }

  const blog = await Blog.create({
    title,
    content,
    image: image || "",
    author: authorId,
    likes: [],
    dislikes: [],
    comments: [],
  });

  return await Blog.findById(blog._id).populate("author", "fullName email");
}

export async function getAllBlogs(page = 1, limit = 9, sortBy = "createdAt") {
  const skip = (page - 1) * limit;
  const sortOptions = {
    createdAt: -1,
    updatedAt: -1,
    title: 1,
  };

  const sort = sortOptions[sortBy] || sortOptions.createdAt;

  const blogs = await Blog.find()
    .populate("author", "fullName email")
    .populate("likes", "fullName")
    .populate("dislikes", "fullName")
    .populate("comments.user", "fullName email")
    .sort({ [sortBy]: sort === 1 ? 1 : -1 })
    .skip(skip)
    .limit(limit);

  const total = await Blog.countDocuments();

  return {
    blogs,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  };
}

export async function getBlogById(blogId) {
  const blog = await Blog.findById(blogId)
    .populate("author", "fullName email")
    .populate("likes", "fullName email")
    .populate("dislikes", "fullName email")
    .populate("comments.user", "fullName email");

  if (!blog) {
    throw new BadRequestError("Blog not found");
  }

  return blog;
}

export async function updateBlog(blogId, userId, updateData) {
  const blog = await Blog.findById(blogId);

  if (!blog) {
    throw new BadRequestError("Blog not found");
  }

  if (blog.author.toString() !== userId.toString()) {
    throw new ForbiddenError("You can only edit your own blogs");
  }

  Object.assign(blog, updateData);
  await blog.save();

  return await Blog.findById(blogId)
    .populate("author", "fullName email")
    .populate("likes", "fullName")
    .populate("dislikes", "fullName")
    .populate("comments.user", "fullName email");
}

export async function deleteBlog(blogId, userId) {
  const blog = await Blog.findById(blogId);

  if (!blog) {
    throw new BadRequestError("Blog not found");
  }

  if (blog.author.toString() !== userId.toString()) {
    throw new ForbiddenError("You can only delete your own blogs");
  }

  await Blog.findByIdAndDelete(blogId);
  return { message: "Blog deleted successfully" };
}

export async function likeBlog(blogId, userId) {
  const blog = await Blog.findById(blogId);

  if (!blog) {
    throw new BadRequestError("Blog not found");
  }

  const hasLiked = blog.likes.some((id) => id.toString() === userId.toString());
  const hasDisliked = blog.dislikes.some(
    (id) => id.toString() === userId.toString()
  );

  if (hasLiked) {
    blog.likes = blog.likes.filter((id) => id.toString() !== userId.toString());
  } else {
    blog.likes.push(userId);
    if (hasDisliked) {
      blog.dislikes = blog.dislikes.filter(
        (id) => id.toString() !== userId.toString()
      );
    }
  }

  await blog.save();
  return await Blog.findById(blogId)
    .populate("author", "fullName email")
    .populate("likes", "fullName email")
    .populate("dislikes", "fullName email")
    .populate("comments.user", "fullName email");
}

export async function dislikeBlog(blogId, userId) {
  const blog = await Blog.findById(blogId);

  if (!blog) {
    throw new BadRequestError("Blog not found");
  }

  const hasLiked = blog.likes.some((id) => id.toString() === userId.toString());
  const hasDisliked = blog.dislikes.some(
    (id) => id.toString() === userId.toString()
  );

  if (hasDisliked) {
    blog.dislikes = blog.dislikes.filter(
      (id) => id.toString() !== userId.toString()
    );
  } else {
    blog.dislikes.push(userId);
    if (hasLiked) {
      blog.likes = blog.likes.filter(
        (id) => id.toString() !== userId.toString()
      );
    }
  }

  await blog.save();
  return await Blog.findById(blogId)
    .populate("author", "fullName email")
    .populate("likes", "fullName email")
    .populate("dislikes", "fullName email")
    .populate("comments.user", "fullName email");
}

export async function addComment(blogId, userId, content) {
  const blog = await Blog.findById(blogId);

  if (!blog) {
    throw new BadRequestError("Blog not found");
  }

  blog.comments.push({
    user: userId,
    content,
  });

  await blog.save();
  return await Blog.findById(blogId)
    .populate("author", "fullName email")
    .populate("likes", "fullName email")
    .populate("dislikes", "fullName email")
    .populate("comments.user", "fullName email");
}

export async function getUserBlogs(userId, page = 1, limit = 10) {
  const skip = (page - 1) * limit;

  const blogs = await Blog.find({ author: userId })
    .populate("author", "fullName email")
    .populate("likes", "fullName")
    .populate("dislikes", "fullName")
    .populate("comments.user", "fullName email")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Blog.countDocuments({ author: userId });

  return {
    blogs,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  };
}
