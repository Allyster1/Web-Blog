/**
 * Format date to a readable string
 * @param {string|Date} dateString - Date string or Date object
 * @param {Object} options - Intl.DateTimeFormat options
 * @returns {string} Formatted date string
 */
export function formatDate(dateString, options = {}) {
  if (!dateString) return "";

  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "";

  const defaultOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
    ...options,
  };

  return date.toLocaleDateString("en-US", defaultOptions);
}

/**
 * Format date with time
 * @param {string|Date} dateString - Date string or Date object
 * @returns {string} Formatted date with time
 */
export function formatDateTime(dateString) {
  return formatDate(dateString, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * Format date for blog posts (short format)
 * @param {string|Date} dateString - Date string or Date object
 * @returns {string} Formatted date (e.g., "Jan 15, 2024")
 */
export function formatBlogDate(dateString) {
  return formatDate(dateString, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
