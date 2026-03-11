import { useEffect, useState } from "react";
import "./transactionModal.css";
import {
  getCategories,
  createCategory,
  createTransaction,
} from "../services/api";

interface Category {
  id: string;
  name: string;
  type: "income" | "expense";
}

interface Props {
  type: "income" | "expense";
  onClose: () => void;
  onSuccess: () => void;
}

const TransactionModal = ({ type, onClose, onSuccess }: Props) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("R$ 0,00");

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

  useEffect(() => {
    getCategories(type).then(setCategories);
  }, [type]);

  const handleCreateCategory = async () => {
    if (!newCategory) return;

    const created = await createCategory(newCategory, type);

    setCategories((prev) => [...prev, created]);
    setSelectedCategory(created.id);
    setNewCategory("");
  };

  const handleCreateTransaction = async () => {
    const numericAmount = parseCurrencyToNumber(amount);

    if (!title || numericAmount <= 0 || !selectedCategory) {
      alert("Preencha todos os campos corretamente.");
      return;
    }

    await createTransaction({
      title,
      amount: numericAmount,
      category_id: selectedCategory,
      type,
      date: new Date(),
    });

    onSuccess();
  };

  return (
    <div className="tans-modal-overlay">
      <div className="tans-modal">
        <h2>{type === "income" ? "Novo Lucro" : "Novo Gasto"}</h2>

        <div className="tans-edit-form">

          <input
            type="text"
            placeholder="Descrição"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <input
            type="text"
            value={amount}
            onChange={(e) => setAmount(formatCurrency(e.target.value))}
          />

          <div className="tans-edit-inputs">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">Selecione uma categoria</option>

              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div className="tans-new-category-box">
            <input
              type="text"
              placeholder="Nova categoria"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
            />

            <button
              className="tans-btn-add-category"
              onClick={handleCreateCategory}
            >
              Adicionar
            </button>
          </div>

        </div>

        <div className="tans-actions">
          <button
            className="tans-btn-save"
            onClick={handleCreateTransaction}
          >
            Salvar
          </button>

          <button
            className="tans-btn-cancel"
            onClick={onClose}
          >
            Cancelar
          </button>
        </div>

      </div>
    </div>
  );
};

export default TransactionModal;