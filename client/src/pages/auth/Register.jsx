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

  const registerHandler = async (values) => {
    setError("");
    try {
      const result = await register(values);
      setAuthToken(result.accessToken);
      navigate("/");
    } catch (err) {
      setError(err.message || "Registration failed. Please try again.");
    }
  };

  const { values, changeHandler, submitHandler } = useControlledFormHook(
    { fullName: "", email: "", password: "", rePass: "" },
    registerHandler
  );
  return (
    <form className="flex flex-col gap-6" onSubmit={submitHandler}>
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
      />

      <input
        type="submit"
        className="bg-[#53946c] cursor-pointer text-[#F7FAFC] font-semibold text-1g leading-5 py-3 border rounded-4xl hover:bg-[#3a795b]"
        value="Sign up"
      />

      <p className="text-[#718096] text-sm text-center">
        Already have an account?
        <Link to="/auth/login" className="underline text-[#1C4532] ml-1">
          Login now
        </Link>
      </p>
    </form>
  );
}
