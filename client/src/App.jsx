import { Routes, Route } from "react-router";
import AuthLayout from "./layouts/AuthLayout";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Logout from "./pages/auth/Logout";
import BlogLayout from "./layouts/BlogLayout";
import AuthGuard from "./components/guards/AuthGuard";
import AdminGuard from "./components/guards/AdminGuard";
import GuestGuard from "./components/guards/GuestGuard";
import Write from "./pages/Write";
import Edit from "./pages/Edit";
import BlogDetail from "./pages/BlogDetail";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<BlogLayout />}></Route>

      <Route element={<AuthGuard />}>
        <Route path="/write" element={<Write />} />
        <Route path="/edit/:id" element={<Edit />} />
      </Route>

      <Route element={<AdminGuard />}>
        <Route path="/admin" element={<AdminDashboard />} />
      </Route>

      <Route path="/blog/:id" element={<BlogDetail />} />

      <Route path="/auth" element={<AuthLayout />}>
        <Route element={<GuestGuard />}>
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
        </Route>
        <Route element={<AuthGuard />}>
          <Route path="logout" element={<Logout />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
