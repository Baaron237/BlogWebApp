import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: "mysql",
    logging: false,
  }
);

// Import models
import User from "./user.js";
import Post from "./post.js";
import Comment from "./comment.js";
import Theme from "./theme.js";

// Initialize models
User.init(sequelize);
Post.init(sequelize);
Comment.init(sequelize);
Theme.init(sequelize);

// Setup associations
User.hasMany(Post, { foreignKey: "authorId" });
Post.belongsTo(User, { foreignKey: "authorId" });

Post.hasMany(Comment, { foreignKey: "postId" });
Comment.belongsTo(Post, { foreignKey: "postId" });

export { sequelize as default, User, Post, Comment, Theme };
