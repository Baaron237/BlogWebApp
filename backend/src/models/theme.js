import { Model, DataTypes } from "sequelize";

export default class Theme extends Model {
  static init(sequelize) {
    return super.init(
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        name: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        primaryColor: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        secondaryColor: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        backgroundColor: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        textColor: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        isActive: {
          type: DataTypes.BOOLEAN,
          defaultValue: false,
        },
      },
      {
        sequelize,
        modelName: "Theme",
        timestamps: true,
      }
    );
  }
}
