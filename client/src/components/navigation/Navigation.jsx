import { useState } from "react";

export default function Navigation() {
   const [isOpen, setIsOpen] = useState(false);

   return (
      <>
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

         <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden flex flex-col gap-1 cursor-pointer"
            aria-label="Toggle menu"
         >
            <span className="w-6 h-0.5 bg-[#ffffff] block"></span>
            <span className="w-6 h-0.5 bg-[#ffffff] block"></span>
            <span className="w-6 h-0.5 bg-[#ffffff] block"></span>
         </button>
         {/* TODO: fix hamburget functionality */}
      </>
   );
}
