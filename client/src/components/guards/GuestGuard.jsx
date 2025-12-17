import { Navigate, Outlet } from "react-router";
import { useAuth } from "../../hooks/useAuth";
import LoadingScreen from "../ui/LoadingScreen";

export default function GuestGuard() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
