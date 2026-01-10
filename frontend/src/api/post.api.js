// src/api/post.api.js
import axios from "./axios";

export const fetchPosts = async () => {
  const { data } = await axios.get("/posts");
  return data?.data ?? data;
};

export const fetchPost = async (id) => {
  const { data } = await axios.get(`/posts/${id}`);
  return data?.data ?? data;
};

export const createPost = async (post) => {
  const { data } = await axios.post("/posts", post);
  return data?.data ?? data;
};

export const updatePost = async (id, post) => {
  const { data } = await axios.put(`/posts/${id}`, post);
  return data?.data ?? data;
};

export const deletePost = async (id) => {
  const { data } = await axios.delete(`/posts/${id}`);
  return data?.data ?? data;
};
