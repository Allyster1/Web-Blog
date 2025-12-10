import { Outlet } from "react-router";
import Header from "../components/Header";

export default function AuthLayout() {
   return (
      <>
         <Header className="hidden md:flex" />
         <div className="flex items-center justify-center pt-16">
            <section className="font-[Inter,sans-serif] py-4 px-7 md:py-8 w-full md:max-w-md lg:max-w-lg">
               <Outlet />
            </section>
         </div>
      </>
   );
}
