import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js"

export const Category = sequelize.define("Category", {
    id: {type: DataTypes.UUID,  defaultValue: DataTypes.UUIDV4, primaryKey: true,},
    name: { type: DataTypes.STRING, allowNull: false, },
    type: {type: DataTypes.ENUM("income", "expense"), allowNull: false,},
    user_id: { type: DataTypes.UUID, allowNull: false},
}, {
    tableName: "categories",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: false
});

