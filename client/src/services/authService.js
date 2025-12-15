const BASE_URL = "http://localhost:5000/api/v1/auth";

export async function login({ email, password }) {
   const response = await fetch(`${BASE_URL}/login`, {
      method: "POST",
      headers: {
         "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ email, password }),
   });

   if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || "Login failed");
   }

   return response.json(); // { accessToken }
}

export async function register({ email, password, rePass }) {
   const response = await fetch(`${BASE_URL}/register`, {
      method: "POST",
      headers: {
         "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ email, password, rePass }),
   });

   if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || "Register failed");
   }

   return response.json(); // { accessToken }
}

export async function logout(accessToken) {
   const response = await fetch(`${BASE_URL}/logout`, {
      method: "POST",
      headers: {
         Authorization: `Bearer ${accessToken}`,
      },
      credentials: "include",
   });

   if (!response.ok) {
      throw new Error("Logout failed");
   }

   return response.json();
}
