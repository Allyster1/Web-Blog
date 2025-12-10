import logo from "../assets/logo.svg";
import Navigation from "./navigation/Navigation";

export default function Header() {
   return (
      <header className="bg-[#087f5b] border-b border-gray-200 text-white">
         <div className="max-w-7xl mx-auto px-7 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
               <img src={logo} alt="site-logo" className="w-8 h-8" />
               <h2 className="font-bold text-lg ml-1">Web Blog</h2>
            </div>

            <Navigation />
         </div>

         {/* Mobile Menu Dropdown */}
         {/* <nav
            className={`md:hidden  ${
               isOpen ? "max-h-96" : "max-h-0"
            } overflow-hidden bg-gray-50 border-t border-gray-200 transition-all duration-300`}
         >
            <ul className="flex flex-col gap-4 px-7 py-4">
               <li>
                  <a href="#" className="text-sm text-black hover:text-[#ced4da] block">
                     Articles
                  </a>
               </li>
               <li>
                  <a href="#" className="text-sm text-black hover:text-[#ced4da] block">
                     Write
                  </a>
               </li>
               <li>
                  <a href="#" className="text-sm text-black hover:text-[#ced4da] block">
                     About
                  </a>
               </li>
               <li>
                  <a href="#" className="text-sm text-black hover:text-[#ced4da] block">
                     Register
                  </a>
               </li>
               <li>
                  <a href="#" className="text-sm text-black hover:text-[#ced4da] block">
                     Login
                  </a>
               </li>
            </ul>
         </nav> */}
      </header>
   );
}
