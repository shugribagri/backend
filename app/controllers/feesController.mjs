import { User, FeePayment, FeeStructure } from "../models/index.mjs";
import logUserActivity from "../../utils/logUserActivity.mjs";

async function updateCategoryFees({ feeCategory, term, amount, year }) {
  // Check if a fee structure for the same category, term, and year already exists
  const existingFeeStructure = await FeeStructure.findOne({
    where: { feeCategory, term, year },
  });

  if (existingFeeStructure) {
    throw new Error(
      `A fee structure for ${feeCategory}, ${term}, ${year} already exists.`
    );
  }

  // Create the new fee structure
  await FeeStructure.create({ feeCategory, term, amount, year });

  // Fetch all students in the specified category
  const students = await User.findAll({ where: { feeCategory } });

  // Update fee balance for each student
  await Promise.all(
    students.map(async (student) => {
      student.feeBalance += parseFloat(amount); // Add term fee to balance
      await student.save();
    })
  );

  return { success: true, message: "Fees updated successfully" };
}

async function addPayment(studentId, paymentData) {
  const { amount, paymentMethod, referenceNumber, description } = paymentData;

  // Validate payment data
  if (!amount || !paymentMethod || !referenceNumber) {
    throw new Error(
      "Amount, payment method, and reference number are required"
    );
  }

  // Fetch the student
  const student = await User.findByPk(studentId);
  if (!student) {
    throw new Error("Student not found");
  }

  // Check if the reference number is unique
  const existingPayment = await FeePayment.findOne({
    where: { referenceNumber },
  });
  if (existingPayment) {
    throw new Error("Reference number must be unique");
  }

  // Add payment record
  const payment = await FeePayment.create({
    studentId,
    amount,
    paymentMethod,
    referenceNumber,
    description,
  });

  // Update fee balance
  student.feeBalance -= amount;
  await student.save();

  logUserActivity(studentId, "make-payment");

  return payment;
}

// Fetch FeePayment records based on conditions and sort by newest first
async function getPaymentsByCondition(condition = {}) {
  return FeePayment.findAll({
    where: condition,
    order: [["createdAt", "DESC"]],
  });
}

async function deleteFeeStructure(feeStructureId) {
  // Fetch the fee structure
  const feeStructure = await FeeStructure.findByPk(feeStructureId);

  if (!feeStructure) {
    throw new Error("Fee structure not found");
  }

  // Fetch all students in the specified category
  const students = await User.findAll({
    where: { feeCategory: feeStructure.feeCategory },
  });

  // Update fee balance for each student
  await Promise.all(
    students.map(async (student) => {
      student.feeBalance -= parseFloat(feeStructure.amount); // Deduct term fee from balance
      await student.save();
    })
  );

  // Delete the fee structure
  await feeStructure.destroy();

  return { success: true, message: "Fee structure deleted successfully" };
}

export {
  addPayment,
  updateCategoryFees,
  getPaymentsByCondition,
  deleteFeeStructure,
};