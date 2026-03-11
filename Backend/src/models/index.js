import { User } from "./user.js";
import { Category } from "./category.js";
import { Transaction } from "./transaction.js";
import { Goal } from "./goal.js";

User.hasMany(Transaction, {
  foreignKey: "user_id",
  as: "transactions",
  onDelete: "CASCADE",
  onUpdate: "CASCADE"
});

User.hasMany(Category, {
  foreignKey: "user_id",
  as: "categories",
  onDelete: "CASCADE",
  onUpdate: "CASCADE"
});

User.hasMany(Goal, {
  foreignKey: "user_id",
  as: "goals",
  onDelete: "CASCADE",
  onUpdate: "CASCADE"
});

Transaction.belongsTo(User, {
  foreignKey: "user_id",
  as: "user"
});

Category.hasMany(Transaction, {
  foreignKey: "category_id",
  as: "transactions",
  onDelete: "CASCADE",
  onUpdate: "CASCADE"
});

Transaction.belongsTo(Category, {
  foreignKey: "category_id",
  as: "category"
});

export { User, Category, Transaction, Goal };