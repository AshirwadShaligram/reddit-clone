"use client";
import { useState, useEffect } from "react";

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedComments, setExpandedComments] = useState({});
  const [newComments, setNewComments] = useState({});

  // Simulate fetching posts from an API
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        // Mock data - replace with actual API call
        const mockPosts = [
          {
            id: 1,
            title: "Getting Started with React",
            content:
              "React is a JavaScript library for building user interfaces. Learn how to create components and manage state.",
            imageUrl: "https://source.unsplash.com/random/600x400/?react",
            createdAt: new Date().toISOString(),
            votes: 24,
            comments: [
              {
                id: 101,
                author: "Jane Doe",
                content:
                  "Great introduction! The component lifecycle explanation was especially helpful.",
                createdAt: new Date(Date.now() - 3600000).toISOString(),
              },
              {
                id: 102,
                author: "John Smith",
                content: "Would love to see more examples of hooks usage.",
                createdAt: new Date(Date.now() - 7200000).toISOString(),
              },
            ],
          },
          {
            id: 2,
            title: "Tailwind CSS Tips",
            content:
              "Here are some advanced Tailwind CSS techniques to improve your styling workflow and create beautiful interfaces faster.",
            imageUrl: "https://source.unsplash.com/random/600x400/?tailwind",
            createdAt: new Date(Date.now() - 86400000).toISOString(),
            votes: 15,
            comments: [
              {
                id: 201,
                author: "Alex Johnson",
                content:
                  "The utility-first approach has completely changed how I write CSS.",
                createdAt: new Date(Date.now() - 10800000).toISOString(),
              },
            ],
          },
          {
            id: 3,
            title: "Apple Design Principles",
            content:
              "Learn about the key design principles that make Apple products visually appealing and user-friendly.",
            imageUrl: "",
            createdAt: new Date(Date.now() - 172800000).toISOString(),
            votes: 8,
            comments: [],
          },
        ];

        setPosts(mockPosts);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching posts:", error);
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleVote = (postId, direction) => {
    setPosts(
      posts.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            votes: direction === "up" ? post.votes + 1 : post.votes - 1,
          };
        }
        return post;
      })
    );
  };

  const toggleComments = (postId) => {
    setExpandedComments((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  const handleCommentChange = (postId, value) => {
    setNewComments((prev) => ({
      ...prev,
      [postId]: value,
    }));
  };

  const submitComment = (postId) => {
    if (!newComments[postId]?.trim()) return;

    const newComment = {
      id: Date.now(), // Temporary ID
      author: "Current User", // Replace with actual user
      content: newComments[postId],
      createdAt: new Date().toISOString(),
    };

    setPosts(
      posts.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            comments: [newComment, ...post.comments],
          };
        }
        return post;
      })
    );

    // Clear the input
    setNewComments((prev) => ({
      ...prev,
      [postId]: "",
    }));
  };

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-6">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">
        Recent Posts
      </h1>

      {posts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No posts available yet.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {posts.map((post) => (
            <div
              key={post.id}
              className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-shadow duration-200"
            >
              {post.imageUrl && (
                <div className="h-48 sm:h-56 w-full overflow-hidden">
                  <img
                    src={post.imageUrl}
                    alt={post.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <div className="p-5 sm:p-6">
                <div className="flex justify-between items-start mb-2">
                  <h2 className="text-xl font-semibold text-gray-800">
                    {post.title}
                  </h2>
                  <span className="text-xs text-gray-500">
                    {formatDate(post.createdAt)}
                  </span>
                </div>

                <p className="text-gray-600 mb-4">{post.content}</p>

                <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleVote(post.id, "up")}
                      className="p-1 rounded-full hover:bg-gray-100 transition-colors duration-200"
                      aria-label="Upvote"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-gray-500 hover:text-blue-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 15l7-7 7 7"
                        />
                      </svg>
                    </button>

                    <span className="text-sm font-medium text-gray-700 min-w-[20px] text-center">
                      {post.votes}
                    </span>

                    <button
                      onClick={() => handleVote(post.id, "down")}
                      className="p-1 rounded-full hover:bg-gray-100 transition-colors duration-200"
                      aria-label="Downvote"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-gray-500 hover:text-red-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </button>
                  </div>

                  <button
                    onClick={() => toggleComments(post.id)}
                    className="flex items-center text-sm text-gray-500 hover:text-blue-600 transition-colors duration-200"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                      />
                    </svg>
                    {post.comments.length}{" "}
                    {post.comments.length === 1 ? "comment" : "comments"}
                  </button>
                </div>

                {/* Comment input field */}
                <div className="mt-4">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                        Y
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex rounded-lg border border-gray-300 overflow-hidden focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent transition-all duration-200">
                        <input
                          type="text"
                          value={newComments[post.id] || ""}
                          onChange={(e) =>
                            handleCommentChange(post.id, e.target.value)
                          }
                          placeholder="Write a comment..."
                          className="flex-1 px-3 py-2 text-sm border-none focus:ring-0"
                          onKeyPress={(e) =>
                            e.key === "Enter" && submitComment(post.id)
                          }
                        />
                        <button
                          onClick={() => submitComment(post.id)}
                          className="px-3 text-blue-600 hover:text-blue-800 font-medium disabled:text-gray-400"
                          disabled={!newComments[post.id]?.trim()}
                        >
                          Post
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Most recent comment preview */}
                {post.comments.length > 0 && !expandedComments[post.id] && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0">
                        <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                          {post.comments[0].author.charAt(0)}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-800">
                          {post.comments[0].author}
                        </p>
                        <p className="text-sm text-gray-600">
                          {post.comments[0].content}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {formatDate(post.comments[0].createdAt)}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Expanded comments section */}
                {expandedComments[post.id] && post.comments.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-100 space-y-4">
                    <h3 className="text-sm font-medium text-gray-800">
                      Comments ({post.comments.length})
                    </h3>
                    {post.comments.map((comment) => (
                      <div
                        key={comment.id}
                        className="flex items-start space-x-3"
                      >
                        <div className="flex-shrink-0">
                          <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                            {comment.author.charAt(0)}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-800">
                            {comment.author}
                          </p>
                          <p className="text-sm text-gray-600">
                            {comment.content}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            {formatDate(comment.createdAt)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
