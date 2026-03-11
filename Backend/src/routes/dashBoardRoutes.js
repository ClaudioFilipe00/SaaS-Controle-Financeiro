import express from "express";
import * as dashboardController from "../controllers/dashBoardController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", authMiddleware, dashboardController.getDashboard);
router.get("/years", authMiddleware, dashboardController.getYears);
router.get("/categories", authMiddleware, dashboardController.getCategories);

export default router;