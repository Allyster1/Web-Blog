import { Routes, Route } from "react-router";
import AuthLayout from "./layouts/AuthLayout";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

function App() {
   return (
      <Routes>
         <Route path="/auth" element={<AuthLayout />}>
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            {/* // <Route path="forgot-password" element={<ForgotPassword /> */}
         </Route>
      </Routes>
   );
}

export default App;
