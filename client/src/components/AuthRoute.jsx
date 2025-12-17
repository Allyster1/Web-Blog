import { Navigate } from "react-router";
import { useAuth } from "../hooks/useAuth";
import LoadingSpinner from "./ui/LoadingSpinner";

export default function AuthRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <LoadingSpinner size="lg" />
          <p className="text-[#718096] text-sm font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
}
