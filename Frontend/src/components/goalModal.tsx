import { useState, useEffect } from "react";
import { updateGoal, createGoal } from "../services/api";

import "./goalModal.css";

interface Props {
    onClose: () => void;
    onSuccess: () => void;
    editingGoal?: any;
}

const GoalModal = ({ onClose, onSuccess, editingGoal }: Props) => {
    const [title, setTitle] = useState("");
    const [targetAmount, setTargetAmount] = useState(""); 
    const [deadline, setDeadline] = useState("");

    // Formatar número para Moeda Brasileira
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
        if (editingGoal) {
            setTitle(editingGoal.title);
            const initialValue = (editingGoal.target_amount * 100).toString();
            setTargetAmount(formatCurrency(initialValue));

            if (editingGoal.deadline) {
                const datePart = editingGoal.deadline.split('T')[0];
                setDeadline(datePart);
            }
        } else {
            setTitle("");
            setTargetAmount(formatCurrency("0"));
            setDeadline("");
        }
    }, [editingGoal]);

    const handleCurrencyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTargetAmount(formatCurrency(e.target.value));
    };

    const handleSave = async () => {
        const numericAmount = parseCurrencyToNumber(targetAmount);

        if (!title || numericAmount <= 0 || !deadline) {
            alert("Preencha todos os campos corretamente.");
            return;
        }

        try {
            const payload = {
                title,
                target_amount: numericAmount,
                deadline,
            };

            if (editingGoal) {
                const id = editingGoal.goalId || editingGoal.id;
                await updateGoal(id, payload);
            } else {
                await createGoal(payload);
            }

            onSuccess();
            onClose();
        } catch (error: any) {
            alert(error.message || "Erro ao salvar meta");
        }
    };

    return (
        <div className="goal-overlay">
            <div className="goal-modal-container">
                <div className="modal-header">

                    <h2>{editingGoal ? "Editar Meta" : "Nova Meta"}</h2>
                </div>

                <div className="goal-edit-form">
                    <div className="goal-form-group">
                        <label>Título da Meta</label>
                        <input
                            type="text"
                            placeholder="Ex: Reserva de Emergência"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>

                    <div className="goal-form-group">
                        <label>Valor Alvo (R$)</label>
                        <input
                            type="text"
                            value={targetAmount}
                            onChange={handleCurrencyChange}
                        />
                    </div>

                    <div className="goal-form-group">
                        <label>Prazo Final</label>
                        <input
                            type="date"
                            value={deadline}
                            onChange={(e) => setDeadline(e.target.value)}
                        />
                    </div>
                </div>

                <div className="goal-modal-actions">
                    <button className="goal-btn goal-btn-save" onClick={handleSave}>
                        {editingGoal ? "Atualizar" : "Salvar"}
                    </button>
                    <button className="goal-btn goal-btn-cancel" onClick={onClose}>
                        Cancelar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default GoalModal;