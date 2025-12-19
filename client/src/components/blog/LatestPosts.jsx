import { useState, useEffect } from "react";
import ArticleGrid from "../ui/ArticleGrid";
import { getAllBlogs } from "../../services/blogService";

export default function LatestPosts() {
  const [latestPosts, setLatestPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLatestPosts = async () => {
      try {
        // Fetch latest posts sorted by createdAt (most recent first)
        const response = await getAllBlogs(1, 9, "createdAt");

        // Format dates for the posts
        const formattedPosts = (response.blogs || []).map((post) => ({
          ...post,
          formattedDate: formatDate(post.createdAt),
        }));

        setLatestPosts(formattedPosts);
      } catch (error) {
        console.error("Failed to fetch latest posts:", error);
        setLatestPosts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchLatestPosts();
  }, []);

  // Format date helper
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {[...Array(9)].map((_, i) => (
          <div
            key={i}
            className="shadow-md overflow-hidden h-80 animate-pulse bg-gray-200 rounded"
          />
        ))}
      </div>
    );
  }

  if (latestPosts.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No latest posts available
      </div>
    );
  }

  // Group posts into rows of 3 (to match original layout with 3 ArticleGrid components)
  const rows = [];
  for (let i = 0; i < latestPosts.length; i += 3) {
    rows.push(latestPosts.slice(i, i + 3));
  }

  return (
    <>
      {rows.map((row, rowIndex) => (
        <ArticleGrid key={rowIndex} posts={row} />
      ))}
    </>
  );
}
