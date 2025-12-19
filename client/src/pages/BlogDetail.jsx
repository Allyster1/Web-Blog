import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router";
import ContainerLayout from "../layouts/ContainerLayout";
import Header from "../components/Header";
import Footer from "../components/footer/Footer";
import {
  getBlogById,
  deleteBlog,
  likeBlog,
  addComment,
} from "../services/blogService";
import { useAuth } from "../hooks/useAuth";
import { getUserIdFromToken } from "../utils/tokenUtils";
import LoadingScreen from "../components/ui/LoadingScreen";
import Button from "../components/ui/Button";
import TextareaField from "../components/ui/TextareaField";
import { FaThumbsUp } from "react-icons/fa";

export default function BlogDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { accessToken, isAuthenticated } = useAuth();
  const [blog, setBlog] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const [commentContent, setCommentContent] = useState("");
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  const currentUserId = accessToken ? getUserIdFromToken(accessToken) : null;
  const isOwner = blog && currentUserId && blog.author?._id === currentUserId;
  const hasLiked = blog && currentUserId && blog.likes?.includes(currentUserId);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setIsLoading(true);
        // Pass accessToken so admins can view pending blogs
        const blogData = await getBlogById(id, accessToken);
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
  }, [id, accessToken]);

  // Handle escape key to close modal
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && showDeleteConfirm && !isDeleting) {
        setShowDeleteConfirm(false);
      }
    };

    if (showDeleteConfirm) {
      document.addEventListener("keydown", handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [showDeleteConfirm, isDeleting]);

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

  const handleLike = async () => {
    if (!isAuthenticated) {
      setError("Please login to like this article");
      return;
    }
    try {
      setIsLiking(true);
      setError("");
      const updatedBlog = await likeBlog(id, accessToken);
      setBlog(updatedBlog);
    } catch (err) {
      setError(err.message || "Failed to like article. Please try again.");
    } finally {
      setIsLiking(false);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      setError("Please login to comment on this article");
      return;
    }
    if (!commentContent.trim()) {
      setError("Comment cannot be empty");
      return;
    }
    try {
      setIsSubmittingComment(true);
      setError("");
      const updatedBlog = await addComment(id, commentContent, accessToken);
      setBlog(updatedBlog);
      setCommentContent("");
    } catch (err) {
      setError(err.message || "Failed to add comment. Please try again.");
    } finally {
      setIsSubmittingComment(false);
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
        </div>
      </ContainerLayout>
    );
  }

  if (!blog) {
    return (
      <ContainerLayout className="min-h-screen py-8">
        <div className="max-w-4xl mx-auto">
          <p>Blog not found</p>
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
    <>
      <Header />
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
              <Button
                variant="secondary"
                onClick={() => navigate(`/blog/${id}/edit`)}
              >
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
            <div
              role="dialog"
              aria-modal="true"
              aria-labelledby="delete-dialog-title"
              aria-describedby="delete-dialog-description"
              className="fixed inset-0  flex items-center justify-center z-50 p-4"
              onClick={() => !isDeleting && setShowDeleteConfirm(false)}
            >
              <div
                className="bg-white rounded-xl p-8 max-w-md w-full shadow-2xl border border-gray-200 transform transition-all"
                onClick={(e) => e.stopPropagation()}
              >
                <h3
                  id="delete-dialog-title"
                  className="text-2xl font-bold mb-3 text-[#212121]"
                >
                  Confirm Delete
                </h3>
                <p
                  id="delete-dialog-description"
                  className="text-gray-700 mb-8"
                >
                  Are you sure you want to delete this article? This action
                  cannot be undone.
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

          {/* Blog Content */}
          <article>
            <h1 className="text-4xl font-bold text-[#212121] mb-4">
              {blog.title}
            </h1>

            <div className="flex items-center gap-4 text-sm text-gray-600 mb-6">
              <span>
                By <strong>{blog.author?.fullName || "Unknown"}</strong>
              </span>
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

            {/* Date at bottom */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                Published on {formatDate(blog.createdAt)}
              </p>
            </div>

            {/* Likes Actions */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="flex gap-6 items-center mb-6">
                <button
                  onClick={handleLike}
                  disabled={isLiking || !isAuthenticated}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    hasLiked
                      ? "bg-green-100 text-green-700 hover:bg-green-200"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  } ${!isAuthenticated ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  <FaThumbsUp />
                  <span>{blog.likes?.length || 0}</span>
                  {isLiking && <span className="text-xs">...</span>}
                </button>
              </div>

              {/* Comments Section */}
              <div className="mt-8">
                <h3 className="text-xl font-bold text-[#212121] mb-4">
                  Comments ({blog.comments?.length || 0})
                </h3>

                {/* Comment Form */}
                {isAuthenticated && (
                  <form onSubmit={handleCommentSubmit} className="mb-6">
                    <TextareaField
                      id="comment"
                      label="Add a comment"
                      placeholder="Write your comment here..."
                      value={commentContent}
                      onChange={(e) => setCommentContent(e.target.value)}
                      rows={4}
                      required
                    />
                    <div className="mt-4 flex justify-end">
                      <Button
                        type="submit"
                        disabled={isSubmittingComment || !commentContent.trim()}
                      >
                        {isSubmittingComment ? "Posting..." : "Post Comment"}
                      </Button>
                    </div>
                  </form>
                )}

                {!isAuthenticated && (
                  <p className="text-gray-600 mb-6">
                    <Link
                      to="/auth/login"
                      className="text-blue-600 hover:underline"
                    >
                      Login
                    </Link>{" "}
                    to add a comment
                  </p>
                )}

                {/* Comments List */}
                <div className="space-y-4">
                  {blog.comments && blog.comments.length > 0 ? (
                    blog.comments.map((comment, index) => (
                      <div
                        key={index}
                        className="border-b border-gray-200 pb-4 last:border-b-0"
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <strong className="text-[#212121]">
                                {comment.user?.fullName || "Anonymous"}
                              </strong>
                              <span className="text-sm text-gray-500">
                                {formatDate(comment.createdAt)}
                              </span>
                            </div>
                            <p className="text-gray-700 whitespace-pre-wrap">
                              {comment.content}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 italic">
                      No comments yet. Be the first to comment!
                    </p>
                  )}
                </div>
              </div>
            </div>
          </article>
        </div>
      </ContainerLayout>
      <Footer />
    </>
  );
}
