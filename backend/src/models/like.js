// models/like.js
import { Model, DataTypes } from 'sequelize';

export default class Like extends Model {
  static init(sequelize) {
    return super.init({
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      postId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    }, {
      sequelize,
      modelName: 'Like',
      timestamps: true,
    });
  }
}
