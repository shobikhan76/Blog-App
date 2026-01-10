import express from "express";
import {
  createPost,
  getPosts,
  getPost,
  updatePost,
  deletePost,
} from "../controllers/post.controller.js";

import { protect } from "../middleware/auth.middleware.js";
import { postValidator } from "../validators/post.validator.js";
import { validate } from "../middleware/validate.middleware.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Posts
 *   description: Blog post management
 */

/**
 * @swagger
 * /api/posts:
 *   get:
 *     summary: Get all blog posts
 *     tags: [Posts]
 *     responses:
 *       200:
 *         description: List of blog posts
 */
router.get("/", getPosts);

/**
 * @swagger
 * /api/posts/{id}:
 *   get:
 *     summary: Get a single blog post
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Post ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Blog post found
 *       404:
 *         description: Post not found
 */
router.get("/:id", getPost);

/**
 * @swagger
 * /api/posts:
 *   post:
 *     summary: Create a new blog post
 *     tags: [Posts]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - content
 *             properties:
 *               title:
 *                 type: string
 *                 example: My First Blog
 *               content:
 *                 type: string
 *                 example: "<p>This is rich text content</p>"
 *     responses:
 *       201:
 *         description: Blog post created successfully
 *       401:
 *         description: Unauthorized
 */
router.post("/", protect, postValidator, validate, createPost);

/**
 * @swagger
 * /api/posts/{id}:
 *   put:
 *     summary: Update a blog post (Owner only)
 *     tags: [Posts]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Post ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - content
 *             properties:
 *               title:
 *                 type: string
 *                 example: Updated Blog Title
 *               content:
 *                 type: string
 *                 example: "<p>Updated rich text content</p>"
 *     responses:
 *       200:
 *         description: Blog post updated successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (Not post owner)
 *       404:
 *         description: Post not found
 */
router.put("/:id", protect, postValidator, validate, updatePost);

/**
 * @swagger
 * /api/posts/{id}:
 *   delete:
 *     summary: Delete a blog post (Owner only)
 *     tags: [Posts]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Post ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Blog post deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (Not post owner)
 *       404:
 *         description: Post not found
 */
router.delete("/:id", protect, deletePost);

export default router;
