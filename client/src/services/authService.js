import { API_BASE_URL } from "../config/apiConfig.js";

const BASE_URL = `${API_BASE_URL}/api/v1/auth`;

export async function login({ email, password }, signal = undefined) {
  const response = await fetch(`${BASE_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    signal,
    body: JSON.stringify({ email, password }),
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
        firstError.msg || firstError.message || "Validation failed"
      );
    }
    throw new Error(error.message || "Login failed");
  }

  const data = await response.json();

  // Store refresh token in localStorage for localhost development (cross-origin cookie fallback)
  // Check both response body and header
  const refreshToken =
    data.refreshToken || response.headers.get("x-refresh-token");
  if (refreshToken) {
    localStorage.setItem("refreshToken", refreshToken);
  }

  return data;
}

export async function register(
  { fullName, email, password, rePass },
  signal = undefined
) {
  const response = await fetch(`${BASE_URL}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    signal,
    body: JSON.stringify({ fullName, email, password, rePass }),
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
        firstError.msg || firstError.message || "Validation failed"
      );
    }
    throw new Error(error.message || "Register failed");
  }

  const data = await response.json();

  // Store refresh token in localStorage for localhost development (cross-origin cookie fallback)
  // Check both response body and header
  const refreshToken =
    data.refreshToken || response.headers.get("x-refresh-token");
  if (refreshToken) {
    localStorage.setItem("refreshToken", refreshToken);
  }

  return data;
}

export async function logout(accessToken, signal = undefined) {
  const response = await fetch(`${BASE_URL}/logout`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    credentials: "include",
    signal,
  });

  if (!response.ok) {
    throw new Error("Logout failed");
  }

  // Clear refresh token from localStorage on logout
  localStorage.removeItem("refreshToken");

  return response.json();
}

export async function refreshAccessToken(signal = undefined) {
  // Get refresh token from localStorage (for localhost cross-origin fallback)
  const refreshTokenFromStorage = localStorage.getItem("refreshToken");

  // Build request options
  const requestOptions = {
    method: "POST",
    credentials: "include",
    signal,
  };

  // Only include body and Content-Type if we have a refreshToken in localStorage
  // Otherwise, rely on cookies (for production)
  if (refreshTokenFromStorage) {
    requestOptions.headers = {
      "Content-Type": "application/json",
    };
    requestOptions.body = JSON.stringify({
      refreshToken: refreshTokenFromStorage,
    });
  }

  const response = await fetch(`${BASE_URL}/refresh`, requestOptions);

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));

    if (response.status === 401 && error.message === "Refresh token missing") {
      try {
        document.cookie =
          "refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      } catch (_) {
        // Ignore cookie clearing errors
      }
      localStorage.removeItem("refreshToken");
      return null;
    }

    if (response.status === 401) {
      try {
        document.cookie =
          "refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      } catch (e) {
        // Ignore cookie clearing errors
      }
      localStorage.removeItem("refreshToken");
    }

    const authError = new Error(error.message || "Failed to refresh token");
    authError.status = response.status;
    throw authError;
  }

  const data = await response.json();

  // Update refresh token in localStorage if provided (for localhost)
  const refreshToken =
    data.refreshToken || response.headers.get("x-refresh-token");
  if (refreshToken) {
    localStorage.setItem("refreshToken", refreshToken);
  }

  return data;
}
