import express from "express";
import { Post } from "../models/index.js";
import { authenticateToken, isAdmin } from "../middleware/auth.js";
import { upload } from "../middleware/upload.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const posts = await Post.findAll({
      order: [["createdAt", "DESC"]],
    });
    res.status(200).json({ posts });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findByPk(req.params.id);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }
    res.status(200).json({ post });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post(
  "/",
  authenticateToken,
  isAdmin,
  upload.array("media"),
  async (req, res) => {
    try {
      const { title, content } = req.body;
      const mediaUrls = req.files
        ? req.files.map((file) => `/uploads/${file.filename}`)
        : [];

      const post = await Post.create({
        title,
        content,
        mediaUrls,
        authorId: req.user.id,
      });

      res.status(201).json(post);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

router.put(
  "/:id",
  authenticateToken,
  isAdmin,
  upload.array("media"),
  async (req, res) => {
    try {
      const { title, content } = req.body;
      const mediaUrls = req.files
        ? req.files.map((file) => `/uploads/${file.filename}`)
        : [];

      const post = await Post.findOne({
        where: {
          id: req.params.id,
          authorId: req.user.id,
        },
      });

      if (!post) {
        return res.status(404).json({ error: "Post not found" });
      }

      await post.update({
        title,
        content,
        mediaUrls,
      });

      res.status(200).json({ post });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

router.delete("/:id", authenticateToken, isAdmin, async (req, res) => {
  try {
    const deleted = await Post.destroy({
      where: {
        id: req.params.id,
        authorId: req.user.id,
      },
    });

    if (!deleted) {
      return res.status(404).json({ error: "Post not found" });
    }

    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
