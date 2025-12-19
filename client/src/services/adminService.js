const BASE_URL = "/api/v1/admin";

/**
 * Get all pending blogs (admin only)
 * @param {number} page - Page number
 * @param {number} limit - Items per page
 * @param {string} accessToken - Authentication token
 * @returns {Promise<Object>} Pending blogs with pagination
 */
export async function getPendingBlogs(page = 1, limit = 9, accessToken) {
  const response = await fetch(
    `${BASE_URL}/pending-blogs?page=${page}&limit=${limit}`,
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
    throw new Error(error.message || "Failed to fetch pending blogs");
  }

  return response.json();
}

/**
 * Update blog status (approve or reject)
 * @param {string} blogId - Blog ID
 * @param {string} status - New status ("approved" or "rejected")
 * @param {string} accessToken - Authentication token
 * @returns {Promise<Object>} Updated blog
 */
export async function updateBlogStatus(blogId, status, accessToken) {
  const response = await fetch(`${BASE_URL}/blogs/${blogId}/status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    credentials: "include",
    body: JSON.stringify({ status }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || "Failed to update blog status");
  }

  return response.json();
}

/**
 * Get all rejected blogs (admin only)
 * @param {number} page - Page number
 * @param {number} limit - Items per page
 * @param {string} accessToken - Authentication token
 * @returns {Promise<Object>} Rejected blogs with pagination
 */
export async function getRejectedBlogs(page = 1, limit = 9, accessToken) {
  const response = await fetch(
    `${BASE_URL}/rejected-blogs?page=${page}&limit=${limit}`,
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
    throw new Error(error.message || "Failed to fetch rejected blogs");
  }

  return response.json();
}

/**
 * Delete a blog (admin only - can delete any blog)
 * @param {string} blogId - Blog ID
 * @param {string} accessToken - Authentication token
 * @returns {Promise<Object>} Deletion confirmation
 */
export async function deleteBlog(blogId, accessToken) {
  const response = await fetch(`${BASE_URL}/blogs/${blogId}`, {
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
}
