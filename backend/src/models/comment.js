import { Model, DataTypes } from "sequelize";

export default class Comment extends Model {
  static init(sequelize) {
    return super.init(
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        emoji: {
          type: DataTypes.STRING,
          allowNull: false,
        },
      },
      {
        sequelize,
        modelName: "Comment",
        timestamps: true,
      }
    );
  }
}
