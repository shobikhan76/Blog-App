import React, { useState } from "react";
import ReactQuill from "react-quill";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createPost } from "../api/post.api";
import { X } from "lucide-react";
import toast from "react-hot-toast";
import "react-quill/dist/quill.snow.css";

const CreatePost = ({ isOpen, onClose }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const queryClient = useQueryClient();
  const [image , setImage ] = useState(null)

  const mutation = useMutation({
   mutationFn: () => {
  const formData = new FormData();
  formData.append("title", title);
  formData.append("content", content);
  if (image) formData.append("image", image);

  return createPost(formData);
},

    onSuccess: () => {
      toast.success("Post created!");
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["my-posts"] });
      setTitle("");
      setContent("");
      setImage(null)
      onClose();
      
    },
    onError: () => toast.error("Failed to create post"),
  });

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Create New Post</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            mutation.mutate();
          }}
          className="p-4 space-y-4 overflow-y-auto max-h-[calc(90vh-120px)]"
        >
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Post title..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
            required
          />
          
          <div className="border border-gray-300 rounded-lg overflow-hidden">
            <ReactQuill 
              value={content} 
              onChange={setContent}
              className="h-64"
              placeholder="Write your post content..."
            />
          </div>
          <input
  type="file"
  accept="image/*"
  onChange={(e) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  }}
  className="w-full border border-gray-300 rounded-lg px-3 py-2"
/>
{image && (
  <img
    src={URL.createObjectURL(image)}
    alt="Preview"
    className="w-32 h-32 object-cover mt-2 rounded"
  />
)}

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={mutation.isLoading || !title || !content}
              className="
                px-6 py-2 bg-blue-600 text-white rounded-lg
                hover:bg-blue-700 disabled:opacity-50
                transition-colors font-medium
              "
            >
              {mutation.isLoading ? "Creating..." : "Create Post"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePost;