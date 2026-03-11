import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js"

export const Transaction = sequelize.define("Transaction", {
    id: {type: DataTypes.UUID,  defaultValue: DataTypes.UUIDV4, primaryKey: true,},
    title: { type: DataTypes.STRING, allowNull: false, },
    amount: { type: DataTypes.DECIMAL(10,2), allowNull:false, },
    type: { type: DataTypes.ENUM("income", "expense"), allowNull:false, },
    date: { type: DataTypes.DATEONLY, allowNull: false, },
    user_id: { type: DataTypes.UUID, allowNull: false},
    category_id: { type: DataTypes.UUID, allowNull: false},
    receipt_url: { type: DataTypes.STRING, allowNull: true},
}, {
    tableName: "transactions",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: false
});

