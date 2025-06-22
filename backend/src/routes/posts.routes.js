import express from "express";
import { Comment, Like, MediaUrls, Post, PostView, Reaction, User } from "../models/index.js";
import { authenticateToken, isAdmin } from "../middleware/auth.js";
import { upload } from "../middleware/upload.js";
import * as path from 'path';
import * as fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const posts = await Post.findAll({
      include: [
        {
          model: MediaUrls,
          as: "media_urls",
          attributes: ["id", "url", "content", "order"],
        },
        {
          model: User,
          as: "reactionsByUsers",
          attributes: ["username"],
          through: {
            attributes: ['emoji']
          }
        },
        {
          model: User,
          as: "likedByUsers",
          attributes: ["id"],
          through: { attributes: [] }
        },
      ],
      order: [["createdAt", "DESC"]],
    });
    res.status(200).json({ posts });
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ error: error.message });
  }
});

router.get("/:id", authenticateToken , async (req, res) => {
  try {
    const post = await Post.findOne({
      where: { id: req.params.id },
      include: [
        {
          model: MediaUrls,
          as: "media_urls",
          attributes: ["id", "url", "content", "order"],
        },
        {
          model: User,
          as: "reactionsByUsers",
          attributes: ["username"],
          through: {
            attributes: ['emoji']
          }
        },
        {
          model: User,
          as: "likedByUsers",
          attributes: ["id"],
          through: { attributes: [] }
        },
      ]
    });
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    const userId = req.user.id;
    const alreadyViewed = await PostView.findOne({
      where: {
        userId,
        postId: post.id,
      },
    });

    if (!alreadyViewed) {
      await PostView.create({ userId, postId: post.id });
      await post.update({ viewCount: post.viewCount + 1 });
    }

    res.status(200).json({ post });
  } catch (error) {
    console.error("Error fetching post:", error);
    res.status(500).json({ error: error.message });
  }
});

router.post("/", authenticateToken, isAdmin, upload.array("media", 5), async (req, res) => {
    try {
      const { title, content, illustrations } = req.body;
      const parsedIllustrations = JSON.parse(illustrations);

      const post = await Post.create({
        title,
        content,
        authorId: req.user.id,
      });

      await Promise.all(
        parsedIllustrations.map(async (illustration, index) => {
          await MediaUrls.create({
            postId: post.id,
            content: illustration.content,
            url: req.files[index] ? `${req.files[index].filename}` : '',
            order: index + 1
          })
        })
      );

      res.status(201).json({ post });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

router.put("/:id", authenticateToken, isAdmin, upload.array("media", 5), async (req, res) => {
    try {
      const { title, content, illustrations } = req.body;
      const parsedIllustrations = JSON.parse(illustrations);
      const post = await Post.findOne({
        where: {
          id: req.params.id,
          authorId: req.user.id,
        },
        include: ["media_urls"],
      });

      if (!post) {
        return res.status(404).json({ error: "Post not found" });
      }

      await Post.update({
        title,
        content,
      }, {
        where: {
          id: post.id,
        }
      });

      if (post.media_urls && post.media_urls.length > 0) {
        post.media_urls.forEach((media) => {
          if (media.url) {
            const filePath = path.resolve(__dirname, "../public/uploads", media.url);
            
            if (fs.existsSync(filePath)) {
              fs.unlinkSync(filePath);
            }
          }
        });
      }

      await Promise.all(
        parsedIllustrations.map(async (illustration, index) => {
          await MediaUrls.update({
            content: illustration.content,
            url: req.files[index] ? `${req.files[index].filename}` : '',
          },
          {
            where: {
              postId: post.id,
              order: index + 1
            }
          })
        })
      );
      res.status(200).json({ post });

    } catch (error) {
      console.log("Error to update post: ", error)
      res.status(500).json({ error: error.message });
    }
  }
);

router.delete("/:id", authenticateToken, isAdmin, async (req, res) => {
  try {
    const postId = req.params.id;

    const post = await Post.findOne({
      where: {
        id: postId,
        authorId: req.user.id,
      },
      include: ["media_urls"],
    });

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    if (post.media_urls && post.media_urls.length > 0) {

      post.media_urls.forEach((media) => {
        if (media.url) {
          const filePath = path.resolve(__dirname, "../public/uploads", media.url);
          
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          }
        }
      });
    }

    await MediaUrls.destroy({
      where: {
        postId: post.id,
      },
    });

    await Like.destroy({
      where: {
        postId: post.id,
      },
    });

    await PostView.destroy({
      where: {
        postId: post.id,
      },
    });

    await Comment.destroy({
      where: {
        postId: post.id,
      },
    });

    await post.destroy();

    res.status(200).json({ message: "Post and deleted successfully" });
  } catch (error) {
    console.error("Error deleting post: ", error);
    res.status(500).json({ error: error.message });
  }
});


router.put("/like/:postId", authenticateToken, async (req, res) => {
  try {
    const post = await Post.findByPk(req.params.postId);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    const userId = req.user.id;

    const alreadyLiked = await post.hasLikedByUser(userId);

    if (alreadyLiked) {
      await post.removeLikedByUser(userId);
      post.likeCount -= 1;
      await post.save();
      return res.status(200).json({ message: "Like removed", liked: false });
    } else {
      await post.addLikedByUser(userId);
      post.likeCount += 1;
      await post.save();
      return res.status(200).json({ message: "Post liked", liked: true });
    }
  } catch (error) {
    console.error("Like error:", error);
    res.status(500).json({ error: error.message });
  }
});

router.post("/:postId/react", authenticateToken, async (req, res) => {
  const { emoji } = req.body;
  const postId = req.params.postId;
  const userId = req.user.id;

  if (!emoji) {
    return res.status(400).json({ error: "Emoji is required" });
  }

  try {
    const post = await Post.findByPk(postId);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    const existingReaction = await Reaction.findOne({
      where: { userId, postId },
    });

    if (existingReaction) {
      existingReaction.emoji = emoji;
      await existingReaction.save();
      return res.status(200).json({ message: "Reaction updated", reaction: existingReaction });
    }

    const newReaction = await Reaction.create({
      userId,
      postId,
      emoji,
    });

    res.status(201).json({ message: "Reaction added", reaction: newReaction });
  } catch (error) {
    console.error("Reaction error:", error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
