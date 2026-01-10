import React from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchPosts } from "../api/post.api";
import Loading from "../components/ui/Loading";

const Posts = () => {
  const { data: posts, isLoading, isError, error } = useQuery({
    queryKey: ["posts"],
    queryFn: fetchPosts,
  });

  if (isLoading) return <Loading message="Loading posts..." />;

  if (isError)
    return (
      <div className="text-center text-red-500 mt-10">
        {error?.message || "Failed to load posts."}
      </div>
    );

  const postsArray = Array.isArray(posts) ? posts : posts?.data ?? [];

  return (
    <div className="max-w-3xl mx-auto mt-6 space-y-6">
      {postsArray.length === 0 ? (
        <div className="text-center text-gray-500 mt-10">
          No posts available.
        </div>
      ) : (
        postsArray.map((post) => (
          <div
            key={post._id}
            className="border p-5 rounded shadow-sm bg-white"
          >
            {/* ✅ Title */}
            <h2 className="text-2xl font-bold mb-1">{post.title}</h2>

            {/* ✅ Author + Date */}
            <p className="text-gray-500 text-sm mb-3">
              By <span className="font-medium">{post.author?.name || "Unknown"}</span>{" "}
              | {new Date(post.createdAt).toLocaleDateString()}
            </p>

            {/* ✅ Full Content */}
            <div
              className="text-gray-800 prose max-w-none"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </div>
        ))
      )}
    </div>
  );
};

export default Posts;
