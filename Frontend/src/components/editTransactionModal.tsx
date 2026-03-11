import { useEffect, useState } from "react";
import "./editTransactionModal.css";
import { Pencil, Trash2, X, Check } from "lucide-react";

import {
  getTransactions,
  updateTransaction,
  deleteTransaction,
  getCategories,
} from "../services/api";

interface Category {
  id: string;
  name: string;
  type: "income" | "expense";
}

interface Transaction {
  id: string;
  title: string;
  amount: number;
  category_id: string;
  type: "income" | "expense";
  date: string;
}

interface Props {
  onClose: () => void;
  onSuccess: () => void;
}

const EditTransactionModal = ({ onClose, onSuccess }: Props) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [editedTitle, setEditedTitle] = useState("");
  const [editedAmount, setEditedAmount] = useState("");
  const [editedCategory, setEditedCategory] = useState("");

  const [categories, setCategories] = useState<Category[]>([]);

  const formatCurrency = (value: string) => {
    const cleanValue = value.replace(/\D/g, "");
    const numberValue = Number(cleanValue) / 100;

    return numberValue.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  const parseCurrencyToNumber = (value: string) => {
    return Number(value.replace(/\D/g, "")) / 100;
  };

  // carregar transações
  useEffect(() => {
    const loadTransactions = async () => {
      try {
        const data = await getTransactions();
        setTransactions(data);
      } catch (error) {
        console.error("Erro ao buscar transações", error);
      }
    };

    loadTransactions();
  }, []);

  // carregar categorias quando editar
  useEffect(() => {
    if (!editingId) return;

    const tx = transactions.find((t) => t.id === editingId);
    if (!tx) return;

    getCategories(tx.type).then(setCategories);
  }, [editingId, transactions]);

  const startEditing = (tx: Transaction) => {
    setEditingId(tx.id);
    setEditedTitle(tx.title);

    const initialValue = (tx.amount * 100).toString();
    setEditedAmount(formatCurrency(initialValue));

    setEditedCategory(tx.category_id);
  };

  const cancelEditing = () => {
    setEditingId(null);
  };

  const saveEditing = async (tx: Transaction) => {
    const numericAmount = parseCurrencyToNumber(editedAmount);

    const body: Partial<Transaction> = {};

    if (editedTitle !== tx.title) body.title = editedTitle;
    if (numericAmount !== tx.amount) body.amount = numericAmount;
    if (editedCategory !== tx.category_id) body.category_id = editedCategory;

    if (Object.keys(body).length === 0) {
      alert("Nenhuma alteração feita.");
      return;
    }

    try {
      const updated = await updateTransaction(tx.id, body);

      setTransactions((prev) =>
        prev.map((t) => (t.id === updated.id ? updated : t))
      );

      onSuccess();
      setEditingId(null);
    } catch {
      alert("Erro ao atualizar transação");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Deseja realmente excluir essa transação?")) return;

    try {
      await deleteTransaction(id);

      setTransactions((prev) => prev.filter((t) => t.id !== id));

      onSuccess();
    } catch {
      alert("Erro ao excluir a transação");
    }
  };

  return (
    <div className="alter-modal-overlay">
      <div className="alter-modal">
        <h2>Gerenciar Lançamentos</h2>

        {transactions.length === 0 && (
          <p className="no-transactions">Nenhuma transação encontrada.</p>
        )}

        <ul className="alter-transaction-list">
          {transactions.map((t) => (
            <li key={t.id} className="alter-transaction-item">

              {editingId === t.id ? (

                <div className="alter-edit-form">

                  <div className="alter-edit-inputs">

                    <input
                      type="text"
                      value={editedTitle}
                      onChange={(e) => setEditedTitle(e.target.value)}
                    />

                    <input
                      type="text"
                      value={editedAmount}
                      onChange={(e) =>
                        setEditedAmount(formatCurrency(e.target.value))
                      }
                    />

                    <select
                      value={editedCategory}
                      onChange={(e) => setEditedCategory(e.target.value)}
                    >
                      <option value="">Categoria</option>

                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}

                    </select>

                  </div>

                  <div className="alter-actions">

                    <button
                      className="alter-btn-icon-base alter-btn-icon-save"
                      onClick={() => saveEditing(t)}
                    >
                      <Check size={20} />
                    </button>

                    <button
                      className="alter-btn-icon-base alter-btn-icon-cancel"
                      onClick={cancelEditing}
                    >
                      <X size={20} />
                    </button>

                  </div>

                </div>

              ) : (

                <>
                  <div className="alter-transaction-info">

                    <strong>{t.title}</strong>

                    <span>

                      <span
                        style={{
                          color:
                            t.type === "income" ? "#2ecc71" : "#e74c3c",
                          fontWeight: "bold",
                        }}
                      >
                        {Number(t.amount).toLocaleString("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        })}
                      </span>

                      <small>
                        {" "}
                        • {t.type === "income" ? "Lucro" : "Gasto"}
                      </small>

                    </span>

                  </div>

                  <div className="alter-actions">

                    <button
                      className="alter-btn-icon"
                      onClick={() => startEditing(t)}
                    >
                      <Pencil size={18} />
                    </button>

                    <button
                      className="alter-btn-icon alter-btn-icon-cancel"
                      onClick={() => handleDelete(t.id)}
                    >
                      <Trash2 size={18} />
                    </button>

                  </div>
                </>
              )}

            </li>
          ))}
        </ul>

        <button className="alter-btn-close-main" onClick={onClose}>
          Fechar
        </button>

      </div>
    </div>
  );
};

export default EditTransactionModal;