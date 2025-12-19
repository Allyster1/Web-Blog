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

  // If image is a file, append it. Otherwise, append as URL string
  if (blogData.image instanceof File) {
    formData.append("image", blogData.image);
  } else if (blogData.image && typeof blogData.image === "string") {
    formData.append("image", blogData.image);
  }

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
}
