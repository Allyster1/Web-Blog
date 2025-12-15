import logo from "../../assets/logo.svg";
import { Link } from "react-router";

export default function HeaderLogo() {
   return (
      <div className="flex items-center gap-2">
         <Link className="cursor-pointer" to="/">
            <img src={logo} alt="site-logo" className="w-8 h-8" />
         </Link>

         <h2 className="font-bold text-lg ml-1">Web Blog</h2>
      </div>
   );
}
