import express from "express";
import {
  addPayment,
  updateCategoryFees,
  getPaymentsByCondition,
  deleteFeeStructure,
} from "../controllers/feesController.mjs";
import isAuth from "../middlewares/isAuthenticated.mjs";
import isAdmin from "../middlewares/isAdmin.mjs";
import { User } from "../models/index.mjs";
import { FeeStructure } from "../models/index.mjs";

const router = express.Router();

router.post("/fees/update", isAuth, isAdmin, async (req, res) => {
  try {
    const { feeCategory, term, amount, year } = req.body;
    const result = await updateCategoryFees({
      feeCategory,
      term,
      amount,
      year,
    });
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Fetch all fee structures
router.get("/fees/structures", isAuth, async (req, res) => {
  try {
    const feeStructures = await FeeStructure.findAll({
      order: [
        ["year", "DESC"],
        ["term", "DESC"],
      ],
    });
    res.status(200).json(feeStructures);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post("/students/:id/payments", isAuth, isAdmin, async (req, res) => {
  try {
    const payment = await addPayment(req.params.id, req.body);
    res.status(201).json({ success: true, payment });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// Route for fetching fee payments
router.get("/students/:id/payments", isAuth, async (req, res) => {
  try {
    let payments;

    // extract id from params and use it to check if the user is an admin in the User table
    // if user.roleId === 2, then the user is an admin, if === 4, then the user is a student
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    if (user.roleId === 2) {
      console.log("admin");
      // Admin fetches all payments
      payments = await getPaymentsByCondition();
    } else if (user.roleId === 4) {
      console.log("student");
      // Students fetch payments for their own ID
      payments = await getPaymentsByCondition({ studentId: req.params.id });
    } else {
      return res
        .status(403)
        .json({ success: false, message: "Access denied." });
    }

    res.status(200).json({ success: true, payments });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
});

router.delete("/fees/:id", isAuth, isAdmin, async (req, res) => {
  try {
    const feeStructureId = req.params.id;
    const result = await deleteFeeStructure(feeStructureId);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;