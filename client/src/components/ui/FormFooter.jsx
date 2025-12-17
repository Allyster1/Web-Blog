import { Link } from "react-router";

export default function FormFooter({ question, linkText, linkTo }) {
  return (
    <p className="text-[#718096] text-sm text-center">
      {question}
      <Link to={linkTo} className="underline text-[#1C4532] ml-1">
        {linkText}
      </Link>
    </p>
  );
}
