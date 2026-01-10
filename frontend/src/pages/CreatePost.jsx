import React, { useState } from "react";
import ReactQuill from "react-quill";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createPost } from "../api/post.api";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const CreatePost = ({ isOpen, onClose }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: () => createPost({ title, content }),
    onSuccess: () => {
      toast.success("Post created");
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      onClose(); // close modal on success
      
    },
    onError: () => toast.error("Create failed"),
  });

  if (!isOpen) return null; // Important: don't render if modal is closed

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          mutation.mutate();
        }}
        className="bg-white p-6 rounded w-full max-w-lg"
      >
        <h2 className="text-xl font-bold mb-4">Create Post</h2>

        <input
          className="border p-2 mb-3 w-full"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          required
        />
        <ReactQuill value={content} onChange={setContent} />

        <div className="mt-4 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border rounded"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={mutation.isLoading}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            {mutation.isLoading ? "Creating..." : "Create"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreatePost;
