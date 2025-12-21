import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router";
import ContainerLayout from "../layouts/ContainerLayout";
import { getPendingBlogs, updateBlogStatus } from "../services/adminService";
import { useAuth } from "../hooks/useAuth";
import LoadingScreen from "../components/ui/LoadingScreen";
import Button from "../components/ui/Button";
import Pagination from "../components/ui/Pagination";
import Header from "../components/Header";
import { formatDateTime } from "../utils/dateUtils";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { accessToken } = useAuth();
  const [pendingBlogs, setPendingBlogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingBlogId, setUpdatingBlogId] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 9,
    total: 0,
    pages: 0,
  });

  const fetchPendingBlogs = useCallback(
    async (page = 1) => {
      if (!accessToken) return;
      try {
        setIsLoading(true);
        setError("");
        const result = await getPendingBlogs(page, 9, accessToken);
        setPendingBlogs(result.blogs || []);
        setPagination(
          result.pagination || { page: 1, limit: 9, total: 0, pages: 0 }
        );
      } catch (err) {
        setError(err.message || "Failed to load pending blogs");
      } finally {
        setIsLoading(false);
      }
    },
    [accessToken]
  );

  useEffect(() => {
    fetchPendingBlogs(1);
  }, [fetchPendingBlogs]);

  const handleStatusUpdate = async (blogId, status, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    try {
      setUpdatingBlogId(blogId);
      await updateBlogStatus(blogId, status, accessToken);
      // Refresh the list
      await fetchPendingBlogs(pagination.page);
    } catch (err) {
      setError(err.message || "Failed to update blog status");
    } finally {
      setUpdatingBlogId(null);
    }
  };

  const handlePageChange = (newPage) => {
    fetchPendingBlogs(newPage);
  };

  if (isLoading && pendingBlogs.length === 0) {
    return <LoadingScreen />;
  }

  return (
    <>
      <Header className="hidden md:flex" />
      <ContainerLayout className="min-h-screen py-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-[#212121] mb-2">
              Admin Dashboard
            </h1>
            <p className="text-gray-600">
              Review and approve or reject pending blog posts
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mb-6">
              {error}
            </div>
          )}

          {pendingBlogs.length === 0 && !isLoading ? (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
              <p className="font-semibold">All clear! 🎉</p>
              <p className="text-sm mt-1">There are no pending blogs.</p>
            </div>
          ) : (
            <>
              <div className="space-y-4">
                {pendingBlogs.map((blog) => (
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
                          <h3 className="text-xl font-bold text-[#212121] mb-2">
                            {blog.title}
                          </h3>
                          <p className="text-gray-600 text-sm mb-3 line-clamp-3">
                            {blog.content}
                          </p>

                          <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-4">
                            <span>
                              <strong>Author:</strong>{" "}
                              {blog.author?.fullName || "Unknown"}
                            </span>
                            <span>
                              <strong>Email:</strong>{" "}
                              {blog.author?.email || "N/A"}
                            </span>
                            <span>
                              <strong>Submitted:</strong>{" "}
                              {formatDateTime(blog.createdAt)}
                            </span>
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
                          <Button
                            type="button"
                            variant="secondary"
                            onClick={() =>
                              navigate(`/blog/${blog._id}/details`)
                            }
                            className="flex-1 w-full sm:w-auto"
                          >
                            View Full Article
                          </Button>
                          <Button
                            type="button"
                            onClick={(e) =>
                              handleStatusUpdate(blog._id, "approved", e)
                            }
                            disabled={updatingBlogId === blog._id}
                            className="flex-1 w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white"
                          >
                            {updatingBlogId === blog._id
                              ? "Processing..."
                              : "Approve"}
                          </Button>
                          <Button
                            type="button"
                            onClick={(e) =>
                              handleStatusUpdate(blog._id, "rejected", e)
                            }
                            disabled={updatingBlogId === blog._id}
                            className="flex-1 w-full sm:w-auto !bg-red-600 !hover:bg-red-700 !text-white !border-red-600"
                          >
                            {updatingBlogId === blog._id
                              ? "Processing..."
                              : "Reject"}
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
    </>
  );
}
