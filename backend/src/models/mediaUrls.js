import { Model, DataTypes } from "sequelize";

export default class MediaUrls extends Model {
  static init(sequelize) {
    return super.init(
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        content: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
        url: {
          type: DataTypes.STRING,
          defaultValue: "",
        },
        order: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },  
      },
      {
        sequelize,
        modelName: "MediaUrls",
        timestamps: true,
      }
    );
  }
}
