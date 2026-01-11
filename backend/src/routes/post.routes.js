import express from "express";
import {
  createPost,
  getPosts,
  getPost,
  updatePost,
  deletePost,
} from "../controllers/post.controller.js";
import { upload } from "../middleware/multer.middleware.js";
import { protect } from "../middleware/auth.middleware.js";
import { postValidator } from "../validators/post.validator.js";
import { validate } from "../middleware/validate.middleware.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Posts
 *   description: Blog post management and operations
 */

/**
 * @swagger
 * /api/posts:
 *   get:
 *     summary: Retrieve all blog posts
 *     tags: [Posts]
 *     responses:
 *       200:
 *         description: List of blog posts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Post'
 */
router.get("/", getPosts);

/**
 * @swagger
 * /api/posts/{id}:
 *   get:
 *     summary: Retrieve a single blog post by ID
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID of the blog post
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Blog post found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       404:
 *         description: Blog post not found
 */
router.get("/:id", getPost);

/**
 * @swagger
 * /api/posts:
 *   post:
 *     summary: Create a new blog post with optional image upload
 *     tags: [Posts]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
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
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Optional image file to upload
 *     responses:
 *       201:
 *         description: Blog post created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       401:
 *         description: Unauthorized
 */
router.post("/", protect, upload.single("image"), postValidator, validate, createPost);

/**
 * @swagger
 * /api/posts/{id}:
 *   put:
 *     summary: Update an existing blog post (owner only)
 *     tags: [Posts]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID of the blog post to update
 *         required: true
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
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (not post owner)
 *       404:
 *         description: Blog post not found
 */
router.put("/:id", protect, upload.single("image"), postValidator, validate, updatePost);

/**
 * @swagger
 * /api/posts/{id}:
 *   delete:
 *     summary: Delete a blog post (owner only)
 *     tags: [Posts]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID of the blog post to delete
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Blog post deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (not post owner)
 *       404:
 *         description: Blog post not found
 */
router.delete("/:id", protect, deletePost);

export default router;
