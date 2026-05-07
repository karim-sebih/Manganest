import { DataTypes } from "sequelize";
import sequelize from "../db/connection.js";

const Progress = sequelize.define(
  "Progress",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    username: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      validate: { isEmail: true },
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM("ADMIN", "VIEWER"),
      allowNull: false,
      defaultValue: "VIEWER",
    },
  },
  {
    tableName: "progress",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    freezeTableName: true,
  }
);

export default Progress;
