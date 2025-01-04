import { Model, DataTypes } from "sequelize";
import sequelize from "../../utils/database.mjs";

class FeePayment extends Model {}

FeePayment.init(
  {
    paymentMethod: {
      type: DataTypes.ENUM("cash", "mpesa", "bank_transfer", "credit_card"),
      allowNull: false,
    },
    referenceNumber: { type: DataTypes.STRING, allowNull: true, unique: true },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    description: { type: DataTypes.STRING, allowNull: true },
    studentId: {
      type: DataTypes.INTEGER,
      references: { model: "Users", key: "id" },
      allowNull: false,
    },
    transactionDate: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
    },
  },
  { sequelize, modelName: "FeePayment", timestamps: true }
);

export default FeePayment;
