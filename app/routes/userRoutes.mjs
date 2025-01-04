import express from "express";
import {
  login,
  register,
  verifyToken,
  getUsersDetails,
  changePassword,
  deleteUser,
} from "../controllers/userController.mjs";
import isAuth from "../middlewares/isAuthenticated.mjs";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/verify-token", isAuth, verifyToken);
router.get("/details", isAuth, getUsersDetails);
router.put("/change-password", isAuth, changePassword);
router.delete("/delete/:id", deleteUser);

export default router;
