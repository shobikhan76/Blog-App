import * as postService from "../services/post.service.js";

export const createPost = async (req, res) => {
  try {
    const post = await postService.createPost({ 
      ...req.body, 
      authorId: req.user._id 
    });
    res.status(201).json({ success: true, data: post });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getPosts = async (req, res) => {
  const posts = await postService.getAllPosts();
  res.json({ success: true, data: posts });
};

export const getPost = async (req, res) => {
  const post = await postService.getPostById(req.params.id);
  if (!post) return res.status(404).json({ success: false, message: "Post not found" });
  res.json({ success: true, data: post });
};

export const updatePost = async (req, res) => {
  try {
    const post = await postService.updatePost(req.params.id, req.user._id, req.body);
    res.json({ success: true, data: post });
  } catch (err) {
    res.status(403).json({ success: false, message: err.message });
  }
};

export const deletePost = async (req, res) => {
  try {
    await postService.deletePost(req.params.id, req.user._id);
    res.json({ success: true, message: "Post deleted" });
  } catch (err) {
    res.status(403).json({ success: false, message: err.message });
  }
};

