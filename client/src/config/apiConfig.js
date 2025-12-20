// API Base URL configuration
// Uses environment variable or defaults based on environment
const getApiBaseUrl = () => {
  // Check if VITE_API_URL is explicitly set (highest priority)
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }

  // In production (Netlify/Vercel), use the Render API URL
  if (import.meta.env.PROD) {
    return "https://ovardov99-web-blog-api.onrender.com";
  }

  // In development, default to local backend
  // You can override by setting VITE_API_URL in .env file
  return "http://localhost:5000";
};

export const API_BASE_URL = getApiBaseUrl();

// Debug: Log the API URL being used (remove in production)
if (import.meta.env.DEV) {
  console.log("API Base URL:", API_BASE_URL || "(empty - using relative URLs)");
}
