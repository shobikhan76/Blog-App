import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchPosts } from "../api/post.api";
import EditPost from "./EditPost";
import DeletePost from "./DeletePost";
import { Edit, Trash2, Calendar, Eye, Clock } from "lucide-react";

const MyPostsList = () => {
  const { data: posts = [], isLoading, isError } = useQuery({
    queryKey: ["posts"],
    queryFn: fetchPosts,
  });

  const user = JSON.parse(localStorage.getItem("user"));
  const [editingPost, setEditingPost] = useState(null);

  // Filter user's posts
  const myPosts = posts.filter((post) => {
    if (!post.author || !user) return false;
    if (typeof post.author === "object") {
      return post.author._id === user._id || post.author._id === user.id;
    }
    return post.author === user._id || post.author === user.id;
  });

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  // Get reading time
  const getReadingTime = (content) => {
    const wordsPerMinute = 200;
    const wordCount = content?.replace(/<[^>]*>/g, '').split(/\s+/).length || 0;
    return Math.ceil(wordCount / wordsPerMinute);
  };

  if (isLoading) return <LoadingState />;
  if (isError) return <ErrorState />;
  if (!user) return <EmptyState message="Please login to view your posts." />;
  if (myPosts.length === 0) return <EmptyState message="You haven't created any posts yet." />;

  return (
    <div className="space-y-4">
      {/* Posts Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-900">
          Your Posts ({myPosts.length})
        </h3>
        <div className="text-sm text-gray-500">
          Last updated: {formatDate(new Date().toISOString())}
        </div>
      </div>

      {/* Posts List */}
      <div className="grid gap-4">
        {myPosts.map((post) => (
          <PostCard
            key={post._id}
            post={post}
            onEdit={() => setEditingPost(post)}
            formatDate={formatDate}
            getReadingTime={getReadingTime}
          />
        ))}
      </div>

      {/* Edit Modal */}
      {editingPost && (
        <EditPost post={editingPost} onClose={() => setEditingPost(null)} />
      )}
    </div>
  );
};

// Post Card Component
const PostCard = ({ post, onEdit, formatDate, getReadingTime }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className="
        bg-white rounded-lg border border-gray-200 
        hover:shadow-md hover:border-gray-300 
        transition-all duration-200
        overflow-hidden
      "
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="p-6">
        <div className="flex justify-between items-start gap-4">
          {/* Post Content */}
          <div className="flex-1 min-w-0">
            {/* Post Image */}
   {post.image && (
  <img
    src={post.image}
    alt={post.title}
    className="w-full h-48 object-cover rounded-lg mb-4"
  />
   )}

            <h4 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
              {post.title}
            </h4>
            
            {/* Post Meta */}
            <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(post.createdAt)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{getReadingTime(post.content)} min read</span>
              </div>
              <div className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                <span>{post.views || 0} views</span>
              </div>
            </div>

            {/* Post Content Preview */}
            <div 
              className="text-gray-600 text-sm line-clamp-3"
              dangerouslySetInnerHTML={{ 
                __html: post.content?.substring(0, 200) + '...' || '' 
              }}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 flex-shrink-0">
            <button
              onClick={onEdit}
              className="
                p-2 text-gray-500 hover:text-blue-600 
                hover:bg-blue-50 rounded-lg
                transition-all duration-200
                border border-gray-200 hover:border-blue-200
              "
              title="Edit post"
            >
              <Edit className="w-4 h-4" />
            </button>

            <DeletePost postId={post._id} />
          </div>
        </div>
      </div>

      {/* Hover Actions Bar */}
      <div className={`
        bg-gray-50 px-6 py-3 border-t border-gray-100
        transition-all duration-200
        ${isHovered ? 'opacity-100' : 'opacity-0 h-0 py-0 border-0'}
      `}>
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500">
            {post.status === 'draft' ? '📝 Draft' : '🚀 Published'}
          </div>
          <div className="text-xs text-gray-400">
            ID: {post._id.slice(-6)}
          </div>
        </div>
      </div>
    </div>
  );
};

// Loading State
const LoadingState = () => (
  <div className="flex flex-col items-center justify-center py-12">
    <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-3"></div>
    <p className="text-gray-600">Loading your posts...</p>
  </div>
);

// Error State
const ErrorState = () => (
  <div className="text-center py-12">
    <div className="text-red-500 text-lg mb-2">⚠️ Failed to load posts</div>
    <p className="text-gray-600">Please try refreshing the page</p>
  </div>
);

// Empty State
const EmptyState = ({ message }) => (
  <div className="text-center py-12">
    <div className="text-gray-400 text-5xl mb-4">📝</div>
    <p className="text-gray-600 text-lg">{message}</p>
  </div>
);

export default MyPostsList;