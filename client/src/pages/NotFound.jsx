import { Link } from "react-router";
import Button from "../components/ui/Button";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="text-center max-w-md">
        <h1 className="text-9xl font-bold text-[#212121] mb-4">404</h1>
        <h2 className="text-3xl font-bold text-[#212121] mb-4">
          Page Not Found
        </h2>
        <p className="text-[#718096] text-lg mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link to="/">
          <Button variant="primary">Go Home</Button>
        </Link>
      </div>
    </div>
  );
}
