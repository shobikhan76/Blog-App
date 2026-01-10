import React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deletePost } from "../api/post.api";
import toast from "react-hot-toast";

const DeletePost = ({ postId }) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: () => deletePost(postId),
    onSuccess: () => {
      toast.success("Post deleted");
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
    onError: () => {
      toast.error("Delete failed");
    },
  });

  const handleDelete = () => {
    if (!confirm("Are you sure you want to delete this post?")) return;
    mutation.mutate();
  };

  return (
    <button
      onClick={handleDelete}
      disabled={mutation.isPending}
      className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
    >
      {mutation.isPending ? "Deleting..." : "Delete"}
    </button>
  );
};

export default DeletePost;
