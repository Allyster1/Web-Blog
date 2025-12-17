const BASE_URL = "http://localhost:5000/api/v1/auth";

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
    // Extract validation error messages from details array if present
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

  return response.json();
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

  return response.json();
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

  return response.json();
}

export async function refreshAccessToken(signal = undefined) {
  const response = await fetch(`${BASE_URL}/refresh`, {
    method: "POST",
    credentials: "include",
    signal,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    const authError = new Error(error.message || "Failed to refresh token");
    authError.status = response.status;
    throw authError;
  }

  return response.json();
}
