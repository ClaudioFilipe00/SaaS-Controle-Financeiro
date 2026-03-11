import express from "express";
import cors from "cors";
import "./models/index.js";
import userRoutes from "./routes/userRoutes.js";
import transactionRoutes from "./routes/transactionRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import goalRoutes from "./routes/goalRoutes.js";
import dashboardRoutes from "./routes/dashBoardRoutes.js";
import authMiddleware from "./middlewares/authMiddleware.js";

const app = express();

app.use(cors());
app.use(express.json());

// Rotas públicas (login e cadastro)
app.use("/users", userRoutes);

// Rotas protegidas
app.use("/transactions", authMiddleware, transactionRoutes);
app.use("/categories", authMiddleware, categoryRoutes);
app.use("/goals", authMiddleware, goalRoutes);
app.use("/dashboard", authMiddleware, dashboardRoutes);

export default app;