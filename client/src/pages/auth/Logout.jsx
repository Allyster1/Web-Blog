import { useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { logout } from "../../services/authService";
import { useAuth } from "../../hooks/useAuth";
import LoadingScreen from "../../components/ui/LoadingScreen";

export default function Logout() {
  const navigate = useNavigate();
  const { accessToken, logout: clearAuth, isAuthenticated } = useAuth();
  const abortControllerRef = useRef(null);

  useEffect(() => {
    if (!isAuthenticated || !accessToken) {
      navigate("/");
      return;
    }

    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;

    const performLogout = async () => {
      try {
        await logout(accessToken, signal);
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Logout error:", error);
        }
      } finally {
        if (!signal.aborted) {
          clearAuth();
          navigate("/");
        }
      }
    };

    performLogout();

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [accessToken, clearAuth, navigate, isAuthenticated]);

  return <LoadingScreen message="Logging out..." />;
}
