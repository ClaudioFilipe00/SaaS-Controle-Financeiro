import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js"

export const Goal = sequelize.define("Goal", {
    id: {type: DataTypes.UUID,  defaultValue: DataTypes.UUIDV4, primaryKey: true,},
    title: { type: DataTypes.STRING, allowNull: false, },
    target_amount: { type: DataTypes.DECIMAL(10,2), allowNull:false, },
    deadline: { type: DataTypes.DATEONLY, allowNull: false, },
    user_id: { type: DataTypes.UUID, allowNull: false},
}, {
    tableName: "goals",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: false
});

