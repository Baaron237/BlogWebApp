import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Import routes

import analyticsRoutes from "./src/routes/analytics.routes.js";
import authRoutes from "./src/routes/auth.routes.js";
import commentsRoutes from "./src/routes/comments.routes.js";
import postsRoutes from "./src/routes/posts.routes.js";
import themesRoutes from "./src/routes/themes.routes.js";
import usersRoutes from "./src/routes/users.routes.js";

// Import database configuration
import { dbConnection } from "./src/config/db.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Middleware
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "src/public/uploads")));

// Routes
app.use("/api/users", usersRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/comments", commentsRoutes);
app.use("/api/posts", postsRoutes);
app.use("/api/themes", themesRoutes);

app.listen(port, async () => {
  await dbConnection();
  console.log(`Server running on port ${port}`);
});
