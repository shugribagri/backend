import express from "express";
import { deleteUser, editUserRole } from "../controllers/adminController.mjs";
import isAuth from "../middlewares/isAuthenticated.mjs";
import isAdmin from "../middlewares/isAdmin.mjs";

const router = express.Router();

router.delete("/delete/:id", isAuth, isAdmin, deleteUser);
router.put("/edit-role", isAuth, isAdmin, editUserRole);

export default router;
