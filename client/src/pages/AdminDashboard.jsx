import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router";
import ContainerLayout from "../layouts/ContainerLayout";
import {
  getPendingBlogs,
  getRejectedBlogs,
  updateBlogStatus,
  deleteBlog,
} from "../services/adminService";
import { useAuth } from "../hooks/useAuth";
import LoadingScreen from "../components/ui/LoadingScreen";
import Button from "../components/ui/Button";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { accessToken } = useAuth();
  const [activeTab, setActiveTab] = useState("pending"); // "pending" or "rejected"
  const [pendingBlogs, setPendingBlogs] = useState([]);
  const [rejectedBlogs, setRejectedBlogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingBlogId, setUpdatingBlogId] = useState(null);
  const [deletingBlogId, setDeletingBlogId] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  });

  const fetchPendingBlogs = useCallback(
    async (page = 1) => {
      if (!accessToken) return;
      try {
        setIsLoading(true);
        setError("");
        const result = await getPendingBlogs(page, 10, accessToken);
        setPendingBlogs(result.blogs || []);
        setPagination(
          result.pagination || { page: 1, limit: 10, total: 0, pages: 0 }
        );
      } catch (err) {
        setError(err.message || "Failed to load pending blogs");
      } finally {
        setIsLoading(false);
      }
    },
    [accessToken]
  );

  const fetchRejectedBlogs = useCallback(
    async (page = 1) => {
      if (!accessToken) return;
      try {
        setIsLoading(true);
        setError("");
        const result = await getRejectedBlogs(page, 10, accessToken);
        setRejectedBlogs(result.blogs || []);
        setPagination(
          result.pagination || { page: 1, limit: 10, total: 0, pages: 0 }
        );
      } catch (err) {
        setError(err.message || "Failed to load rejected blogs");
      } finally {
        setIsLoading(false);
      }
    },
    [accessToken]
  );

  useEffect(() => {
    if (activeTab === "pending") {
      fetchPendingBlogs(1);
    } else {
      fetchRejectedBlogs(1);
    }
  }, [activeTab, fetchPendingBlogs, fetchRejectedBlogs]);

  const handleStatusUpdate = async (blogId, status) => {
    try {
      setUpdatingBlogId(blogId);
      await updateBlogStatus(blogId, status, accessToken);
      // Refresh the list
      if (activeTab === "pending") {
        await fetchPendingBlogs(pagination.page);
      } else {
        await fetchRejectedBlogs(pagination.page);
      }
    } catch (err) {
      setError(err.message || "Failed to update blog status");
    } finally {
      setUpdatingBlogId(null);
    }
  };

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
      if (activeTab === "pending") {
        await fetchPendingBlogs(pagination.page);
      } else {
        await fetchRejectedBlogs(pagination.page);
      }
    } catch (err) {
      setError(err.message || "Failed to delete blog");
    } finally {
      setDeletingBlogId(null);
    }
  };

  const handlePageChange = (newPage) => {
    if (activeTab === "pending") {
      fetchPendingBlogs(newPage);
    } else {
      fetchRejectedBlogs(newPage);
    }
    setPagination((prev) => ({ ...prev, page: newPage }));
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setPagination({ page: 1, limit: 10, total: 0, pages: 0 });
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const currentBlogs = activeTab === "pending" ? pendingBlogs : rejectedBlogs;

  if (isLoading && currentBlogs.length === 0) {
    return <LoadingScreen />;
  }

  return (
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

        {/* Tabs */}
        <div className="mb-6 border-b border-gray-200">
          <nav className="flex gap-4">
            <button
              onClick={() => handleTabChange("pending")}
              className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
                activeTab === "pending"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              Pending
            </button>
            <button
              onClick={() => handleTabChange("rejected")}
              className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
                activeTab === "rejected"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              Rejected
            </button>
          </nav>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mb-6">
            {error}
          </div>
        )}

        {currentBlogs.length === 0 && !isLoading ? (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
            <p className="font-semibold">All clear! 🎉</p>
            <p className="text-sm mt-1">There are no {activeTab} blogs.</p>
          </div>
        ) : (
          <>
            <div className="mb-4 text-sm text-gray-600">
              Showing {currentBlogs.length} of {pagination.total}{" "}
              {activeTab === "pending" ? "pending" : "rejected"} blog
              {pagination.total !== 1 ? "s" : ""}
            </div>

            <div className="space-y-4">
              {currentBlogs.map((blog) => (
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
                            {formatDate(blog.createdAt)}
                          </span>
                        </div>
                      </div>

                      <div className="flex gap-3 pt-4 border-t border-gray-200">
                        <Button
                          variant="secondary"
                          onClick={() => navigate(`/blog/${blog._id}/details`)}
                          className="flex-1"
                        >
                          View Full Article
                        </Button>
                        {activeTab === "pending" ? (
                          <>
                            <Button
                              onClick={() =>
                                handleStatusUpdate(blog._id, "approved")
                              }
                              disabled={updatingBlogId === blog._id}
                              className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                            >
                              {updatingBlogId === blog._id
                                ? "Processing..."
                                : "Approve"}
                            </Button>
                            <Button
                              onClick={() =>
                                handleStatusUpdate(blog._id, "rejected")
                              }
                              disabled={updatingBlogId === blog._id}
                              className="flex-1 !bg-red-600 !hover:bg-red-700 !text-white !border-red-600"
                            >
                              {updatingBlogId === blog._id
                                ? "Processing..."
                                : "Reject"}
                            </Button>
                          </>
                        ) : (
                          <Button
                            onClick={() => handleDelete(blog._id)}
                            disabled={deletingBlogId === blog._id}
                            className="flex-1 !bg-red-600 !hover:bg-red-700 !text-white !border-red-600"
                          >
                            {deletingBlogId === blog._id
                              ? "Deleting..."
                              : "Delete"}
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="mt-8 flex justify-center gap-2">
                <Button
                  variant="secondary"
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                >
                  Previous
                </Button>
                <span className="flex items-center px-4 text-sm text-gray-600">
                  Page {pagination.page} of {pagination.pages}
                </span>
                <Button
                  variant="secondary"
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page >= pagination.pages}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </ContainerLayout>
  );
}
