import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router";
import ContainerLayout from "../layouts/ContainerLayout";
import { getBlogById, deleteBlog } from "../services/blogService";
import { useAuth } from "../hooks/useAuth";
import { getUserIdFromToken } from "../utils/tokenUtils";
import LoadingScreen from "../components/ui/LoadingScreen";
import Button from "../components/ui/Button";

export default function BlogDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { accessToken, isAuthenticated } = useAuth();
  const [blog, setBlog] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const currentUserId = accessToken ? getUserIdFromToken(accessToken) : null;
  const isOwner = blog && currentUserId && blog.author?._id === currentUserId;

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setIsLoading(true);
        const blogData = await getBlogById(id);
        setBlog(blogData);
      } catch (err) {
        setError(err.message || "Failed to load blog. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchBlog();
    }
  }, [id]);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await deleteBlog(id, accessToken);
      navigate("/");
    } catch (err) {
      setError(err.message || "Failed to delete blog. Please try again.");
      setShowDeleteConfirm(false);
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (error && !blog) {
    return (
      <ContainerLayout className="min-h-screen py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
          <div className="mt-4">
            <Link to="/" className="text-blue-600 hover:underline">
              ← Back to Articles
            </Link>
          </div>
        </div>
      </ContainerLayout>
    );
  }

  if (!blog) {
    return (
      <ContainerLayout className="min-h-screen py-8">
        <div className="max-w-4xl mx-auto">
          <p>Blog not found</p>
          <Link to="/" className="text-blue-600 hover:underline">
            ← Back to Articles
          </Link>
        </div>
      </ContainerLayout>
    );
  }

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <ContainerLayout className="min-h-screen py-8">
      <div className="max-w-4xl mx-auto">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mb-6">
            {error}
          </div>
        )}

        {/* Owner Actions */}
        {isOwner && isAuthenticated && (
          <div className="mb-6 flex gap-4 justify-end">
            <Button variant="secondary" onClick={() => navigate(`/edit/${id}`)}>
              Edit Article
            </Button>
            <Button
              variant="secondary"
              onClick={() => setShowDeleteConfirm(true)}
              className="!bg-red-600 !hover:bg-red-700 !text-white !border-red-600"
            >
              Delete Article
            </Button>
          </div>
        )}

        {/* Delete Confirmation Dialog */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md mx-4">
              <h3 className="text-xl font-bold mb-4">Confirm Delete</h3>
              <p className="text-gray-700 mb-6">
                Are you sure you want to delete this article? This action cannot
                be undone.
              </p>
              <div className="flex gap-4 justify-end">
                <Button
                  variant="secondary"
                  onClick={() => setShowDeleteConfirm(false)}
                  disabled={isDeleting}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="!bg-red-600 !hover:bg-red-700 !text-white !border-red-600 disabled:opacity-50"
                >
                  {isDeleting ? "Deleting..." : "Delete"}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Back Link */}
        <Link
          to="/"
          className="text-blue-600 hover:underline mb-6 inline-block"
        >
          ← Back to Articles
        </Link>

        {/* Blog Content */}
        <article>
          <h1 className="text-4xl font-bold text-[#212121] mb-4">
            {blog.title}
          </h1>

          <div className="flex items-center gap-4 text-sm text-gray-600 mb-6">
            <span>
              By <strong>{blog.author?.fullName || "Unknown"}</strong>
            </span>
            <span>•</span>
            <span>{formatDate(blog.createdAt)}</span>
          </div>

          {blog.image && (
            <div className="mb-8">
              <img
                src={blog.image}
                alt={blog.title}
                className="w-full h-auto rounded-lg object-cover"
              />
            </div>
          )}

          <div className="prose max-w-none">
            <div className="whitespace-pre-wrap text-gray-800 leading-7">
              {blog.content}
            </div>
          </div>

          {/* Likes/Dislikes Info */}
          <div className="mt-8 pt-6 border-t border-gray-200 flex gap-6 text-sm text-gray-600">
            <span>
              {blog.likes?.length || 0}{" "}
              {blog.likes?.length === 1 ? "like" : "likes"}
            </span>
            <span>
              {blog.dislikes?.length || 0}{" "}
              {blog.dislikes?.length === 1 ? "dislike" : "dislikes"}
            </span>
            <span>
              {blog.comments?.length || 0}{" "}
              {blog.comments?.length === 1 ? "comment" : "comments"}
            </span>
          </div>
        </article>
      </div>
    </ContainerLayout>
  );
}
