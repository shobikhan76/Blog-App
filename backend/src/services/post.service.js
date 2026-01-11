import cloudinary from "../config/cloudinary.js"; // correct path
import fs from "fs";
import Post from "../models/post.model.js";

export const createPost = async ({ title, content, authorId, image }) => {
  // Service only saves to DB — no req, no files, no cloudinary here
  return await Post.create({
    title,
    content,
    author: authorId,
    image: image || null,
  });
};

// Get all posts with author info
export const getAllPosts = async () => {
  return await Post.find()
    .populate("author", "name email")
    .sort({ createdAt: -1 });
};

// Get single post by ID with author info
export const getPostById = async (postId) => {
  return await Post.findById(postId).populate("author", "name email");
};

// Update post with ownership check & image update
export const updatePost = async (postId, userId, updates) => {
  const post = await Post.findById(postId);
  if (!post) throw new Error("Post not found");
  if (post.author.toString() !== userId.toString())
    throw new Error("Not authorized");

  // Update all fields in updates including image if present
  Object.assign(post, updates);
  await post.save();
  return post;
};

// Delete post with ownership check
export const deletePost = async (postId, userId) => {
  const post = await Post.findById(postId);
  if (!post) throw new Error("Post not found");
  if (post.author.toString() !== userId.toString())
    throw new Error("Not authorized");

  await Post.findByIdAndDelete(postId);
};
