import express from "express";
import * as user from "../controllers/usercontroller.js";

const router = express.Router();

router.post("/", user.newUser);
router.post("/login", user.userLogin);
router.put('/:id', user.updateUser);
router.delete('/:id', user.deleteUser);


export default router;