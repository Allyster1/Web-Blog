/**
 * Decode JWT token without verification (client-side only)
 * Note: This does not verify the token signature. Verification should be done server-side.
 * @param {string} token - JWT token
 * @returns {Object|null} Decoded token payload or null if invalid
 */
export function decodeToken(token) {
  if (!token) return null;

  try {
    const base64Url = token.split(".")[1];
    if (!base64Url) return null;

    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );

    return JSON.parse(jsonPayload);
  } catch (error) {
    return null;
  }
}

/**
 * Get user ID from JWT token
 * @param {string} token - JWT access token
 * @returns {string|null} User ID or null if not found
 */
export function getUserIdFromToken(token) {
  const decoded = decodeToken(token);
  return decoded?.id || null;
}

/**
 * Get user role from JWT token
 * @param {string} token - JWT access token
 * @returns {string|null} User role or null if not found
 */
export function getUserRoleFromToken(token) {
  const decoded = decodeToken(token);
  return decoded?.role || null;
}

/**
 * Get user email from JWT token
 * @param {string} token - JWT access token
 * @returns {string|null} User email or null if not found
 */
export function getUserEmailFromToken(token) {
  const decoded = decodeToken(token);
  return decoded?.email || null;
}
