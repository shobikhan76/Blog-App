import Post from "../models/post.model.js";

// Create post
export const createPost = async ({ title, content, authorId }) => {
  return await Post.create({ title, content, author: authorId });
};

// Get all posts
export const getAllPosts = async () => {
  return await Post.find().populate("author", "name email").sort({ createdAt: -1 });
};

// Get single post
export const getPostById = async (postId) => {
  return await Post.findById(postId).populate("author", "name email");
};

// Update post with ownership check
export const updatePost = async (postId, userId, updates) => {
  const post = await Post.findById(postId);
  if (!post) throw new Error("Post not found");
  if (post.author.toString() !== userId.toString()) throw new Error("Not authorized");

  Object.assign(post, updates);
  await post.save();
  return post;
};


export const deletePost = async (postId, userId) => {
  const post = await Post.findById(postId);
  if (!post) throw new Error("Post not found");
  if (post.author.toString() !== userId.toString()) throw new Error("Not authorized");

  await Post.findByIdAndDelete(postId); // <-- fixed
};
