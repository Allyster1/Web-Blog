import { useState } from "react";
import logo from "../assets/logo.svg";

export default function Header() {
   const [isOpen, setIsOpen] = useState(false);

   return (
      <header className="bg-[#087f5b] border-b border-gray-200 text-white">
         <div className="max-w-7xl mx-auto px-7 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
               <img src={logo} alt="site-logo" className="w-8 h-8" />
               <h2 className="font-bold text-lg ml-1">Web Blog</h2>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex">
               <ul className="flex gap-7">
                  <li>
                     <a href="#" className="text-sm hover:text-[#ced4da] hover:underline">
                        Articles
                     </a>
                  </li>
                  <li>
                     <a href="#" className="text-sm hover:text-[#ced4da] hover:underline">
                        Write
                     </a>
                  </li>
                  <li>
                     <a href="#" className="text-sm hover:text-[#ced4da] hover:underline">
                        About
                     </a>
                  </li>
                  <li>
                     <a href="#" className="text-sm hover:text-[#ced4da] hover:underline">
                        Register
                     </a>
                  </li>
                  <li>
                     <a href="#" className="text-sm hover:text-[#ced4da] hover:underline">
                        Login
                     </a>
                  </li>
               </ul>
            </nav>

            {/* Mobile Hamburger Menu */}
            <button
               onClick={() => setIsOpen(!isOpen)}
               className="md:hidden flex flex-col gap-1 cursor-pointer"
               aria-label="Toggle menu"
            >
               <span className="w-6 h-0.5 bg-[#ffffff] block"></span>
               <span className="w-6 h-0.5 bg-[#ffffff] block"></span>
               <span className="w-6 h-0.5 bg-[#ffffff] block"></span>
            </button>
         </div>

         {/* Mobile Menu Dropdown */}
         <nav
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
         </nav>
      </header>
   );
}
