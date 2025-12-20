import { useState } from "react";
import ListItem from "../ui/ListItem";
import HamburgerLine from "../ui/HamburgerLine";
import { useAuth } from "../../hooks/useAuth";
import {
  getUserRoleFromToken,
  getUserEmailFromToken,
} from "../../utils/tokenUtils";
import ContainerLayout from "../../layouts/ContainerLayout";
import HeaderLogo from "../ui/HeaderLogo";

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, accessToken } = useAuth();
  const isAdmin = accessToken && getUserRoleFromToken(accessToken) === "admin";
  const userEmail = accessToken ? getUserEmailFromToken(accessToken) : null;

  return (
    <>
      <ContainerLayout className="py-4 flex items-center justify-between">
        <HeaderLogo />
        <nav className="hidden md:flex">
          <ul className="flex gap-7 items-center">
            <ListItem link={"/"} text={"Articles"} />
            {isAuthenticated && (
              <>
                <ListItem link={"/blog/write"} text={"Write"} />
                <ListItem link={"/blog/myposts"} text={"My Posts"} />
              </>
            )}
            {isAdmin && <ListItem link={"/admin"} text={"Admin"} />}
            {!isAuthenticated && (
              <>
                <ListItem link={"/auth/register"} text={"Register"} />
                <ListItem link={"/auth/login"} text={"Login"} />
              </>
            )}
            {isAuthenticated && userEmail && (
              <li className="text-white text-sm font-medium px-3 py-1.5 bg-white/10 rounded-lg border border-white/20">
                {userEmail}
              </li>
            )}
            {isAuthenticated && (
              <ListItem link={"/auth/logout"} text={"Logout"} />
            )}
          </ul>
        </nav>

        <div className="md:hidden flex items-center gap-3">
          {isAuthenticated && userEmail && (
            <span className="text-white text-xs font-medium px-2 py-1 bg-white/10 rounded-lg border border-white/20 truncate max-w-[120px]">
              {userEmail}
            </span>
          )}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex flex-col gap-1 cursor-pointer"
            aria-label="Toggle menu"
          >
            <HamburgerLine />
            <HamburgerLine />
            <HamburgerLine />
          </button>
        </div>
      </ContainerLayout>

      <nav
        className={`md:hidden w-full ${
          isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        } overflow-hidden bg-[#087F5B] transition-all duration-300`}
      >
        <ContainerLayout>
          <ul className="flex flex-col gap-4 px-4 py-4">
            <ListItem link={"/"} text={"Articles"} />
            {isAuthenticated && (
              <>
                <ListItem link={"/blog/write"} text={"Write"} />
                <ListItem link={"/blog/myposts"} text={"My Posts"} />
              </>
            )}
            {isAdmin && <ListItem link={"/admin"} text={"Admin"} />}
            {!isAuthenticated && (
              <>
                <ListItem link={"/auth/register"} text={"Register"} />
                <ListItem link={"/auth/login"} text={"Login"} />
              </>
            )}
            {isAuthenticated && (
              <ListItem link={"/auth/logout"} text={"Logout"} />
            )}
          </ul>
        </ContainerLayout>
      </nav>
    </>
  );
}
