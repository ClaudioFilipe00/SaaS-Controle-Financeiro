import { Goal } from "../models/goal.js";
import { Transaction } from "../models/transaction.js";

export const getGoalProgress = async (userId) => {
  const goals = await Goal.findAll({
    where: { user_id: userId },
  });

  if (!goals.length) return [];

  const transactions = await Transaction.findAll({
    where: { user_id: userId },
  });

  return goals.map((goal) => {
    const target = Number(goal.target_amount);

    // Calcular saldo total
    let totalIncome = 0;
    let totalExpense = 0;

    transactions.forEach((t) => {
      if (t.type === "income") {
        totalIncome += Number(t.amount);
      } else {
        totalExpense += Number(t.amount);
      }
    });

    const currentBalance = totalIncome - totalExpense;
    const accumulated = Math.max(currentBalance, 0);

    const percentage =
      target > 0 ? Math.min((accumulated / target) * 100, 100) : 0;

    // Se já atingiu
    if (accumulated >= target) {
      return {
        id: goal.id,
        title: goal.title,
        target_amount: target,
        progress: {
          accumulated,
          percentage: 100,
        },
        stipulatedMonths: calculateStipulatedMonths(goal.deadline),
        estimatedMonths: 0,
        projection: [],
      };
    }

    // Agrupar saldo por mês
    const monthlyMap = {};

    transactions.forEach((t) => {
      const date = new Date(t.created_at);
      const key = `${date.getFullYear()}-${date.getMonth()}`;

      if (!monthlyMap[key]) {
        monthlyMap[key] = 0;
      }

      if (t.type === "income") {
        monthlyMap[key] += Number(t.amount);
      } else {
        monthlyMap[key] -= Number(t.amount);
      }
    });

    const monthlyValues = Object.values(monthlyMap);

    if (!monthlyValues.length) {
      return {
        id: goal.id,
        title: goal.title,
        target_amount: target,
        progress: { accumulated, percentage },
        stipulatedMonths: calculateStipulatedMonths(goal.deadline),
        estimatedMonths: null,
        projection: [],
      };
    }

    const monthlyAverage =
      monthlyValues.reduce((acc, val) => acc + val, 0) /
      monthlyValues.length;

    if (monthlyAverage <= 0) {
      return {
        id: goal.id,
        title: goal.title,
        target_amount: target,
        progress: { accumulated, percentage },
        stipulatedMonths: calculateStipulatedMonths(goal.deadline),
        estimatedMonths: null,
        projection: [],
      };
    }

    const remaining = target - accumulated;
    const estimatedMonths = Math.ceil(remaining / monthlyAverage);

    let projectedAmount = accumulated;
    const projection = [];

    for (let i = 1; i <= estimatedMonths; i++) {
      projectedAmount += monthlyAverage;

      projection.push({
        month: `+${i}`,
        projected: Number(projectedAmount.toFixed(2)),
      });
    }

    return {
      id: goal.id,
      title: goal.title,
      target_amount: target,
      progress: {
        accumulated,
        percentage,
      },
      stipulatedMonths: calculateStipulatedMonths(goal.deadline),
      estimatedMonths,
      projection,
    };
  });
};

// Função auxiliar
const calculateStipulatedMonths = (deadline) => {
  const today = new Date();
  const end = new Date(deadline);

  const months =
    (end.getFullYear() - today.getFullYear()) * 12 +
    (end.getMonth() - today.getMonth());

  return Math.max(months, 0);
};