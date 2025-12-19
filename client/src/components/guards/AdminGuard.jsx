import { Navigate, Outlet } from "react-router";
import { useAuth } from "../../hooks/useAuth";
import { getUserRoleFromToken } from "../../utils/tokenUtils";
import LoadingScreen from "../ui/LoadingScreen";

export default function AdminGuard() {
  const { accessToken, isLoading, isAuthenticated } = useAuth();

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated || !accessToken) {
    return <Navigate to="/auth/login" replace />;
  }

  const userRole = getUserRoleFromToken(accessToken);
  if (userRole !== "admin") {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
