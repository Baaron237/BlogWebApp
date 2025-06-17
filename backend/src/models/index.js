import { sequelize } from "../config/db.js";


import User from "./user.js";
import Post from "./post.js";
import Comment from "./comment.js";
import Theme from "./theme.js";
import MediaUrls from "./mediaUrls.js";


// Initialize models
User.init(sequelize);
Post.init(sequelize);
Comment.init(sequelize);
Theme.init(sequelize);
MediaUrls.init(sequelize);

// Setup associations
User.hasMany(Post, { foreignKey: "authorId" });
Post.belongsTo(User, { foreignKey: "authorId" });

Post.hasMany(Comment, { foreignKey: "postId" });
Comment.belongsTo(Post, { foreignKey: "postId" });

Post.hasMany(MediaUrls, { foreignKey: "postId", as: "media_urls" });
MediaUrls.belongsTo(Post, { foreignKey: "postId" });

export { sequelize, User, Post, Comment, Theme, MediaUrls };
