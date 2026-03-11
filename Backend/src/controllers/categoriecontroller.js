import { Category } from "../models/category.js";

// CREATE CATEGORY
export const createCategory = async (req, res) => {
  try {
    const { name, type } = req.body;

    if (!name || !type)
      return res.status(400).json({ error: "Nome e tipo são obrigatórios" });

    const category = await Category.create({
      name,
      type,
      user_id: req.user.id,
    });

    return res.status(201).json(category);

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "Erro ao criar categoria",
      details: error.message
    });
  }
};

// GET CATEGORIES
export const getCategories = async (req, res) => {
  try {
    const { type } = req.query;

    const categories = await Category.findAll({
      where: {
        user_id: req.user.id,
        ...(type && { type }),
      },
      order: [["created_at", "DESC"]],
    });

    return res.json(categories);

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "Erro ao buscar categorias",
      details: error.message
    });
  }
};