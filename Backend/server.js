import app from "./src/app.js";
import { sequelize, connectDB } from "./src/config/database.js";

import "./src/models/index.js";

const PORT = process.env.PORT || 3000;

async function start() {
  try {
    await connectDB();
    await sequelize.sync();

    console.log("Banco sincronizado!");

    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`);
    });

  } catch (error) {
    console.error("Erro ao iniciar servidor:", error);
  }
}

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET não definido no .env");
}

start();

