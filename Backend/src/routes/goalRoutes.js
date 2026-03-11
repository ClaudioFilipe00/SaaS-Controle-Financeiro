import express from "express";
import { createGoal, getAllGoals, getProgress, deleteGoal, updateGoal } from "../controllers/goalscontroller.js"; 
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, createGoal);
router.get("/", authMiddleware, getAllGoals);
router.get("/progress", authMiddleware, getProgress);
router.delete("/:id", authMiddleware, deleteGoal);
router.put("/:id", authMiddleware, updateGoal);

export default router;