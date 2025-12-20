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

  const response = await fetch(`${BASE_URL}/refresh`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    signal,
    // Send refresh token in body if available (fallback when cookies don't work cross-origin)
    body: refreshTokenFromStorage
      ? JSON.stringify({ refreshToken: refreshTokenFromStorage })
      : undefined,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));

    if (response.status === 401 && error.message === "Refresh token missing") {
      // Clear both cookie and localStorage
      try {
        document.cookie =
          "refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      } catch (e) {
        // Ignore cookie clearing errors
      }
      localStorage.removeItem("refreshToken");
      return null;
    }

    if (response.status === 401) {
      // Clear both cookie and localStorage
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
  if (data.refreshToken) {
    localStorage.setItem("refreshToken", data.refreshToken);
  }

  return data;
}
