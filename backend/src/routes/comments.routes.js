import express from "express";
import { Comment, Post } from "../models/index.js";

const router = express.Router();

router.get("/:postId", async (req, res) => {
  try {
    const comments = await Comment.findAll({
      where: { postId: req.params.postId },
      order: [["createdAt", "DESC"]],
    });
    res.status(200).json({ comments });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const { postId, emoji } = req.body;
    const comment = await Comment.create({ postId, emoji });

    await Post.increment("commentCount", { where: { id: postId } });

    res.status(201).json({ comment });
  } catch (error) {
    console.error("Error creating comment:", error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
