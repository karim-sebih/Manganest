import { DataTypes } from "sequelize";
import sequelize from "../db/connection.js";

const History = sequelize.define(
  "History",
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

    mangadex_chapter_id: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
  },
  {
    tableName: "history",
    timestamps: true,
    createdAt: "viewed_at",
    updatedAt: false,
    freezeTableName: true,
  }
);

export default History;