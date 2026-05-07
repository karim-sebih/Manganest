import { DataTypes } from "sequelize";
import sequelize from "../db/connection.js";

const Library = sequelize.define(
  "Library",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    mangadex_id: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
  },
  {
    tableName: "library",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: false,
    freezeTableName: true,
    indexes: [
      {
        unique: true,
        fields: ["user_id", "mangadex_id"],
      },
    ],
  }
);

export default Library;