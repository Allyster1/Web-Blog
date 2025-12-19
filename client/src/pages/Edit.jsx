import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import InputField from "../components/ui/InputField";
import TextareaField from "../components/ui/TextareaField";
import Button from "../components/ui/Button";
import ContainerLayout from "../layouts/ContainerLayout";
import { useAuth } from "../hooks/useAuth";
import { getBlogById, updateBlog } from "../services/blogService";
import LoadingScreen from "../components/ui/LoadingScreen";

export default function Edit() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { accessToken } = useAuth();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [values, setValues] = useState({
    title: "",
    content: "",
    image: "",
    imageFile: null,
  });

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setIsLoading(true);
        const blog = await getBlogById(id);
        setValues({
          title: blog.title || "",
          content: blog.content || "",
          image: blog.image || "",
          imageFile: null,
        });
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

  const changeHandler = (e) => {
    if (e.target.name === "imageFile" && e.target.files?.[0]) {
      setValues((state) => ({
        ...state,
        imageFile: e.target.files[0],
        image: "", // Clear URL if file is selected
      }));
    } else {
      setValues((state) => ({
        ...state,
        [e.target.name]: e.target.value,
      }));
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const blogData = {
        title: values.title,
        content: values.content,
      };
      if (values.imageFile) {
        blogData.image = values.imageFile;
      } else if (values.image && values.image.trim() !== "") {
        blogData.image = values.image;
      }

      await updateBlog(id, blogData, accessToken);
      navigate(`/blog/${id}`);
    } catch (err) {
      setError(err.message || "Failed to update blog. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <ContainerLayout className="min-h-screen py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-[#212121] mb-8">Edit Article</h1>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mb-6">
            {error}
          </div>
        )}

        <form className="flex flex-col gap-6" onSubmit={submitHandler}>
          <InputField
            label="Title"
            id="title"
            name="title"
            type="text"
            placeholder="Enter article title"
            required
            value={values.title}
            onChange={changeHandler}
          />

          <TextareaField
            label="Content"
            id="content"
            name="content"
            placeholder="Write your article content here..."
            required
            rows={12}
            value={values.content}
            onChange={changeHandler}
          />

          <div className="flex flex-col gap-4">
            <div className="flex flex-col">
              <label
                htmlFor="imageFile"
                className="text-[#718096] text-sm leading-5 tracking-tight mb-2.5"
              >
                Image (Upload File)
              </label>
              <input
                type="file"
                id="imageFile"
                name="imageFile"
                accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                onChange={changeHandler}
                className="rounded-2xl px-4 py-2.5 border border-gray-300 focus:border-gray-500 focus:outline-none"
              />
              {values.imageFile && (
                <p className="text-sm text-gray-600 mt-1">
                  Selected: {values.imageFile.name}
                </p>
              )}
              {!values.imageFile && values.image && (
                <p className="text-sm text-gray-600 mt-1">
                  Current image:{" "}
                  <a
                    href={values.image}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {values.image}
                  </a>
                </p>
              )}
            </div>

            <div className="text-center text-gray-500 text-sm">OR</div>

            <InputField
              label="Image URL (Alternative)"
              id="image"
              name="image"
              type="url"
              placeholder="https://example.com/image.jpg"
              value={values.image}
              onChange={changeHandler}
            />
            <p className="text-xs text-gray-500">
              Upload an image file or provide an image URL. Leave empty to keep
              current image.
            </p>
          </div>

          <div className="flex gap-4 justify-end">
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate(`/blog/${id}`)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Updating..." : "Update Article"}
            </Button>
          </div>
        </form>
      </div>
    </ContainerLayout>
  );
}
