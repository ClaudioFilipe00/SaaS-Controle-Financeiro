import express from "express";
import * as catCtrl from "../controllers/categoriecontroller.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, catCtrl.createCategory);
router.get("/", authMiddleware, catCtrl.getCategories);

export default router;