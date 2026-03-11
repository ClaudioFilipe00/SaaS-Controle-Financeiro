import { useEffect, useState } from "react";
import "./transactionModal.css";

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

  const token = localStorage.getItem("token");

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
    fetch(`http://localhost:3000/categories?type=${type}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch((err) => console.error(err));
  }, [type, token]);

  const handleCreateCategory = async () => {
    if (!newCategory) return;

    const response = await fetch("http://localhost:3000/categories", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name: newCategory, type }),
    });

    const created = await response.json();
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

    try {
      const response = await fetch("http://localhost:3000/transactions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          amount: numericAmount,
          category_id: selectedCategory,
          type,
          date: new Date(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || data.error || "Erro ao salvar transação");
        return;
      }

      onSuccess();
      setTitle("");
      setAmount("R$ 0,00");
      setSelectedCategory("");
    } catch {
      alert("Erro inesperado");
    }
  };

  return (
    <div className="tans-modal-overlay">
      <div className="tans-modal">
        <h2>{type === "income" ? "Novo Lucro" : "Novo Gasto"}</h2>

        <div className="tans-edit-form">
          <input
            type="text"
            placeholder="Descrição (ex: Salário Abril)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <input
            type="text"
            placeholder="Valor"
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