import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchPosts } from "../api/post.api";
import { useNavigate } from "react-router-dom";
import Loading from "../components/ui/Loading";
import { motion } from "framer-motion";

const Posts = () => {
  const navigate = useNavigate();
  const [expandedPosts, setExpandedPosts] = useState(new Set());

  const { data: posts, isLoading, isError, error } = useQuery({
    queryKey: ["posts"],
    queryFn: fetchPosts,
    staleTime: 5 * 60 * 1000,
  });

  if (isLoading) return <Loading message="Loading stories..." />;
  if (isError)
    return (
      <div className="text-center text-red-600 mt-10">
        {error?.message || "Something went wrong while loading posts"}
      </div>
    );

  const postsArray = Array.isArray(posts) ? posts : posts?.data ?? [];

  const toggleExpand = (postId) => {
    setExpandedPosts((prev) => {
      const next = new Set(prev);
      if (next.has(postId)) {
        next.delete(postId);
      } else {
        next.add(postId);
      }
      return next;
    });
  };

  const getReadingTime = (content = "") => {
    const words = content.replace(/<[^>]*>/g, "").split(/\s+/).filter(Boolean).length;
    return Math.max(1, Math.ceil(words / 200));
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const diffDays = Math.floor((Date.now() - date.getTime()) / 86400000);

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays}d ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-gray-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl sm:text-5xl font-bold text-center mb-12 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          Latest Stories
        </h1>

        <div className="space-y-10">
          {postsArray.length === 0 ? (
            <div className="text-center py-20 text-gray-500">
              <div className="text-6xl mb-4">📭</div>
              <p className="text-xl">No posts available yet</p>
            </div>
          ) : (
            postsArray.map((post) => {
              const isExpanded = expandedPosts.has(post._id);
              const readingTime = getReadingTime(post.content);

              return (
                <motion.article
                  key={post._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="group bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100"
                >
                  {post.image && (
  <img
    src={post.image}
    alt={post.title}
    className="w-full h-48 object-cover rounded-lg mb-4"
  />
   )}

                  

                  {/* Title */}
                  <h2
                    onClick={() => navigate(`/posts/${post._id}`)}
                    className="px-6 text-2xl sm:text-3xl font-bold text-gray-900 mb-4 cursor-pointer group-hover:text-indigo-700 transition-colors"
                  >
                    {post.title}
                  </h2>

                  {/* Content */}
                  <div className="px-6 pb-6">
                    <div
                      className={`
                        prose prose-slate max-w-none
                        text-gray-700 leading-relaxed
                        transition-all duration-500
                        ${isExpanded ? "" : "line-clamp-5"}
                      `}
                      dangerouslySetInnerHTML={{ __html: post.content || "" }}
                    />

                    {/* Read more button - only shown when content is clamped */}
                    {!isExpanded && (
                      <button
                        onClick={() => toggleExpand(post._id)}
                        className="mt-4 text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-1.5 transition-colors"
                      >
                        Continue reading
                        <span className="text-lg leading-none">→</span>
                      </button>
                    )}

                    {isExpanded && (
                      <button
                        onClick={() => toggleExpand(post._id)}
                        className="mt-6 text-gray-500 hover:text-gray-700 text-sm font-medium flex items-center gap-1.5 transition-colors"
                      >
                        Show less
                        <span className="transform rotate-180 inline-block">→</span>
                      </button>
                    )}
                  </div>

                  {/* Quick actions */}
                  <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/40 flex gap-6 text-sm">
                    <button className="flex items-center gap-1.5 text-gray-600 hover:text-red-600 transition-colors">
                      🤍 <span>{post.likes || 0}</span>
                    </button>
                    <button className="flex items-center gap-1.5 text-gray-600 hover:text-indigo-600 transition-colors">
                      📑
                    </button>
                    <button className="flex items-center gap-1.5 text-gray-600 hover:text-blue-600 transition-colors">
                      💬 <span>{post.comments || 0}</span>
                    </button>
                  </div>
                </motion.article>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default Posts;