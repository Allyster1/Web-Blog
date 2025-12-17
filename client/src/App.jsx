import { Routes, Route } from "react-router";
import AuthLayout from "./layouts/AuthLayout";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Logout from "./pages/auth/Logout";
import BlogLayout from "./layouts/BlogLayout";
import AuthGuard from "./components/guards/AuthGuard";
import GuestGuard from "./components/guards/GuestGuard";
import Write from "./pages/Write";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<BlogLayout />}></Route>

      <Route element={<AuthGuard />}>
        <Route path="/write" element={<Write />} />
      </Route>

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
