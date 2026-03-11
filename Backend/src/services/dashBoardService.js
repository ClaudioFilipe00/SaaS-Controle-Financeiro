import { Transaction } from "../models/transaction.js";
import { Op, Sequelize } from "sequelize";

export const getYearlySummary = async (userId, year) => {
  const transactions = await Transaction.findAll({
    where: {
      user_id: userId,
      created_at: {
        [Op.between]: [
          new Date(`${year}-01-01`),
          new Date(`${year}-12-31`),
        ],
      },
    },
  });

  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];

  const result = months.map((month, index) => ({
    month,
    income: 0,
    expense: 0,
  }));

  transactions.forEach((transaction) => {
    const monthIndex = new Date(transaction.created_at).getMonth();

    if (transaction.type === "income") {
      result[monthIndex].income += Number(transaction.amount);
    } else {
      result[monthIndex].expense += Number(transaction.amount);
    }
  });

  return result;
};

export const getAvailableYears = async (userId) => {
  const years = await Transaction.findAll({
    attributes: [
      [
        Sequelize.fn(
          "DISTINCT",
          Sequelize.fn("YEAR", Sequelize.col("created_at"))
        ),
        "year",
      ],
    ],
    where: {
      user_id: userId,
    },
    raw: true,
  });

  return years.map((item) => Number(item.year)).sort();
};