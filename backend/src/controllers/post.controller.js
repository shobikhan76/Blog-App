import cloudinary from "../config/cloudinary.js";
import fs from "fs";
import * as postService from "../services/post.service.js";

export const createPost = async (req, res) => {
  try {
    
    const { title, content } = req.body;
    let imageUrl = null;

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "posts",
      });
      imageUrl = result.secure_url;

      // remove temp local file
      fs.unlinkSync(req.file.path);
    }

    const post = await postService.createPost({
      title,
      content,
      authorId: req.user._id,
      image: imageUrl,
    });

    res.status(201).json({ success: true, data: post });
  } catch (err) {
    console.log(err); // log the real error
    res.status(500).json({ success: false, message: err.message });
  }
};

    
  


export const getPosts = async (req, res) => {
  try {
    const posts = await postService.getAllPosts();
    res.json({ success: true, data: posts });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getPost = async (req, res) => {
  try {
    const post = await postService.getPostById(req.params.id);
    if (!post)
      return res.status(404).json({ success: false, message: "Post not found" });
    res.json({ success: true, data: post });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const updatePost = async (req, res) => {
  try {
    const updates = { ...req.body };

    // If image uploaded, update the image field too
    if (req.file) {
      updates.image = req.file.path;
    }

    const post = await postService.updatePost(req.params.id, req.user._id, updates);
    res.json({ success: true, data: post });
  } catch (err) {
    if (err.message === "Post not found") {
      res.status(404).json({ success: false, message: err.message });
    } else if (err.message === "Not authorized") {
      res.status(403).json({ success: false, message: err.message });
    } else {
      res.status(500).json({ success: false, message: err.message });
    }
  }
};

export const deletePost = async (req, res) => {
  try {
    await postService.deletePost(req.params.id, req.user._id);
    res.json({ success: true, message: "Post deleted" });
  } catch (err) {
    if (err.message === "Post not found") {
      res.status(404).json({ success: false, message: err.message });
    } else if (err.message === "Not authorized") {
      res.status(403).json({ success: false, message: err.message });
    } else {
      res.status(500).json({ success: false, message: err.message });
    }
  }
};
