import { Routes, Route } from "react-router";
import AuthLayout from "./layouts/AuthLayout";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import BlogLayout from "./layouts/BlogLayout";

function App() {
   return (
      <Routes>
         <Route path="/" element={<BlogLayout />}></Route>
         <Route path="/auth" element={<AuthLayout />}>
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            {/* <Route path="logout" logoutFunction /> */}
            {/* // <Route path="forgot-password" element={<ForgotPassword /> */}
         </Route>
      </Routes>
   );
}

export default App;
