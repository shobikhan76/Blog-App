import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchPosts } from "../api/post.api";
import { useNavigate } from "react-router-dom";
import Loading from "../components/ui/Loading";
import { motion, AnimatePresence } from "framer-motion";

const Posts = () => {
  const navigate = useNavigate();
  const [expandedPost, setExpandedPost] = useState(null);
  const [hoveredPost, setHoveredPost] = useState(null);
  const [likedPosts, setLikedPosts] = useState(new Set());
  const [bookmarkedPosts, setBookmarkedPosts] = useState(new Set());

  const { data: posts, isLoading, isError, error } = useQuery({
    queryKey: ["posts"],
    queryFn: fetchPosts,
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
  });

  if (isLoading) return <Loading message="Loading posts..." />;

  if (isError)
    return (
      <div className="text-center text-red-500 mt-10">
        {error?.message || "Failed to load posts."}
      </div>
    );

  const postsArray = Array.isArray(posts) ? posts : posts?.data ?? [];

  const toggleLike = (postId) => {
    setLikedPosts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
      } else {
        newSet.add(postId);
      }
      return newSet;
    });
  };

  const toggleBookmark = (postId) => {
    setBookmarkedPosts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
      } else {
        newSet.add(postId);
      }
      return newSet;
    });
  };

  const getReadingTime = (content) => {
    const wordsPerMinute = 200;
    const wordCount = content?.replace(/<[^>]*>/g, '').split(/\s+/).length || 0;
    return Math.ceil(wordCount / wordsPerMinute);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-12">
      <div className="max-w-5xl mx-auto px-4">
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Latest Posts
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Discover insights, stories, and expertise from our community
          </p>
        </motion.div>

        {/* Filter Bar */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-wrap gap-4 mb-8 justify-center"
        >
          {['All', 'Technology', 'Business', 'Design', 'Lifestyle'].map((category, index) => (
            <button
              key={category}
              className="px-6 py-2 rounded-full bg-white border-2 border-gray-200 text-gray-700 hover:border-blue-500 hover:text-blue-600 transition-all duration-300 hover:shadow-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {category}
            </button>
          ))}
        </motion.div>

        {/* Posts Grid */}
        <div className="space-y-6">
          <AnimatePresence>
            {postsArray.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="text-center py-20"
              >
                <div className="text-6xl mb-4">📝</div>
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No posts available</h3>
                <p className="text-gray-500">Check back later for new content!</p>
              </motion.div>
            ) : (
              postsArray.map((post, index) => {
                const isExpanded = expandedPost === post._id;
                const isLiked = likedPosts.has(post._id);
                const isBookmarked = bookmarkedPosts.has(post._id);
                const readingTime = getReadingTime(post.content);

                return (
                  <motion.article
                    key={post._id}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -5 }}
                    onHoverStart={() => setHoveredPost(post._id)}
                    onHoverEnd={() => setHoveredPost(null)}
                    className={`
                      bg-white/80 backdrop-blur-sm
                      border border-white/20
                      rounded-3xl
                      p-8
                      shadow-[0_8px_32px_rgba(0,0,0,0.08)]
                      hover:shadow-[0_16px_48px_rgba(0,0,0,0.12)]
                      transition-all duration-500
                      relative overflow-hidden
                      ${hoveredPost === post._id ? 'ring-2 ring-blue-500/50' : ''}
                    `}
                  >
                    {/* Background Gradient Effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 hover:opacity-100 transition-opacity duration-500" />
                    
                    {/* Category Badge */}
                    <div className="flex items-center gap-3 mb-4">
                      <span className="px-3 py-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs font-semibold rounded-full">
                        {post.category || 'General'}
                      </span>
                      <span className="text-gray-500 text-sm">
                        {readingTime} min read
                      </span>
                    </div>

                    {/* Title with Hover Effect */}
                    <motion.h2
                      onClick={() => navigate(`/posts/${post._id}`)}
                      className="
                        text-3xl font-bold text-gray-900 mb-3
                        cursor-pointer relative
                        bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent
                        hover:from-blue-600 hover:to-purple-600
                        transition-all duration-300
                      "
                      whileHover={{ x: 5 }}
                    >
                      {post.title}
                      <motion.div
                        className="absolute -left-6 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full"
                        initial={{ scaleY: 0 }}
                        whileHover={{ scaleY: 1 }}
                        transition={{ duration: 0.2 }}
                      />
                    </motion.h2>

                    {/* Author & Date with Enhanced Styling */}
                    <div className="flex items-center gap-4 mb-6">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                          {post.author?.name?.charAt(0) || 'A'}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-700">
                            {post.author?.name || "Unknown Author"}
                          </p>
                          <p className="text-xs text-gray-500">
                            {formatDate(post.createdAt)}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Content with Smooth Expansion */}
                    <div className="relative">
  <div
    className={`
      prose prose-lg max-w-none text-gray-700 transition-all duration-300
      ${isExpanded ? 'max-h-none' : 'max-h-40 overflow-hidden'}
    `}
    dangerouslySetInnerHTML={{ __html: post.content }}
  />

  {!isExpanded && (
    <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-white to-transparent pointer-events-none" />
  )}
</div>


                    {/* Interactive Actions Bar */}
                    <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-100">
                      <div className="flex items-center gap-4">
                        {/* Like Button */}
                        <motion.button
                          onClick={() => toggleLike(post._id)}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className={`
                            flex items-center gap-2 px-4 py-2 rounded-full
                            transition-all duration-300
                            ${isLiked 
                              ? 'bg-red-100 text-red-600 border-2 border-red-200' 
                              : 'bg-gray-100 text-gray-600 hover:bg-red-50 hover:text-red-500'
                            }
                          `}
                        >
                          <motion.span
                            animate={{ scale: isLiked ? [1, 1.2, 1] : 1 }}
                            transition={{ duration: 0.2 }}
                          >
                            {isLiked ? '❤️' : '🤍'}
                          </motion.span>
                          <span className="text-sm font-medium">
                            {post.likes || 0}
                          </span>
                        </motion.button>

                        {/* Bookmark Button */}
                        <motion.button
                          onClick={() => toggleBookmark(post._id)}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className={`
                            p-2 rounded-full transition-all duration-300
                            ${isBookmarked 
                              ? 'bg-blue-100 text-blue-600' 
                              : 'bg-gray-100 text-gray-600 hover:bg-blue-50 hover:text-blue-500'
                            }
                          `}
                        >
                          {isBookmarked ? '🔖' : '📑'}
                        </motion.button>

                        {/* Comments */}
                        <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 text-gray-600 hover:bg-blue-50 hover:text-blue-500 transition-all duration-300">
                          <span>💬</span>
                          <span className="text-sm font-medium">
                            {post.comments || 0}
                          </span>
                        </button>
                      </div>

                      <div className="flex items-center gap-3">
                        {/* Read More Toggle */}
                        <button
  onClick={() =>
    setExpandedPost(isExpanded ? null : post._id)
  }
  className="text-sm font-semibold text-blue-600 hover:underline flex items-center gap-1"
>
  {isExpanded ? "Show less" : "Read more"}
  <span className={`transition-transform ${isExpanded ? "rotate-180" : ""}`}>
    ▼
  </span>
</button>


                     
                      </div>
                    </div>

                    {/* Tags Section */}
                    {post.tags && post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-6">
                        {post.tags.map((tag, tagIndex) => (
                          <span
                            key={tagIndex}
                            className="px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-full hover:bg-blue-100 hover:text-blue-600 transition-colors cursor-pointer"
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

        {/* Load More Button */}
        {postsArray.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center mt-12"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="
                px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600
                text-white font-semibold rounded-full
                hover:from-blue-700 hover:to-purple-700
                transition-all duration-300
                shadow-lg hover:shadow-xl
              "
            >
              Load More Posts
            </motion.button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Posts;