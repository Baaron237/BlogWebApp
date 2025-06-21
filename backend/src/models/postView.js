// models/postview.js
import { Model, DataTypes } from "sequelize";

export default class PostView extends Model {
  static init(sequelize) {
    return super.init({
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      postId: {
        type: DataTypes.INTEGER,
        allowNull: false
      }
    }, {
      sequelize,
      modelName: 'PostView',
      timestamps: true,
    });
  }
}
