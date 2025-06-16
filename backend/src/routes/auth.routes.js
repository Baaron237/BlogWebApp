import express from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/index.js";
import bcryptjs from "bcryptjs";

const router = express.Router();

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ where: { username } });

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const isMatch = bcryptjs.compareSync(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user.id, isAdmin: user.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        isAdmin: user.isAdmin,
      },
    });
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
