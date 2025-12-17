import Navigation from "./navigation/Navigation";
import ContainerLayout from "../layouts/ContainerLayout";
import HeaderLogo from "./ui/HeaderLogo";

export default function Header() {
  return (
    <header className="bg-[#53946c] border-b border-gray-200 text-white">
      <Navigation />
    </header>
  );
}
