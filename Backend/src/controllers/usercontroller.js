import { User } from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Category } from "../models/category.js";
import { sequelize } from "../config/database.js";

// CREATE
export const newUser = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: "Preencher todos os campos." });
    }

    const existing = await User.findOne({ where: { email } });
    if (existing) return res.status(409).json({ error: "Email ja cadastrado." });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create(
      { name, email, password: hashedPassword },
      { transaction: t }
    );

    await Category.bulkCreate(
      [
        { name: "Salário", type: "income", user_id: user.id },
        { name: "PIX Recebido", type: "income", user_id: user.id },
        { name: "Investimentos", type: "income", user_id: user.id },
        { name: "Alimentação", type: "expense", user_id: user.id },
        { name: "Internet", type: "expense", user_id: user.id },
        { name: "Energia", type: "expense", user_id: user.id },
        { name: "Transporte", type: "expense", user_id: user.id },
        { name: "PIX Enviado", type: "expense", user_id: user.id },
      ],
      { transaction: t }
    );

    await t.commit();

    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    const { password: _, ...userWithoutPassword } = user.toJSON();

    return res.status(201).json({
      user: userWithoutPassword,
      token,
    });

  } catch (err) {
    await t.rollback();
    console.error(err);
    return res.status(500).json({ error: "Erro ao criar usuário." });
  }
};


// LOGIN
export const userLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password)
            return res.status(400).json({ error: "Insira os dados corretamente para efetuar o login!" });

        const user = await User.findOne({ where: { email } });
        if (!user) return res.status(401).json({ error: "Email ou senha incorretos" });

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword)
            return res.status(401).json({ error: "Email ou senha incorretos" });
        const token = jwt.sign(
            { id: user.id },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        const { password: _, ...userWithoutPassword } = user.toJSON();

        return res.json({
            user: userWithoutPassword,
            token
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Erro ao efetuar login." });
    }
};

// ATUALIZAR
export const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;
        if (updates.email) delete updates.email;

        const [n] = await User.update(updates, { where: { id } });
        if (!n) return res.status(404).json({ error: "Usuário não encontrado." });
        const updated = await User.findByPk(id);
        const { password: _, ...userWithoutPassword } = updated.toJSON();
        return res.json(userWithoutPassword);;
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Erro ao atualizar usuário." });
    }
};

// DELETE
export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await User.destroy({ where: { id } });
        if (!deleted) return res.status(404).json({ error: "Usuário não encontrado." });
        return res.json({ message: "Usuário excluído." });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Erro ao excluir usuário." });
    }
};