import { useState, useEffect } from "react";
import BlogCard from "../ui/BlogCard";
import { getAllBlogs } from "../../services/blogService";
import { formatBlogDate } from "../../utils/dateUtils";

export default function PopularPosts() {
  const [trendingPosts, setTrendingPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrendingPosts = async () => {
      try {
        // Fetch a larger number of blogs to ensure we have enough to sort by likes
        const response = await getAllBlogs(1, 50, "createdAt");

        // Sort by likes count (descending) and take top 3
        const sortedByLikes = [...response.blogs].sort((a, b) => {
          const likesA = Array.isArray(a.likes) ? a.likes.length : 0;
          const likesB = Array.isArray(b.likes) ? b.likes.length : 0;
          return likesB - likesA;
        });

        const top3 = sortedByLikes.slice(0, 3);
        setTrendingPosts(top3);
      } catch (error) {
        setTrendingPosts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTrendingPosts();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card rounded-xl overflow-hidden shadow-sm h-64 animate-pulse" />
        <div className="flex flex-col gap-6">
          <div className="bg-card rounded-xl overflow-hidden shadow-sm h-32 animate-pulse" />
          <div className="bg-card rounded-xl overflow-hidden shadow-sm h-32 animate-pulse" />
        </div>
      </div>
    );
  }

  if (trendingPosts.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No trending posts available
      </div>
    );
  }

  // Top post (most liked) - large variant on left
  const topPost = trendingPosts[0];
  // 2nd and 3rd posts - horizontal variants on right
  const secondPost = trendingPosts[1];
  const thirdPost = trendingPosts[2];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {topPost && (
        <BlogCard
          variant="large"
          img={topPost.image || "https://via.placeholder.com/600x400"}
          title={topPost.title}
          author={topPost.author?.fullName || "Unknown Author"}
          date={formatBlogDate(topPost.createdAt)}
          id={topPost._id}
        />
      )}

      <div className="flex flex-col gap-6">
        {secondPost && (
          <BlogCard
            variant="horizontal"
            img={secondPost.image || "https://via.placeholder.com/400x300"}
            title={secondPost.title}
            author={secondPost.author?.fullName || "Unknown Author"}
            date={formatBlogDate(secondPost.createdAt)}
            id={secondPost._id}
          />
        )}

        {thirdPost && (
          <BlogCard
            variant="horizontal"
            img={thirdPost.image || "https://via.placeholder.com/400x300"}
            title={thirdPost.title}
            author={thirdPost.author?.fullName || "Unknown Author"}
            date={formatBlogDate(thirdPost.createdAt)}
            id={thirdPost._id}
          />
        )}
      </div>
    </div>
  );
}
