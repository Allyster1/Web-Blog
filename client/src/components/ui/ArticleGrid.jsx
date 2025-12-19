import ArticleCard from "./ArticleCard";

export default function ArticleGrid({ posts = [] }) {
  // If no posts provided, render empty or placeholder
  if (posts.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
      {posts.map((post) => (
        <ArticleCard
          key={post._id || post.id}
          img={post.image || "https://via.placeholder.com/400x300"}
          author={post.author?.fullName || post.author || "Unknown Author"}
          title={post.title}
          date={post.date || post.formattedDate}
          id={post._id || post.id}
        />
      ))}
    </div>
  );
}
