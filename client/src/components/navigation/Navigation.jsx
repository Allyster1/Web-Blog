import { useState } from "react";

import ListItem from "../ui/ListItem";
import HamburgerLine from "../ui/HamburgerLine";

export default function Navigation() {
   const [isOpen, setIsOpen] = useState(false);

   return (
      <>
         <nav className="hidden md:flex">
            <ul className="flex gap-7">
               <ListItem link={"#"} text={"Articles"} />
               <ListItem link={"#"} text={"Write"} />
               <ListItem link={"#"} text={"Register"} />
               <ListItem link={"#"} text={"Login"} />
               <ListItem link={"#"} text={"Logout"} />
            </ul>
         </nav>

         <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden flex flex-col gap-1 cursor-pointer"
            aria-label="Toggle menu"
         >
            <HamburgerLine />
            <HamburgerLine />
            <HamburgerLine />
         </button>
         {/* TODO: fix hamburget functionality */}
      </>
   );
}
