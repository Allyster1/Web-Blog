import { API_BASE_URL } from "../config/apiConfig.js";
import { handleNetworkError } from "../utils/errorUtils.js";

const BASE_URL = `${API_BASE_URL}/api/v1/blogs`;

/**
 * Get all blogs with optional sorting and pagination
 * @param {number} page - Page number (default: 1)
 * @param {number} limit - Number of blogs per page (default: 9)
 * @param {string} sortBy - Sort field (default: "createdAt")
 * @returns {Promise<Object>} Blogs data with pagination
 */
export async function getAllBlogs(page = 1, limit = 9, sortBy = "createdAt") {
  try {
    const response = await fetch(
      `${BASE_URL}?page=${page}&limit=${limit}&sortBy=${sortBy}`,
      {
        method: "GET",
        credentials: "include",
      }
    );

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || "Failed to fetch blogs");
    }

    return response.json();
  } catch (error) {
    throw handleNetworkError(error, "Failed to fetch blogs");
  }
}

/**
 * Create a new blog post
 * @param {Object} blogData - Blog data { title, content, image (optional file or URL) }
 * @param {string} accessToken - Authentication token
 * @returns {Promise<Object>} Created blog
 */
export async function createBlog(blogData, accessToken) {
  const formData = new FormData();
  formData.append("title", blogData.title);
  formData.append("content", blogData.content);

  if (blogData.image) {
    if (blogData.image instanceof File) {
      formData.append("image", blogData.image);
    } else if (
      typeof blogData.image === "string" &&
      blogData.image.trim() !== ""
    ) {
      formData.append("image", blogData.image);
    }
  }

  try {
    const response = await fetch(`${BASE_URL}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      credentials: "include",
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      if (
        error.details &&
        Array.isArray(error.details) &&
        error.details.length > 0
      ) {
        const firstError = error.details[0];
        throw new Error(
          firstError.msg || firstError.message || "Failed to create blog"
        );
      }
      throw new Error(error.message || "Failed to create blog");
    }

    return response.json();
  } catch (error) {
    // Handle network errors (connection refused, reset, etc.)
    if (error instanceof TypeError && error.message.includes("fetch")) {
      throw new Error(
        "Unable to connect to the server. Please ensure the API server is running."
      );
    }
    // Re-throw other errors
    throw error;
  }
}

/**
 * Get a blog by ID
 * @param {string} blogId - Blog ID
 * @param {string} accessToken - Optional access token (for admin access to pending blogs)
 * @returns {Promise<Object>} Blog data
 */
export async function getBlogById(blogId, accessToken = null) {
  try {
    const headers = {};
    if (accessToken) {
      headers.Authorization = `Bearer ${accessToken}`;
    }

    const response = await fetch(`${BASE_URL}/${blogId}`, {
      method: "GET",
      headers,
      credentials: "include",
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || "Failed to fetch blog");
    }

    return response.json();
  } catch (error) {
    throw handleNetworkError(error, "Failed to fetch blogs");
  }
}

/**
 * Update an existing blog post
 * @param {string} blogId - Blog ID
 * @param {Object} blogData - Blog data { title, content, image (optional file or URL) }
 * @param {string} accessToken - Authentication token
 * @returns {Promise<Object>} Updated blog
 */
export async function updateBlog(blogId, blogData, accessToken) {
  const formData = new FormData();
  formData.append("title", blogData.title);
  formData.append("content", blogData.content);

  if (blogData.image) {
    if (blogData.image instanceof File) {
      formData.append("image", blogData.image);
    } else if (
      typeof blogData.image === "string" &&
      blogData.image.trim() !== ""
    ) {
      formData.append("image", blogData.image);
    }
  }

  try {
    const response = await fetch(`${BASE_URL}/${blogId}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      credentials: "include",
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      if (
        error.details &&
        Array.isArray(error.details) &&
        error.details.length > 0
      ) {
        const firstError = error.details[0];
        throw new Error(
          firstError.msg || firstError.message || "Failed to update blog"
        );
      }
      throw new Error(error.message || "Failed to update blog");
    }

    return response.json();
  } catch (error) {
    throw handleNetworkError(error, "Failed to fetch blogs");
  }
}

/**
 * Delete a blog post
 * @param {string} blogId - Blog ID
 * @param {string} accessToken - Authentication token
 * @returns {Promise<Object>} Deletion confirmation
 */
export async function deleteBlog(blogId, accessToken) {
  try {
    const response = await fetch(`${BASE_URL}/${blogId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      credentials: "include",
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || "Failed to delete blog");
    }

    return response.json();
  } catch (error) {
    throw handleNetworkError(error, "Failed to fetch blogs");
  }
}

/**
 * Like a blog post
 * @param {string} blogId - Blog ID
 * @param {string} accessToken - Authentication token
 * @returns {Promise<Object>} Updated blog
 */
export async function likeBlog(blogId, accessToken) {
  try {
    const response = await fetch(`${BASE_URL}/${blogId}/like`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      credentials: "include",
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || "Failed to like blog");
    }

    return response.json();
  } catch (error) {
    throw handleNetworkError(error, "Failed to fetch blogs");
  }
}

/**
 * Dislike a blog post
 * @param {string} blogId - Blog ID
 * @param {string} accessToken - Authentication token
 * @returns {Promise<Object>} Updated blog
 */
export async function dislikeBlog(blogId, accessToken) {
  try {
    const response = await fetch(`${BASE_URL}/${blogId}/dislike`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      credentials: "include",
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || "Failed to dislike blog");
    }

    return response.json();
  } catch (error) {
    throw handleNetworkError(error, "Failed to fetch blogs");
  }
}

/**
 * Add a comment to a blog post
 * @param {string} blogId - Blog ID
 * @param {string} content - Comment content
 * @param {string} accessToken - Authentication token
 * @returns {Promise<Object>} Updated blog
 */
export async function addComment(blogId, content, accessToken) {
  try {
    const response = await fetch(`${BASE_URL}/${blogId}/comments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      credentials: "include",
      body: JSON.stringify({ content }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      if (
        error.details &&
        Array.isArray(error.details) &&
        error.details.length > 0
      ) {
        const firstError = error.details[0];
        throw new Error(
          firstError.msg || firstError.message || "Failed to add comment"
        );
      }
      throw new Error(error.message || "Failed to add comment");
    }

    return response.json();
  } catch (error) {
    throw handleNetworkError(error, "Failed to fetch blogs");
  }
}

/**
 * Get all blogs by the logged-in user
 * @param {number} page - Page number (default: 1)
 * @param {number} limit - Number of blogs per page (default: 10)
 * @param {string} accessToken - Authentication token
 * @returns {Promise<Object>} User's blogs data with pagination
 */
export async function getUserBlogs(page = 1, limit = 10, accessToken) {
  try {
    const response = await fetch(
      `${BASE_URL}/user/my-blogs?page=${page}&limit=${limit}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        credentials: "include",
      }
    );

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || "Failed to fetch your blogs");
    }

    return response.json();
  } catch (error) {
    throw handleNetworkError(error, "Failed to fetch blogs");
  }
}
