import React, { useState, useRef, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchPosts } from "../api/post.api";
import { useNavigate } from "react-router-dom";
import Loading from "../components/ui/Loading";
import { motion, AnimatePresence } from "framer-motion";

const Posts = () => {
  const navigate = useNavigate();
  const [expandedPosts, setExpandedPosts] = useState(new Set());
  const [likedPosts, setLikedPosts] = useState(new Set());
  const [bookmarkedPosts, setBookmarkedPosts] = useState(new Set());
  const [contentHeights, setContentHeights] = useState({});

  const contentRefs = useRef(new Map());

  const { data: posts, isLoading, isError, error } = useQuery({
    queryKey: ["posts"],
    queryFn: fetchPosts,
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
  });

  // Measure content height when posts load or change
  useEffect(() => {
    const newHeights = {};
    contentRefs.current.forEach((el, postId) => {
      if (el) {
        newHeights[postId] = el.scrollHeight + 40; // small buffer
      }
    });
    setContentHeights(newHeights);
  }, [posts]);

  if (isLoading) return <Loading message="Loading posts..." />;

  if (isError) {
    return (
      <div className="text-center text-red-500 mt-10">
        {error?.message || "Failed to load posts."}
      </div>
    );
  }

  const postsArray = Array.isArray(posts) ? posts : posts?.data ?? [];

  const toggleLike = (postId) => {
    setLikedPosts((prev) => {
      const next = new Set(prev);
      next.has(postId) ? next.delete(postId) : next.add(postId);
      return next;
    });
  };

  const toggleBookmark = (postId) => {
    setBookmarkedPosts((prev) => {
      const next = new Set(prev);
      next.has(postId) ? next.delete(postId) : next.add(postId);
      return next;
    });
  };

  const toggleExpand = (postId) => {
    setExpandedPosts((prev) => {
      const next = new Set(prev);
      next.has(postId) ? next.delete(postId) : next.add(postId);
      return next;
    });
  };

  const getReadingTime = (content) => {
    const words = content?.replace(/<[^>]*>/g, "").split(/\s+/).length || 0;
    return Math.ceil(words / 200);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.ceil(Math.abs(now - date) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Latest Posts
          </h1>
          <p className="text-gray-600 text-lg">Discover insights, stories, and expertise</p>
        </motion.div>

        {/* Posts */}
        <AnimatePresence>
          {postsArray.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-20"
            >
              <div className="text-6xl mb-4">📝</div>
              <h3 className="text-xl font-semibold text-gray-600">No posts yet</h3>
            </motion.div>
          ) : (
            postsArray.map((post, index) => {
              const isExpanded = expandedPosts.has(post._id);
              const isLiked = likedPosts.has(post._id);
              const isBookmarked = bookmarkedPosts.has(post._id);
              const readingTime = getReadingTime(post.content);

              return (
                <motion.article
                  key={post._id}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.08 }}
                  className={`
                    bg-white/80 backdrop-blur-sm 
                    border border-white/30 rounded-2xl 
                    p-7 mb-8 shadow-lg hover:shadow-xl 
                    transition-all duration-300
                  `}
                >
                  {/* Category & Reading Time */}
                  <div className="flex items-center gap-3 mb-4">
                    <span className="px-3 py-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xs font-medium rounded-full">
                      {post.category || "General"}
                    </span>
                    <span className="text-sm text-gray-500">{readingTime} min read</span>
                  </div>

                  {/* Title */}
                  <h2
                    onClick={() => navigate(`/posts/${post._id}`)}
                    className="text-3xl font-bold text-gray-900 mb-4 cursor-pointer hover:text-blue-700 transition-colors"
                  >
                    {post.title}
                  </h2>

                  {/* Author */}
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-medium">
                      {post.author?.name?.[0] || "?"}
                    </div>
                    <div>
                      <p className="font-medium">{post.author?.name || "Anonymous"}</p>
                      <p className="text-sm text-gray-500">{formatDate(post.createdAt)}</p>
                    </div>
                  </div>

                  {/* Content with smooth expand */}
                  <div className="relative overflow-hidden">
                    <div
                      ref={(el) => {
                        if (el) contentRefs.current.set(post._id, el);
                      }}
                      className={`
                        prose prose-lg max-w-none text-gray-700
                        transition-all duration-500 ease-in-out
                      `}
                      style={{
                        maxHeight: isExpanded
                          ? `${contentHeights[post._id] || 2000}px`
                          : "180px",
                      }}
                      dangerouslySetInnerHTML={{ __html: post.content }}
                    />

                    {!isExpanded && (
                      <div className="absolute inset-x-0 bottom-0 h-24 pointer-events-none bg-gradient-to-t from-white via-white/90 to-transparent" />
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
                    <div className="flex items-center gap-5">
                      <button
                        onClick={() => toggleLike(post._id)}
                        className={`flex items-center gap-2 transition-colors ${
                          isLiked ? "text-red-600" : "text-gray-600 hover:text-red-500"
                        }`}
                      >
                        {isLiked ? "❤️" : "🤍"} <span>{post.likes || 0}</span>
                      </button>

                      <button
                        onClick={() => toggleBookmark(post._id)}
                        className={`transition-colors ${
                          isBookmarked ? "text-blue-600" : "text-gray-600 hover:text-blue-600"
                        }`}
                      >
                        {isBookmarked ? "🔖" : "📑"}
                      </button>

                      <button className="flex items-center gap-2 text-gray-600">
                        💬 <span>{post.comments || 0}</span>
                      </button>
                    </div>

                    <button
                      onClick={() => toggleExpand(post._id)}
                      className="flex items-center gap-1.5 text-blue-600 hover:text-blue-800 font-medium transition-colors"
                    >
                      {isExpanded ? "Show less" : "Read more"}
                      <svg
                        className={`w-4 h-4 transition-transform duration-300 ${
                          isExpanded ? "rotate-180" : ""
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  </div>

                  {/* Tags */}
                  {post.tags?.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-6">
                      {post.tags.map((tag, i) => (
                        <span
                          key={i}
                          className="px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-full hover:bg-blue-100 transition-colors"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </motion.article>
              );
            })
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Posts;