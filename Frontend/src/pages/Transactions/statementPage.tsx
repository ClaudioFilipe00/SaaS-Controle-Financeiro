import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getSummary, getTransactions } from "../../services/api";
import "./statement.css";

interface Summary {
  income: number;
  expense: number;
  balance: number;
}

interface Transaction {
  id: string;
  title: string;
  amount: number;
  type: "income" | "expense";
  date: string;
}

const StatementPage = () => {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      try {
        const summaryData = await getSummary();
        const transactionsData = await getTransactions();

        setSummary(summaryData);
        setTransactions(transactionsData);
      } catch (error) {
        console.error("Erro ao carregar extrato:", error);
      }
    };

    loadData();
  }, []);

  return (
    <div className="statement-container">
      <h1>Extrato</h1>

      {summary && (
        <div className="summary-box">
          <div className="summary-card">
            <p>Entradas</p>
            <h3>
              R${" "}
              {summary.income.toLocaleString("pt-BR", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </h3>
          </div>

          <div className="summary-card">
            <p>Saídas</p>
            <h3>
              R${" "}
              {summary.expense.toLocaleString("pt-BR", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </h3>
          </div>

          <div className="summary-card">
            <p>Saldo</p>
            <h2
              className={
                summary.balance >= 0
                  ? "balance-positive"
                  : "balance-negative"
              }
            >
              R${" "}
              {summary.balance.toLocaleString("pt-BR", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </h2>
          </div>
        </div>
      )}

      <button className="btn" onClick={() => navigate("/home")}>
        Voltar
      </button>

      <div className="transaction-list">
        {transactions.map((t) => (
          <div key={t.id} className="transaction-item">
            <span>{t.title}</span>

            <span className={t.type}>
              {t.type === "income" ? "+" : "-"} R${" "}
              {t.amount.toLocaleString("pt-BR", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatementPage;