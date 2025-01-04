import express from "express";
import {
  createMember,
  editUserAndMember,
} from "../controllers/memberController.mjs";
import isAuth from "../middlewares/isAuthenticated.mjs";
import upload from "../../utils/multer.mjs";

const router = express.Router();

router.post("/create", isAuth, upload.single("file"), createMember);
router.put("/profile-edit", isAuth, upload.single("file"), editUserAndMember);

export default router;
