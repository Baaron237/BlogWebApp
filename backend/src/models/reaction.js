 import { Model, DataTypes } from "sequelize";
 
 export default class Reaction extends Model {
   static init(sequelize) {
     return super.init(
       {
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: true
        },
        postId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: true
        },
         emoji: {
           type: DataTypes.STRING,
           allowNull: true,
         }
       },
       {
         sequelize,
         modelName: "Reaction",
         timestamps: true,
         charset: 'utf8mb4',
         collate: 'utf8mb4_unicode_ci',
       }
     );
   }
 }
 