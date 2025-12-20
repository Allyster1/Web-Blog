import { useState, useEffect } from "react";
import { AuthContext } from "./authContextValue";
import { refreshAccessToken } from "../services/authService";

export function AuthProvider({ children }) {
  const [accessToken, setAccessToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const abortController = new AbortController();

    const initializeAuth = async () => {
      try {
        const data = await refreshAccessToken(abortController.signal);

        if (abortController.signal.aborted) {
          return;
        }

        if (data && data.accessToken) {
          setAccessToken(data.accessToken);
          setIsAuthenticated(true);
        } else {
          setAccessToken(null);
          setIsAuthenticated(false);
        }
      } catch (error) {
        if (error.name === "AbortError") {
          return;
        }
        if (error.status === 401) {
          setAccessToken(null);
          setIsAuthenticated(false);
        } else {
          setAccessToken(null);
          setIsAuthenticated(false);
        }
      } finally {
        if (!abortController.signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    initializeAuth();

    return () => {
      abortController.abort();
    };
  }, []);

  const login = (token) => {
    setAccessToken(token);
    setIsAuthenticated(true);
  };

  const logout = () => {
    setAccessToken(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{
        accessToken,
        isAuthenticated,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
