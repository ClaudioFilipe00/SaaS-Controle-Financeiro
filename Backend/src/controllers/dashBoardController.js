import * as dashboardService from "../services/dashBoardService.js";
import { Transaction } from "../models/transaction.js";
import { Category } from "../models/category.js";
import { Sequelize, Op } from "sequelize";

export const getDashboard = async (req, res) => {
    try {
        const userId = req.user.id;
        const year = req.query.year;

        const data = await dashboardService.getYearlySummary(userId, year);

        res.json(data);
    } catch (error) {
        res.status(500).json({ error: "Erro ao buscar dashboard" });
    }
};


export const getYears = async (req, res) => {
    try {
        const userId = req.user.id;

        const years = await dashboardService.getAvailableYears(userId);

        res.json(years);
    } catch (error) {
        res.status(500).json({ error: "Erro ao buscar anos" });
    }
};

export const getCategories = async (req, res) => {
    try {
        const userId = req.user.id;
        const { year, type } = req.query;

        if (!year || !type) {
            return res.status(400).json({ message: "Year e type são obrigatórios" });
        }

        const result = await Transaction.findAll({
            attributes: [
                [Sequelize.col("category.name"), "name"],
                [Sequelize.fn("SUM", Sequelize.col("amount")), "value"],
            ],
            include: [
                {
                    model: Category,
                    as: "category",
                    attributes: [],
                },
            ],
            where: {
                user_id: userId,
                type,
                created_at: {
                    [Op.between]: [
                        `${year}-01-01`,
                        `${year}-12-31`,
                    ],
                },
            },
            group: ["category.name"],
            raw: true,
        });

        res.json(
            result.map((item) => ({
                name: item.name,
                value: Number(item.value),
            }))
        );
    } catch (error) {
        console.error("Erro ao buscar categorias:", error);
        res.status(500).json({ message: "Erro interno" });
    }
};

