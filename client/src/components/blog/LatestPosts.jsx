import { useState, useEffect } from "react";
import ArticleGrid from "../ui/ArticleGrid";
import Pagination from "../ui/Pagination";
import { getAllBlogs } from "../../services/blogService";
import { formatBlogDate } from "../../utils/dateUtils";

export default function LatestPosts() {
  const [latestPosts, setLatestPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 9,
    total: 0,
    pages: 0,
  });

  const fetchLatestPosts = async (page = 1) => {
    try {
      setLoading(true);
      // Fetch latest posts sorted by createdAt (most recent first)
      const response = await getAllBlogs(page, 9, "createdAt");

      // Format dates for the posts
      const formattedPosts = (response.blogs || []).map((post) => ({
        ...post,
        formattedDate: formatBlogDate(post.createdAt),
      }));

      setLatestPosts(formattedPosts);
      setPagination(
        response.pagination || { page: 1, limit: 9, total: 0, pages: 0 }
      );
    } catch (error) {
      setLatestPosts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLatestPosts(1);
  }, []);

  const handlePageChange = (newPage) => {
    fetchLatestPosts(newPage);
    // Scroll to top of the Latest Posts section
    window.scrollTo({ top: 0, behavior: "smooth" });
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
      <Pagination pagination={pagination} onPageChange={handlePageChange} />
    </>
  );
}
