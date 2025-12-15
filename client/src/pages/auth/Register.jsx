import InputField from "../../components/ui/InputField";
import { Link, useNavigate } from "react-router";
import useControlledFormHook from "../../hooks/useControllerForm";
import { register } from "../../services/authService";

export default function Register() {
   const navigate = useNavigate();

   const registerHandler = async (values) => {
      try {
         const result = await register(values);

         localStorage.setItem("accessToken", result.accessToken);
         navigate("/");
      } catch (err) {
         console.error(err.message);
      }
   };

   const { values, changeHandler, submitHandler } = useControlledFormHook({ email: "", password: "" }, registerHandler);
   return (
      <form className="flex flex-col gap-6" onSubmit={submitHandler}>
         <h1 className="font-bold text-3xl md:text-4xl text-[#171923]">Sign up</h1>

         <InputField
            label="E-mail"
            id="email"
            name="email"
            type="email"
            placeholder="example@email.com"
            autoComplete="email"
            required
            values={values.email}
            onChange={changeHandler}
         />
         <InputField
            label="Password"
            id="password"
            name="password"
            type="password"
            placeholder="******"
            autoComplete="password"
            required
            values={values.password}
            onChange={changeHandler}
         />

         <InputField
            label="Confirm Password"
            id="rePass"
            name="rePass"
            type="password"
            placeholder="******"
            autoComplete="rePass"
            required
            values={values.rePass}
            onChange={changeHandler}
         />

         <input
            type="submit"
            className="bg-[#1C4532] text-[#F7FAFC] font-semibold text-1g leading-5 py-3 border rounded-4xl"
            value="Sign up"
         />

         <p className="text-[#718096] text-sm text-center">
            Already have an account?
            <Link to="/auth/login" className="underline text-[#1C4532] ml-1">
               Create now
            </Link>
         </p>
      </form>
   );
}
