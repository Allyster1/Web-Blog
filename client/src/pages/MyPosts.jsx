import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router";
import ContainerLayout from "../layouts/ContainerLayout";
import { getUserBlogs, deleteBlog } from "../services/blogService";
import { useAuth } from "../hooks/useAuth";
import LoadingScreen from "../components/ui/LoadingScreen";
import Button from "../components/ui/Button";
import Pagination from "../components/ui/Pagination";
import Header from "../components/Header";
import Footer from "../components/footer/Footer";
import { formatBlogDate, formatDateTime } from "../utils/dateUtils";

export default function MyPosts() {
  const navigate = useNavigate();
  const { accessToken } = useAuth();
  const [blogs, setBlogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingBlogId, setDeletingBlogId] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 9,
    total: 0,
    pages: 0,
  });

  const fetchUserBlogs = useCallback(
    async (page = 1) => {
      if (!accessToken) return;
      try {
        setIsLoading(true);
        setError("");
        const result = await getUserBlogs(page, 9, accessToken);
        setBlogs(result.blogs || []);
        setPagination(
          result.pagination || { page: 1, limit: 9, total: 0, pages: 0 }
        );
      } catch (err) {
        setError(err.message || "Failed to load your blogs");
      } finally {
        setIsLoading(false);
      }
    },
    [accessToken]
  );

  useEffect(() => {
    fetchUserBlogs(1);
  }, [fetchUserBlogs]);

  const handleDelete = async (blogId) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this blog? This action cannot be undone."
      )
    ) {
      return;
    }
    try {
      setDeletingBlogId(blogId);
      await deleteBlog(blogId, accessToken);
      // Refresh the list
      await fetchUserBlogs(pagination.page);
    } catch (err) {
      setError(err.message || "Failed to delete blog");
    } finally {
      setDeletingBlogId(null);
    }
  };

  const handlePageChange = (newPage) => {
    fetchUserBlogs(newPage);
  };

  const getStatusBadge = (status) => {
    const statusColors = {
      pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
      approved: "bg-green-100 text-green-800 border-green-200",
      rejected: "bg-red-100 text-red-800 border-red-200",
    };

    return (
      <span
        className={`px-2 py-1 text-xs font-semibold rounded border ${
          statusColors[status] || "bg-gray-100 text-gray-800 border-gray-200"
        }`}
      >
        {status?.charAt(0).toUpperCase() + status?.slice(1) || "Unknown"}
      </span>
    );
  };

  if (isLoading && blogs.length === 0) {
    return <LoadingScreen />;
  }

  return (
    <>
      <Header />
      <ContainerLayout className="min-h-screen py-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-[#212121] mb-2">My Posts</h1>
            <p className="text-gray-600">Manage and view all your blog posts</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mb-6">
              {error}
            </div>
          )}

          {blogs.length === 0 && !isLoading ? (
            <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg">
              <p className="font-semibold">No posts yet!</p>
              <p className="text-sm mt-1">
                Start writing your first blog post{" "}
                <button
                  onClick={() => navigate("/blog/write")}
                  className="underline hover:text-blue-800 cursor-pointer"
                >
                  here
                </button>
                .
              </p>
            </div>
          ) : (
            <>
              <div className="space-y-4">
                {blogs.map((blog) => (
                  <div
                    key={blog._id}
                    className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="flex flex-col md:flex-row gap-4">
                      {blog.image && (
                        <div className="md:w-48 h-48 shrink-0">
                          <img
                            src={blog.image}
                            alt={blog.title}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        </div>
                      )}

                      <div className="flex-1 flex flex-col">
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="text-xl font-bold text-[#212121] flex-1">
                              {blog.title}
                            </h3>
                            {getStatusBadge(blog.status)}
                          </div>
                          <p className="text-gray-600 text-sm mb-3 line-clamp-3">
                            {blog.content}
                          </p>

                          <div className="flex flex-wrap gap-3 mb-4">
                            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 rounded-lg text-sm text-gray-700">
                              <span className="text-gray-500">📅</span>
                              <span className="font-medium">Created:</span>
                              <span>{formatBlogDate(blog.createdAt)}</span>
                            </div>
                            {blog.updatedAt &&
                              blog.updatedAt !== blog.createdAt && (
                                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 rounded-lg text-sm text-gray-700">
                                  <span className="text-gray-500">✏️</span>
                                  <span className="font-medium">Updated:</span>
                                  <span>{formatBlogDate(blog.updatedAt)}</span>
                                </div>
                              )}
                            <span>
                              <strong>Likes:</strong> {blog.likes?.length || 0}
                            </span>
                            <span className="ml-4">
                              <strong>Comments:</strong>{" "}
                              {blog.comments?.length || 0}
                            </span>
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
                          <Button
                            variant="secondary"
                            onClick={() =>
                              navigate(`/blog/${blog._id}/details`)
                            }
                            className="flex-1 w-full sm:w-auto"
                          >
                            View Article
                          </Button>
                          {blog.status === "pending" && (
                            <Button
                              variant="secondary"
                              onClick={() => navigate(`/blog/${blog._id}/edit`)}
                              className="flex-1 w-full sm:w-auto"
                            >
                              Edit
                            </Button>
                          )}
                          <Button
                            onClick={() => handleDelete(blog._id)}
                            disabled={deletingBlogId === blog._id}
                            className="flex-1 w-full sm:w-auto !bg-red-600 !hover:bg-red-700 !text-white !border-red-600"
                          >
                            {deletingBlogId === blog._id
                              ? "Deleting..."
                              : "Delete"}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <Pagination
                pagination={pagination}
                onPageChange={handlePageChange}
              />
            </>
          )}
        </div>
      </ContainerLayout>
      <Footer />
    </>
  );
}
