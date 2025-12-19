import { Link } from "react-router";

export default function ArticleCard({ img, author, title, date, id }) {
  const linkTo = id ? `/blog/${id}` : "#";

  return (
    <div className="shadow-md overflow-hidden flex flex-col transition hover:shadow-lg w-full mb-7">
      <Link to={linkTo}>
        <img
          className="w-full h-64 object-cover hover:scale-105 transition-transform duration-300 cursor-pointer"
          src={img}
          alt={title || "test-img"}
        />
        <div className="m-3 flex flex-col flex-1">
          <span className="text-xs text-[#212121] mb-2.5">
            Author: {author}
          </span>
          <h2 className="text-lg font-medium text-[#212121] line-clamp-2 leading-8 mb-1">
            {title}
          </h2>

          <span className="text-[#9A9A9A] text-xs text-right">{date}</span>
        </div>
      </Link>
    </div>
  );
}
