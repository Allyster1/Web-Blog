// API Base URL configuration
// Uses environment variable or defaults to Render API URL
const getApiBaseUrl = () => {
  // Check if VITE_API_URL is set (for local backend testing)
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }

  // In production (Netlify/Vercel), use the Render API URL
  if (import.meta.env.PROD) {
    return "https://ovardov99-web-blog-api.onrender.com";
  }

  // In development, use Render API URL (or set VITE_API_URL for local backend)
  return "https://ovardov99-web-blog-api.onrender.com";
};

export const API_BASE_URL = getApiBaseUrl();

// Debug: Log the API URL being used (remove in production)
if (import.meta.env.DEV) {
  console.log("API Base URL:", API_BASE_URL || "(empty - using relative URLs)");
}
