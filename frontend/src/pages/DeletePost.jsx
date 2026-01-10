import React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deletePost } from "../api/post.api";
import { Trash2 } from "lucide-react";
import toast from "react-hot-toast";

const DeletePost = ({ postId }) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: () => deletePost(postId),
    onSuccess: () => {
      toast.success("Post deleted");
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["my-posts"] });
    },
    onError: () => toast.error("Failed to delete post"),
  });

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      mutation.mutate();
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={mutation.isLoading}
      className="
        p-2 text-gray-500 hover:text-red-600 
        hover:bg-red-50 rounded-lg
        transition-all duration-200
        border border-gray-200 hover:border-red-200
        disabled:opacity-50
      "
      title="Delete post"
    >
      <Trash2 className="w-4 h-4" />
    </button>
  );
};

export default DeletePost;