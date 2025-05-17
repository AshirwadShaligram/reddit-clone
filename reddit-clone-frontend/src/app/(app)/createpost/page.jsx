"use client";
import { useState } from "react";
import { ChevronDown, User } from "lucide-react";
import { useSelector } from "react-redux";
import api from "@/lib/axiosInstance"; // Update this path to match your project structure
import { toast } from "sonner";

const CreatePost = () => {
  const [postType, setPostType] = useState("text");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useSelector((state) => state.auth);

  const [selectedOption, setSelectedOption] = useState(`user`); // Default to user posts

  const handleChange = (e) => {
    setSelectedOption(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Create form data for multipart/form-data request (needed for file upload)
      const formData = new FormData();
      formData.append("title", title);

      // Determine if this is a user post or community post
      if (selectedOption === "user") {
        formData.append("authorId", user.id);
      } else if (selectedOption.startsWith("community-")) {
        // Extract community ID from the selected option
        const communityId = selectedOption.replace("community-", "");
        formData.append("communityId", communityId);
      }

      // Handle content based on post type
      if (postType === "text") {
        formData.append("content", content);
      } else if (file) {
        formData.append("postImage", file);
      }

      // Make the API call
      const response = await api.post("/api/posts", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (response.data) {
        toast.success("Post created successfully!");
      }
      // Reset form after successful submission
      setTitle("");
      setContent("");
      setFile(null);
    } catch (err) {
      console.error("Error creating post:", err);
      toast.error("Failed to create post. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-sm mt-8">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">Create Post</h1>

      {/* Post Type Selector for post creator (community / user) */}
      <div className="relative mb-6 w-48">
        <select
          value={selectedOption}
          onChange={handleChange}
          className="block appearance-none w-full bg-gray-100 border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          {/* User Option */}
          <option value="user">{user?.userName || "User"}</option>

          {/* Community Options */}
          {user?.communities?.map((community) => (
            <option key={community.id} value={`community-${community.id}`}>
              {community.name}
            </option>
          ))}
        </select>

        {/* Dropdown Arrow */}
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
          <ChevronDown />
        </div>
      </div>

      {/* Post Type Selector Buttons */}
      <div className="flex space-x-4 mb-6">
        <button
          type="button"
          onClick={() => setPostType("text")}
          className={`px-4 py-2 rounded-lg border-b-2 transition-colors ${
            postType === "text"
              ? "border-blue-500 text-blue-700"
              : "text-gray-700 hover:bg-gray-200"
          }`}
        >
          Text
        </button>
        <button
          type="button"
          onClick={() => setPostType("image")}
          className={`px-4 py-2 rounded-lg border-b-2 transition-colors ${
            postType === "image"
              ? "border-blue-500 text-blue-700"
              : "text-gray-700 hover:bg-gray-200"
          }`}
        >
          Image/Video
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Title field (common for both types) */}
        <div className="mb-6">
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Title*
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-background"
            placeholder="Enter post title"
            required
          />
        </div>

        {/* Conditional fields based on post type */}
        {postType === "text" ? (
          <div className="mb-6">
            <label
              htmlFor="content"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Content*
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[200px] text-background"
              placeholder="Write your post content..."
              required={postType === "text"}
            />
          </div>
        ) : (
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Upload Image/Video*
            </label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
              <div className="space-y-1 text-center">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 48 48"
                  aria-hidden="true"
                >
                  <path
                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <div className="flex text-sm text-gray-600">
                  <label
                    htmlFor="file-upload"
                    className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                  >
                    <span>Upload a file</span>
                    <input
                      id="file-upload"
                      name="file-upload"
                      type="file"
                      accept="image/*,video/*"
                      onChange={(e) => setFile(e.target.files[0])}
                      className="sr-only"
                      required={postType === "image"}
                    />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">
                  PNG, JPG, GIF, MP4 up to 5MB
                </p>
              </div>
            </div>
            {file && (
              <p className="mt-2 text-sm text-gray-600">
                Selected file: {file.name}
              </p>
            )}
          </div>
        )}

        {/* Submit button */}
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full ${
            isLoading ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
          } text-white font-medium py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-150 ease-in-out`}
        >
          {isLoading ? "Creating Post..." : "Post"}
        </button>
      </form>
    </div>
  );
};

export default CreatePost;
