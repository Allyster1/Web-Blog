import { Routes, Route } from "react-router";
import AuthLayout from "./layouts/AuthLayout";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import BlogLayout from "./layouts/BlogLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import AuthRoute from "./components/AuthRoute";
import Write from "./pages/Write";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<BlogLayout />}></Route>
      <Route path="/auth" element={<AuthLayout />}>
        <Route
          path="login"
          element={
            <AuthRoute>
              <Login />
            </AuthRoute>
          }
        />
        <Route
          path="register"
          element={
            <AuthRoute>
              <Register />
            </AuthRoute>
          }
        />
      </Route>
      <Route
        path="/write"
        element={
          <ProtectedRoute>
            <Write />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
