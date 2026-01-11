import React, { useState } from "react";
import ReactQuill from "react-quill";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updatePost } from "../api/post.api";
import toast from "react-hot-toast";

const EditPost = ({ post, onClose }) => {
  const [title, setTitle] = useState(post.title);
  const [content, setContent] = useState(post.content);
  const [image , setImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(post.image || null);

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: () => {
  const formData = new FormData();
  formData.append("title", title);
  formData.append("content", content);
  if (image) formData.append("image", image);

  return updatePost(post._id, formData);
},

    onSuccess: () => {
      toast.success("Post updated");
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      setImage(null);

      onClose(); // close modal
    },
    onError: () => {
      toast.error("Update failed");
    },
  });

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded w-full max-w-xl">
        <h2 className="text-xl font-semibold mb-4">Edit Post</h2>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            mutation.mutate();
          }}
          className="space-y-4"
        >
          <input
            className="w-full border p-2 rounded"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />


          <ReactQuill value={content} onChange={setContent} />
<div>
  <label className="block mb-1 text-gray-600">Post Image</label>
  <input
    type="file"
    accept="image/*"
    onChange={(e) => {
      if (e.target.files && e.target.files[0]) {
        setImage(e.target.files[0]);
      }
    }}
    className="w-full border p-2 rounded"
  />
</div>
{image && (
  <img
    src={URL.createObjectURL(image)}
    alt="Preview"
    className="w-32 h-32 object-cover mt-2 rounded"
  />
)}

          <div className="flex justify-end gap-3 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={mutation.isPending}
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              {mutation.isPending ? "Updating..." : "Update"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPost;
