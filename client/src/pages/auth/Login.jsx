import googleLogo from "../../assets/google-logo.svg";
import facebookLogo from "../../assets/facebook-logo.svg";

import InputField from "../../components/ui/InputField";
import Divider from "../../components/ui/Divider";
import SocialButton from "../../components/ui/SocialButton";
import { Link } from "react-router";

export default function Login() {
   return (
      <form className="flex flex-col gap-6">
         <h1 className="font-bold text-3xl md:text-4xl text-[#171923]">Sign In</h1>

         <InputField
            label="E-mail"
            id="email"
            name="email"
            type="email"
            placeholder="example@email.com"
            autoComplete="email"
            required
         />
         <InputField
            label="Password"
            id="password"
            name="password"
            type="password"
            placeholder="******"
            autoComplete="password"
            required
         />

         <div className="flex justify-between">
            <div className="flex gap-2">
               <input type="checkbox" name="remember" id="remember" />
               <label htmlFor="remember" className="text-[#718096] font-medium text-sm ml-0.5">
                  Remember Me
               </label>
            </div>
            <a href="#" className="text-[#1C4532] underline text-sm">
               Forgot Password?
            </a>
         </div>
         <input
            type="submit"
            className="bg-[#1C4532] text-[#F7FAFC] cursor-pointer font-semibold text-1g leading-5 py-3 border rounded-4xl"
            value="Sign in"
         />

         <Divider />

         <div className="flex flex-col gap-4 text-[#718096]">
            <SocialButton image={googleLogo} text="Continue with Google" />
            <SocialButton image={facebookLogo} text="Continue with Facebook" />
         </div>

         <p className="text-[#718096] text-sm text-center">
            Don't have an account?
            <Link to="/auth/register" className="underline text-[#1C4532] ml-1">
               Create now
            </Link>
         </p>
      </form>
   );
}
