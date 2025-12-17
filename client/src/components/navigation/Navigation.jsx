import { useState, useRef, useEffect } from "react";

import ListItem from "../ui/ListItem";
import HamburgerLine from "../ui/HamburgerLine";
import { logout } from "../../services/authService";
import { useNavigate } from "react-router";
import { useAuth } from "../../hooks/useAuth";
import ContainerLayout from "../../layouts/ContainerLayout";
import HeaderLogo from "../ui/HeaderLogo";

export default function Navigation() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, accessToken, logout: clearAuth } = useAuth();
  const abortControllerRef = useRef(null);

  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const logoutHandler = async () => {
    if (!isAuthenticated || !accessToken) return;

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;

    try {
      await logout(accessToken, signal);
    } catch (error) {
      if (error.name !== "AbortError") {
        console.error("Logout error:", error);
      }
    } finally {
      if (!signal.aborted) {
        clearAuth();
        navigate("/");
      }
    }
  };

  return (
    <>
      <ContainerLayout className="py-4 flex items-center justify-between">
        <HeaderLogo />
        <nav className="hidden md:flex">
          <ul className="flex gap-7">
            <ListItem link={"/"} text={"Articles"} />
            <ListItem link={"/write"} text={"Write"} />
            <ListItem link={"about"} text={"About"} />
            {!isAuthenticated && (
              <>
                <ListItem link={"/auth/register"} text={"Register"} />
                <ListItem link={"/auth/login"} text={"Login"} />
              </>
            )}
            {isAuthenticated && (
              <li>
                <button
                  onClick={logoutHandler}
                  className="text-sm text-white hover:text-[#E9FAC8] cursor-pointer hover:underline"
                >
                  Logout
                </button>
              </li>
            )}
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
      </ContainerLayout>

      <nav
        className={`md:hidden w-full ${
          isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        } overflow-hidden bg-[#087F5B] transition-all duration-300`}
      >
        <ContainerLayout>
          <ul className="flex flex-col gap-4 px-4 py-4">
            <ListItem link={"/"} text={"Articles"} />
            <ListItem link={"/write"} text={"Write"} />
            {!isAuthenticated && (
              <>
                <ListItem link={"/auth/register"} text={"Register"} />
                <ListItem link={"/auth/login"} text={"Login"} />
              </>
            )}
            {isAuthenticated && (
              <li>
                <button
                  onClick={logoutHandler}
                  className="text-sm text-white hover:text-[#E9FAC8] cursor-pointer hover:underline"
                >
                  Logout
                </button>
              </li>
            )}
          </ul>
        </ContainerLayout>
      </nav>
    </>
  );
}
