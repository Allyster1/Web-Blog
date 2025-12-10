export default function ListItem({ link, text }) {
   return (
      <li>
         <a href={link} className="text-sm hover:text-[#ced4da] hover:underline">
            {text}
         </a>
      </li>
   );
}
