/**
 * Handle network errors consistently
 * @param {Error} error - The error object
 * @param {string} defaultMessage - Default error message
 * @returns {Error} Error with user-friendly message
 */
export function handleNetworkError(
  error,
  defaultMessage = "An error occurred"
) {
  if (error instanceof TypeError && error.message.includes("fetch")) {
    return new Error(
      "Unable to connect to the server. Please ensure the API server is running."
    );
  }

  if (error.message) {
    return error;
  }

  return new Error(defaultMessage);
}
