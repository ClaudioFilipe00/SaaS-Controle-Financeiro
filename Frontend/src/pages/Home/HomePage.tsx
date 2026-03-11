import { useEffect, useState } from "react";
import Sidebar from "../../components/sideBar";
import DashboardCard from "../Transactions/lineDashBoard";
import CategoryPie from "../Transactions/categoryPie";
import GoalDashboard, { type GoalData } from "../Transactions/goalDashBoard";
import {
  getDashboard,
  getDashboardYears,
  getCategoryDashboard,
  getGoalsProgress,
  deleteGoal
} from "../../services/api";
import "./home.css";

interface DashboardData {
  month: string;
  income: number;
  expense: number;
}

interface CategoryData {
  name: string;
  value: number;
}

const HomePage = () => {
  const [years, setYears] = useState<number[]>([]);
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [dashboardData, setDashboardData] = useState<DashboardData[]>([]);
  const [incomeCategories, setIncomeCategories] = useState<CategoryData[]>([]);
  const [expenseCategories, setExpenseCategories] = useState<CategoryData[]>([]);
  const [goals, setGoals] = useState<GoalData[]>([]);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState<string>("Usuário");

  // 🔥 Buscar nome do usuário ao carregar
  useEffect(() => {
    const storedName = localStorage.getItem("userName");
    if (storedName) {
      setUserName(storedName);
    }
  }, []);

  // 🔥 Buscar gráfico principal
  const fetchDashboard = async (year: number) => {
    try {
      const data = await getDashboard(year);
      setDashboardData(data);
    } catch (error) {
      console.error("Erro ao carregar dashboard", error);
    }
  };

  // 🔥 Buscar categorias
  const fetchCategories = async (year: number) => {
    try {
      const income = await getCategoryDashboard(year, "income");
      const expense = await getCategoryDashboard(year, "expense");
      setIncomeCategories(income);
      setExpenseCategories(expense);
    } catch (error) {
      console.error("Erro ao carregar categorias", error);
    }
  };

  // 🔥 Buscar metas
  const fetchGoals = async () => {
    try {
      const data = await getGoalsProgress();
      if (data && data.length > 0) {
        setGoals(data);
      } else {
        setGoals([]);
      }
    } catch (error) {
      console.error("Erro ao carregar metas", error);
    }
  };

  // 🔹 Função geral de atualização
  const refreshDashboard = async (year: number) => {
    try {
      setLoading(true);
      await Promise.all([fetchDashboard(year), fetchCategories(year), fetchGoals()]);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Buscar anos disponíveis
  useEffect(() => {
    const fetchYears = async () => {
      try {
        const data = await getDashboardYears();
        setYears(data);
        if (data.length > 0) setSelectedYear(data[data.length - 1]);
      } catch (error) {
        console.error("Erro ao buscar anos", error);
      }
    };
    fetchYears();
  }, []);

  // 🔹 Atualizar sempre que o ano mudar
  useEffect(() => {
    if (!selectedYear) return;
    refreshDashboard(selectedYear);
  }, [selectedYear]);

  const handleDeleteGoal = async (id: number) => {
    try {
      await deleteGoal(id);
      setGoals((prev) => prev.filter((goal) => goal.id !== id));
    } catch (error) {
      console.error("Erro ao deletar meta", error);
    }
  };

  return (
    <div className="home-container">
      <Sidebar
        onTransactionChange={() => {
          if (selectedYear) refreshDashboard(selectedYear);
        }}
      />
      <div className="home-content">
        <header className="home-header">
          <h1>Relatório Geral</h1>
          <div className="user-greeting">
            Olá, <span>{userName}</span>
          </div>
        </header>

        {loading ? (
          <p className="loading-text">Carregando dados...</p>
        ) : years.length === 0 ? (
          <p>Nenhuma transação encontrada ainda.</p>
        ) : (
          <>
            <DashboardCard
              data={dashboardData}
              years={years}
              selectedYear={selectedYear}
              onYearChange={setSelectedYear}
            />

            <div className="pie-row">
              <CategoryPie
                data={incomeCategories}
                title="Distribuição de Lucros"
              />
              <CategoryPie
                data={expenseCategories}
                title="Distribuição de Despesas"
              />
            </div>

            {goals.length > 0 && (
              <div className="goal-row">
                {goals.map((g) => (
                  <GoalDashboard
                    key={g.id}
                    goal={g}
                    onDelete={handleDeleteGoal}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default HomePage;