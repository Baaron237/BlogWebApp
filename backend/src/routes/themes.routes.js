import express from "express";
import { Theme } from "../models/index.js";
import { authenticateToken, isAdmin } from "../middleware/auth.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const themes = await Theme.findAll({
      order: [["createdAt", "DESC"]],
    });
    res.json(themes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put("/:id", authenticateToken, isAdmin, async (req, res) => {
  try {
    const {
      name,
      primaryColor,
      secondaryColor,
      backgroundColor,
      textColor,
      isActive,
    } = req.body;

    if (isActive) {
      await Theme.update({ isActive: false }, { where: { isActive: true } });
    }

    const theme = await Theme.findByPk(req.params.id);
    if (!theme) {
      return res.status(404).json({ error: "Theme not found" });
    }

    await theme.update({
      name,
      primaryColor,
      secondaryColor,
      backgroundColor,
      textColor,
      isActive,
    });

    res.json(theme);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
