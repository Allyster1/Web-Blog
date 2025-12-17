import { Schema, model } from "mongoose";

const blogSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required!"],
      trim: true,
      minLength: [3, "Title must be at least 3 characters"],
      maxLength: [200, "Title must not exceed 200 characters"],
    },
    content: {
      type: String,
      required: [true, "Content is required!"],
      trim: true,
      minLength: [10, "Content must be at least 10 characters"],
    },
    image: {
      type: String,
      trim: true,
      default: "",
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Author is required!"],
    },
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    dislikes: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    comments: [
      {
        user: {
          type: Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        content: {
          type: String,
          required: true,
          trim: true,
          minLength: [1, "Comment cannot be empty"],
          maxLength: [500, "Comment must not exceed 500 characters"],
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

blogSchema.index({ author: 1, createdAt: -1 });
blogSchema.index({ createdAt: -1 });

const Blog = model("Blog", blogSchema);

export default Blog;
