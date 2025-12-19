import { Link } from "react-router";

export default function BlogCard({
  img,
  title,
  author,
  date,
  variant = "large",
  href = "#",
  id,
}) {
  const isLarge = variant === "large";
  const isHorizontal = variant === "horizontal";
  const linkTo = id ? `/blog/${id}/details` : href;

  if (isLarge) {
    return (
      <div className="bg-card rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col">
        <Link to={linkTo} className="block flex flex-col flex-1">
          <img
            className="w-full h-64 object-cover hover:scale-105 transition-transform duration-300 cursor-pointer"
            src={img}
            alt={title}
          />
          <div
            className="p-6 flex flex-col flex-1"
            style={{ maxHeight: "200px" }}
          >
            <h3 className="text-xl font-bold mb-3 line-clamp-2">{title}</h3>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-sm font-medium">{author}</span>
            </div>
            <span className="text-sm text-muted-foreground mt-auto">
              {date}
            </span>
          </div>
        </Link>
      </div>
    );
  }

  if (isHorizontal) {
    return (
      <div className="bg-card rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
        <Link to={linkTo} className="block sm:flex">
          <div className="w-full sm:w-48 h-48 shrink-0">
            <img
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300 cursor-pointer"
              src={img}
              alt={title}
            />
          </div>
          <div
            className="p-5 flex flex-col flex-1"
            style={{ maxHeight: "200px" }}
          >
            <h3 className="text-lg font-bold mb-3 line-clamp-2">{title}</h3>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-sm font-medium">{author}</span>
            </div>
            <span className="text-sm text-muted-foreground mt-auto">
              {date}
            </span>
          </div>
        </Link>
      </div>
    );
  }

  return null;
}
