import logo from "../assets/logo.svg";
import Navigation from "./navigation/Navigation";

export default function Header() {
   return (
      <header className="bg-[#087f5b] border-b border-gray-200 text-white">
         <div className="relative max-w-7xl mx-auto px-7 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
               <a className="cursor-pointer" href="/">
                  <img src={logo} alt="site-logo" className="w-8 h-8" />
               </a>

               <h2 className="font-bold text-lg ml-1">Web Blog</h2>
            </div>

            <Navigation />
         </div>
      </header>
   );
}
