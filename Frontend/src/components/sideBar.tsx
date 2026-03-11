import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import TransactionModal from "./transactionModal";
import EditTransactionModal from "./editTransactionModal";
import type { GoalData } from "../pages/Transactions/goalDashBoard";
import GoalModal from "./goalModal";
import "./sideBar.css";

interface Props {
  onTransactionChange: () => void;
}

const Sidebar = ({ onTransactionChange }: Props) => {
  const navigate = useNavigate();
  const [modalType, setModalType] = useState<"income" | "expense" | "manage" | "goal" | null>(null);
  const [editingGoal, setEditingGoal] = useState<GoalData | null>(null); 
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleEditGoalEvent = (event: any) => {
      setEditingGoal(event.detail);
      setModalType("goal");
    };

    window.addEventListener("openEditGoal", handleEditGoalEvent);
    return () => window.removeEventListener("openEditGoal", handleEditGoalEvent);
  }, []);

  const handleCloseModal = () => {
    setModalType(null);
    setEditingGoal(null); 
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <>
      <button className="menu-toggle" onClick={() => setIsOpen(true)}>
        ☰
      </button>

      {isOpen && <div className="sidebar-overlay" onClick={() => setIsOpen(false)} />}

      <div className={`sidebar ${isOpen ? "open" : ""}`}>
        <h2 className="h2-side">Controle Financeiro</h2>

        <button className="side-btn" onClick={() => setModalType("income")}>
          Lançar Lucro
        </button>

        <button className="side-btn" onClick={() => setModalType("expense")}>
          Lançar Gastos
        </button>

        <button className="side-btn" onClick={() => setModalType("manage")}>
          Gerenciar Lançamentos
        </button>

        <button className="side-btn" onClick={() => setModalType("goal")}>
          Definir Metas
        </button>

        <button className="side-btn" onClick={() => navigate("/extrato")}>
          Extrato
        </button>

        <button
          className="side-btn logout-btn"
          onClick={handleLogout}
        >
          Sair
        </button>
      </div>

      {modalType === "income" && (
        <TransactionModal
          type="income"
          onClose={() => setModalType(null)}
          onSuccess={onTransactionChange}
        />
      )}

      {modalType === "expense" && (
        <TransactionModal
          type="expense"
          onClose={() => setModalType(null)}
          onSuccess={onTransactionChange}
        />
      )}

      {modalType === "manage" && (
        <EditTransactionModal
          onClose={() => setModalType(null)}
          onSuccess={onTransactionChange}
        />
      )}

      {modalType === "goal" && (
        <GoalModal
          onClose={handleCloseModal}
          onSuccess={onTransactionChange} 
          editingGoal={editingGoal}
        />
      )}
    </>
  );
};

export default Sidebar;