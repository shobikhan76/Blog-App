import React from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchPosts } from "../api/post.api";
import { Link } from "react-router-dom";
import Loading from "../components/ui/Loading";
import toast from "react-hot-toast";

const Posts = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["posts"],
    queryFn: fetchPosts,
  });

  if (isLoading) return <Loading message="Loading posts..." />;

  if (isError) {
    toast.error("Failed to load posts");
    return null;
  }

  const posts = data?.data ?? [];

  if (posts.length === 0) {
    return <div style={{ textAlign: "center" }}>No posts available</div>;
  }

  return (
    <div style={{ maxWidth: "700px", margin: "20px auto" }}>
      {posts.map((post) => (
        <Link key={post._id} to={`/posts/${post._id}`}>
          <h3>{post.title}</h3>
          <small>
            {post.author?.name} |{" "}
            {new Date(post.createdAt).toDateString()}
          </small>
          <hr />
        </Link>
      ))}
    </div>
  );
};

export default Posts;
