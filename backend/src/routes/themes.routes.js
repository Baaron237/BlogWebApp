import express from "express";
import { Theme } from "../models/index.js";
import { authenticateToken, isAdmin } from "../middleware/auth.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const themes = await Theme.findAll({
      order: [["createdAt", "DESC"]],
    });
    res.status(200).json({ themes });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/", authenticateToken, isAdmin, async (req, res) => {
  try {
    const {
      name,
      primaryColor,
      secondaryColor,
      backgroundColor,
      textColor,
      isActive,
    } = req.body;

    const newTheme = await Theme.create({
      name,
      primaryColor,
      secondaryColor,
      backgroundColor,
      textColor,
      isActive,
    });

    res.status(201).json({ theme: newTheme });
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.error("Error creating theme:", error);
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
    } else {
      await Theme.update({ isActive: true }, { where: { isActive: false } });
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

    res.status(200).json({ theme });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete("/:id", authenticateToken, isAdmin, async (req, res) => {
  try {
    const theme = await Theme.findByPk(req.params.id);
    if (!theme) {
      return res.status(404).json({ error: "Theme not found" });
    }

    await theme.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
