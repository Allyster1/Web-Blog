import { useState } from "react";

import ListItem from "../ui/ListItem";
import HamburgerLine from "../ui/HamburgerLine";
import { logout } from "../../services/authService";
import { useNavigate } from "react-router";

export default function Navigation() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const logoutHandler = async () => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) return;

    await logout(accessToken);

    localStorage.removeItem("accessToken");
    navigate("/");
  };

  return (
    <>
      <nav className="hidden md:flex">
        <ul className="flex gap-7">
          <ListItem link={"/"} text={"Articles"} />
          <ListItem link={"#"} text={"Write"} />
          <ListItem link={"about"} text={"About"} />
          <ListItem link={"/auth/register"} text={"Register"} />
          <ListItem link={"/auth/login"} text={"Login"} />
          <li>
            <button
              onClick={logoutHandler}
              className="text-sm text-white hover:text-[#E9FAC8] cursor-pointer hover:underline"
            >
              Logout
            </button>
          </li>
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

      <nav
        className={`md:hidden  ${
          isOpen ? "max-h-96" : "max-h-0"
        } absolute top-full right-0 opacity-90 overflow-hidden rounded-bl-3xl bg-[#087F5B] transition-all duration-300`}
      >
        <ul className="flex flex-col gap-4 px-7 py-4">
          <ListItem link={"#"} text={"Articles"} />
          <ListItem link={"#"} text={"Write"} />
          <ListItem link={"/auth/register"} text={"Register"} />
          <ListItem link={"/auth/login"} text={"Login"} />
        </ul>
      </nav>
    </>
  );
}
