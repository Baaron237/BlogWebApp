import express from "express";
import { Comment, Post, User } from "../models/index.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

router.get("/:postId", async (req, res) => {
  try {
    const comments = await Comment.findAll({
      where: { postId: req.params.postId },
      include: [
        {
          model: User,
          as: "author",
          attributes: ["id", "username"], 
        }
      ],
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json({ comments });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


router.post("/", authenticateToken, async (req, res) => {
  try {
    const { postId, message } = req.body;
    const userId = req.user.id;

    const comment = await Comment.create({ postId, message, userId });

    await Post.increment("commentCount", { where: { id: postId } });

    res.status(201).json({ comment });
  } catch (error) {
    console.error("Error creating comment:", error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
