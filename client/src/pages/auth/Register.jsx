import { useState } from "react";
import InputField from "../../components/ui/InputField";
import PasswordField from "../../components/ui/PasswordField";
import { Link, useNavigate } from "react-router";
import useControlledFormHook from "../../hooks/useControllerForm";
import { register } from "../../services/authService";
import { useAuth } from "../../hooks/useAuth";

export default function Register() {
  const navigate = useNavigate();
  const { login: setAuthToken } = useAuth();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const registerHandler = async (values) => {
    setError("");
    setIsLoading(true);
    try {
      const result = await register(values);
      setAuthToken(result.accessToken);
      navigate("/");
    } catch (err) {
      setError(err.message || "Registration failed. Please try again.");
      setIsLoading(false);
      throw err;
    }
  };

  const { values, changeHandler, submitHandler } = useControlledFormHook(
    { fullName: "", email: "", password: "", rePass: "" },
    registerHandler
  );
  return (
    <form className="flex flex-col gap-6" onSubmit={submitHandler} noValidate>
      <h1 className="font-bold text-3xl md:text-4xl text-[#171923]">Sign up</h1>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      <InputField
        label="Full Name"
        id="fullName"
        name="fullName"
        type="text"
        placeholder="Peter Parker"
        autoComplete="name"
        required
        value={values.fullName}
        onChange={changeHandler}
        disabled={isLoading}
      />
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
        disabled={isLoading}
      />
      <PasswordField
        label="Password"
        id="password"
        name="password"
        placeholder="******"
        autoComplete="new-password"
        required
        value={values.password}
        onChange={changeHandler}
        showStrengthInfo={true}
        disabled={isLoading}
      />

      <PasswordField
        label="Confirm Password"
        id="rePass"
        name="rePass"
        placeholder="******"
        autoComplete="new-password"
        required
        value={values.rePass}
        onChange={changeHandler}
        disabled={isLoading}
      />

      <button
        type="submit"
        disabled={isLoading}
        className="bg-[#53946c] cursor-pointer text-[#F7FAFC] font-semibold text-1g leading-5 py-3 border rounded-4xl hover:bg-[#3a795b] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
        {isLoading ? "Signing up..." : "Sign up"}
      </button>

      <p className="text-[#718096] text-sm text-center mb-8">
        Already have an account?
        <Link to="/auth/login" className="underline text-[#1C4532] ml-1">
          Login now
        </Link>
      </p>
    </form>
  );
}
