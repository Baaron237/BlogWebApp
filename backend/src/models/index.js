import { sequelize } from "../config/db.js";


import User from "./user.js";
import Post from "./post.js";
import Comment from "./comment.js";
import Theme from "./theme.js";
import MediaUrls from "./mediaUrls.js";
import Like from "./like.js";
import PostView from "./postView.js";
import Reaction from "./reaction.js";


// Initialize models
User.init(sequelize);
Post.init(sequelize);
Comment.init(sequelize);
Theme.init(sequelize);
MediaUrls.init(sequelize);
Like.init(sequelize);
PostView.init(sequelize);
Reaction.init(sequelize);

// Setup associations
User.hasMany(Post, { foreignKey: "authorId" });
Post.belongsTo(User, { foreignKey: "authorId" });

Post.hasMany(Comment, { foreignKey: "postId" });
Comment.belongsTo(Post, { foreignKey: "postId" });

Post.hasMany(MediaUrls, { foreignKey: "postId", as: "media_urls" });
MediaUrls.belongsTo(Post, { foreignKey: "postId" });

User.belongsToMany(Post, { through: Like, as: 'likedPosts', foreignKey: 'userId' });
Post.belongsToMany(User, { through: Like, as: 'likedByUsers', foreignKey: 'postId' });

Like.belongsTo(User, { foreignKey: 'userId' });
Like.belongsTo(Post, { foreignKey: 'postId' });

User.hasMany(Comment, { foreignKey: 'userId', as: 'comments' });
Comment.belongsTo(User, { foreignKey: 'userId', as: 'author' });

PostView.belongsTo(User, { foreignKey: "userId" });
PostView.belongsTo(Post, { foreignKey: "postId" });

User.belongsToMany(Post, { through: Reaction, as: 'reactionToPosts', foreignKey: 'userId' });
Post.belongsToMany(User, { through: Reaction, as: 'reactionsByUsers', foreignKey: 'postId' });

Reaction.belongsTo(User, { foreignKey: 'userId' });
Reaction.belongsTo(Post, { foreignKey: 'postId' });


export { sequelize, User, Post, Comment, Theme, MediaUrls, Like, PostView, Reaction };
