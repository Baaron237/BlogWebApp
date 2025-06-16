import express from "express";
import { Post, Comment } from "../models/index.js";
import { authenticateToken, isAdmin } from "../middleware/auth.js";

const router = express.Router();

router.get("/", authenticateToken, isAdmin, async (req, res) => {
  try {
    const [totalViews, totalLikes, totalComments] = await Promise.all([
      Post.sum("viewCount"),
      Post.sum("likeCount"),
      Comment.count(),
    ]);

    res.status(200).json({
      totalViews: totalViews || 0,
      totalLikes: totalLikes || 0,
      totalComments: totalComments || 0,
    });
  } catch (error) {
    console.log("Error fetching analytics:", error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
