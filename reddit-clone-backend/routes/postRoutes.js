import express from "express";
import {
  createPost,
  getPosts,
  getPost,
  updatePost,
  deletePost,
} from "../controller/postController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

// Apply authentication middleware to all post routes
router.use(protect);

// Post routes
router.post("/", createPost);
router.get("/", getPosts);
router.get("/:id", getPost);
router.put("/:id", updatePost);
router.delete("/:id", deletePost);

export default router;
