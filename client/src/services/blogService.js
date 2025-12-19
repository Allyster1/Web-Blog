const BASE_URL = "/api/v1/blogs";

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
 * @returns {Promise<Object>} Blog data
 */
export async function getBlogById(blogId) {
  try {
    const response = await fetch(`${BASE_URL}/${blogId}`, {
      method: "GET",
      credentials: "include",
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || "Failed to fetch blog");
    }

    return response.json();
  } catch (error) {
    if (error instanceof TypeError && error.message.includes("fetch")) {
      throw new Error(
        "Unable to connect to the server. Please ensure the API server is running."
      );
    }
    throw error;
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
    if (error instanceof TypeError && error.message.includes("fetch")) {
      throw new Error(
        "Unable to connect to the server. Please ensure the API server is running."
      );
    }
    throw error;
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
    if (error instanceof TypeError && error.message.includes("fetch")) {
      throw new Error(
        "Unable to connect to the server. Please ensure the API server is running."
      );
    }
    throw error;
  }
}
