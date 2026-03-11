import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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

    const token = localStorage.getItem("token");
    const navigate = useNavigate();

    useEffect(() => {
        if (!token) return;

        //  Buscar resumo
        fetch("http://localhost:3000/transactions/summary", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then((res) => res.json())
            .then((data: Summary) => setSummary(data));

        //  Buscar transações
        fetch("http://localhost:3000/transactions", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then((res) => res.json())
            .then((data: Transaction[]) => setTransactions(data));
    }, []);



    return (
        <div className="statement-container">
            <h1>Extrato</h1>

            {summary && (
                <div className="summary-box">
                    <div className="summary-card">
                        <p>Entradas</p>
                        <h3>
                            R$ {summary.income.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </h3>
                    </div>

                    <div className="summary-card">
                        <p>Saídas</p>
                        <h3>
                            R$ {summary.expense.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
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
                            R$ {summary.balance.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
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
                            {t.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default StatementPage;