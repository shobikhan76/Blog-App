import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchPosts } from "../api/post.api";
import EditPost from "./EditPost";
import DeletePost from "./DeletePost";

const MyPostsList = () => {
  // ✅ get all posts (API already sends JWT via axios interceptor)
  const { data: posts = [], isLoading, isError } = useQuery({
    queryKey: ["posts"],
    queryFn: fetchPosts,
  });

  // ✅ get logged in user
  const user = JSON.parse(localStorage.getItem("user"));

  // ✅ filter only my posts
  const myPosts = posts.filter((post) => {
    if (!post.author || !user) return false;

    // if author is object
    if (typeof post.author === "object") {
      return post.author._id === user._id || post.author._id === user.id;
    }

    // if author is string id
    return post.author === user._id || post.author === user.id;
  });

  const [editingPost, setEditingPost] = useState(null);

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Failed to load posts</p>;
  if (!user) return <p>Please login first.</p>;
  if (myPosts.length === 0) return <p>You have not created any posts yet.</p>;

  return (
    <div className="grid gap-4">
      {myPosts.map((post) => (
        <div
          key={post._id}
          className="border p-4 rounded shadow flex justify-between items-start"
        >
          <div className="max-w-xl">
            <h4 className="font-semibold text-lg">{post.title}</h4>
            <div
              className="text-gray-700 mt-2"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </div>

          <div className="flex flex-col gap-2">
            <button
              className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
              onClick={() => setEditingPost(post)}
            >
              Edit
            </button>

            <DeletePost postId={post._id} />
          </div>
        </div>
      ))}

      {/* ✅ Edit Modal */}
      {editingPost && (
        <EditPost post={editingPost} onClose={() => setEditingPost(null)} />
      )}
    </div>
  );
};

export default MyPostsList;
