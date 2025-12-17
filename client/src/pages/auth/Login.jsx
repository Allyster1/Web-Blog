import { useState } from "react";
import InputField from "../../components/ui/InputField";
import PasswordField from "../../components/ui/PasswordField";
import { Link, useNavigate } from "react-router";
import useControlledFormHook from "../../hooks/useControllerForm";
import { login } from "../../services/authService";
import { useAuth } from "../../hooks/useAuth";

export default function Login() {
  const navigate = useNavigate();
  const { login: setAuthToken } = useAuth();
  const [error, setError] = useState("");

  const loginHandler = async (values) => {
    setError("");
    try {
      const result = await login(values);
      setAuthToken(result.accessToken);
      navigate("/");
    } catch (err) {
      setError(err.message || "Login failed. Please check your credentials.");
    }
  };

  const { values, changeHandler, submitHandler } = useControlledFormHook(
    { email: "", password: "" },
    loginHandler
  );

  return (
    <form className="flex flex-col gap-6" onSubmit={submitHandler}>
      <h1 className="font-bold text-3xl md:text-4xl text-[#171923]">Sign In</h1>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      <InputField
        label="E-mail"
        id="email"
        name="email"
        type="email"
        placeholder="example@email.com"
        autoComplete="email"
        required
        value={values.email}
        onChange={changeHandler}
      />
      <PasswordField
        label="Password"
        id="password"
        name="password"
        placeholder="******"
        autoComplete="current-password"
        required
        value={values.password}
        onChange={changeHandler}
      />

      <div className="flex justify-between">
        <div className="flex gap-2">
          <input type="checkbox" name="remember" id="remember" />
          <label
            htmlFor="remember"
            className="text-[#718096] font-medium text-sm ml-0.5"
          >
            Remember Me
          </label>
        </div>
        <a href="#" className="text-[#1C4532] underline text-sm">
          Forgot Password?
        </a>
      </div>
      <input
        type="submit"
        className="bg-[#53946c] text-[#F7FAFC] cursor-pointer font-semibold text-1g leading-5 py-3 border rounded-4xl hover:bg-[#3a795b]"
        value="Sign in"
      />

      <p className="text-[#718096] text-sm text-center">
        Don't have an account?
        <Link to="/auth/register" className="underline text-[#1C4532] ml-1">
          Create now
        </Link>
      </p>
    </form>
  );
}
