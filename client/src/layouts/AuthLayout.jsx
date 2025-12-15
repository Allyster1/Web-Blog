import { Outlet } from "react-router";
import Header from "../components/Header";

export default function AuthLayout() {
   return (
      <>
         <Header className="hidden md:flex" />
         <div className="min-h-screen flex items-center justify-center pt-16 px-4">
            <section className="w-full max-w-md md:max-w-lg">
               <Outlet />
            </section>
         </div>
      </>
   );
}
