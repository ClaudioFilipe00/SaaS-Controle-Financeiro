import { Transaction } from "../models/transaction.js";
import * as transactionService from "../services/transactionService.js";

// CREATE
export const create = async (req, res) => {
  try {
    const { title, amount, type, category_id, receipt_url } = req.body;

    if (!title || !amount || !type || !category_id) {
      return res.status(400).json({ error: "Campos obrigatórios faltando" });
    }

    const transaction = await Transaction.create({
      title,
      amount,
      type,
      date: new Date(),
      user_id: req.user.id,
      category_id,
      receipt_url: receipt_url || null,
    });

    return res.status(201).json(transaction);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Erro ao criar transação" });
  }
};

// GET ALL
export const getAll = async (req, res) => {
  try {
    const transactions = await Transaction.findAll({
      where: { user_id: req.user.id },
      order: [["date", "DESC"]],
    });

    return res.json(transactions);
  } catch (error) {
    return res.status(500).json({ error: "Erro ao buscar transações" });
  }
};

// SUMMARY
export const getSummary = async (req, res) => {
  try {
    const data = await transactionService.getSummary(req.user.id);
    return res.json(data);
  } catch (error) {
    return res.status(500).json({ error: "Erro ao gerar resumo" });
  }
};

// UPDATE 
export const update = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, amount, category_id, type, date, receipt_url } = req.body;
    const transaction = await Transaction.findOne({
      where: { id, user_id: req.user.id }
    });

    if (!transaction) {
      return res.status(404).json({ error: "Transação não encontrada" });
    }

    await transaction.update({
      title,
      amount,
      category_id,
      type,
      date,
      receipt_url
    });

    return res.json(transaction);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Erro ao atualizar transação" });
  }
};

// DELETE
export const deleteTransaction = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await Transaction.destroy({
      where: {
        id,
        user_id: req.user.id,
      },
    });

    if (result === 0) {
      return res.status(404).json({ error: "Transação não encontrada" });
    }

    return res.json({ message: "Transação removida" });
  } catch (error) {
    return res.status(500).json({ error: "Erro ao deletar transação" });
  }
};