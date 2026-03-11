import { Transaction } from "../models/transaction.js";
import { Sequelize } from "sequelize";

export const getSummary = async (user_id) => {
  const summary = await Transaction.findAll({
    attributes: [
      "type",
      [Sequelize.fn("SUM", Sequelize.col("amount")), "total"],
    ],
    where: { user_id: user_id },
    group: ["type"],
  });

  let income = 0;
  let expense = 0;

  summary.forEach(item => {
    if (item.dataValues.type === "income")
      income = parseFloat(item.dataValues.total);
    if (item.dataValues.type === "expense")
      expense = parseFloat(item.dataValues.total);
  });

  return {
    income,
    expense,
    balance: income - expense,
  };
};