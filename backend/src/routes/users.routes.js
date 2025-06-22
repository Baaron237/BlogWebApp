import express from "express";
import jwt from "jsonwebtoken";
import { authenticateToken, isAdmin } from "../middleware/auth.js";;
import { PostView, User } from "../models/index.js";

const router = express.Router();

router.get("/", authenticateToken, isAdmin, async (req, res) => {
  try {
    const users = await User.findAll({
      where: { isAdmin: false}
    },{
      attributes: { exclude: ["password", "createdAt", "updatedAt"] },
      order: [["createdAt", "DESC"]],
    });
    res.status(200).json({ users });
  } catch (error) {
    console.error("Error fetching users:", error);  
    res.status(500).json({ error: "Internal server error" });
  } 
}
);

router.get("/:id", authenticateToken, isAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json({ user });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
);

router.delete("/:id", authenticateToken, isAdmin, async (req, res) => { 
  const { id } = req.params;
  try {
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    await PostView.destroy({
      where: {
        userId: user.id
      }
    })
    await user.destroy();
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
} 
);

export default router;
