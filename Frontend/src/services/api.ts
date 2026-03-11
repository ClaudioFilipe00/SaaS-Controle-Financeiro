const API_URL = "https://controle-financeiro-api-gd8b.onrender.com";

const getToken = () => {
  return localStorage.getItem("token");
};

const authHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${getToken()}`,
});


// AUTH LOGIN E REGISTRO

export const login = async (email: string, password: string) => {
  const response = await fetch(`${API_URL}/users/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    const error = new Error(errorData.error || "Erro no login");
    (error as any).status = response.status;
    (error as any).data = errorData;
    throw error;
  }

  return response.json();
};

export const register = async (name: string, email: string, password: string) => {
  const response = await fetch(`${API_URL}/users`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    const error = new Error(errorData.error || "Erro no cadastro");
    (error as any).status = response.status;
    (error as any).data = errorData;
    throw error;
  }

  return response.json();
};


// CATEGORIES

export const getCategories = async (type: "income" | "expense") => {
  const response = await fetch(`${API_URL}/categories?type=${type}`, {
    headers: authHeaders(),
  });

  if (!response.ok) throw new Error("Erro ao buscar categorias");

  return response.json();
};

export const createCategory = async (name: string, type: "income" | "expense") => {
  const response = await fetch(`${API_URL}/categories`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ name, type }),
  });

  if (!response.ok) throw new Error("Erro ao criar categoria");

  return response.json();
};


// TRANSAÇÕES

export const getTransactions = async () => {
  const response = await fetch(`${API_URL}/transactions`, {
    headers: authHeaders(),
  });

  if (!response.ok) throw new Error("Erro ao buscar transações");

  return response.json();
};

export const createTransaction = async (data: {
  title: string;
  amount: number;
  type: "income" | "expense";
  category_id: string;
  date?: Date;
}) => {
  const response = await fetch(`${API_URL}/transactions`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(data),
  });

  if (!response.ok) throw new Error("Erro ao criar transação");

  return response.json();
};

export const updateTransaction = async (id: string, data: any) => {
  const response = await fetch(`${API_URL}/transactions/${id}`, {
    method: "PATCH",
    headers: authHeaders(),
    body: JSON.stringify(data),
  });

  if (!response.ok) throw new Error("Erro ao atualizar transação");

  return response.json();
};

export const deleteTransaction = async (id: string) => {
  const response = await fetch(`${API_URL}/transactions/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });

  if (!response.ok) throw new Error("Erro ao excluir transação");
};


// SUMMARY

export const getSummary = async () => {
  const response = await fetch(`${API_URL}/transactions/summary`, {
    headers: authHeaders(),
  });

  if (!response.ok) throw new Error("Erro ao buscar resumo");

  return response.json();
};


// METAS (GOALS)

export interface Goal {
  id: string;
  title: string;
  target_amount: number;
  deadline: string;
  created_at: string;
}

export const createGoal = async (data: {
  title: string;
  target_amount: number;
  deadline: string;
}) => {
  const response = await fetch(`${API_URL}/goals`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(data),
  });

  if (!response.ok) throw new Error("Erro ao criar meta");

  return response.json();
};

export const updateGoal = async (
  id: string | number,
  data: {
    title?: string;
    target_amount?: number;
    deadline?: string;
  }
) => {
  const response = await fetch(`${API_URL}/goals/${id}`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify(data),
  });

  if (!response.ok) throw new Error("Erro ao atualizar meta");

  return response.json();
};

export const getGoals = async (): Promise<Goal[]> => {
  const response = await fetch(`${API_URL}/goals`, {
    headers: authHeaders(),
  });

  if (!response.ok) throw new Error("Erro ao buscar metas");

  return response.json();
};

export const deleteGoal = async (id: number | string): Promise<void> => {
  const response = await fetch(`${API_URL}/goals/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });

  if (!response.ok) {
    throw new Error("Erro ao excluir meta");
  }
};


// DASHBOARD

export const getDashboard = async (year: number) => {
  const response = await fetch(`${API_URL}/dashboard?year=${year}`, {
    headers: authHeaders(),
  });

  if (!response.ok) throw new Error("Erro ao buscar dashboard");

  return response.json();
};

export const getDashboardYears = async () => {
  const response = await fetch(`${API_URL}/dashboard/years`, {
    headers: authHeaders(),
  });

  if (!response.ok) {
    throw new Error("Erro ao buscar anos");
  }

  return response.json();
};

export const getCategoryDashboard = async (
  year: number,
  type: "income" | "expense"
) => {
  const response = await fetch(
    `${API_URL}/dashboard/categories?year=${year}&type=${type}`,
    {
      headers: authHeaders(),
    }
  );

  if (!response.ok) {
    throw new Error("Erro ao buscar categorias do dashboard");
  }

  return response.json();
};


// PROGRESSÃO DE METAS

export interface GoalProgress {
  id: number;
  title: string;
  target_amount: number;
  deadline: string;
  stipulatedMonths: number;
  estimatedMonths: number | null;
  progress: {
    accumulated: number;
    percentage: number;
  };
  projection: {
    month: string;
    projected: number;
  }[];
}

import type { GoalData } from "../pages/Transactions/goalDashBoard";

export const getGoalsProgress = async (): Promise<GoalData[]> => {
  const response = await fetch(`${API_URL}/goals/progress`, {
    headers: authHeaders(),
  });

  if (!response.ok) {
    throw new Error("Erro ao buscar metas");
  }

  return response.json();
};