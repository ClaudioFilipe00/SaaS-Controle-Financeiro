import express from "express";
import * as trans from "../controllers/transactioncontroller.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, trans.create);
router.get("/", authMiddleware, trans.getAll);
router.get("/summary", authMiddleware, trans.getSummary);
router.delete("/:id", authMiddleware, trans.deleteTransaction);
router.patch("/:id", authMiddleware, trans.update);

export default router;