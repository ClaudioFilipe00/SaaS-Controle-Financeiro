const API_URL = "http://localhost:3000";

// --- AUTH LOGIN E REGISTRO ---
export const login = async (email: string, password: string) => {
  const response = await fetch(`${API_URL}/users/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    // Criamos um objeto de erro que contém o status e a mensagem do back
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

//  TRANSAÇÕES 
export const createTransaction = async (data: {
  title: string;
  amount: number;
  type: "income" | "expense";
  category_id: string;
}) => {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}/transactions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) throw new Error("Erro ao criar transação");

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
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}/goals`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) throw new Error("Erro ao criar meta");

  return response.json();
};

// UPDATE
export const updateGoal = async (
  id: string | number, 
  data: {
    title?: string;
    target_amount?: number;
    deadline?: string;
  }
) => {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}/goals/${id}`, {
    method: "PUT", // Ou PATCH, dependendo da sua rota
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) throw new Error("Erro ao atualizar meta");

  return response.json();
};

export const getGoals = async (): Promise<Goal[]> => {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}/goals`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) throw new Error("Erro ao buscar metas");

  return response.json();
};

export const deleteGoal = async (id: number | string): Promise<void> => {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}/goals/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Erro ao excluir meta");
  }
};

// DASHBOARD 
export const getDashboard = async (year: number) => {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}/dashboard?year=${year}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) throw new Error("Erro ao buscar dashboard");

  return response.json();
};

export const getDashboardYears = async () => {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}/dashboard/years`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
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
  const token = localStorage.getItem("token");

  const response = await fetch(
    `${API_URL}/dashboard/categories?year=${year}&type=${type}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
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
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}/goals/progress`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Erro ao buscar metas");
  }

  return response.json();
};