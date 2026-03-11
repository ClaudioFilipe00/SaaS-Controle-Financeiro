import { Goal } from "../models/goal.js"; 
import { getGoalProgress } from "../services/goalService.js";

// CREATE
export const createGoal = async (req, res) => {
  try {
    const { title, target_amount, deadline } = req.body;

    if (!title || !target_amount || !deadline) {
      return res.status(400).json({ error: "Campos obrigatórios faltando" });
    }

    const goal = await Goal.create({
      title,
      target_amount,
      deadline,
      user_id: req.user.id, // do middleware
    });

    return res.status(201).json(goal); // retorna o registro criado
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Erro ao definir meta", details: error.message });
  }
};

// GET ALL
export const getAllGoals = async (req, res) => {
  try {
    const goals = await Goal.findAll({
      where: { user_id: req.user.id },
      order: [["created_at", "DESC"]],
    });

    return res.json(goals);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Erro ao buscar metas", details: error.message });
  }
};

// PROGRESS
export const getProgress = async (req, res) => {
  try {
    const userId = req.user.id; // authMiddleware já definiu
    const goalsProgress = await getGoalProgress(userId);
    res.json(goalsProgress);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao buscar progresso das metas" });
  }
};

// UPDATE
export const updateGoal = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, target_amount, deadline } = req.body;
    const [updatedRows] = await Goal.update(
      { title, target_amount, deadline },
      {
        where: {
          id: id,
          user_id: req.user.id 
        }
      }
    );

    if (updatedRows === 0) {
      return res.status(404).json({ 
        error: "Meta não encontrada ou você não tem permissão para editá-la." 
      });
    }

    const updatedGoal = await Goal.findByPk(id);
    
    return res.status(200).json({
      message: "Meta atualizada com sucesso!",
      goal: updatedGoal
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ 
      error: "Erro ao atualizar meta", 
      details: error.message 
    });
  }
};

// DELETE
export const deleteGoal = async (req, res) => {
  try {
    const { id } = req.params; 
    const deletedCount = await Goal.destroy({
      where: {
        id: id,
        user_id: req.user.id 
      }
    });

    if (deletedCount === 0) {
      return res.status(404).json({ error: "Meta não encontrada ou você não tem permissão para excluí-la." });
    }

    return res.status(200).json({ message: "Meta excluída com sucesso!" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ 
      error: "Erro ao excluir meta", 
      details: error.message 
    });
  }
};