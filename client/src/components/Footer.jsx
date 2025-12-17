import ContainerLayout from "../layouts/ContainerLayout";
import HeaderLogo from "./ui/HeaderLogo";
import { Link } from "react-router";
import { FaGithub, FaLinkedin } from "react-icons/fa";

export default function Footer() {
   return (
      <footer className="bg-[#2f5d3f] text-white border-t border-white/10">
         <ContainerLayout className="py-12 md:py-16">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
               {/* Logo & Brand Section */}
               <div className="flex flex-col items-center md:items-start text-center md:text-left">
                  <HeaderLogo />
                  <div className="mt-4 space-y-1 text-sm text-gray-300">
                     <p>Sofia, Bulgaria</p>
                     <a href="mailto:myemail" className="hover:text-white transition-colors inline-block">
                        ovardovslav@gmail.com
                     </a>
                  </div>
               </div>

               {/* Quick Links Section */}
               <div className="flex flex-col items-center md:items-start text-center md:text-left">
                  <h3 className="font-semibold text-base mb-4">Quick Links</h3>
                  <nav className="flex flex-col gap-3 text-sm">
                     <Link to="/" className="text-gray-300 hover:text-white transition-colors">
                        Home
                     </Link>
                     <Link to="/write" className="text-gray-300 hover:text-white transition-colors">
                        Write
                     </Link>
                  </nav>
               </div>

               {/* Connect Section */}
               <div className="flex flex-col items-center md:items-start text-center md:text-left">
                  <h3 className="font-semibold text-base mb-4">Social Links</h3>
                  <div className="flex gap-4 text-2xl">
                     <a
                        href="https://github.com/Allyster1"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-300 hover:text-white transition-colors"
                        aria-label="GitHub"
                     >
                        <FaGithub />
                     </a>
                     <a
                        href="https://linkedin.com/in/yourprofile"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-300 hover:text-white transition-colors"
                        aria-label="LinkedIn"
                     >
                        <FaLinkedin />
                     </a>
                  </div>
                  <p className="mt-4 text-sm text-gray-300">Follow us for updates and insights</p>
               </div>
            </div>
         </ContainerLayout>

         {/* Bottom Copyright Section */}
         <div className="border-t border-white/10 bg-[#264831]">
            <ContainerLayout className="py-4">
               <p className="text-center text-sm text-gray-400">
                  © {new Date().getFullYear()} Allyster1. All rights reserved.
               </p>
            </ContainerLayout>
         </div>
      </footer>
   );
}
