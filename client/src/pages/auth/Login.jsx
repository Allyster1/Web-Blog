import { useState, useEffect, useRef } from "react";
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
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const abortControllerRef = useRef(null);

  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const loginHandler = async (values) => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;

    setError("");
    setIsLoading(true);
    try {
      const result = await login({ ...values, rememberMe }, signal);
      if (!signal.aborted) {
        setAuthToken(result.accessToken);
        navigate("/");
      }
    } catch (err) {
      if (err.name !== "AbortError" && !signal.aborted) {
        setError(err.message || "Login failed. Please check your credentials.");
        setIsLoading(false);
        throw err;
      }
      if (err.name === "AbortError") {
        setIsLoading(false);
        throw err;
      }
    } finally {
      if (!signal.aborted) {
        setIsLoading(false);
      }
    }
  };

  const { values, changeHandler, submitHandler } = useControlledFormHook(
    { email: "", password: "" },
    loginHandler
  );

  return (
    <form className="flex flex-col gap-6" onSubmit={submitHandler} noValidate>
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
          <input
            type="checkbox"
            name="remember"
            id="remember"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            disabled={isLoading}
            className="cursor-pointer"
          />
          <label
            htmlFor="remember"
            className="text-[#718096] font-medium text-sm ml-0.5 cursor-pointer"
          >
            Remember Me
          </label>
        </div>
        <a href="#" className="text-[#1C4532] underline text-sm">
          Forgot Password?
        </a>
      </div>
      <button
        type="submit"
        disabled={isLoading}
        className="bg-[#53946c] text-[#F7FAFC] cursor-pointer font-semibold text-1g leading-5 py-3 border rounded-4xl hover:bg-[#3a795b] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isLoading && (
          <svg
            className="animate-spin h-5 w-5 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        )}
        {isLoading ? "Signing in..." : "Sign in"}
      </button>

      <p className="text-[#718096] text-sm text-center">
        Don't have an account?
        <Link to="/auth/register" className="underline text-[#1C4532] ml-1">
          Create now
        </Link>
      </p>
    </form>
  );
}
