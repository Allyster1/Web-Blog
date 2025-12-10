import { Link } from "react-router";

export default function ListItem({ link, text }) {
   return (
      <li>
         <Link to={link} className="text-sm text-white md:text-white hover:text-[#E9FAC8] hover:underline">
            {text}
         </Link>
      </li>
   );
}
