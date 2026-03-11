import { Sequelize } from "sequelize";
import dotenv from "dotenv";
dotenv.config();

export const sequelize = new Sequelize(
    process.env.DB_NAME || "sistema_financeiro",
    process.env.DB_USER || "teste",
    process.env.DB_PASSWORD || "",
    {
        host: process.env.DB_HOST || "localhost",
        port: process.env.DB_PORT ? Number(process.env.DB_PORT): 3306,
        dialect: "mysql",
        logging:false,
    }
);

export async function connectDB() {
  try {
    await sequelize.authenticate();
    console.log("Banco conectado com sucesso!");
  } catch (error) {
    console.error("Erro ao conectar no banco:", error);
  }
}