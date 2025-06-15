import { Model, DataTypes } from "sequelize";

export default class Post extends Model {
  static init(sequelize) {
    return super.init(
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        title: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        content: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
        mediaUrls: {
          type: DataTypes.JSON,
          defaultValue: [],
        },
        viewCount: {
          type: DataTypes.INTEGER,
          defaultValue: 0,
        },
        likeCount: {
          type: DataTypes.INTEGER,
          defaultValue: 0,
        },
        commentCount: {
          type: DataTypes.INTEGER,
          defaultValue: 0,
        },
      },
      {
        sequelize,
        modelName: "Post",
        timestamps: true,
      }
    );
  }
}
