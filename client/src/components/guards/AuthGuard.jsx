import { Navigate, Outlet } from "react-router";
import { useAuth } from "../../hooks/useAuth";
import LoadingScreen from "../ui/LoadingScreen";

export default function AuthGuard() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }

  return <Outlet />;
}
